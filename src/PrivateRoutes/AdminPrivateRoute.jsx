import PropTypes from "prop-types";
import { Navigate } from "react-router-dom";
import useUserRole from "../CustomHooks/useUserRole";
import FullScreenLoader from "../Pages/Shared/Loaders/FullScreenLoader";

const AdminPrivateRoute = ({ children }) => {
  const { userRole, loading } = useUserRole();

  if (loading) {
    return <FullScreenLoader />
  }

  if (userRole === "admin") {
    return children;
  }

  return <Navigate to="/login" state={{ from: location }} replace />;
};

AdminPrivateRoute.propTypes = {
  children: PropTypes.node.isRequired,
};

export default AdminPrivateRoute;
