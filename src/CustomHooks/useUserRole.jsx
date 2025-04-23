import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../Providers/AuthProvider";
import useAxiosBase from "./useAxiosBase";

const useUserRole = () => {
  const { user } = useContext(AuthContext);
  const [userRole, setUserRole] = useState(null); // Initialize as null or other appropriate value
  const [loading, setLoading] = useState(true); // Add loading state
  const axiosBase = useAxiosBase();

  useEffect(() => {
    const getUserRole = async () => {
      if (user?.email) {
        try {
          setLoading(true); // Start loading
          const response = await axiosBase.get(`/user/userRole/${user.email}`);
          setUserRole(response.data);
        } catch (error) {
          console.error("Error fetching user role:", error);
          setUserRole("user"); // Optionally, set a default role on error
        } finally {
          setLoading(false); // End loading
        }
      } else {
        setLoading(false); // End loading if no user
      }
    };
    getUserRole();
  }, [user?.email, axiosBase]); // Use user.email for dependency

  return { userRole, loading }; // Return both userRole and loading state
};

export default useUserRole;
