import { useContext, useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { Link, useLocation, useNavigate } from "react-router-dom";
import img from "../../../assets/Images/login.jpg";
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
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);

  // const isValidAdmin = (email, password) =>
  //   adminCredentials.some(
  //     (admin) => admin.email === email && admin.password === password
  //   );

  const handleLogin = (e) => {
    e.preventDefault();
    setIsLoading(true);
    const email = e.target.email.value;
    const password = e.target.password.value;
    // const isAdmin = isValidAdmin(email, password);
    // if (isAdmin) {
    //   setCustomUser({
    //     email,
    //     displayName: "Admin",
    //   });
    //   navigate("/adminHome");
    //   return;
    // }

    logIn(email, password)
      .then(() => {
        Swal.fire({
          position: "center",
          icon: "success",
          title: "Welcome to Next Career",
          text: "Login Successfully",
          showConfirmButton: false,
          timer: 1500,
        });
        navigate(location?.state?.from?.pathname || "/");
      })
      .catch((error) => {
        Swal.fire({
          title: "OPPS!!!",
          text: `${error.message}`,
          icon: "error",
        });
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  const handleGoogleLogin = () => {
    setIsGoogleLoading(true);
    googleSignIn()
      .then((res) => {
        const userInfo = {
          name: res.user?.displayName,
          email: res.user?.email,
          role: "user",
        };
        axiosBase.post("/users", userInfo);
        Swal.fire({
          position: "center",
          icon: "success",
          title: "Welcome to Next Career",
          text: "Login Successfully",
          showConfirmButton: false,
          timer: 1500,
        });
        navigate(location?.state?.from?.pathname || "/");
      })
      .catch((error) => {
        Swal.fire({
          title: "OPPS!!!",
          text: `${error.message}`,
          icon: "error",
        });
      })
      .finally(() => {
        setIsGoogleLoading(false);
      });
  };
  return (
    <div className="w-fit  mx-auto pt-20 ">
      <div className="mx-auto lg:text-left mb-5 text-center">
        <h1 className="text-3xl lg:text-5xl text-center font-bold">Login</h1>
      </div>
      <div className="flex flex-col lg:flex-row">
        <div className="flex-1">
          <img src={img} alt="" />
        </div>
        <div className="flex-1 card shrink-0 rounded-2xl bg-base-100 justify-center">
          <form className="p-5" onSubmit={handleLogin}>
            <div className="form-control">
              <label className="label">
                <span className="label-text">Email*</span>
              </label>
              <input
                type="email"
                placeholder="Email"
                name="email"
                className="input input-bordered"
                required
                disabled={isLoading}
              />
            </div>
            <div className="form-control relative">
              <label className="label">
                <span className="label-text">Password*</span>
                <span
                  className="absolute bottom-4 right-3"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <FaEye></FaEye> : <FaEyeSlash></FaEyeSlash>}
                </span>
              </label>
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                name="password"
                className="input input-bordered"
                required
                disabled={isLoading}
              />
            </div>

            <div className="form-control mt-6">
              <button
                type="submit"
                className="bg-[#00DFBF] p-3 btn text-white font-bold relative"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-solid border-current border-r-transparent mr-2"></span>
                    Logging in...
                  </>
                ) : (
                  "Login"
                )}
              </button>
            </div>
          </form>
          <div className="flex m-0 flex-col space-y-3 w-full justify-center items-center">
            <p className="m-0">Or</p>
            <div className="space-x-6">
              <button
                onClick={handleGoogleLogin}
                className="text-xl flex items-center justify-center p-2 bg-[#009C86] rounded btn"
                disabled={isGoogleLoading || isLoading}
              >
                {isGoogleLoading ? (
                  <>
                    <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-solid border-current border-r-transparent mr-2"></span>
                    <span className="text-white">Connecting...</span>
                  </>
                ) : (
                  <>
                    <FcGoogle />{" "}
                    <span className="text-white">Continue with Google</span>
                  </>
                )}
              </button>
            </div>
          </div>
          <div className="flex m-0 flex-col my-5 w-full justify-center items-center">
            <p>New in Next Career?</p>
            <div className="mt-3 space-y-3">
              <p>
                Find Job in Next Career?
                <Link state={location?.state} to="/register">
                  <span
                    className={`underline text-green-400 ${isLoading || isGoogleLoading ? "cursor-wait" : ""}`}
                  >
                    {isLoading || isGoogleLoading ? (
                      <span className="animate-pulse">Loading...</span>
                    ) : (
                      "Sign Up as Job Seeker"
                    )}
                  </span>
                </Link>
              </p>
              <p>
                Find Talent in Next Career?
                <Link state={location?.state} to="/recruiterRegistration">
                  <span
                    className={`underline text-green-400 ${isLoading || isGoogleLoading ? "cursor-wait" : ""}`}
                  >
                    {isLoading || isGoogleLoading ? (
                      <span className="animate-pulse">Loading...</span>
                    ) : (
                      "Sign Up as Recruiter"
                    )}
                  </span>
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
