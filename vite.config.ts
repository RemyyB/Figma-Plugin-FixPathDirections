import { defineConfig } from "vite";
import commonjs from "vite-plugin-commonjs";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [commonjs()],
  build: {
    commonjsOptions: {
      transformMixedEsModules: true,
    },
  },
});
