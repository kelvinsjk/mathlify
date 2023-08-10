import { defineConfig } from 'vite'

// https://vitejs.dev/config/
export default defineConfig({
  build: {
    commonjsOptions: { include: []}
  },
  optimizeDeps: {
    disabled: false,
  },
})
