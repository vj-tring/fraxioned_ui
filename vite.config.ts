import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
// import commonjs from 'vite-plugin-commonjs';
import commonjs from '@rollup/plugin-commonjs';


// https://vitejs.dev/config/
export default defineConfig({
  server:{
    host: '0.0.0.0',
  },
  plugins: [
    react({
      jsxRuntime: 'automatic',
      babel: {
        babelrc: true,
        // configFile: true
      }
    }),
    commonjs(),
  ],
  css: {
    modules: {
      localsConvention: 'camelCaseOnly',
      generateScopedName: '[name]__[local]___[hash:base64:5]'
    }
  },
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./src/setupTests.ts']
  },
  build: {
    sourcemap: true,
    minify: 'terser',
  },
  optimizeDeps: {
    include: ['@mui/material', 'react', 'react-dom'],
  },
})
