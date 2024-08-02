import { defineConfig } from "vite";
import path from "node:path";
import { viteSingleFile } from "vite-plugin-singlefile";
import react from "@vitejs/plugin-react";
import commonjs from "vite-plugin-commonjs";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  plugins: [react(), viteSingleFile(), commonjs()],
  root: path.resolve("src"),
  build: {
    minify: mode === "production",
    cssMinify: mode === "production",
    // sourcemap: mode !== "production" ? "inline" : false,
    sourcemap: false,
    emptyOutDir: false,
    outDir: path.resolve("dist"),
    commonjsOptions: {
      transformMixedEsModules: true,
    },
    rollupOptions: {
      input: path.resolve("src/plugin.html"),
    },
  },
  resolve: {
    alias: {
      services: path.resolve("src/services"),
      utilities: path.resolve("src/utilities"),
      types: path.resolve("src/types"),
    },
  },
}));
