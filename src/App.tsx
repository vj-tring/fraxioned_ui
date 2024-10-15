import React, { useEffect } from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
  useLocation,
} from "react-router-dom";
import { useSelector } from "react-redux";
import { useDispatch } from "./store";
import Login from "./pages/login/index";
import ForgetPassword from "./pages/forgot-password";
import Change from "./pages/recover-password";
import Dashboard from "./pages/dashboard";
import AdminDashboard from "./pages-admin/admin-dashboard";
import ScrollToTop from "./components/ScrollToTop";
import AxiosInterceptor from "./api/axiosSetup";
import { fetchAuthState } from "./store/slice/authentication/actions";
import { RootState } from "./store/reducers";
import PrivateRoute from "./private-route";
import {publicRoutes} from './constants'
function AppRoutes() {
  const dispatch = useDispatch();
  const location = useLocation();
  const user = useSelector((state: RootState) => state.auth.user);
  const isPublicRoute = publicRoutes.includes(location.pathname)
  useEffect(() => {
    if (user == null && !isPublicRoute){
      dispatch(fetchAuthState());
    }
  }, [dispatch]);
  return (
    <>
      <Routes>
        {/* <Route path="/" element={<Navigate to="/login" />} /> */}
        <Route path="/login" element={<Login />} />
        <Route path="/forgotPassword" element={<ForgetPassword />} />
        <Route path="/recover" element={<Change />} />
        <Route
          path="/*"
          element={<PrivateRoute element={Dashboard} allowedRoles={[2, 3]} />}
        />
        <Route
          path="/admin/*"
          element={<PrivateRoute element={AdminDashboard} allowedRoles={[1]} />}
        />
      </Routes>
    </>
  );
}
function App() {
  return (
    <Router>
      <ScrollToTop>
        <AxiosInterceptor>
          <AppRoutes />
        </AxiosInterceptor>
      </ScrollToTop>
    </Router>
  );
}

export default App;
