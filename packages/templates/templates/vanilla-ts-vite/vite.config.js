import path from 'path'
import { defineConfig } from 'vite'

export default defineConfig({
  envDir: path.resolve(__dirname, 'env'),
  resolve: {
    alias: [
      {
        find: '@',
        replacement: path.resolve(__dirname, 'src')
      },
      {
        find: '@desktop',
        replacement: path.resolve(__dirname, 'cross/desktop/src')
      }
    ]
  },
  build: {
    brotliSize: false
  }
})
