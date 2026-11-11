import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// strictPort: el CORS del backend solo acepta http://localhost:5173
export default defineConfig({
  plugins: [react()],
  server: { port: 5173, strictPort: true },
})
