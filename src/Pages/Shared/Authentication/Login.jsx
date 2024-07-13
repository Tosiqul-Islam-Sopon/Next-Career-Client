import { useContext, useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { Link, useLocation, useNavigate } from "react-router-dom";
import img from "../../../assets/Images/login.jpg"
import { FcGoogle } from "react-icons/fc";
import { AuthContext } from "../../../Providers/AuthProvider";
import Swal from "sweetalert2";
import useAxiosBase from "../../../CustomHooks/useAxiosBase";

const Login = () => {
    const [showPassword, setShowPassword] = useState(false);
    const { logIn, googleSignIn } = useContext(AuthContext);
    const location = useLocation();
    const navigate = useNavigate();
    const axiosBase = useAxiosBase();

    const handleLogin = e => {
        e.preventDefault();
        const email = e.target.email.value;
        const password = e.target.password.value;

        logIn(email, password)
            .then(() => {
                Swal.fire({
                    position: "center",
                    icon: "success",
                    title: "Welcome to InnovateX",
                    text: "Login Successfully",
                    showConfirmButton: false,
                    timer: 1500
                });
                navigate(location?.state ? location.state : "/");
            })
            .catch(error => {
                Swal.fire({
                    title: "OPPS!!!",
                    text: `${error.message}`,
                    icon: "error"
                });
            })
    }

    const handleGoogleLogin = () => {
        googleSignIn()
            .then((res) => {
                const userInfo = {
                    name: res.user?.displayName,
                    email: res.user?.email,
                    role: "user"
                }
                axiosBase.post("/users", userInfo)

                navigate(location?.state ? location.state : "/");
            })
            .catch(error => {

                Swal.fire({
                    title: "OPPS!!!",
                    text: `${error.message}`,
                    icon: "error"
                });
            })
    }
    return (
        <div className="w-fit  mx-auto pt-20 ">
            <div className="mx-auto lg:text-left mb-5 text-center">
                <h1 className="text-3xl lg:text-5xl text-center font-bold">Login</h1>
            </div>
            <div className="flex flex-col lg:flex-row">
                <div className="flex-1">
                    <img src={img} alt="" />
                </div>
                <div className="flex-1 card shrink-0 rounded-2xl bg-base-100">

                    <form className="p-5" onSubmit={handleLogin}>
                        <div className="form-control">
                            <label className="label">
                                <span className="label-text">Email*</span>
                            </label>
                            <input type="email" placeholder="Email" name="email" className="input input-bordered" required />
                        </div>
                        <div className="form-control relative">
                            <label className="label">
                                <span className="label-text">Password*</span>
                                <span className="absolute bottom-4 right-3"
                                    onClick={() => setShowPassword(!showPassword)}>
                                    {
                                        showPassword ?
                                            <FaEye></FaEye>
                                            :
                                            <FaEyeSlash></FaEyeSlash>
                                    }
                                </span>
                            </label>
                            <input type={showPassword ? "text" : "password"} placeholder="Password" name="password" className="input input-bordered" required />
                        </div>

                        <div className="form-control mt-6">
                            <button className="bg-[#00DFBF] p-3 btn text-white font-bold">Login</button>
                        </div>
                    </form>
                    <div className="flex m-0 flex-col space-y-3 w-full justify-center items-center">
                        <p className="m-0">Or</p>
                        <div className="space-x-6">
                            <button onClick={handleGoogleLogin} className="text-xl flex items-center p-2 bg-[#009C86] rounded btn"><FcGoogle /> <span className="text-white">Continue with Google</span></button>
                        </div>
                    </div>
                    <div className="flex m-0 flex-col my-5 w-full justify-center items-center">
                        <p>New in Next Career?</p>
                        <div className="mt-3 space-y-3">
                            <p>Find Job in Next Career?<Link state={location?.state} to="/register"> <span className="underline text-green-400">Sign Up as User</span></Link></p>
                            <p>Find Talent in Next Career?<Link state={location?.state} to="/recruiterRegistration"> <span className="underline text-green-400">Sign Up as Recruiter</span></Link></p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;