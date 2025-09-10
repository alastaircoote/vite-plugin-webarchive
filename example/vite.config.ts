import { defineConfig } from "vite";
import { webarchive } from "vite-plugin-webarchive";

export default defineConfig({
  base: "https://www.example.com/",
  plugins: [webarchive()],
});
