import useUserRole from "../../../CustomHooks/useUserRole";
import AdminHome from "../../Admin/Home";
import BannerReq from "../../Recruiter/Home/Banner/BannerReq";
import AboutUs from "../../User/Home/AboutUs/AboutUs";
import BannerUser from "../../User/Home/BannerUser";
import Categories from "../../User/Home/Categories/Categoris";
import FeaturedJobs from "../../User/Home/FeaturedJobs/FeaturedJobs";
import NewestJobs from "../../User/Home/Newest Jobs/NewestJobs";

const Home = () => {
  const { userRole, loading } = useUserRole();

  if (loading){
    return <div>Loading...........</div>
  }

  return (
    <>
      {userRole === "admin" ? (
        <AdminHome></AdminHome>
      ) : (
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
      )}
    </>
  );
};

export default Home;
