import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],

  resolve: {
    alias: {
      '@': `${import.meta.dirname}/src`,
    },
  },

  server: {
    host: '0.0.0.0',
    port: 5173,

    allowedHosts: [
      '01c4bx0t-5173.brs.devtunnels.ms',
    ],

    hmr: {
      protocol: 'wss',
      host: '01c4bx0t-5173.brs.devtunnels.ms',
      clientPort: 443,
    },
  },
})