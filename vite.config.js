/*
 * @Description: 
 * @Version: 2.0
 * @Author: Yaowen Liu
 * @Date: 2021-07-19 09:42:00
 * @LastEditors: Yaowen Liu
 * @LastEditTime: 2022-01-18 13:10:18
 */
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  build: {
    lib: {
      entry: './src/lib/index.js',
      name: 'MinimePillow',
      fileName: 'minime-pillow'
    },
    rollupOptions: {
      external: [
        'vue',
        'localforage'
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