import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { fileURLToPath, URL } from 'node:url'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  if (mode === 'lib') {
    // Library build configuration
    return {
      plugins: [react()],
      build: {
        lib: {
          entry: fileURLToPath(new URL('./src/index.ts', import.meta.url)),
          name: 'ReactVoiceFeedback',
          fileName: 'index',
          formats: ['es', 'cjs']
        },
        rollupOptions: {
          external: ['react', 'react-dom'],
          output: {
            globals: {
              react: 'React',
              'react-dom': 'ReactDOM'
            }
          }
        }
      }
    }
  }
  
  // Development configuration
  return {
    plugins: [react()],
  }
})
