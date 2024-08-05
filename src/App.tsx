import { useState } from 'react'
import {
  BrowserRouter as Router,
  Routes,
} from 'react-router-dom'
import { Provider } from 'react-redux'
import './App.css'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <Provider>
        <Router>
          <Routes>
          </Routes>
        </Router>
      </Provider>
    </>
  )
}

export default App
