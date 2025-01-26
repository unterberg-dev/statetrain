import path from "node:path"
import react from "@vitejs/plugin-react"
import UnoCSS from "unocss/vite"
import vike from "vike/plugin"
import { defineConfig } from "vite"

import tsConf from "./lib/utils/tsconf"

export default defineConfig({
  base: "/statetrain",
  plugins: [
    UnoCSS(),
    react(),
    vike({
      prerender: true,
      trailingSlash: true,
    }),
  ],
  optimizeDeps: {
    include: ["react/jsx-runtime", "react", "react-dom"],
  },
  server: { port: 5247 },
  preview: { port: 4248 },
  resolve: {
    alias: Object.entries(tsConf.compilerOptions.paths).map(([key, [value]]) => ({
      find: key.replace("/*", ""),
      replacement: path.resolve(__dirname, value.replace("/*", "")),
    })),
  },
})
