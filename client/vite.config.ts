import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import path from "node:path";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  base: "./",
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
      buffer: 'buffer',
    },
  },
  build: {
    outDir: "dist",
    assetsDir: "assets", // Ensure assets are properly placed
  },
  server: {
    port: 5173, // Change if needed
    host: "localhost",
  },
});
