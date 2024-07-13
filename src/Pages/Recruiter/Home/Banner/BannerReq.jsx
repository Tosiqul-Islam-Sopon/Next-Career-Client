
import banner from "../../../../assets/Images/bannerRecruiter.jpg"

const BannerReq = () => {
    return (
        <div className="relative h-screen">
            <div className="relative h-full flex items-center justify-center text-white">
                <div
                    className="absolute inset-0 bg-cover bg-center"
                    style={{ backgroundImage: `url(${banner})` }}
                ></div>
                <div className="absolute inset-0 bg-gradient-to-r from-black/50 to-black/50"></div>
                <div className="relative text-center w-3/5">
                    <h1 className="text-5xl font-bold text-white mb-5">Job Recruitment Solution</h1>
                    <p>Discover top talents for your job openings with <span className="text-green-500 text-xl font-bold">Next Career</span> now!</p>

                    <button className="px-6 mt-6 py-2 border-2 border-white rounded-lg hover:bg-white hover:text-black hover:border-none ">
                        Find Talents
                    </button>

                </div>
            </div>
        </div>
    );
};

export default BannerReq;