import PropTypes from "prop-types";
import { useLocation, Navigate } from "react-router-dom";
import { useContext } from "react";
import useUserRole from "../CustomHooks/useUserRole";
import { AuthContext } from "../Providers/AuthProvider";

const UserPrivateRoute = ({ children }) => {
  const { userRole, loading: roleLoading } = useUserRole();
  const { user, loading: userLoading } = useContext(AuthContext);
  const location = useLocation();

  const isLoading = roleLoading || userLoading;

  if (isLoading) {
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

  if (!user || userRole !== "user") {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
};

UserPrivateRoute.propTypes = {
  children: PropTypes.node.isRequired,
};

export default UserPrivateRoute;
