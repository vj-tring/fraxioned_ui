import { FC, useState } from 'react'
import {
  Navigate,
  Route,
  BrowserRouter as Router,
  Routes,
} from 'react-router-dom'
import Login from './pages/login/index'
import { Provider } from 'react-redux'
import './App.css'
import store from './store/index';
import ForgetPassword from './pages/forgot-password'
import Change from './pages/recover-password'
import ResetPassword from './pages/reset-password'
import Dashboard from './pages/dashboard'

interface PrivateRouteProps {
  element: React.ComponentType
}

const PrivateRoute: FC<PrivateRouteProps> = ({ element: Element }) => {
  const token = localStorage.getItem('session')
  return token ? <Element /> : <Navigate to="/dashboard" />
}

function App() {

  return (
    <>
      <Provider store={store}>
        <Router>
          <Routes>
            <Route path="/" element={<Navigate to="/login" />} />
            <Route path="/login" element={<Login />} />
            <Route path="/forgotPassword" element={<ForgetPassword />} />
            <Route path="/recoverPassword" element={<Change />} />
            <Route path="/resetPassword" element={<ResetPassword onClose={()=>{}} />} />
            <Route path="/*" element={<Dashboard />} />
          </Routes>
        </Router>
      </Provider>
    </>
  )
}

export default App
