import PropTypes from "prop-types";
import { Navigate } from "react-router-dom";
import useUserRole from "../CustomHooks/useUserRole";

const AdminPrivateRoute = ({ children }) => {
  const { userRole, loading } = useUserRole();

  if (loading) {
    return (
      <div className="flex justify-center items-center mt-28">
        <div>
          <span className="loading loading-ring loading-xs"></span>
          <span className="loading loading-ring loading-sm"></span>
          <span className="loading loading-ring loading-md"></span>
          <span className="loading loading-ring loading-lg"></span>
        </div>
      </div>
    );
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
