import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  build: {
    lib: {
      entry: './src/lib/index.js',
      name: 'MinimePillow'
    },
    rollupOptions: {
      external: [
        'vue'
      ],
      output: {
        globals: {
          vue: 'Vue'
        }
      }
    }
  },
  plugins: [vue()]
})