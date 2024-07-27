import React from 'react'
import ReactDOM from 'react-dom'
import { BaseProvider, LightTheme } from 'baseui'
import { Provider as StyletronProvider } from 'styletron-react'
import { Client as Styletron } from 'styletron-engine-atomic'
import App from 'App'

// Import your Calendar component
// import Calendar from './Components/Calendar/Calendar'; // Adjust the path as per your actual folder structure

// Initialize Styletron engine
const engine = new Styletron()

// Render your application
ReactDOM.render(
  <React.StrictMode>
    <StyletronProvider value={engine}>
      <BaseProvider theme={LightTheme}>
        <App /> {/* Render your Calendar component */}
      </BaseProvider>
    </StyletronProvider>
  </React.StrictMode>,
  document.getElementById('root')
)
