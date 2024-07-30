import BannerReq from "../../Recruiter/Home/Banner/BannerReq";
import AboutUs from "../../User/Home/AboutUs/AboutUs";
import BannerUser from "../../User/Home/BannerUser";
import Categories from "../../User/Home/Categories/Categoris";
import FeaturedJobs from "../../User/Home/FeaturedJobs/FeaturedJobs";


const Home = () => {
    const userRole = "user"
    return (
        <div className="pt-10">
            {
                userRole === "recruiter" ? <BannerReq></BannerReq> : <BannerUser></BannerUser>
            }
            <FeaturedJobs></FeaturedJobs>
            <Categories></Categories>
            <AboutUs></AboutUs>
        </div>
    );
};

export default Home;