import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  server:{
    host: '0.0.0.0',
  },
  plugins: [
    react({
      jsxRuntime: 'automatic',
       
    })
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
  build: {
    sourcemap: false,
    minify: 'terser',
  },
  optimizeDeps: {
    include: ['react', 'react-dom','@mui/utils', '@mui/material', '@mui/system', '@emotion/react', '@emotion/styled','@mui/utils/formatMuiErrorMessage'],
  },
})
