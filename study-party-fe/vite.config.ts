import path from "path"
import tailwindcss from "@tailwindcss/vite"
import react from "@vitejs/plugin-react"
import { defineConfig } from "vite"

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  define: {
    global: 'window', // Fix lỗi global is not defined của sockjs-client cũ
  },
  server: {
    allowedHosts: true,
    proxy: {
      '/api': {
        target: 'http://localhost:8080',
        changeOrigin: true,
        secure: false,
        ws: true, // <--- BẬT CÁI NÀY Ở ĐÂY LÀ ĐỦ
        rewrite: (path) => path.replace(/^\/api/, ''),
      },
    },
  },
})