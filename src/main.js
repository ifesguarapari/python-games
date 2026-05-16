import * as monaco from "monaco-editor";
import EditorWorker from "monaco-editor/esm/vs/editor/editor.worker?worker";
import { loadPyodide } from "pyodide";

self.MonacoEnvironment = {
  getWorker() {
    return new EditorWorker();
  },
};

const DEFAULT_GRID = 7;
const CANVAS_SIZE = 448;
const MAX_ACTIONS = 500;
const DB_NAME = "python-game-progress";
const STORE_NAME = "stage-progress";

const LEVELS = [
  {
    "title": "Aprenda: comandos em sequência",
    "lineGoal": 99,
    "start": {
      "x": 1,
      "y": 3,
      "dir": 0
    },
    "goal": {
      "x": 3,
      "y": 3
    },
    "path": [
      [
        1,
        3
      ],
      [
        2,
        3
      ],
      [
        3,
        3
      ]
    ],
    "starterCode": "# Exemplo resolvido.\n# O personagem anda duas casas em linha reta.\n\nandar()\nandar()",
    "isTutorial": true,
    "concept": {
      "title": "Vamos começar com uma sequência",
      "objective": "Você vai ver como o personagem segue exatamente a ordem dos comandos.",
      "programming": "Cada linha é uma instrução. O computador lê de cima para baixo.",
      "python": "Use andar() com parênteses. Em Python, os detalhes importam.",
      "thinking": "Conte as casas antes de escrever o código."
    }
  },
  {
    "title": "Desafio: comandos em sequência",
    "lineGoal": 3,
    "start": {
      "x": 2,
      "y": 3,
      "dir": 0
    },
    "goal": {
      "x": 5,
      "y": 3
    },
    "path": [
      [
        2,
        3
      ],
      [
        3,
        3
      ],
      [
        4,
        3
      ],
      [
        5,
        3
      ]
    ],
    "starterCode": "# Desafio\n# Leve o personagem até o objetivo usando sequência.\n# Use andar() três vezes.\n\n",
    "isTutorial": false,
    "concept": null
  },
  {
    "title": "Aprenda: virando no caminho",
    "lineGoal": 99,
    "start": {
      "x": 1,
      "y": 4,
      "dir": 0
    },
    "goal": {
      "x": 2,
      "y": 3
    },
    "path": [
      [
        1,
        4
      ],
      [
        2,
        4
      ],
      [
        2,
        3
      ]
    ],
    "starterCode": "# Exemplo resolvido.\n# Primeiro anda, depois vira para subir.\n\nandar()\nvirar_esquerda()\nandar()",
    "isTutorial": true,
    "concept": {
      "title": "Agora o personagem também precisa virar",
      "objective": "Você vai misturar andar() com virar_direita() ou virar_esquerda().",
      "programming": "Virar muda a direção, mas não tira o personagem do lugar.",
      "python": "Escreva os comandos exatamente como aparecem: virar_esquerda() é diferente de virarEsquerda().",
      "thinking": "Imagine que você está dentro do mapa olhando para frente."
    }
  },
  {
    "title": "Desafio: vire uma vez",
    "lineGoal": 5,
    "start": {
      "x": 1,
      "y": 4,
      "dir": 0
    },
    "goal": {
      "x": 3,
      "y": 2
    },
    "path": [
      [
        1,
        4
      ],
      [
        2,
        4
      ],
      [
        2,
        3
      ],
      [
        3,
        3
      ],
      [
        3,
        2
      ]
    ],
    "starterCode": "# Desafio\n# Use andar() e virar_esquerda().\n\n",
    "isTutorial": false,
    "concept": null
  },
  {
    "title": "Aprenda: repetindo com while",
    "lineGoal": 99,
    "start": {
      "x": 1,
      "y": 3,
      "dir": 0
    },
    "goal": {
      "x": 4,
      "y": 3
    },
    "path": [
      [
        1,
        3
      ],
      [
        2,
        3
      ],
      [
        3,
        3
      ],
      [
        4,
        3
      ]
    ],
    "starterCode": "# Exemplo resolvido.\n# Enquanto houver caminho livre, continue andando.\n\nwhile caminho_livre():\n    andar()",
    "isTutorial": true,
    "concept": {
      "title": "Quando algo se repete, o código pode ficar menor",
      "objective": "Você vai perceber que ações repetidas podem virar uma repetição.",
      "programming": "Quando uma ação acontece várias vezes, o código pode mandar repetir em vez de copiar a mesma linha.",
      "python": "while caminho_livre(): significa: enquanto houver caminho, execute as linhas de dentro. A linha de dentro precisa ficar indentada.",
      "thinking": "Procure padrões antes de sair escrevendo comandos."
    }
  },
  {
    "title": "Desafio: repetição",
    "lineGoal": 4,
    "start": {
      "x": 1,
      "y": 3,
      "dir": 0
    },
    "goal": {
      "x": 5,
      "y": 3
    },
    "path": [
      [
        1,
        3
      ],
      [
        2,
        3
      ],
      [
        3,
        3
      ],
      [
        4,
        3
      ],
      [
        5,
        3
      ]
    ],
    "starterCode": "# Desafio\n# Tente usar while para andar até o final.\n\n",
    "isTutorial": false,
    "concept": null
  },
  {
    "title": "Aprenda: controles alinhados",
    "lineGoal": 4,
    "start": {
      "x": 1,
      "y": 5,
      "dir": 0
    },
    "goal": {
      "x": 3,
      "y": 4
    },
    "path": [
      [
        1,
        5
      ],
      [
        2,
        5
      ],
      [
        3,
        5
      ],
      [
        3,
        4
      ]
    ],
    "starterCode": "# Exemplo resolvido.\n# Use while com um if dentro do while para chegar ao objetivo.\n\nwhile caminho_livre():\n    andar()\n    if not caminho_livre():\n        virar_esquerda()",
    "isTutorial": true,
    "concept": {
      "title": "Controles alinhados",
      "objective": "Você vai aprender a colocar um if dentro de um while.",
      "programming": "O if pertence ao while e só executa quando o caminho à frente estiver bloqueado.",
      "python": "Depois de while, use indentação para o corpo do laço e para o if dentro dele.",
      "thinking": "Use o while para repetir ações e o if para mudar de direção quando necessário."
    }
  },
  {
    "title": "Desafio: zigue-zague",
    "lineGoal": 7,
    "start": {
      "x": 1,
      "y": 5,
      "dir": 0
    },
    "goal": {
      "x": 4,
      "y": 2
    },
    "path": [
      [
        1,
        5
      ],
      [
        2,
        5
      ],
      [
        2,
        4
      ],
      [
        3,
        4
      ],
      [
        3,
        3
      ],
      [
        4,
        3
      ],
      [
        4,
        2
      ]
    ],
    "starterCode": "# Desafio\n# Resolva o caminho em escada.\n\n",
    "isTutorial": false,
    "concept": null
  },
  {
    "title": "Aprenda: planejando por partes",
    "lineGoal": 99,
    "start": {
      "x": 1,
      "y": 5,
      "dir": 0
    },
    "goal": {
      "x": 3,
      "y": 3
    },
    "path": [
      [
        1,
        5
      ],
      [
        2,
        5
      ],
      [
        3,
        5
      ],
      [
        3,
        4
      ],
      [
        3,
        3
      ]
    ],
    "starterCode": "# Exemplo resolvido.\n# Parte 1: ir para a direita.\nandar()\nandar()\n# Parte 2: subir.\nvirar_esquerda()\nandar()\nandar()",
    "isTutorial": true,
    "concept": {
      "title": "Resolva por partes",
      "objective": "Você vai dividir um caminho maior em trechos menores.",
      "programming": "Fica mais fácil resolver quando você separa: trecho reto, curva, outro trecho reto.",
      "python": "Use # para escrever comentários. Eles ajudam você a organizar o plano.",
      "thinking": "Antes de programar, descreva o caminho em voz baixa ou no comentário."
    }
  },
  {
    "title": "Desafio: caminho em L",
    "lineGoal": 7,
    "start": {
      "x": 2,
      "y": 5,
      "dir": 0
    },
    "goal": {
      "x": 4,
      "y": 1
    },
    "path": [
      [
        2,
        5
      ],
      [
        3,
        5
      ],
      [
        4,
        5
      ],
      [
        4,
        4
      ],
      [
        4,
        3
      ],
      [
        4,
        2
      ],
      [
        4,
        1
      ]
    ],
    "starterCode": "# Desafio\n# Combine sequência e virada.\n\n",
    "isTutorial": false,
    "concept": null
  },
  {
    "title": "Aprenda: contornando obstáculos",
    "lineGoal": 99,
    "start": {
      "x": 1,
      "y": 5,
      "dir": 0
    },
    "goal": {
      "x": 4,
      "y": 3
    },
    "path": [
      [
        1,
        5
      ],
      [
        2,
        5
      ],
      [
        3,
        5
      ],
      [
        4,
        5
      ],
      [
        4,
        4
      ],
      [
        4,
        3
      ]
    ],
    "starterCode": "# Exemplo resolvido.\n# Nem sempre o caminho direto é o melhor.\n\nwhile caminho_livre():\n    andar()\nvirar_esquerda()\nwhile caminho_livre():\n    andar()",
    "isTutorial": true,
    "concept": {
      "title": "Nem sempre o caminho direto funciona",
      "objective": "Você vai contornar obstáculos para chegar ao objetivo.",
      "programming": "Programar também é testar, observar o resultado e ajustar a estratégia.",
      "python": "Se aparecer muita repetição no código, talvez um while ajude.",
      "thinking": "Errar faz parte: o erro mostra onde o plano precisa melhorar."
    }
  },
  {
    "title": "Desafio: contorno",
    "lineGoal": 12,
    "start": {
      "x": 1,
      "y": 5,
      "dir": 0
    },
    "goal": {
      "x": 2,
      "y": 3
    },
    "path": [
      [
        1,
        5
      ],
      [
        2,
        5
      ],
      [
        3,
        5
      ],
      [
        4,
        5
      ],
      [
        4,
        4
      ],
      [
        4,
        3
      ],
      [
        4,
        2
      ],
      [
        3,
        2
      ],
      [
        2,
        2
      ],
      [
        1,
        2
      ],
      [
        1,
        3
      ],
      [
        2,
        3
      ]
    ],
    "starterCode": "# Desafio\n# Contorne o caminho.\n\n",
    "isTutorial": false,
    "concept": null
  },
  {
    "title": "Aprenda: escolhendo com if",
    "lineGoal": 99,
    "start": {
      "x": 1,
      "y": 4,
      "dir": 0
    },
    "goal": {
      "x": 2,
      "y": 3
    },
    "path": [
      [
        1,
        4
      ],
      [
        2,
        4
      ],
      [
        2,
        3
      ]
    ],
    "starterCode": "# Exemplo resolvido.\n# Se houver caminho à frente, ande.\n# Depois, vire e continue.\n\nif caminho_livre():\n    andar()\nvirar_esquerda()\nif caminho_livre():\n    andar()",
    "isTutorial": true,
    "concept": {
      "title": "O código pode escolher o que fazer",
      "objective": "Você vai usar condições para decidir a próxima ação.",
      "programming": "Uma condição é uma pergunta: se for verdade, faça uma coisa; se não for, tente outra.",
      "python": "if caminho_livre(): precisa de dois-pontos e indentação na linha seguinte.",
      "thinking": "Faça perguntas simples ao caminho: posso andar? devo virar?"
    }
  },
  {
    "title": "Desafio: decisões",
    "lineGoal": 12,
    "start": {
      "x": 1,
      "y": 2,
      "dir": 0
    },
    "goal": {
      "x": 2,
      "y": 4
    },
    "path": [
      [
        1,
        2
      ],
      [
        2,
        2
      ],
      [
        3,
        2
      ],
      [
        4,
        2
      ],
      [
        4,
        1
      ],
      [
        5,
        1
      ],
      [
        4,
        2
      ],
      [
        4,
        3
      ],
      [
        5,
        3
      ],
      [
        4,
        3
      ],
      [
        4,
        4
      ],
      [
        3,
        4
      ],
      [
        2,
        4
      ],
      [
        1,
        4
      ],
      [
        1,
        5
      ],
      [
        2,
        5
      ],
      [
        2,
        4
      ]
    ],
    "starterCode": "# Desafio\n# Teste caminhos com if.\n\n",
    "isTutorial": false,
    "concept": null
  },
  {
    "title": "Aprenda: melhorando a solução",
    "lineGoal": 99,
    "start": {
      "x": 1,
      "y": 5,
      "dir": 0
    },
    "goal": {
      "x": 3,
      "y": 5
    },
    "path": [
      [
        1,
        5
      ],
      [
        2,
        5
      ],
      [
        3,
        5
      ]
    ],
    "starterCode": "# Exemplo resolvido curto.\n# Em vez de repetir muitos comandos, use while.\n\nwhile caminho_livre():\n    andar()",
    "isTutorial": true,
    "concept": {
      "title": "Fazer funcionar é bom; fazer melhor é o próximo passo",
      "objective": "Você vai tentar resolver usando menos linhas.",
      "programming": "Depois que funciona, você pode melhorar o código para ficar mais simples e claro.",
      "python": "Comentários e linhas em branco ajudam na leitura, mas a meta considera as linhas de comando.",
      "thinking": "Primeiro faça funcionar. Depois tente deixar mais curto."
    }
  },
  {
    "title": "Desafio: menos linhas",
    "lineGoal": 9,
    "start": {
      "x": 1,
      "y": 5,
      "dir": 0
    },
    "goal": {
      "x": 4,
      "y": 5
    },
    "path": [
      [
        1,
        5
      ],
      [
        2,
        5
      ],
      [
        2,
        4
      ],
      [
        1,
        4
      ],
      [
        1,
        3
      ],
      [
        2,
        3
      ],
      [
        3,
        3
      ],
      [
        3,
        2
      ],
      [
        4,
        2
      ],
      [
        4,
        3
      ],
      [
        5,
        3
      ],
      [
        5,
        4
      ],
      [
        4,
        4
      ],
      [
        4,
        5
      ]
    ],
    "starterCode": "# Desafio\n# Resolva usando poucas linhas.\n\n",
    "isTutorial": false,
    "concept": null
  },
  {
    "title": "Aprenda: controles alinhados",
    "lineGoal": 20,
    "start": {
      "x": 1,
      "y": 6,
      "dir": 3
    },
    "goal": {
      "x": 6,
      "y": 2
    },
    "path": [
      [
        1,
        6
      ],
      [
        1,
        5
      ],
      [
        1,
        4
      ],
      [
        1,
        3
      ],
      [
        2,
        3
      ],
      [
        3,
        3
      ],
      [
        4,
        3
      ],
      [
        4,
        2
      ],
      [
        5,
        2
      ],
      [
        6,
        2
      ]
    ],
    "starterCode": "# Exemplo resolvido.\n# Resolva em partes usando while com if alinhado.\n\nwhile caminho_livre():\n    andar()\n    if caminho_livre_direita():\n        break\nif caminho_livre_direita():\n    virar_direita()\n\nwhile caminho_livre():\n    andar()\n    if caminho_livre_esquerda():\n        break\nif caminho_livre_esquerda():\n    virar_esquerda()\n\nwhile caminho_livre():\n    andar()\n    if caminho_livre_direita():\n        break\nif caminho_livre_direita():\n    virar_direita()\n\nwhile caminho_livre():\n    andar()",
    "isTutorial": true,
    "concept": {
      "title": "Resolução por partes",
      "objective": "Você vai combinar if e while para seguir o caminho em etapas.",
      "programming": "Use while para repetir ações e use if dentro do laço para decidir quando mudar de direção.",
      "python": "Controle alinhado significa que o if está dentro do while quando faz parte do mesmo bloco.",
      "thinking": "Divida o problema em partes: avance até a curva, vire, e continue."
    }
  },
  {
    "title": "Desafio: ramificações",
    "lineGoal": 10,
    "start": {
      "x": 5,
      "y": 5,
      "dir": 3
    },
    "goal": {
      "x": 0,
      "y": 3
    },
    "path": [
      [
        5,
        5
      ],
      [
        5,
        4
      ],
      [
        4,
        4
      ],
      [
        4,
        3
      ],
      [
        5,
        3
      ],
      [
        4,
        3
      ],
      [
        3,
        3
      ],
      [
        3,
        4
      ],
      [
        3,
        5
      ],
      [
        3,
        4
      ],
      [
        3,
        3
      ],
      [
        2,
        3
      ],
      [
        2,
        4
      ],
      [
        2,
        5
      ],
      [
        2,
        4
      ],
      [
        2,
        3
      ],
      [
        1,
        3
      ],
      [
        1,
        4
      ],
      [
        1,
        5
      ],
      [
        1,
        4
      ],
      [
        1,
        3
      ],
      [
        0,
        3
      ]
    ],
    "starterCode": "# Desafio\n# Cuidado com ramificações.\n\n",
    "isTutorial": false,
    "concept": null
  },
  {
    "title": "Aprenda: juntando estratégias",
    "lineGoal": 18,
    "start": {
      "x": 1,
      "y": 5,
      "dir": 0
    },
    "goal": {
      "x": 4,
      "y": 1
    },
    "path": [
      [
        1,
        5
      ],
      [
        2,
        5
      ],
      [
        3,
        5
      ],
      [
        4,
        5
      ],
      [
        5,
        5
      ],
      [
        5,
        4
      ],
      [
        5,
        3
      ],
      [
        4,
        3
      ],
      [
        3,
        3
      ],
      [
        2,
        3
      ],
      [
        2,
        2
      ],
      [
        2,
        1
      ],
      [
        3,
        1
      ],
      [
        4,
        1
      ]
    ],
    "starterCode": "# Exemplo resolvido.\n# Use controles alinhados e resolva em partes.\n\nwhile caminho_livre():\n    andar()\nif caminho_livre_esquerda():\n    virar_esquerda()\nwhile caminho_livre():\n    andar()\nif caminho_livre_esquerda():\n    virar_esquerda()\nwhile caminho_livre():\n    andar()\nif caminho_livre_direita():\n    virar_direita()\nwhile caminho_livre():\n    andar()\nif caminho_livre_direita():\n    virar_direita()\nwhile caminho_livre():\n    andar()",
    "isTutorial": true,
    "concept": {
      "title": "Junte tudo o que você aprendeu",
      "objective": "Você vai combinar if e while para resolver etapas de um caminho maior.",
      "programming": "Use repetições para avançar e decisões para mudar de direção quando o caminho muda.",
      "python": "O if pode ficar alinhado dentro do while quando faz parte do mesmo bloco.",
      "thinking": "Divida o caminho em pedaços: avance, vire e continue."
    }
  },
  {
    "title": "Desafio: desafio final",
    "lineGoal": 14,
    "grid": 8,
    "start": {
      "x": 1,
      "y": 6,
      "dir": 0
    },
    "goal": {
      "x": 4,
      "y": 1
    },
    "path": [
      [
        1,
        6
      ],
      [
        2,
        6
      ],
      [
        3,
        6
      ],
      [
        4,
        6
      ],
      [
        3,
        6
      ],
      [
        3,
        5
      ],
      [
        3,
        4
      ],
      [
        3,
        3
      ],
      [
        3,
        4
      ],
      [
        2,
        4
      ],
      [
        1,
        4
      ],
      [
        1,
        3
      ],
      [
        1,
        2
      ],
      [
        1,
        1
      ],
      [
        2,
        1
      ],
      [
        2,
        2
      ],
      [
        1,
        2
      ],
      [
        1,
        3
      ],
      [
        1,
        4
      ],
      [
        2,
        4
      ],
      [
        3,
        4
      ],
      [
        4,
        4
      ],
      [
        5,
        4
      ],
      [
        5,
        3
      ],
      [
        5,
        2
      ],
      [
        4,
        2
      ],
      [
        4,
        1
      ],
      [
        4,
        2
      ],
      [
        5,
        2
      ],
      [
        6,
        2
      ],
      [
        6,
        1
      ],
      [
        6,
        2
      ],
      [
        5,
        2
      ],
      [
        5,
        3
      ],
      [
        5,
        4
      ],
      [
        6,
        4
      ],
      [
        6,
        5
      ],
      [
        6,
        6
      ]
    ],
    "starterCode": "# Você consegue resolver este labirinto complicado? Tente seguir a parede da mão esquerda.\n\n",
    "isTutorial": false,
    "concept": null
  },
  {
    "title": "Aprenda: funções com parâmetros",
    "lineGoal": 13,
    "mode": "stars",
    "start": {
      "x": 0,
      "y": 5,
      "dir": 0
    },
    "goal": {
      "x": 5,
      "y": 1
    },
    "stars": [
      [
        2,
        5
      ],
      [
        2,
        3
      ],
      [
        5,
        3
      ]
    ],
    "path": [],
    "starterCode": "# Exemplo resolvido.\n# Funções guardam pequenos planos para usar várias vezes.\n# O parâmetro passos muda quantas casas o personagem anda.\n# A função dobro() faz um cálculo e devolve um resultado.\n\ndef avancar(passos):\n    while passos > 0:\n        andar()\n        passos = passos - 1\n\ndef dobro(numero):\n    return numero * 2\n\navancar(dobro(1))\nvirar(270)\navancar(2)\nvirar(90)\navancar(3)\nvirar(270)\navancar(2)",
    "isTutorial": true,
    "concept": {
      "title": "Funções ajudam a organizar o plano",
      "objective": "Você vai chamar funções, passar parâmetros e usar um retorno em um cálculo simples.",
      "programming": "Uma função é um bloco de código com nome. Um parâmetro é uma informação enviada para a função.",
      "python": "Use def para criar uma função. Use return quando a função precisar devolver um valor.",
      "thinking": "Crie pequenas ações reutilizáveis: avançar alguns passos, virar e calcular quantidades."
    }
  },
  {
    "title": "Desafio: colete as estrelas",
    "lineGoal": 16,
    "mode": "stars",
    "start": {
      "x": 1,
      "y": 6,
      "dir": 3
    },
    "goal": {
      "x": 6,
      "y": 1
    },
    "stars": [
      [
        1,
        3
      ],
      [
        4,
        3
      ],
      [
        4,
        1
      ]
    ],
    "path": [],
    "starterCode": "# Desafio\n# Pegue todas as estrelas azuis antes de chegar ao destino.\n# Tente criar suas próprias funções com parâmetros e retorno.\n\n",
    "isTutorial": false,
    "concept": null
  },
  {
    "title": "Aprenda: posição x e y",
    "lineGoal": 14,
    "mode": "stars",
    "grid": 6,
    "coordinateStep": 20,
    "showCoordinates": true,
    "start": {
      "x": 0,
      "y": 4,
      "dir": 0
    },
    "goal": {
      "x": 1,
      "y": 0
    },
    "stars": [
      [
        3,
        4
      ],
      [
        4,
        2
      ],
      [
        4,
        1
      ]
    ],
    "walls": [
      {
        "orientation": "horizontal",
        "y": 3,
        "x1": 0,
        "x2": 3
      }
    ],
    "path": [],
    "starterCode": "# Exemplo resolvido.\n# Agora o mapa mostra x e y de 0 a 100.\n# A parede cinza bloqueia o caminho direto.\n# x aumenta para a direita; y aumenta para cima.\n\ndef ir_ate_x(limite):\n    while x < limite:\n        andar()\n\ndef ir_ate_y(limite):\n    virar(270)\n    while y < limite:\n        andar()\n\nif x < 80:\n    ir_ate_x(80)\n\nir_ate_y(80)\nandar()\nvirar(270)\nwhile x > 20:\n    andar()",
    "isTutorial": true,
    "concept": {
      "title": "Use x e y para decidir",
      "objective": "Você vai usar as coordenadas do mapa dentro de if e while.",
      "programming": "O programa pode olhar a posição atual antes de decidir se continua andando.",
      "python": "Use comparações como x < 80, y < 100 e y > 20 para controlar repetições.",
      "thinking": "Leia o mapa como um plano: vá até um x seguro, suba pelo espaço livre e só depois vá ao destino."
    }
  },
  {
    "title": "Desafio: desvie da parede",
    "lineGoal": 18,
    "mode": "stars",
    "grid": 6,
    "coordinateStep": 20,
    "showCoordinates": true,
    "start": {
      "x": 0,
      "y": 5,
      "dir": 0
    },
    "goal": {
      "x": 5,
      "y": 0
    },
    "stars": [
      [
        1,
        5
      ],
      [
        4,
        4
      ],
      [
        2,
        1
      ]
    ],
    "walls": [
      {
        "orientation": "vertical",
        "x": 3,
        "y1": 1,
        "y2": 4
      }
    ],
    "path": [],
    "starterCode": "# Desafio\n# Pegue todas as estrelas antes de chegar ao destino.\n# Use x, y, if, while e suas próprias funções para desviar da parede.\n\n",
    "isTutorial": false,
    "concept": null
  },
  {
    "title": "Aprenda: contador de estrelas",
    "lineGoal": 20,
    "mode": "stars",
    "grid": 6,
    "coordinateStep": 20,
    "showCoordinates": true,
    "start": {
      "x": 0,
      "y": 5,
      "dir": 0
    },
    "goal": {
      "x": 5,
      "y": 0
    },
    "stars": [
      [
        2,
        5
      ],
      [
        2,
        2
      ],
      [
        5,
        2
      ]
    ],
    "walls": [
      {
        "orientation": "horizontal",
        "y": 4,
        "x1": 3,
        "x2": 5
      }
    ],
    "path": [],
    "starterCode": "# Exemplo resolvido.\n# estrelas guarda quantas estrelas azuis já foram pegas.\n# Uma função pode chamar outra função criada antes.\n# Variáveis locais, como faltam e distancia, ajudam nos cálculos.\n\ndef avancar(passos):\n    faltam = passos\n    while faltam > 0:\n        andar()\n        faltam = faltam - 1\n\ndef passos_ate_x(alvo):\n    distancia = alvo - x\n    passos = distancia // 20\n    return passos\n\ndef pegar_estrela(passos):\n    avancar(passos)\n\nwhile estrelas < 1:\n    andar()\n\nvirar(270)\npegar_estrela(3)\nvirar(90)\nif estrelas < 3:\n    avancar(passos_ate_x(100))\nvirar(270)\navancar(2)",
    "isTutorial": true,
    "concept": {
      "title": "O contador também é uma variável",
      "objective": "Você vai usar estrelas para decidir quando continuar andando e quando mudar de estratégia.",
      "programming": "O valor de estrelas muda durante o jogo. O programa pode ler esse valor dentro de while e if.",
      "python": "Funções podem chamar outras funções. Dentro delas, variáveis locais como faltam, distancia e passos ajudam a organizar pequenos cálculos.",
      "thinking": "Use o contador para saber qual parte do plano já foi concluída: pegou uma estrela, vire; pegou outra, avance até o próximo alvo."
    }
  },
  {
    "title": "Desafio: funções com variáveis locais",
    "lineGoal": 18,
    "mode": "stars",
    "grid": 6,
    "coordinateStep": 20,
    "showCoordinates": true,
    "start": {
      "x": 0,
      "y": 4,
      "dir": 0
    },
    "goal": {
      "x": 5,
      "y": 0
    },
    "stars": [
      [
        1,
        4
      ],
      [
        1,
        1
      ],
      [
        4,
        1
      ],
      [
        4,
        0
      ]
    ],
    "walls": [
      {
        "orientation": "vertical",
        "x": 3,
        "y1": 2,
        "y2": 5
      }
    ],
    "path": [],
    "starterCode": "# Desafio\n# Use estrelas como contador para saber quantas já foram pegas.\n# Crie uma função que chame outra função criada antes.\n# Use variáveis locais auxiliares dentro das funções.\n\n",
    "isTutorial": false,
    "concept": null
  },
  {
    "title": "Aprenda: ângulos calculados",
    "lineGoal": 26,
    "mode": "stars",
    "grid": 6,
    "coordinateStep": 20,
    "showCoordinates": true,
    "start": {
      "x": 0,
      "y": 4,
      "dir": 0
    },
    "goal": {
      "x": 5,
      "y": 0
    },
    "stars": [
      [
        2,
        4
      ],
      [
        2,
        2
      ],
      [
        5,
        2
      ]
    ],
    "purpleStars": [
      [
        2,
        5
      ],
      [
        1,
        2
      ],
      [
        5,
        3
      ]
    ],
    "walls": [
      {
        "orientation": "vertical",
        "x": 3,
        "y1": 3,
        "y2": 5
      }
    ],
    "path": [],
    "starterCode": "# Exemplo resolvido.\n# Estrela azul soma 1 ponto; estrela roxa tira 1 ponto.\n# O ângulo de virar pode ser calculado olhando mapa, muro e estrelas.\n\ndef avancar(passos):\n    repeticoes = passos\n    while repeticoes > 0:\n        andar()\n        repeticoes = repeticoes - 1\n\ndef calcular_angulo():\n    muro = not caminho_livre()\n    if muro and estrelas == 1:\n        return 270\n    if estrelas == 2 and y == 60:\n        return 90\n    return 270\n\ndef virar_pelo_mapa():\n    angulo = calcular_angulo()\n    virar(angulo)\n\nwhile estrelas < 1:\n    andar()\nvirar_pelo_mapa()\nwhile estrelas < 2:\n    andar()\nvirar_pelo_mapa()\nwhile estrelas < 3:\n    andar()\nvirar_pelo_mapa()\navancar(2)",
    "isTutorial": true,
    "concept": {
      "title": "Calcule a curva antes de virar",
      "objective": "Você vai criar uma função que calcula o ângulo usando o mapa, uma parede e o contador de estrelas.",
      "programming": "O programa pode guardar uma decisão em uma variável local antes de chamar virar().",
      "python": "Use return para devolver 90 ou 270. Depois, outra função pode chamar esse cálculo e passar o resultado para virar(angulo).",
      "thinking": "Evite estrelas roxas: elas reduzem a pontuação e mostram que o caminho escolhido passou pelo lugar errado."
    }
  },
  {
    "title": "Desafio: evite estrelas roxas",
    "lineGoal": 24,
    "mode": "stars",
    "grid": 6,
    "coordinateStep": 20,
    "showCoordinates": true,
    "start": {
      "x": 0,
      "y": 5,
      "dir": 0
    },
    "goal": {
      "x": 5,
      "y": 5
    },
    "stars": [
      [
        1,
        5
      ],
      [
        1,
        2
      ],
      [
        4,
        2
      ],
      [
        4,
        5
      ]
    ],
    "purpleStars": [
      [
        0,
        3
      ],
      [
        5,
        2
      ],
      [
        3,
        5
      ]
    ],
    "walls": [
      {
        "orientation": "vertical",
        "x": 2,
        "y1": 3,
        "y2": 5
      }
    ],
    "path": [],
    "starterCode": "# Desafio\n# Estrelas roxas tiram pontos do contador de estrelas.\n# Crie uma função que calcule o ângulo usando mapa, muro e estrelas.\n# Use outra função para chamar esse cálculo e virar.\n\n",
    "isTutorial": false,
    "concept": null
  },
  {
    "title": "Aprenda: função recursiva",
    "lineGoal": 24,
    "mode": "stars",
    "grid": 6,
    "coordinateStep": 20,
    "showCoordinates": true,
    "start": {
      "x": 0,
      "y": 5,
      "dir": 0
    },
    "goal": {
      "x": 5,
      "y": 0
    },
    "stars": [
      [
        2,
        5
      ],
      [
        2,
        3
      ],
      [
        5,
        3
      ]
    ],
    "purpleStars": [
      [
        1,
        4
      ],
      [
        4,
        2
      ],
      [
        5,
        4
      ]
    ],
    "walls": [
      {
        "orientation": "vertical",
        "x": 3,
        "y1": 4,
        "y2": 5
      }
    ],
    "path": [],
    "starterCode": "# Exemplo resolvido.\n# Recursão acontece quando uma função chama ela mesma.\n# Toda recursão precisa de uma condição de parada.\n\ndef avancar(passos):\n    if passos == 0:\n        return\n    andar()\n    avancar(passos - 1)\n\ndef procurar_estrela(alvo):\n    if estrelas >= alvo:\n        return\n    andar()\n    procurar_estrela(alvo)\n\ndef virar_pelo_contador():\n    if not caminho_livre():\n        virar(270)\n    elif estrelas == 2:\n        virar(90)\n    else:\n        virar(270)\n\nprocurar_estrela(1)\nvirar_pelo_contador()\nprocurar_estrela(2)\nvirar_pelo_contador()\nprocurar_estrela(3)\nvirar_pelo_contador()\navancar(3)",
    "isTutorial": true,
    "concept": {
      "title": "Uma função pode chamar a si mesma",
      "objective": "Você vai usar recursão para repetir movimentos até uma condição de parada.",
      "programming": "Recursão resolve uma tarefa repetida chamando a mesma função novamente, cada vez mais perto do fim.",
      "python": "Use um caso base com if e return antes da chamada recursiva. Sem isso, a função nunca para.",
      "thinking": "Pense assim: se já alcancei o alvo, paro; se não alcancei, dou um passo e tento de novo."
    }
  },
  {
    "title": "Desafio: recursão com estrelas",
    "lineGoal": 22,
    "mode": "stars",
    "grid": 6,
    "coordinateStep": 20,
    "showCoordinates": true,
    "start": {
      "x": 0,
      "y": 5,
      "dir": 0
    },
    "goal": {
      "x": 5,
      "y": 1
    },
    "stars": [
      [
        1,
        5
      ],
      [
        1,
        2
      ],
      [
        4,
        2
      ],
      [
        4,
        1
      ]
    ],
    "purpleStars": [
      [
        0,
        3
      ],
      [
        5,
        2
      ],
      [
        3,
        1
      ]
    ],
    "walls": [
      {
        "orientation": "vertical",
        "x": 2,
        "y1": 3,
        "y2": 5
      }
    ],
    "path": [],
    "starterCode": "# Desafio\n# Resolva usando pelo menos uma função recursiva.\n# Uma função recursiva chama ela mesma até chegar ao caso base.\n# Evite as estrelas roxas; elas tiram ponto do contador.\n\n",
    "isTutorial": false,
    "concept": null
  }
];

const STAGES = [
  {
    "label": "A",
    "levelIndexes": Array.from({ length: 20 }, (_, index) => index)
  },
  {
    "label": "B",
    "levelIndexes": [20, 21, 22, 23, 24, 25, 26, 27, 28, 29]
  }
];

const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");
const statusBox = document.getElementById("status");
const debugInfo = document.getElementById("debugInfo");
const runButton = document.getElementById("runButton");
const stepButton = document.getElementById("stepButton");
const resetStageButton = document.getElementById("resetStageButton");
const clearProgressButton = document.getElementById("clearProgressButton");
const prevButton = document.getElementById("prevButton");
const nextButton = document.getElementById("nextButton");
const levelTitle = document.getElementById("levelTitle");
const lineGoal = document.getElementById("lineGoal");
const stageCarousel = document.getElementById("stageCarousel");
const levelCarousel = document.getElementById("levelCarousel");
const errorModal = document.getElementById("errorModal");
const errorModalMessage = document.getElementById("errorModalMessage");
const closeErrorModal = document.getElementById("closeErrorModal");
const conceptModal = document.getElementById("conceptModal");
const conceptModalTitle = document.getElementById("conceptModalTitle");
const conceptModalBody = document.getElementById("conceptModalBody");
const closeConceptModal = document.getElementById("closeConceptModal");

let editor = null;
let pyodide = null;
let db = null;
let currentLevelIndex = 0;
let selectedStageIndex = 0;
let progress = {};
let player = { x: 0, y: 0, dir: 0 };
let collectedStars = new Set();
let collectedPurpleStars = new Set();
let actions = [];
let debugActions = [];
let debugIndex = 0;
let currentDecorationIds = [];
let currentErrorDecorationIds = [];
let isAnimating = false;
let successAnimationId = null;
let errorAnimationId = null;
let warningAnimationId = null;

runButton.disabled = true;
stepButton.disabled = true;

function currentLevel() {
  return LEVELS[currentLevelIndex];
}

function currentGrid() {
  return currentLevel().grid || DEFAULT_GRID;
}

function tileSize() {
  return CANVAS_SIZE / currentGrid();
}

function isStarLevel() {
  return currentLevel().mode === "stars";
}

function levelStars() {
  return currentLevel().stars || [];
}

function levelPurpleStars() {
  return currentLevel().purpleStars || [];
}

function levelWalls() {
  return currentLevel().walls || [];
}

function starScore() {
  return collectedStars.size - collectedPurpleStars.size;
}

function coordinateStep() {
  return currentLevel().coordinateStep || 20;
}

function playerCoordinates() {
  const grid = currentGrid();

  return {
    x: player.x * coordinateStep(),
    y: (grid - 1 - player.y) * coordinateStep(),
  };
}

function updatePythonPositionGlobals() {
  if (!pyodide) return;

  const position = playerCoordinates();
  pyodide.globals.set("x", position.x);
  pyodide.globals.set("y", position.y);
  pyodide.globals.set("estrelas", starScore());
  pyodide.globals.set("estrelas_azuis", collectedStars.size);
  pyodide.globals.set("estrelas_roxas", collectedPurpleStars.size);
  pyodide.globals.set("total_estrelas", levelStars().length);
}

function starKey(x, y) {
  return `${x},${y}`;
}

function collectStarAtPlayer() {
  if (!isStarLevel()) return;

  const key = starKey(player.x, player.y);
  if (levelStars().some(([x, y]) => starKey(x, y) === key)) {
    collectedStars.add(key);
  }
  if (levelPurpleStars().some(([x, y]) => starKey(x, y) === key)) {
    collectedPurpleStars.add(key);
  }

  updatePythonPositionGlobals();
}

function allStarsCollected() {
  return levelStars().every(([x, y]) => collectedStars.has(starKey(x, y)));
}

function hasFullStarScore() {
  return starScore() >= levelStars().length;
}

function normalizeAngle(angle) {
  return ((angle % 360) + 360) % 360;
}

function stageForLevel(index = currentLevelIndex) {
  const stageIndex = STAGES.findIndex((stage) => stage.levelIndexes.includes(index));
  return stageIndex >= 0 ? stageIndex : 0;
}

function currentStage() {
  return STAGES[selectedStageIndex];
}

function currentLevelPosition() {
  const stageIndex = selectedStageIndex;
  const stage = STAGES[stageIndex];

  return {
    stageIndex,
    levelPosition: stage.levelIndexes.indexOf(currentLevelIndex),
  };
}

function nextNavigationTarget() {
  const { stageIndex, levelPosition } = currentLevelPosition();
  const stage = STAGES[stageIndex];

  if (levelPosition >= 0 && levelPosition < stage.levelIndexes.length - 1) {
    return { type: "level", index: stage.levelIndexes[levelPosition + 1] };
  }

  for (let nextStageIndex = stageIndex + 1; nextStageIndex < STAGES.length; nextStageIndex += 1) {
    const nextStage = STAGES[nextStageIndex];
    if (nextStage.levelIndexes.length > 0) {
      return { type: "level", index: nextStage.levelIndexes[0] };
    }

    return { type: "stage", index: nextStageIndex };
  }

  return null;
}

function previousNavigationTarget() {
  const { stageIndex, levelPosition } = currentLevelPosition();
  const stage = STAGES[stageIndex];

  if (levelPosition > 0) {
    return { type: "level", index: stage.levelIndexes[levelPosition - 1] };
  }

  for (let previousStageIndex = stageIndex - 1; previousStageIndex >= 0; previousStageIndex -= 1) {
    const previousStage = STAGES[previousStageIndex];
    if (previousStage.levelIndexes.length > 0) {
      return { type: "level", index: previousStage.levelIndexes[previousStage.levelIndexes.length - 1] };
    }

    return { type: "stage", index: previousStageIndex };
  }

  return null;
}

function navigateToTarget(target) {
  if (!target) return;

  if (target.type === "level") {
    loadLevel(target.index);
  }

  if (target.type === "stage") {
    loadStage(target.index);
  }
}

function levelKey(index = currentLevelIndex) {
  return `level-${index + 1}`;
}

function setStatus(message) {
  statusBox.textContent = message;
}

function setDebugInfo(message) {
  debugInfo.textContent = message;
}

function openDatabase() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, 1);

    request.onupgradeneeded = () => {
      const database = request.result;
      if (!database.objectStoreNames.contains(STORE_NAME)) {
        database.createObjectStore(STORE_NAME);
      }
    };

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

function dbGet(key) {
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, "readonly");
    const store = tx.objectStore(STORE_NAME);
    const request = store.get(key);
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

function dbSet(key, value) {
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, "readwrite");
    const store = tx.objectStore(STORE_NAME);
    const request = store.put(value, key);
    request.onsuccess = () => resolve();
    request.onerror = () => reject(request.error);
  });
}

function dbDelete(key) {
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, "readwrite");
    const store = tx.objectStore(STORE_NAME);
    const request = store.delete(key);
    request.onsuccess = () => resolve();
    request.onerror = () => reject(request.error);
  });
}

async function loadProgress() {
  progress = (await dbGet("progress")) || {};
  currentLevelIndex = (await dbGet("currentLevelIndex")) || 0;
  selectedStageIndex = stageForLevel(currentLevelIndex);
}

async function saveProgress() {
  await dbSet("progress", progress);
  await dbSet("currentLevelIndex", currentLevelIndex);
}

function resetPlayerToLevel() {
  const start = currentLevel().start;
  player = { x: start.x, y: start.y, dir: start.dir, angle: start.dir * 90 };
  collectedStars = new Set();
  collectedPurpleStars = new Set();
  collectStarAtPlayer();
}

function pathSetForLevel() {
  return new Set((currentLevel().path || []).map(([x, y]) => `${x},${y}`));
}

function isRoad(x, y) {
  return pathSetForLevel().has(`${x},${y}`);
}

function isGoal() {
  const goal = currentLevel().goal;
  return player.x === goal.x && player.y === goal.y;
}

function isGoalBlockedByStars(x, y) {
  const goal = currentLevel().goal;
  return isStarLevel() && x === goal.x && y === goal.y && !allStarsCollected();
}

function wallBlocksMove(nextX, nextY) {
  return levelWalls().some((wall) => {
    if (wall.orientation === "horizontal") {
      const crossesWall = (player.y < wall.y && nextY >= wall.y) || (player.y >= wall.y && nextY < wall.y);
      const column = Math.min(player.x, nextX);
      return crossesWall && column >= wall.x1 && column <= wall.x2;
    }

    if (wall.orientation === "vertical") {
      const crossesWall = (player.x < wall.x && nextX >= wall.x) || (player.x >= wall.x && nextX < wall.x);
      const row = Math.min(player.y, nextY);
      return crossesWall && row >= wall.y1 && row <= wall.y2;
    }

    return false;
  });
}

function isBlocked(x, y) {
  const grid = currentGrid();
  if (x < 0 || y < 0 || x >= grid || y >= grid) return true;
  if (isGoalBlockedByStars(x, y)) return true;
  if (isStarLevel()) return wallBlocksMove(x, y);
  return !isRoad(x, y);
}

function directionAtOffset(offset) {
  const angle = normalizeAngle((player.angle ?? player.dir * 90) + offset * 90);
  const radians = angle * Math.PI / 180;

  return {
    angle,
    dx: Math.round(Math.cos(radians)),
    dy: Math.round(Math.sin(radians)),
  };
}

function frontCell(offset = 0) {
  const direction = directionAtOffset(offset);
  return {
    x: player.x + direction.dx,
    y: player.y + direction.dy,
  };
}

function clearHighlightedLine() {
  if (!editor) return;
  currentDecorationIds = editor.deltaDecorations(currentDecorationIds, []);
}

function clearErrorHighlight() {
  if (!editor) return;
  currentErrorDecorationIds = editor.deltaDecorations(currentErrorDecorationIds, []);
}

function highlightErrorLine(lineNumber) {
  if (!editor) return;

  clearErrorHighlight();

  const model = editor.getModel();
  const totalLines = model.getLineCount();

  if (lineNumber > 0 && lineNumber <= totalLines) {
    currentErrorDecorationIds = editor.deltaDecorations([], [
      {
        range: new monaco.Range(lineNumber, 1, lineNumber, 1),
        options: {
          isWholeLine: true,
          className: "errorLineHighlight",
          glyphMarginClassName: "errorGlyph",
        },
      },
    ]);

    editor.revealLineInCenter(lineNumber);
  }
}

function extractStudentErrorLine(error) {
  const text = String(error?.message || error || "");
  const studentMatch = text.match(/File ["']<student>["'], line (\d+)/);

  if (studentMatch) {
    return Number(studentMatch[1]);
  }

  const lineMatch = text.match(/line (\d+)/i);

  if (lineMatch) {
    return Number(lineMatch[1]);
  }

  return null;
}

function getFriendlyErrorMessage(error) {
  const text = String(error?.message || error || "").toLowerCase();

  if (text.includes("syntaxerror") || text.includes("invalid syntax")) {
    return "Revise seu código: há um erro de escrita nesta linha. Verifique parênteses, dois-pontos e indentação.";
  }

  if (
    text.includes("indentationerror") ||
    text.includes("expected an indented block") ||
    text.includes("unindent")
  ) {
    return "Revise a indentação: depois de while, if ou else, os comandos precisam ficar recuados.";
  }

  if (text.includes("nameerror") || text.includes("is not defined")) {
    return "Revise o nome usado nesta linha. Pode haver um comando escrito incorretamente ou uma variável que não existe.";
  }

  if (text.includes("typeerror")) {
    return "Revise esta linha: algum comando foi usado de forma inadequada, talvez com parênteses ou argumentos incorretos.";
  }

  if (text.includes("zerodivisionerror")) {
    return "Revise esta linha: não é possível dividir por zero.";
  }

  if (text.includes("indexerror")) {
    return "Revise esta linha: o código tentou acessar uma posição que não existe.";
  }

  if (text.includes("recursionerror") || text.includes("maximum recursion")) {
    return "Revise seu código: parece haver uma repetição ou chamada infinita.";
  }

  if (
    text.includes("interrompido") ||
    text.includes("laço infinito") ||
    text.includes("ações demais") ||
    text.includes("mais de")
  ) {
    return "Seu programa executou ações demais. Verifique se há um laço que nunca termina ou se o personagem não consegue chegar ao final.";
  }

  return "Boa tentativa! Tem algo para ajustar no seu código. Marquei a linha em vermelho para você revisar. Tente corrigir sozinho; se travar, chame um colega ou o professor.";
}

function openConceptModal(level) {
  if (!level?.isTutorial || !level?.concept) return;

  conceptModalTitle.textContent = level.concept.title;
  conceptModalBody.innerHTML = `
    <div class="concept-section">
      <strong>O que você vai treinar agora</strong>
      <p>${level.concept.objective}</p>
    </div>
    <div class="concept-section">
      <strong>Ideia principal</strong>
      <p>${level.concept.programming}</p>
    </div>
    <div class="concept-section">
      <strong>Dica de Python</strong>
      <p>${level.concept.python}</p>
    </div>
    <div class="concept-section">
      <strong>Estratégia para resolver</strong>
      <p>${level.concept.thinking}</p>
    </div>
  `;

  conceptModal.classList.remove("hidden");
}

function closeConceptModalBox() {
  conceptModal.classList.add("hidden");
}

function openErrorModal(message) {
  errorModalMessage.textContent = message;
  errorModal.classList.remove("hidden");
}

function closeErrorModalBox() {
  errorModal.classList.add("hidden");
}

function showFriendlyError(error) {
  const lineNumber = extractStudentErrorLine(error);

  clearHighlightedLine();

  if (lineNumber) {
    highlightErrorLine(lineNumber);
  }

  setStatus("Há um erro no código. Observe a linha destacada em vermelho.");
  openErrorModal(getFriendlyErrorMessage(error));
}

function highlightLine(lineNumber) {
  if (!editor) return;
  clearHighlightedLine();

  const model = editor.getModel();
  const totalLines = model.getLineCount();

  if (lineNumber > 0 && lineNumber <= totalLines) {
    currentDecorationIds = editor.deltaDecorations([], [
      {
        range: new monaco.Range(lineNumber, 1, lineNumber, 1),
        options: {
          isWholeLine: true,
          className: "debugLineHighlight",
          glyphMarginClassName: "debugGlyph",
        },
      },
    ]);

    editor.revealLineInCenter(lineNumber);
  }
}

function countStudentLines(code) {
  return code
    .split("\n")
    .map((line) => line.trim())
    .filter((line) => line.length > 0 && !line.startsWith("#"))
    .length;
}

function enqueueAction(type, payload = {}) {
  if (actions.length >= MAX_ACTIONS) {
    throw new Error(
      `O programa executou mais de ${MAX_ACTIONS} ações e foi interrompido.\n\n` +
      "Isso geralmente acontece quando há um laço infinito ou quando o caminho não chega ao objetivo."
    );
  }

  const lineNumber = getPythonLineNumber();
  actions.push({ type, lineNumber, ...payload });
}

function getPythonLineNumber() {
  try {
    const lineNumber = pyodide.globals.get("__current_student_line__");
    return Number(lineNumber);
  } catch {
    return null;
  }
}

function andar() {
  enqueueAction("move");

  const next = frontCell(0);
  if (!isBlocked(next.x, next.y)) {
    player.x = next.x;
    player.y = next.y;
    collectStarAtPlayer();
  }
}

function virarDireita() {
  enqueueAction("turnRight");
  player.dir = (player.dir + 1) % 4;
  player.angle = normalizeAngle(player.angle + 90);
}

function virarEsquerda() {
  enqueueAction("turnLeft");
  player.dir = (player.dir + 3) % 4;
  player.angle = normalizeAngle(player.angle - 90);
}

function virarGraus(degrees) {
  if (!isStarLevel()) {
    throw new Error("virar(graus) está disponível a partir do Estágio B.");
  }

  const value = Number(degrees);
  if (!Number.isFinite(value)) {
    throw new Error("Use virar(graus) com um número, por exemplo: virar(90).");
  }

  enqueueAction("turnDegrees", { degrees: value });
  player.angle = normalizeAngle(player.angle + value);
  player.dir = Math.round(player.angle / 90) % 4;
}

function caminhoLivre() {
  const next = frontCell(0);
  return !isBlocked(next.x, next.y);
}

function caminhoLivreEsquerda() {
  const next = frontCell(-1);
  return !isBlocked(next.x, next.y);
}

function caminhoLivreDireita() {
  const next = frontCell(1);
  return !isBlocked(next.x, next.y);
}

function applyVisualAction(action) {
  if (action.type === "move") {
    const next = frontCell(0);
    if (!isBlocked(next.x, next.y)) {
      player.x = next.x;
      player.y = next.y;
      collectStarAtPlayer();
    }
  }

  if (action.type === "turnRight") {
    player.dir = (player.dir + 1) % 4;
    player.angle = normalizeAngle(player.angle + 90);
  }

  if (action.type === "turnLeft") {
    player.dir = (player.dir + 3) % 4;
    player.angle = normalizeAngle(player.angle - 90);
  }

  if (action.type === "turnDegrees") {
    player.angle = normalizeAngle(player.angle + action.degrees);
    player.dir = Math.round(player.angle / 90) % 4;
  }
}

function draw(offsetX = 0, offsetY = 0) {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.save();
  ctx.translate(offsetX, offsetY);

  drawBackground();
  drawRoad();
  drawWalls();
  drawStars();
  drawGoal();
  drawPlayer();
  drawStarCounter();

  ctx.restore();
}

function drawEmptyStage() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = "#f2f0e9";
  ctx.fillRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);
}

function drawBackgroundDecorations(grid, tile, detail) {
  for (let y = 0; y < grid; y++) {
    for (let x = 0; x < grid; x++) {
      if (!isRoad(x, y)) {
        const px = x * tile + 13 * detail;
        const py = y * tile + 13 * detail;
        ctx.globalAlpha = 0.55;
        ctx.beginPath();
        ctx.moveTo(px, py);
        ctx.lineTo(px + 28 * detail, py);
        ctx.lineTo(px + 28 * detail, py + 12 * detail);
        ctx.lineTo(px + 42 * detail, py + 12 * detail);
        ctx.lineTo(px + 42 * detail, py + 36 * detail);
        ctx.lineTo(px + 12 * detail, py + 36 * detail);
        ctx.lineTo(px + 12 * detail, py + 22 * detail);
        ctx.lineTo(px, py + 22 * detail);
        ctx.closePath();
        ctx.stroke();
        ctx.globalAlpha = 1;
      }
    }
  }
}

function drawBackground() {
  if (isStarLevel()) {
    drawStarBackground();
    return;
  }

  const grid = currentGrid();
  const tile = tileSize();
  const detail = tile / 64;

  ctx.fillStyle = "#f2f0e9";
  ctx.fillRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);

  ctx.strokeStyle = "#e4e0d8";
  ctx.lineWidth = 2 * detail;
  drawBackgroundDecorations(grid, tile, detail);
}

function drawStarBackground() {
  const grid = currentGrid();
  const tile = tileSize();
  const detail = tile / 64;

  ctx.fillStyle = "#f2f0e9";
  ctx.fillRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);

  ctx.strokeStyle = "#e4e0d8";
  ctx.lineWidth = 2 * detail;
  drawBackgroundDecorations(grid, tile, detail);

  ctx.strokeStyle = "#e4e0d8";
  ctx.lineWidth = 2;
  ctx.strokeRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);

  if (!currentLevel().showCoordinates) return;

  ctx.save();
  ctx.fillStyle = "#b7b5a8";
  ctx.strokeStyle = "#cfcbbf";
  ctx.lineWidth = 1.5;
  ctx.font = "14px Arial, Helvetica, sans-serif";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";

  for (let index = 1; index < grid; index += 1) {
    const value = index * coordinateStep();
    const x = index * tile;
    const y = CANVAS_SIZE - index * tile;

    ctx.beginPath();
    ctx.moveTo(x, CANVAS_SIZE);
    ctx.lineTo(x, CANVAS_SIZE - 9);
    ctx.stroke();

    ctx.fillText(String(value), x + 8, CANVAS_SIZE - 8);

    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(9, y);
    ctx.stroke();

    ctx.textAlign = "left";
    ctx.fillText(String(value), 4, y - 6);
    ctx.textAlign = "center";
  }

  ctx.fillStyle = "#8d8b80";
  ctx.font = "bold 15px Arial, Helvetica, sans-serif";
  ctx.textAlign = "right";
  ctx.fillText("x", CANVAS_SIZE - 8, CANVAS_SIZE - 28);
  ctx.textAlign = "left";
  ctx.fillText("y", 14, 14);

  ctx.restore();
}

function drawWalls() {
  if (!isStarLevel()) return;

  const tile = tileSize();

  ctx.save();
  ctx.strokeStyle = "#c3c4b8";
  ctx.lineWidth = 10;
  ctx.lineCap = "round";

  levelWalls().forEach((wall) => {
    ctx.beginPath();

    if (wall.orientation === "horizontal") {
      const y = wall.y * tile;
      ctx.moveTo(wall.x1 * tile, y);
      ctx.lineTo((wall.x2 + 1) * tile, y);
    }

    if (wall.orientation === "vertical") {
      const x = wall.x * tile;
      ctx.moveTo(x, wall.y1 * tile);
      ctx.lineTo(x, (wall.y2 + 1) * tile);
    }

    ctx.stroke();
  });

  ctx.restore();
}

function drawRoad() {
  const path = currentLevel().path;
  if (isStarLevel() || !path?.length) return;

  const tile = tileSize();
  const detail = tile / 64;

  ctx.strokeStyle = "#fff500";
  ctx.lineWidth = 18 * detail;
  ctx.lineCap = "round";
  ctx.lineJoin = "round";

  ctx.beginPath();

  path.forEach(([x, y], index) => {
    const cx = x * tile + tile / 2;
    const cy = y * tile + tile / 2;

    if (index === 0) {
      ctx.moveTo(cx, cy);
    } else {
      ctx.lineTo(cx, cy);
    }
  });

  ctx.stroke();

  ctx.strokeStyle = "rgba(255,255,255,0.55)";
  ctx.lineWidth = 2 * detail;
  ctx.setLineDash([12 * detail, 22 * detail]);
  ctx.beginPath();

  path.forEach(([x, y], index) => {
    const cx = x * tile + tile / 2;
    const cy = y * tile + tile / 2;

    if (index === 0) {
      ctx.moveTo(cx, cy);
    } else {
      ctx.lineTo(cx, cy);
    }
  });

  ctx.stroke();
  ctx.setLineDash([]);
}

function drawStars() {
  if (!isStarLevel()) return;

  const tile = tileSize();
  const detail = tile / 64;

  levelStars().forEach(([x, y]) => {
    if (collectedStars.has(starKey(x, y))) return;

    const cx = x * tile + tile / 2;
    const cy = y * tile + tile / 2;
    drawStarShape(cx, cy, detail, "#1e88e5", "#0d47a1");
  });

  levelPurpleStars().forEach(([x, y]) => {
    if (collectedPurpleStars.has(starKey(x, y))) return;

    const cx = x * tile + tile / 2;
    const cy = y * tile + tile / 2;
    drawStarShape(cx, cy, detail, "#8e24aa", "#4a148c");
  });
}

function drawStarShape(cx, cy, detail, fill, stroke) {
  const outer = 15 * detail;
  const inner = 6 * detail;

  ctx.save();
  ctx.fillStyle = fill;
  ctx.strokeStyle = stroke;
  ctx.lineWidth = 2 * detail;
  ctx.beginPath();

  for (let point = 0; point < 10; point += 1) {
    const radius = point % 2 === 0 ? outer : inner;
    const angle = -Math.PI / 2 + point * Math.PI / 5;
    const px = cx + Math.cos(angle) * radius;
    const py = cy + Math.sin(angle) * radius;

    if (point === 0) {
      ctx.moveTo(px, py);
    } else {
      ctx.lineTo(px, py);
    }
  }

  ctx.closePath();
  ctx.fill();
  ctx.stroke();
  ctx.restore();
}

function drawStarCounter() {
  if (!isStarLevel()) return;

  const total = levelStars().length;
  const collected = starScore();
  const width = 94;
  const height = 34;
  const x = Math.round((CANVAS_SIZE - width) / 2);
  const y = 12;

  ctx.save();
  ctx.fillStyle = "#1e88e5";
  ctx.font = "bold 18px Arial, Helvetica, sans-serif";
  ctx.textAlign = "left";
  ctx.textBaseline = "middle";
  ctx.fillText("★", x + 14, y + height / 2);

  ctx.fillStyle = "#333";
  ctx.font = "bold 15px Arial, Helvetica, sans-serif";
  ctx.fillText(`${collected}/${total}`, x + 42, y + height / 2);
  ctx.restore();
}

function drawGoal() {
  const goal = currentLevel().goal;
  const tile = tileSize();
  const detail = tile / 64;
  const x = goal.x * tile + tile / 2;
  const y = goal.y * tile + tile / 2;

  ctx.save();
  ctx.fillStyle = "#ff6f61";
  ctx.strokeStyle = "#111";
  ctx.lineWidth = 2 * detail;

  ctx.beginPath();
  ctx.arc(x, y - 12 * detail, 9 * detail, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();

  ctx.beginPath();
  ctx.moveTo(x, y + 18 * detail);
  ctx.lineTo(x - 8 * detail, y - 4 * detail);
  ctx.lineTo(x + 8 * detail, y - 4 * detail);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();
  ctx.restore();
}

function drawPlayer() {
  const tile = tileSize();
  const detail = tile / 64;
  const x = player.x * tile + tile / 2;
  const y = player.y * tile + tile / 2;

  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(((player.angle ?? player.dir * 90) * Math.PI) / 180);
  ctx.scale(detail, detail);

  ctx.fillStyle = "rgba(0,0,0,0.22)";
  ctx.beginPath();
  ctx.ellipse(4, 10, 22, 7, 0, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = "#7ac943";
  ctx.strokeStyle = "#245d23";
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.ellipse(0, 12, 16, 8, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();

  ctx.fillStyle = "#ffc107";
  ctx.strokeStyle = "#795548";
  ctx.beginPath();
  ctx.roundRect(-4, -28, 8, 34, 4);
  ctx.fill();
  ctx.stroke();

  ctx.fillStyle = "#ffca28";
  ctx.strokeStyle = "#333";
  ctx.beginPath();
  ctx.arc(0, -30, 5, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();

  ctx.restore();
}

function stopAnimation(animationIdName) {
  const id = animationIdName === "success" ? successAnimationId : animationIdName === "error" ? errorAnimationId : warningAnimationId;
  if (id !== null) {
    cancelAnimationFrame(id);
  }

  if (animationIdName === "success") successAnimationId = null;
  if (animationIdName === "error") errorAnimationId = null;
  if (animationIdName === "warning") warningAnimationId = null;
}

function stopAllEffects() {
  stopAnimation("success");
  stopAnimation("error");
  stopAnimation("warning");
  draw();
}

function startSuccessEffect() {
  stopAllEffects();
  const start = performance.now();
  const duration = 1300;

  function animate(now) {
    const progressValue = Math.min((now - start) / duration, 1);
    draw();

    const goal = currentLevel().goal;
    const tile = tileSize();
    const x = goal.x * tile + tile / 2;
    const y = goal.y * tile + tile / 2;

    ctx.save();
    ctx.strokeStyle = `rgba(67, 160, 71, ${1 - progressValue})`;
    ctx.lineWidth = 8 * (1 - progressValue) + 2;
    ctx.beginPath();
    ctx.arc(x, y, 20 + progressValue * 120, 0, Math.PI * 2);
    ctx.stroke();

    ctx.fillStyle = `rgba(67, 160, 71, ${0.18 * (1 - progressValue)})`;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.restore();

    if (progressValue < 1) {
      successAnimationId = requestAnimationFrame(animate);
    } else {
      successAnimationId = null;
      draw();
    }
  }

  successAnimationId = requestAnimationFrame(animate);
}

function startWarningEffect() {
  stopAllEffects();
  const start = performance.now();
  const duration = 1500;

  function animate(now) {
    const progressValue = Math.min((now - start) / duration, 1);
    const pulse = Math.sin(progressValue * Math.PI * 8) * 0.5 + 0.5;

    draw();

    ctx.save();
    ctx.fillStyle = `rgba(251, 192, 45, ${0.08 + pulse * 0.18})`;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.strokeStyle = `rgba(251, 192, 45, ${0.8 - progressValue * 0.5})`;
    ctx.lineWidth = 12;
    ctx.strokeRect(8, 8, canvas.width - 16, canvas.height - 16);
    ctx.restore();

    if (progressValue < 1) {
      warningAnimationId = requestAnimationFrame(animate);
    } else {
      warningAnimationId = null;
      draw();
    }
  }

  warningAnimationId = requestAnimationFrame(animate);
}

function startErrorEffect() {
  stopAllEffects();
  const start = performance.now();
  const duration = 850;

  function animate(now) {
    const progressValue = Math.min((now - start) / duration, 1);
    const shake = 9 * (1 - progressValue);
    const offsetX = (Math.random() - 0.5) * shake;
    const offsetY = (Math.random() - 0.5) * shake;

    draw(offsetX, offsetY);

    ctx.save();
    ctx.fillStyle = `rgba(120, 0, 0, ${0.38 * (1 - progressValue)})`;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.strokeStyle = `rgba(211, 47, 47, ${1 - progressValue})`;
    ctx.lineWidth = 14;
    ctx.lineCap = "round";
    const size = 82;
    const center = canvas.width / 2;

    ctx.beginPath();
    ctx.moveTo(center - size / 2, center - size / 2);
    ctx.lineTo(center + size / 2, center + size / 2);
    ctx.moveTo(center + size / 2, center - size / 2);
    ctx.lineTo(center - size / 2, center + size / 2);
    ctx.stroke();
    ctx.restore();

    if (progressValue < 1) {
      errorAnimationId = requestAnimationFrame(animate);
    } else {
      errorAnimationId = null;
      draw();
    }
  }

  errorAnimationId = requestAnimationFrame(animate);
}

function stageStatus(stage) {
  if (stage.levelIndexes.length === 0) return null;

  const states = stage.levelIndexes.map((index) => progress[levelKey(index)]?.status);

  if (states.includes("error")) return "error";
  if (states.every((state) => state === "success")) return "success";
  if (states.every((state) => state === "success" || state === "warning") && states.includes("warning")) {
    return "warning";
  }

  return null;
}

function updateStageCarousel() {
  stageCarousel.innerHTML = "";

  STAGES.forEach((stage, index) => {
    const button = document.createElement("button");
    button.className = "stage-button";
    button.textContent = stage.label;
    button.title = stage.levelIndexes.length > 0 ? `Estágio ${stage.label}` : `Estágio ${stage.label} em breve`;

    const state = stageStatus(stage);
    if (state === "success") button.classList.add("success");
    if (state === "error") button.classList.add("error");
    if (state === "warning") button.classList.add("warning");
    if (index === selectedStageIndex) button.classList.add("active");

    button.addEventListener("click", () => {
      if (stage.levelIndexes.length > 0) {
        loadLevel(stage.levelIndexes[0]);
      } else {
        loadStage(index);
      }
    });

    stageCarousel.appendChild(button);
  });
}

function updateCarousel() {
  updateStageCarousel();
  levelCarousel.innerHTML = "";

  currentStage().levelIndexes.forEach((index, position) => {
    const level = LEVELS[index];
    const button = document.createElement("button");
    button.className = "level-button";
    button.textContent = index === currentLevelIndex || progress[levelKey(index)]?.status ? String(position + 1) : "";
    button.title = level.title;

    const state = progress[levelKey(index)]?.status;
    if (state === "success") button.classList.add("success");
    if (state === "error") button.classList.add("error");
    if (state === "warning") button.classList.add("warning");
    if (index === currentLevelIndex) button.classList.add("active");

    button.addEventListener("click", () => loadLevel(index));
    levelCarousel.appendChild(button);
  });
}

function updateLevelHeader() {
  const stage = currentStage();
  if (stage.levelIndexes.length === 0) {
    levelTitle.textContent = `Estágio ${stage.label}`;
    lineGoal.textContent = "Aguardando fases";
    prevButton.disabled = previousNavigationTarget() === null;
    nextButton.disabled = nextNavigationTarget() === null;
    return;
  }

  const level = currentLevel();
  levelTitle.textContent = level.title;
  lineGoal.textContent = `Meta: até ${level.lineGoal} linhas`;
  prevButton.disabled = previousNavigationTarget() === null;
  nextButton.disabled = nextNavigationTarget() === null;
}

async function loadStage(index) {
  stopAnimation("success");
  stopAnimation("error");
  stopAnimation("warning");
  selectedStageIndex = index;
  debugActions = [];
  debugIndex = 0;
  actions = [];
  clearHighlightedLine();
  clearErrorHighlight();

  runButton.disabled = true;
  stepButton.disabled = true;
  resetStageButton.disabled = true;
  if (editor) {
    editor.updateOptions({ readOnly: true });
  }

  updateLevelHeader();
  updateCarousel();
  drawEmptyStage();
  setDebugInfo("Este estágio ainda não possui fases.");
  setStatus(`Estágio ${currentStage().label} selecionado.`);
  await saveProgress();
}

async function loadLevel(index) {
  stopAllEffects();
  selectedStageIndex = stageForLevel(index);
  currentLevelIndex = index;
  debugActions = [];
  debugIndex = 0;
  actions = [];
  clearHighlightedLine();
  clearErrorHighlight();
  resetPlayerToLevel();

  if (editor) {
    editor.updateOptions({ readOnly: false });
    const saved = progress[levelKey()]?.code;
    editor.setValue(saved || currentLevel().starterCode);
  }

  resetStageButton.disabled = false;
  if (pyodide) {
    runButton.disabled = false;
    stepButton.disabled = false;
  }

  updateLevelHeader();
  updateCarousel();
  draw();
  setDebugInfo("Clique em “Executar tudo” ou em “Próxima linha” para iniciar.");
  setStatus(currentLevel().isTutorial ? "Etapa de aprendizagem carregada. Leia a explicação e execute o exemplo." : "Desafio carregado.");
  openConceptModal(currentLevel());
  await saveProgress();
}

async function saveCurrentCode() {
  if (!editor) return;
  const key = levelKey();
  progress[key] = {
    ...(progress[key] || {}),
    code: editor.getValue(),
  };
  await saveProgress();
}

async function setStageResult(status, lineCount) {
  const key = levelKey();

  progress[key] = {
    ...(progress[key] || {}),
    status,
    lineCount,
    code: editor.getValue(),
    updatedAt: new Date().toISOString(),
  };

  await saveProgress();
  updateCarousel();
}

async function resetCurrentStage() {
  stopAllEffects();
  const key = levelKey();
  progress[key] = {
    code: currentLevel().starterCode,
  };
  await saveProgress();
  editor.setValue(currentLevel().starterCode);
  resetPlayerToLevel();
  debugActions = [];
  debugIndex = 0;
  actions = [];
  clearHighlightedLine();
  updateCarousel();
  draw();
  setDebugInfo("Fase reiniciada.");
  setStatus("Esta fase voltou ao estado branco/não executado.");
}

async function clearStageProgress() {
  const stage = currentStage();
  const shouldClear = window.confirm(
    `Você tem certeza que deseja limpar o progresso do Estágio ${stage.label}?`
  );
  if (!shouldClear) {
    setStatus("Limpeza de progresso cancelada.");
    return;
  }

  stage.levelIndexes.forEach((index) => {
    delete progress[levelKey(index)];
  });

  await saveProgress();
  await loadLevel(stage.levelIndexes[0] ?? currentLevelIndex);
  setStatus(`O progresso do Estágio ${stage.label} foi apagado.`);
}

async function collectActionsFromPython() {
  resetPlayerToLevel();
  actions = [];
  draw();

  const code = editor.getValue();

  pyodide.globals.set("__student_code__", code);
  pyodide.globals.set("__current_student_line__", 0);

  await pyodide.runPythonAsync(`
import sys

__current_student_line__ = 0

def __student_trace__(frame, event, arg):
    global __current_student_line__
    if event == "line" and frame.f_code.co_filename == "<student>":
        __current_student_line__ = frame.f_lineno
    return __student_trace__

sys.settrace(__student_trace__)
try:
    exec(compile(__student_code__, "<student>", "exec"), globals())
finally:
    sys.settrace(None)
  `);

  return [...actions];
}

async function evaluateResult() {
  const lineCount = countStudentLines(editor.getValue());

  if (isGoal() && allStarsCollected() && hasFullStarScore()) {
    if (currentLevel().isTutorial || lineCount <= currentLevel().lineGoal) {
      await setStageResult("success", lineCount);
      setStatus(currentLevel().isTutorial
        ? `Muito bem! Você executou o exemplo resolvido com ${lineCount} linha(s). Agora tente o próximo desafio.`
        : `Parabéns! Fase concluída com ${lineCount} linha(s).`
      );
      startSuccessEffect();
    } else {
      await setStageResult("warning", lineCount);
      setStatus(
        `Você chegou ao objetivo, mas usou ${lineCount} linhas. A meta desta fase é até ${currentLevel().lineGoal}.`
      );
      startWarningEffect();
    }
  } else if (isStarLevel() && isGoal()) {
    await setStageResult("error", lineCount);
    setStatus(allStarsCollected()
      ? "Você chegou ao destino, mas pegou estrela roxa e perdeu ponto. Evite as roxas."
      : "Você chegou ao destino, mas ainda faltam estrelas azuis pelo caminho.");
    startErrorEffect();
  } else {
    await setStageResult("error", lineCount);
    setStatus(isStarLevel()
      ? "Ainda não foi dessa vez. Pegue todas as estrelas azuis e depois vá ao destino."
      : "Ainda não foi dessa vez. Revise o caminho e tente novamente.");
    startErrorEffect();
  }
}

async function animateActions(recordedActions) {
  isAnimating = true;
  runButton.disabled = true;
  stepButton.disabled = true;

  resetPlayerToLevel();
  draw();

  for (const action of recordedActions) {
    highlightLine(action.lineNumber);
    applyVisualAction(action);
    draw();
    await new Promise((resolve) => setTimeout(resolve, 420));
  }

  clearHighlightedLine();
  isAnimating = false;
  runButton.disabled = false;
  stepButton.disabled = false;

  await evaluateResult();
}

async function runCode() {
  if (!pyodide || !editor || isAnimating) return;

  runButton.disabled = true;
  stepButton.disabled = true;
  clearHighlightedLine();
  clearErrorHighlight();
  stopAllEffects();
  setStatus("Executando o código Python...");

  try {
    await saveCurrentCode();
    const recordedActions = await collectActionsFromPython();

    setStatus(`Código executado. Ações registradas: ${recordedActions.length}.`);
    await animateActions(recordedActions);
  } catch (error) {
    await setStageResult("error", countStudentLines(editor.getValue()));
    showFriendlyError(error);
    startErrorEffect();
    runButton.disabled = false;
    stepButton.disabled = false;
  }
}

async function prepareDebugIfNeeded() {
  if (debugActions.length > 0 && debugIndex < debugActions.length) {
    return true;
  }

  clearHighlightedLine();
  clearErrorHighlight();
  stopAllEffects();
  setStatus("Preparando debug...");

  try {
    await saveCurrentCode();
    debugActions = await collectActionsFromPython();
    debugIndex = 0;
    resetPlayerToLevel();
    draw();

    if (debugActions.length === 0) {
      setDebugInfo("Nenhuma ação foi registrada.");
      setStatus("O código não gerou movimentos para o personagem.");
      return false;
    }

    setDebugInfo(`Debug preparado. Total de ações: ${debugActions.length}.`);
    setStatus("Clique em “Próxima linha” para avançar.");
    return true;
  } catch (error) {
    await setStageResult("error", countStudentLines(editor.getValue()));
    showFriendlyError(error);
    startErrorEffect();
    return false;
  }
}

async function stepDebug() {
  if (!pyodide || !editor || isAnimating) return;

  runButton.disabled = true;
  stepButton.disabled = true;

  const ready = await prepareDebugIfNeeded();

  if (!ready) {
    runButton.disabled = false;
    stepButton.disabled = false;
    return;
  }

  const action = debugActions[debugIndex];

  highlightLine(action.lineNumber);
  applyVisualAction(action);
  draw();

  debugIndex += 1;

  setDebugInfo(`Passo ${debugIndex}/${debugActions.length}. Linha executada: ${action.lineNumber}.`);

  if (debugIndex >= debugActions.length) {
    await evaluateResult();
  }

  runButton.disabled = false;
  stepButton.disabled = false;
}

async function initPyodide() {
  draw();
  setStatus("Carregando Pyodide...");

  const pyodideBaseUrl = `${import.meta.env.BASE_URL}pyodide/`;

  pyodide = await loadPyodide({
    indexURL: pyodideBaseUrl,
  });

  pyodide.globals.set("andar", andar);
  pyodide.globals.set("virar", virarGraus);
  pyodide.globals.set("virar_direita", virarDireita);
  pyodide.globals.set("virar_esquerda", virarEsquerda);
  pyodide.globals.set("caminho_livre", caminhoLivre);
  pyodide.globals.set("caminho_livre_esquerda", caminhoLivreEsquerda);
  pyodide.globals.set("caminho_livre_direita", caminhoLivreDireita);

  const stage = currentStage();
  runButton.disabled = stage.levelIndexes.length === 0;
  stepButton.disabled = stage.levelIndexes.length === 0;

  setStatus("Pronto. Escreva seu código Python e clique em Executar tudo ou Próxima linha.");
}

function initMonaco() {
  editor = monaco.editor.create(document.getElementById("editor"), {
    value: currentLevel().starterCode,
    language: "python",
    theme: "vs-dark",
    automaticLayout: true,
    fontSize: 15,
    minimap: { enabled: false },
    lineNumbers: "on",
    roundedSelection: true,
    scrollBeyondLastLine: false,
    wordWrap: "on",
    tabSize: 4,
    insertSpaces: true,
    glyphMargin: true,
  });

  editor.onDidChangeModelContent(() => {
    debugActions = [];
    debugIndex = 0;
    clearHighlightedLine();
    clearErrorHighlight();
    saveCurrentCode();
    setDebugInfo("Código alterado. Clique em “Próxima linha” para reiniciar o debug.");
  });
}

async function init() {
  db = await openDatabase();
  await loadProgress();

  initMonaco();
  await loadLevel(currentLevelIndex);
  await initPyodide();
}

runButton.addEventListener("click", runCode);
stepButton.addEventListener("click", stepDebug);
resetStageButton.addEventListener("click", resetCurrentStage);
clearProgressButton.addEventListener("click", clearStageProgress);
prevButton.addEventListener("click", () => {
  navigateToTarget(previousNavigationTarget());
});
nextButton.addEventListener("click", () => {
  navigateToTarget(nextNavigationTarget());
});

closeErrorModal.addEventListener("click", closeErrorModalBox);
closeConceptModal.addEventListener("click", closeConceptModalBox);
errorModal.addEventListener("click", (event) => {
  if (event.target === errorModal) {
    closeErrorModalBox();
  }
});

conceptModal.addEventListener("click", (event) => {
  if (event.target === conceptModal) {
    closeConceptModalBox();
  }
});
document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    closeErrorModalBox();
    closeConceptModalBox();
  }
});

draw();
init();
