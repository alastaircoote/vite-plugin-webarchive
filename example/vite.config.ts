import { defineConfig } from "vite";
import { webarchive } from "vite-plugin-webarchive";

export default defineConfig({
  base: "https://www.example.com/",
  plugins: [webarchive()],
  build: {
    rollupOptions: {
      input: {
        index: "index.html",
        worker: "src/worker.ts",
      },
      output: {
        entryFileNames: (chunk) => {
          if (chunk.name === "worker") {
            return "[name].js";
          }
          return "assets/[name]-[hash].js";
        },
      },
    },
  },
});
