import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

const baseurl = process.env.VITE_BACKEND_URL || "https://localhost:7098"
console.log(baseurl)

export default defineConfig({
  plugins: [react(),tailwindcss(),],
  server:{
    host: '0.0.0.0',
    port: 5173,
    proxy:{
        '/api': {
        target: `${baseurl}/api/Values/`, // your .NET backend /api/Values/
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path.replace(/^\/api/, ''),
    }
  }
  }
})
