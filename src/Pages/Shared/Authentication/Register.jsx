import { useContext, useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";
import img from "../../../assets/Images/register.jpg";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { AuthContext } from "../../../Providers/AuthProvider";
import Swal from "sweetalert2";
import useAxiosBase from "../../../CustomHooks/useAxiosBase";

const image_hosting_key = import.meta.env.VITE_IMAGE_UPLOAD_KEY_IMAGEBB;
const image_hosting_api = `https://api.imgbb.com/1/upload?key=${image_hosting_key}`;

const Registration = () => {
    const [showPassword, setShowPassword] = useState(false);
    const [photoFile, setPhotoFile] = useState(null); // State to hold the file
    const { createUser, setNameAndPhoto, googleSignIn } = useContext(AuthContext);
    const location = useLocation();
    const navigate = useNavigate();
    const axiosBase = useAxiosBase();
    const goTo = location?.state?.from || "/";

    const validatePassword = (password) => {
        if (password.length < 6) {
            return "Password must be at least 6 characters long.";
        }
        if (!/[A-Z]/.test(password)) {
            return "Password must contain at least one capital letter.";
        }
        if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
            return "Password must contain at least one special character.";
        }
        if (!/\d/.test(password)) {
            return "Password must contain at least one numeric character.";
        }
        return true;
    };

    const handleRegister = async (e) => {
        e.preventDefault();
        const name = e.target.name.value;
        const email = e.target.email.value;
        const password = e.target.password.value;

        if (validatePassword(password) !== true) {
            Swal.fire({
                title: "Sorry!",
                text: validatePassword(password),
                icon: "error"
            });
            return;
        }

        if (photoFile) {
            const formData = new FormData();
            formData.append("image", photoFile);
            try {
                const response = await fetch(image_hosting_api, {
                    method: "POST",
                    body: formData
                });
                const data = await response.json();
                console.log(data);
                if (data.success) {
                    const url = data.data.url;
                    createUser(email, password)
                        .then(() => {
                            setNameAndPhoto(name, url)
                                .then(() => {
                                    const userInfo = {
                                        name,
                                        email,
                                        role: "user",
                                    };
                                    axiosBase.post("/users", userInfo)
                                        .then(res => {
                                            if (res.data.insertedId) {
                                                Swal.fire({
                                                    position: "center",
                                                    icon: "success",
                                                    title: "Registration Successful",
                                                    showConfirmButton: false,
                                                    timer: 1500
                                                });
                                                navigate(goTo);
                                            }
                                        })
                                        .catch(() => {
                                            Swal.fire({
                                                position: "center",
                                                icon: "error",
                                                title: "Sorry!!! Something went wrong",
                                                showConfirmButton: false,
                                                timer: 1500
                                            });
                                        });
                                })
                                .catch(() => {
                                    Swal.fire({
                                        position: "center",
                                        icon: "error",
                                        title: "Sorry!!! Something went wrong",
                                        showConfirmButton: false,
                                        timer: 1500
                                    });
                                });
                        })
                        .catch(error => {
                            Swal.fire({
                                title: "Sorry!",
                                text: `${error.message}`,
                                icon: "error"
                            });
                        });
                } else {
                    Swal.fire({
                        title: "Sorry!",
                        text: "Image upload failed. Please try again.",
                        icon: "error"
                    });
                }
            } catch (error) {
                Swal.fire({
                    title: "Sorry!",
                    text: "Image upload failed. Please try again.",
                    icon: "error"
                });
            }
        } else {
            Swal.fire({
                title: "Sorry!",
                text: "Please upload a photo.",
                icon: "error"
            });
        }
    };

    const handleGoogleLogin = () => {
        googleSignIn()
            .then((res) => {
                const userInfo = {
                    name: res.user?.displayName,
                    email: res.user?.email,
                    role: "user"
                }
                axiosBase.post("/users", userInfo)
                    .then(res => {
                        if (res.data.insertedId) {
                            Swal.fire({
                                position: "center",
                                icon: "success",
                                title: "Registration Successful",
                                showConfirmButton: false,
                                timer: 1500
                            });
                            navigate(goTo);
                        }
                    })
                    .catch(() => {
                        Swal.fire({
                            position: "center",
                            icon: "error",
                            title: "Sorry!!! Something went wrong",
                            showConfirmButton: false,
                            timer: 1500
                        });
                    });
            })
            .catch(error => {
                Swal.fire({
                    title: "OPPS!!!",
                    text: `${error.message}`,
                    icon: "error"
                });
            });
    };

    return (
        <div className="w-fit mx-auto py-20">
            <div className="mx-auto lg:text-left text-center mb-5">
                <h1 className="text-3xl lg:text-5xl text-center font-bold">Sign Up</h1>
            </div>
            <div className="flex flex-col lg:flex-row">
                <div className="flex-1">
                    <img src={img} alt="" />
                </div>
                <div className="flex-1 card shrink-0 rounded-2xl bg-[#AACBFF] ">
                    <form className="card-body" onSubmit={handleRegister}>
                        <div className="form-control">
                            <label className="label">
                                <span className="label-text">Name*</span>
                            </label>
                            <input type="text" placeholder="Name" name="name" className="input input-bordered" required />
                        </div>
                        <div className="form-control">
                            <label className="label">
                                <span className="label-text">Email*</span>
                            </label>
                            <input type="email" placeholder="Email" name="email" className="input input-bordered" required />
                        </div>
                        <div className="form-control">
                            <label className="label">
                                <span className="label-text">Your Photo*</span>
                            </label>
                            <input
                                type="file"
                                className="file-input w-full"
                                onChange={(e) => setPhotoFile(e.target.files[0])} // Update state with the selected file
                            />
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
                            <button className="btn bg-[#007CFF] text-white text-xl font-medium border-none hover:bg-gray-600">Sign Up</button>
                        </div>
                    </form>
                    <div className="flex flex-col space-y-3 w-full justify-center items-center">
                        <p>Or</p>
                        <div className="space-x-6">
                            <button onClick={handleGoogleLogin} className="text-xl flex items-center p-2 bg-[#009C86] rounded btn text-white"><FcGoogle /> Continue with Google</button>
                        </div>
                    </div>
                    <div className="flex m-0 flex-col my-5 w-full justify-center items-center">
                        <p>Or</p>
                        <p>Already have an Account? <Link state={location?.state} to="/login"><span className="underline text-green-500 text-xl">Login?</span></Link></p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Registration;
