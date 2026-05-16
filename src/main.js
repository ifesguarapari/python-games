import * as monaco from "monaco-editor";
import EditorWorker from "monaco-editor/esm/vs/editor/editor.worker?worker";
import { loadPyodide } from "pyodide";

self.MonacoEnvironment = {
  getWorker() {
    return new EditorWorker();
  },
};

const TILE = 64;
const GRID = 7;
const CANVAS_SIZE = TILE * GRID;
const MAX_ACTIONS = 500;
const DB_NAME = "python-game-progress";
const STORE_NAME = "stage-progress";

const LEVELS = [
  {
    "title": "Aprenda 1: comandos em sequência",
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
    "title": "Desafio 2: comandos em sequência",
    "lineGoal": 2,
    "start": {
      "x": 2,
      "y": 3,
      "dir": 0
    },
    "goal": {
      "x": 4,
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
      ]
    ],
    "starterCode": "# Desafio 2\n# Leve o personagem até o objetivo usando sequência.\n\n",
    "isTutorial": false,
    "concept": null
  },
  {
    "title": "Aprenda 3: virando no caminho",
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
    "title": "Desafio 4: vire uma vez",
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
    "starterCode": "# Desafio 4\n# Use andar() e virar_esquerda().\n\n",
    "isTutorial": false,
    "concept": null
  },
  {
    "title": "Aprenda 5: repetindo com while",
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
    "title": "Desafio 6: repetição",
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
    "starterCode": "# Desafio 6\n# Tente usar while para andar até o final.\n\n",
    "isTutorial": false,
    "concept": null
  },
  {
    "title": "Aprenda 7: bloco indentado",
    "lineGoal": 99,
    "start": {
      "x": 1,
      "y": 5,
      "dir": 0
    },
    "goal": {
      "x": 2,
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
        2,
        4
      ]
    ],
    "starterCode": "# Exemplo resolvido.\n# A linha dentro do if fica recuada.\n\nif caminho_livre():\n    andar()\nvirar_esquerda()\nandar()",
    "isTutorial": true,
    "concept": {
      "title": "Algumas linhas trabalham em grupo",
      "objective": "Você vai observar comandos que ficam dentro de um bloco.",
      "programming": "Um bloco é um grupo de linhas que pertence à mesma ideia, como uma repetição ou decisão.",
      "python": "Depois de if ou while, use indentação: Tab ou quatro espaços nas linhas de dentro.",
      "thinking": "Se algo der erro, confira primeiro se as linhas estão bem alinhadas."
    }
  },
  {
    "title": "Desafio 8: zigue-zague",
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
    "starterCode": "# Desafio 8\n# Resolva o caminho em escada.\n\n",
    "isTutorial": false,
    "concept": null
  },
  {
    "title": "Aprenda 9: planejando por partes",
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
    "title": "Desafio 10: caminho em L",
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
    "starterCode": "# Desafio 10\n# Combine sequência e virada.\n\n",
    "isTutorial": false,
    "concept": null
  },
  {
    "title": "Aprenda 11: contornando obstáculos",
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
    "title": "Desafio 12: contorno",
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
    "starterCode": "# Desafio 12\n# Contorne o caminho.\n\n",
    "isTutorial": false,
    "concept": null
  },
  {
    "title": "Aprenda 13: escolhendo com if",
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
    "title": "Desafio 14: decisões",
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
    "starterCode": "# Desafio 14\n# Teste caminhos com if.\n\n",
    "isTutorial": false,
    "concept": null
  },
  {
    "title": "Aprenda 15: melhorando a solução",
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
    "title": "Desafio 16: menos linhas",
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
    "starterCode": "# Desafio 16\n# Resolva usando poucas linhas.\n\n",
    "isTutorial": false,
    "concept": null
  },
  {
    "title": "Aprenda 17: olhando para os lados",
    "lineGoal": 99,
    "start": {
      "x": 2,
      "y": 5,
      "dir": 3
    },
    "goal": {
      "x": 1,
      "y": 4
    },
    "path": [
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
      ]
    ],
    "starterCode": "# Exemplo resolvido.\n# Teste se há caminho à esquerda.\n\nandar()\nif caminho_livre_esquerda():\n    virar_esquerda()\n    andar()",
    "isTutorial": true,
    "concept": {
      "title": "O programa pode observar o caminho",
      "objective": "Você vai usar testes como caminho_livre_esquerda() e caminho_livre_direita().",
      "programming": "Esses testes ajudam o personagem a perceber o ambiente antes de agir.",
      "python": "Essas funções retornam True ou False e combinam bem com if e while.",
      "thinking": "Antes de mandar andar, pergunte se existe caminho."
    }
  },
  {
    "title": "Desafio 18: ramificações",
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
    "starterCode": "# Desafio 18\n# Cuidado com ramificações.\n\n",
    "isTutorial": false,
    "concept": null
  },
  {
    "title": "Aprenda 19: juntando estratégias",
    "lineGoal": 99,
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
    "starterCode": "# Exemplo resolvido.\n# Use repetição, virada e teste.\n\nwhile caminho_livre():\n    andar()\nvirar_esquerda()\nif caminho_livre():\n    andar()",
    "isTutorial": true,
    "concept": {
      "title": "Junte tudo o que você aprendeu",
      "objective": "Você vai combinar comandos, repetição e decisão em um desafio maior.",
      "programming": "Problemas grandes ficam mais fáceis quando quebrados em partes menores.",
      "python": "Teste aos poucos. Se uma linha ficar vermelha, leia a dica e corrija com calma.",
      "thinking": "Não precisa acertar de primeira: programar é ajustar passo a passo."
    }
  },
  {
    "title": "Desafio 20: desafio final",
    "lineGoal": 12,
    "start": {
      "x": 1,
      "y": 5,
      "dir": 0
    },
    "goal": {
      "x": 3,
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
        2,
        2
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
        3,
        1
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
        5,
        2
      ],
      [
        5,
        1
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
        4,
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
        3,
        1
      ]
    ],
    "starterCode": "# Desafio 20\n# Use tudo o que aprendeu.\n\n",
    "isTutorial": false,
    "concept": null
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
let progress = {};
let player = { x: 0, y: 0, dir: 0 };
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
}

async function saveProgress() {
  await dbSet("progress", progress);
  await dbSet("currentLevelIndex", currentLevelIndex);
}

function resetPlayerToLevel() {
  const start = currentLevel().start;
  player = { x: start.x, y: start.y, dir: start.dir };
}

function pathSetForLevel() {
  return new Set(currentLevel().path.map(([x, y]) => `${x},${y}`));
}

function isRoad(x, y) {
  return pathSetForLevel().has(`${x},${y}`);
}

function isGoal() {
  const goal = currentLevel().goal;
  return player.x === goal.x && player.y === goal.y;
}

function isBlocked(x, y) {
  if (x < 0 || y < 0 || x >= GRID || y >= GRID) return true;
  return !isRoad(x, y);
}

function directionAtOffset(offset) {
  const directions = [
    { dx: 1, dy: 0, label: "direita" },
    { dx: 0, dy: 1, label: "baixo" },
    { dx: -1, dy: 0, label: "esquerda" },
    { dx: 0, dy: -1, label: "cima" },
  ];

  const dir = (player.dir + offset + 4) % 4;

  return {
    dir,
    dx: directions[dir].dx,
    dy: directions[dir].dy,
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

function enqueueAction(type) {
  if (actions.length >= MAX_ACTIONS) {
    throw new Error(
      `O programa executou mais de ${MAX_ACTIONS} ações e foi interrompido.\n\n` +
      "Isso geralmente acontece quando há um laço infinito ou quando o caminho não chega ao objetivo."
    );
  }

  const lineNumber = getPythonLineNumber();
  actions.push({ type, lineNumber });
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
  }
}

function virarDireita() {
  enqueueAction("turnRight");
  player.dir = (player.dir + 1) % 4;
}

function virarEsquerda() {
  enqueueAction("turnLeft");
  player.dir = (player.dir + 3) % 4;
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
    }
  }

  if (action.type === "turnRight") {
    player.dir = (player.dir + 1) % 4;
  }

  if (action.type === "turnLeft") {
    player.dir = (player.dir + 3) % 4;
  }
}

function draw(offsetX = 0, offsetY = 0) {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.save();
  ctx.translate(offsetX, offsetY);

  drawBackground();
  drawRoad();
  drawGoal();
  drawPlayer();

  ctx.restore();
}

function drawBackground() {
  ctx.fillStyle = "#f2f0e9";
  ctx.fillRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);

  ctx.strokeStyle = "#e4e0d8";
  ctx.lineWidth = 2;

  for (let y = 0; y < GRID; y++) {
    for (let x = 0; x < GRID; x++) {
      if (!isRoad(x, y)) {
        const px = x * TILE + 13;
        const py = y * TILE + 13;
        ctx.globalAlpha = 0.55;
        ctx.beginPath();
        ctx.moveTo(px, py);
        ctx.lineTo(px + 28, py);
        ctx.lineTo(px + 28, py + 12);
        ctx.lineTo(px + 42, py + 12);
        ctx.lineTo(px + 42, py + 36);
        ctx.lineTo(px + 12, py + 36);
        ctx.lineTo(px + 12, py + 22);
        ctx.lineTo(px, py + 22);
        ctx.closePath();
        ctx.stroke();
        ctx.globalAlpha = 1;
      }
    }
  }
}

function drawRoad() {
  const path = currentLevel().path;

  ctx.strokeStyle = "#fff500";
  ctx.lineWidth = 18;
  ctx.lineCap = "round";
  ctx.lineJoin = "round";

  ctx.beginPath();

  path.forEach(([x, y], index) => {
    const cx = x * TILE + TILE / 2;
    const cy = y * TILE + TILE / 2;

    if (index === 0) {
      ctx.moveTo(cx, cy);
    } else {
      ctx.lineTo(cx, cy);
    }
  });

  ctx.stroke();

  ctx.strokeStyle = "rgba(255,255,255,0.55)";
  ctx.lineWidth = 2;
  ctx.setLineDash([12, 22]);
  ctx.beginPath();

  path.forEach(([x, y], index) => {
    const cx = x * TILE + TILE / 2;
    const cy = y * TILE + TILE / 2;

    if (index === 0) {
      ctx.moveTo(cx, cy);
    } else {
      ctx.lineTo(cx, cy);
    }
  });

  ctx.stroke();
  ctx.setLineDash([]);
}

function drawGoal() {
  const goal = currentLevel().goal;
  const x = goal.x * TILE + TILE / 2;
  const y = goal.y * TILE + TILE / 2;

  ctx.fillStyle = "#ff6f61";
  ctx.strokeStyle = "#111";
  ctx.lineWidth = 2;

  ctx.beginPath();
  ctx.arc(x, y - 12, 9, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();

  ctx.beginPath();
  ctx.moveTo(x, y + 18);
  ctx.lineTo(x - 8, y - 4);
  ctx.lineTo(x + 8, y - 4);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();
}

function drawPlayer() {
  const x = player.x * TILE + TILE / 2;
  const y = player.y * TILE + TILE / 2;

  ctx.save();
  ctx.translate(x, y);
  ctx.rotate((Math.PI / 2) * player.dir);

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
    const x = goal.x * TILE + TILE / 2;
    const y = goal.y * TILE + TILE / 2;

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

function updateCarousel() {
  levelCarousel.innerHTML = "";

  LEVELS.forEach((level, index) => {
    const button = document.createElement("button");
    button.className = "level-button";
    button.textContent = index === currentLevelIndex || progress[levelKey(index)]?.status ? String(index + 1) : "";
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
  const level = currentLevel();
  levelTitle.textContent = level.title;
  lineGoal.textContent = `Meta: até ${level.lineGoal} linhas`;
  prevButton.disabled = currentLevelIndex === 0;
  nextButton.disabled = currentLevelIndex === LEVELS.length - 1;
}

async function loadLevel(index) {
  stopAllEffects();
  currentLevelIndex = index;
  debugActions = [];
  debugIndex = 0;
  actions = [];
  clearHighlightedLine();
  clearErrorHighlight();
  resetPlayerToLevel();

  if (editor) {
    const saved = progress[levelKey()]?.code;
    editor.setValue(saved || currentLevel().starterCode);
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

async function clearAllProgress() {
  progress = {};
  await dbDelete("progress");
  await dbDelete("currentLevelIndex");
  await loadLevel(0);
  setStatus("Todo o progresso local foi apagado.");
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

  if (isGoal()) {
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
  } else {
    await setStageResult("error", lineCount);
    setStatus("Ainda não foi dessa vez. Revise o caminho e tente novamente.");
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
  pyodide.globals.set("virar_direita", virarDireita);
  pyodide.globals.set("virar_esquerda", virarEsquerda);
  pyodide.globals.set("caminho_livre", caminhoLivre);
  pyodide.globals.set("caminho_livre_esquerda", caminhoLivreEsquerda);
  pyodide.globals.set("caminho_livre_direita", caminhoLivreDireita);

  runButton.disabled = false;
  stepButton.disabled = false;

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
clearProgressButton.addEventListener("click", clearAllProgress);
prevButton.addEventListener("click", () => {
  if (currentLevelIndex > 0) loadLevel(currentLevelIndex - 1);
});
nextButton.addEventListener("click", () => {
  if (currentLevelIndex < LEVELS.length - 1) loadLevel(currentLevelIndex + 1);
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
