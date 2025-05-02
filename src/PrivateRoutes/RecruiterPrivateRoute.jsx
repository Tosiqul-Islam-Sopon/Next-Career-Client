import { Navigate } from "react-router-dom";
import useUserRole from "../CustomHooks/useUserRole";
import PropTypes from "prop-types";
import FullScreenLoader from "../Pages/Shared/Loaders/FullScreenLoader";

const RecruiterPrivateRoute = ({ children }) => {
  const { userRole, loading } = useUserRole();

  if (loading) {
    return <FullScreenLoader />
  }

  if (userRole === "recruiter") {
    return children;
  }

  return <Navigate to="/login" state={{ from: location }} replace />;
};

RecruiterPrivateRoute.propTypes = {
  children: PropTypes.node.isRequired,
};

export default RecruiterPrivateRoute;
