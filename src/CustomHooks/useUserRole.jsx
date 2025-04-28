import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../Providers/AuthProvider";
import useAxiosBase from "./useAxiosBase";

const useUserRole = () => {
  const { user } = useContext(AuthContext);
  const [userRole, setUserRole] = useState(null); 
  const [loading, setLoading] = useState(true); 
  const axiosBase = useAxiosBase();

  useEffect(() => {
    const getUserRole = async () => {
      if (user?.email) {
        try {
          setLoading(true); 
          const response = await axiosBase.get(`/user/userRole/${user.email}`);
          setUserRole(response.data);
        } catch (error) {
          console.error("Error fetching user role:", error);
          setUserRole("user"); 
        } finally {
          setLoading(false);
        }
      } else {
        setLoading(false);
      }
    };
    getUserRole();
  }, [user?.email, axiosBase]); 

  return { userRole, loading };
};

export default useUserRole;
