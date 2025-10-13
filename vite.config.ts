import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import dts from 'vite-plugin-dts'

export default defineConfig(({ mode }) => {
  if (mode === 'lib') {
    return {
      plugins: [vue(), dts()],
      build: {
        outDir: 'dist',
        lib: {
          entry: './src/index.ts',
          name: 'Thesis',
          formats: ['es'],
          fileName: (format) => `index.${format}.js`
        },
        rollupOptions: {
          external: ['vue', '@y2kfund/core', '@tanstack/vue-query'],
          output: {
            globals: {
              vue: 'Vue',
              '@y2kfund/core': 'Y2kfundCore',
              '@tanstack/vue-query': 'VueQuery'
            }
          }
        }
      }
    }
  }

  return {
    plugins: [vue()],
    server: { 
      port: 5103,
      open: true 
    },
    root: '.',
    // Use dev harness as the default entry point
    build: {
      rollupOptions: {
        input: './dev/index.html'
      }
    }
  }
})