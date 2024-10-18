import { Navigate, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import { RootState } from "./store/reducers";
import Loader from "./components/loader";

interface PrivateRouteProps {
  element: React.ComponentType;
  allowedRoles: number[];
}
const PrivateRoute: React.FC<PrivateRouteProps> = ({
  element: Element,
  allowedRoles,
}) => {
  const user = useSelector((state: RootState) => state.auth.user);
  const loading = useSelector((state: RootState) => state.auth.loading);
  const session = localStorage.getItem("session");
  const parsedSession = session !== null ? JSON.parse(session) : null;
  if(parsedSession == null){
    return <Navigate to="/login" />
  }
  if (loading) {
    return <Loader />; // Or return null or a spinner
  }
  if (!user || !session) {
    return <Navigate to="/login" />;
  }

  if (user.role && allowedRoles.includes(user.role.id)) {
    return <Element />;
  }

  return <Navigate to="/login" />;
};
export default PrivateRoute;
