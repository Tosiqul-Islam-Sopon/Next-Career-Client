import { io } from "socket.io-client";
import useAxiosBase, { baseUrl } from "../../../CustomHooks/useAxiosBase";
import useUserRole from "../../../CustomHooks/useUserRole";
import BannerReq from "../../Recruiter/Home/Banner/BannerReq";
import AboutUs from "../../User/Home/AboutUs/AboutUs";
import BannerUser from "../../User/Home/BannerUser";
import Categories from "../../User/Home/Categories/Categoris";
import FeaturedJobs from "../../User/Home/FeaturedJobs/FeaturedJobs";
import NewestJobs from "../../User/Home/Newest Jobs/NewestJobs";
import { useContext, useEffect } from "react";
import { AuthContext } from "../../../Providers/AuthProvider";
import { useQuery } from "@tanstack/react-query";

const socket = io(baseUrl);

const Home = () => {
  const { userRole } = useUserRole();
  const { user } = useContext(AuthContext);
  const axiosBase = useAxiosBase();

  const { data: userInfo = null } = useQuery({
    queryKey: ["user", user?.email],
    queryFn: async () => {
      const response = await axiosBase.get(`/user-by-email/${user?.email}`);
      return response.data;
    },
  });

  useEffect(() => {
    // Register recruiter with their user ID
    socket.emit("register", userInfo?._id);
  
    // Listen for job application notifications
    socket.on("jobApplication", (data) => {
      alert(data.message);
      console.log("Job application notification:", data);
    });
  
    return () => {
      socket.off("jobApplication");
    };
  }, []);  

  return (
    <div className="pt-10">
      {userRole === "recruiter" ? (
        <BannerReq></BannerReq>
      ) : (
        <BannerUser></BannerUser>
      )}
      <FeaturedJobs></FeaturedJobs>
      <NewestJobs></NewestJobs>
      <Categories></Categories>
      <AboutUs></AboutUs>
    </div>
  );
};

export default Home;
