import PropTypes from "prop-types";
import { useLocation, Navigate } from "react-router-dom";
import { useContext } from "react";
import useUserRole from "../CustomHooks/useUserRole";
import { AuthContext } from "../Providers/AuthProvider";
import FullScreenLoader from "../Pages/Shared/Loaders/FullScreenLoader";

const UserPrivateRoute = ({ children }) => {
  const { userRole, loading: roleLoading } = useUserRole();
  const { user, loading: userLoading } = useContext(AuthContext);
  const location = useLocation();

  const isLoading = roleLoading || userLoading;

  if (isLoading) {
    return <FullScreenLoader />
  }

  if (!user || userRole !== "user") {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
};

UserPrivateRoute.propTypes = {
  children: PropTypes.node.isRequired,
};

export default UserPrivateRoute;
