import { defineConfig } from "vite"
import path from "path"
import vue from "@vitejs/plugin-vue"
import vueJSX from "@vitejs/plugin-vue-jsx"
import WindiCSS from "vite-plugin-windicss"

export default defineConfig({
  server: {
    open: true,
    port: 8080,
    host: true,
  },
  resolve: {
    alias: {
      "/@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    lib: {
      entry: "./src/components/tagInput/index.ts",
      name: "tagInput",
      fileName: (format) => `vue-tags-input.${format}.js`,
    },
    rollupOptions: {
      external: ["vue"],
      output: {
        globals: {
          vue: "Vue",
        },
      },
    },
  },
  css: {
    preprocessorOptions: {
      less: { javascriptEnabled: true },
    },
  },
  plugins: [vue(), vueJSX(), WindiCSS()],
})
