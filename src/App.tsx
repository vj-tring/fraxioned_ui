import React, { FC } from 'react'
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from 'react-router-dom'
import './App.css'
import Login from './pages/Login/Login'
import Dashboard from './pages/Dashboard/Dashboard'


interface PrivateRouteProps {
  element: React.ComponentType
}

const PrivateRoute: FC<PrivateRouteProps> = ({ element: Element }) => {
  const token = localStorage.getItem('token')
  return token ? <Element /> : <Navigate to="/login" />
}


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/login" element={<Login />} />
        <Route
          path="/dashboard"
          element={<PrivateRoute element={Dashboard} />}
        />
      </Routes>
    </Router>
  )
}

export default App
