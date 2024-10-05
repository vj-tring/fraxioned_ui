import React from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import { Provider } from "react-redux";
import store from "./store/index";
import Login from "./pages/login/index";
import ForgetPassword from "./pages/forgot-password";
import Change from "./pages/recover-password";
import ResetPassword from "./pages/reset-password";
import Dashboard from "./pages/dashboard";
import BookingSummary from "./pages/booking-summary/pages";
import AdminDashboard from "./pages-admin/admin-dashboard";
import ScrollToTop from "./components/ScrollToTop";
import AxiosInterceptor from "./api/axiosSetup";

interface PrivateRouteProps {
  element: React.ComponentType;
  allowedRoles: number[];
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({
  element: Element,
  allowedRoles,
}) => {
  const token = localStorage.getItem("session");
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  console.log(token)
  if (!token) {
    return <Navigate to="/login" />;
  }

  if (user?.roleId && allowedRoles.includes(user.roleId)) {
    return <Element />;
  }
  return <Navigate to="/" />;
};

function App() {
  return (
    <Provider store={store}>
      <Router>
        <ScrollToTop>
          <AxiosInterceptor>
            <Routes>
              {/* <Route path="/" element={<Navigate to="/login" />} /> */}
              <Route path="/login" element={<Login />} />
              <Route path="/forgotPassword" element={<ForgetPassword />} />
              <Route path="/recover" element={<Change />} />
              <Route path="/bookingSummary" element={<BookingSummary />} />
              <Route
                path="/resetPassword"
                element={<ResetPassword onClose={() => {}} />}
              />
              <Route
                path="/*"
                element={
                  <PrivateRoute element={Dashboard} allowedRoles={[2, 3]} />
                }
              />
              <Route
                path="/admin/*"
                element={
                  <PrivateRoute element={AdminDashboard} allowedRoles={[1]} />
                }
              />
            </Routes>
          </AxiosInterceptor>
        </ScrollToTop>
      </Router>
    </Provider>
  );
}

export default App;
