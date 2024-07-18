import BannerReq from "../../Recruiter/Home/Banner/BannerReq";
import FeaturedJobs from "../../User/FeaturedJobs/FeaturedJobs";
import BannerUser from "../../User/Home/BannerUser";


const Home = () => {
    const userRole = "user"
    return (
        <div className="pt-10">
            {
                userRole === "recruiter" ? <BannerReq></BannerReq> : <BannerUser></BannerUser>
            }
            <FeaturedJobs></FeaturedJobs>
        </div>
    );
};

export default Home;