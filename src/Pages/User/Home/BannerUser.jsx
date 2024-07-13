
import banner1 from "../../../assets/Images/bannerUser.jpg";

const BannerUser = () => {
    return (
        <div className="relative h-screen">
            <div className="relative h-full flex items-center justify-center text-white">
                <div
                    className="absolute inset-0 bg-cover bg-center"
                    style={{ backgroundImage: `url(${banner1})` }}
                ></div>
                <div className="absolute inset-0 bg-gradient-to-r from-black/50 to-black/50"></div>
                <div className="relative text-center w-3/5">
                    <h1 className="text-5xl font-bold text-white mb-5">Your Next Career Move Starts <br /> Here</h1>
                    <p>Explore top job opportunities and connect with leading employers. Start your career journey with <span className="text-green-500 text-xl font-bold">Next Career</span> today!</p>
                    <button className="px-6 mt-6 py-2 border-2 border-white rounded-lg hover:bg-white hover:text-black hover:border-none ">
                        Jobs
                    </button>

                </div>
            </div>
        </div>
    );
};

export default BannerUser;