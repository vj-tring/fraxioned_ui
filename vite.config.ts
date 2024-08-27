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
       
    }),
    // commonjs(),
    
  ],
  resolve: {
    alias: {
      '@': '/src',
    },
  },
  css: {
    modules: {
      localsConvention: 'camelCaseOnly',
      generateScopedName: '[name]__[local]___[hash:base64:5]'
    }
  },
  // test: {
  //   globals: true,
  //   environment: 'jsdom',
  //   setupFiles: ['./src/setupTests.ts']
  // },
  build: {
    sourcemap: false,
    minify: 'terser',
  },
  optimizeDeps: {
    include: ['react', 'react-dom','@mui/utils', '@mui/material', '@mui/system', '@emotion/react', '@emotion/styled','@mui/utils/formatMuiErrorMessage'],
  },
})
