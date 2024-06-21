import React, { FC } from 'react';
import { Navigate } from 'react-router-dom';

interface PrivateRouteProps {
  element: React.ComponentType;
}

const PrivateRoute: FC<PrivateRouteProps> = ({ element: Element }) => {
  const token = localStorage.getItem('token');
  return token ? <Element /> : <Navigate to="/login" />;
};

export default PrivateRoute;
