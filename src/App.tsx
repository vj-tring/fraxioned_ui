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
  allowedRoles: number[];
}

const PrivateRoute: FC<PrivateRouteProps> = ({ element: Element, allowedRoles }) => {
  const token = localStorage.getItem('session')
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  if (!token) {
    return <Navigate to="/login" />;
  }
  if (allowedRoles.includes(user.role.id)) {
    return <Element />;
  }
  return <Navigate to="/dashboard" />;
};

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
            <Route path="/dashboard/*" element={<Dashboard />} />
          </Routes>
        </Router>
      </Provider>
    </>
  )
}

export default App
