import React from 'react'
import ReactDOM from 'react-dom/client'
import { BaseProvider, LightTheme } from 'baseui'
import { Provider as StyletronProvider } from 'styletron-react'
import { Client as Styletron } from 'styletron-engine-atomic'
import App from './App'
import { SnackbarProvider } from '../src/Components/SnackbarProvider/SnackbarProvider'; // Adjust the path as necessary


const engine = new Styletron()
const rootElement = document.getElementById('root')

if (rootElement) {
  const root = ReactDOM.createRoot(rootElement)

  root.render(
    <React.StrictMode>
      <StyletronProvider value={engine}>
        <BaseProvider theme={LightTheme}>
          <SnackbarProvider>
            <App />
          </SnackbarProvider>,
        </BaseProvider>
      </StyletronProvider>
    </React.StrictMode>
  )
} else {
  console.error('Root element not found')
}
