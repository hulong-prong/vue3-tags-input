import { defineConfig } from "vite"
import path from "path"
import vue from "@vitejs/plugin-vue"
import vueJSX from "@vitejs/plugin-vue-jsx"
// import pluginEslint from "vite-plugin-eslint"
import WindiCSS from "vite-plugin-windicss"

// https://vitejs.dev/config/
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
    },
  },
  css: {
    preprocessorOptions: {
      less: { javascriptEnabled: true },
    },
  },
  plugins: [
    vue(),
    vueJSX(),
    // pluginEslint({
    //   include: ["src/**/*.ts", "src/**/*.d.ts", "src/**/*.tsx", "src/**/*.vue"],
    // }),
    WindiCSS(),
  ],
})
