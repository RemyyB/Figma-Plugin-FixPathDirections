import path from "node:path";
import { defineConfig } from "vite";
import generateFile from "vite-plugin-generate-file";
import { viteSingleFile } from "vite-plugin-singlefile";
import figmaManifest from "./manifest";
import commonjs from "vite-plugin-commonjs";

export default defineConfig(({ mode }) => ({
  plugins: [
    viteSingleFile(),
    generateFile({
      type: "json",
      output: "./manifest.json",
      data: figmaManifest,
    }),
    commonjs(),
  ],
  build: {
    minify: mode === "production",
    // sourcemap: mode !== 'production' ? 'inline' : false,
    sourcemap: false,
    target: "es2017",
    emptyOutDir: false,
    outDir: path.resolve("dist"),
    commonjsOptions: {
      transformMixedEsModules: true,
    },
    rollupOptions: {
      input: path.resolve("src/main.ts"),
      output: {
        entryFileNames: "main.js",
      },
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
