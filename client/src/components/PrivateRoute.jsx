import { useSelector } from "react-redux";
import { Outlet, Navigate } from "react-router-dom";
const PrivateRoute = () => {
  const user = useSelector((state) => state.user);
  if (user.currentUser) {
    return <Outlet />;
  } else {
    return <Navigate to="/sign-in" />;
  }
};

export default PrivateRoute;
