import { defineConfig } from "vite";
import { viteStaticCopy } from "vite-plugin-static-copy";

export default defineConfig({
  base: "/python-games/",
  optimizeDeps: {
    exclude: ["pyodide"],
  },
  plugins: [
    viteStaticCopy({
      targets: [
        {
          src: "node_modules/pyodide/*",
          dest: "pyodide",
        },
      ],
    }),
  ],
});
