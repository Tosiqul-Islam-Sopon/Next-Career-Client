import BannerReq from "../../Recruiter/Home/Banner/BannerReq";
import BannerUser from "../../User/Home/BannerUser";


const Home = () => {
    const userRole = "recruiter"
    return (
        <div className="pt-10">
            {
                userRole === "recruiter" ? <BannerReq></BannerReq> : <BannerUser></BannerUser>
            }
            
        </div>
    );
};

export default Home;