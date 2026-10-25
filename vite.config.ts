import { fileURLToPath } from "node:url"
import tailwindcss from "@tailwindcss/vite"
import react from "@vitejs/plugin-react"
import { defineConfig } from "vite"

export default defineConfig(({ command }) => {
  if (command === "build") process.env.NODE_ENV = "production"

  return {
    base: "/",
    define:
      command === "build"
        ? { "process.env.NODE_ENV": JSON.stringify("production") }
        : undefined,
    plugins: [react(), tailwindcss()],
    resolve: {
      alias: {
        "@": fileURLToPath(new URL("./src/", import.meta.url)),
      },
    },
    build: {
      outDir: "dist",
      sourcemap: false,
    },
    server: {
      host: "0.0.0.0",
      port: Number(process.env.PORT || 8443),
      strictPort: true,
    },
    preview: {
      host: "0.0.0.0",
      port: Number(process.env.PORT || 8443),
    },
  }
})
