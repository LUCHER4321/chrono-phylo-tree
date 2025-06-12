import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import dts from 'vite-plugin-dts'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    dts()
  ],
  build: {
    lib: {
      entry: 'src/index.ts',
      name: 'chrono-phylo-tree',
      fileName: (format) => `chrono-phylo-tree.${format}.js`
    },
    rollupOptions: {
      external: ['react', 'react-dom', "react/jsx-runtime"],
      output: {
        globals: {
          react: 'React',
          'react-dom': 'ReactDOM',
          "react/jsx-runtime": "react/jsx-runtime"
        }
      }
    }
  }
})
