import React from 'react'
import { createRoot } from 'react-dom/client';
// import { BaseProvider, LightTheme } from 'baseui'
// import { Provider as StyletronProvider } from 'styletron-react'
import {SnackbarProvider} from './components/snackbar-provider'; // Adjust the path as necessary
// import { ThemeProvider, createTheme } from '@mui/system';
import App from './App.tsx'
// import { Client as Styletron } from 'styletron-engine-atomic'
import './index.css'

// const engine = new Styletron()
const rootElement = document.getElementById('root')
// const theme = createTheme();

if (rootElement) {
  const root = createRoot(rootElement)

  root.render(
    <React.StrictMode>
      {/* <ThemeProvider theme={theme}> */}
      {/* <StyletronProvider value={engine}> */}
        {/* <BaseProvider theme={LightTheme}> */}
          <SnackbarProvider>
            <App />
          </SnackbarProvider>
        {/* </BaseProvider> */}
      {/* </StyletronProvider> */}
      {/* </ThemeProvider> */}
    </React.StrictMode>
  )
} else {
  console.error('Root element not found')
}

