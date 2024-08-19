// App.tsx
import React from 'react';
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from 'react-router-dom';
import { Provider } from 'react-redux';
import store from './store/index';
import Login from './pages/login/index';
import ForgetPassword from './pages/forgot-password';
import Change from './pages/recover-password';
import ResetPassword from './pages/reset-password';
import Dashboard from './pages/dashboard';
import AdminDashboard from './pages/admin-dashboard';

interface PrivateRouteProps {
  element: React.ComponentType;
  allowedRoles: number[];
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({ element: Element, allowedRoles }) => {
  const token = localStorage.getItem('session');
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
    <Provider store={store}>
      <Router>
        <Routes>
          <Route path="/" element={<Navigate to="/login" />} />
          <Route path="/login" element={<Login />} />
          <Route path="/forgotPassword" element={<ForgetPassword />} />
          <Route path="/recoverPassword" element={<Change />} />
          <Route path="/resetPassword" element={<ResetPassword onClose={() => { }} />} />
          <Route path="/dashboard/*" element={<PrivateRoute element={Dashboard} allowedRoles={[2, 3]} />} />
          <Route path="/admin/*" element={<PrivateRoute element={AdminDashboard} allowedRoles={[1]} />} />
        </Routes>
      </Router>
    </Provider>
  );
}

export default App;
