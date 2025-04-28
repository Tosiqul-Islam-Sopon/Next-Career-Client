"use client";

import { useContext, useState } from "react";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
// Import your image properly
import loginImage from "../../../assets/Images/login.png"; // Adjust path as needed
import Swal from "sweetalert2";
import useAxiosBase, { baseUrl } from "../../../CustomHooks/useAxiosBase";
import { AuthContext } from "../../../Providers/AuthProvider";
import { io } from "socket.io-client";
import auth from "../../../Firebase/firebase.config";
const socket = io(baseUrl);

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const axiosBase = useAxiosBase();
  const navigate = useNavigate();
  const { logIn, googleSignIn, logOut } = useContext(AuthContext);

  const handleLogin = (e) => {
    e.preventDefault();
    setIsLoading(true);
    const email = e.target.email.value;
    const password = e.target.password.value;

    logIn(email, password)
      .then(async () => {
        if (!auth.currentUser.emailVerified) {
          Swal.fire({
            title: "Please Verify Email",
            text: "You must verify your email before accessing the app.",
            icon: "warning",
            showConfirmButton: true,
            timer: 10000,
          });
          await logOut();
          return;
        }
        socket.connect();
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
        socket.connect();
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
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4 pb-12 pt-28">
      <div className="max-w-6xl w-full mx-auto grid md:grid-cols-2 gap-8 items-center">
        {/* Left side - Image */}
        <div className="hidden md:block relative h-[600px] rounded-xl overflow-hidden">
          {/* Correct HTML tag is img, not image */}
          <img
            src={loginImage || "/placeholder.svg"} // Use the imported image
            alt="Job seekers and recruiters connecting"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex flex-col justify-end p-8">
            <h2 className="text-white text-3xl font-bold mb-2">
              Find Your Dream Career
            </h2>
            <p className="text-white/90 text-lg">
              Connect with top employers and opportunities
            </p>
          </div>
        </div>

        {/* Right side - Login form */}
        <div>
          <div className="bg-white rounded-xl shadow-lg p-8">
            <div className="mb-6 text-center">
              <h1 className="text-3xl font-bold">Welcome Back</h1>
              <p className="text-gray-500 mt-2">
                Sign in to your account to continue
              </p>
            </div>

            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700"
                >
                  Email
                </label>
                <input
                  id="email"
                  name="email" // Added name attribute for form handling
                  type="email"
                  placeholder="name@example.com"
                  required
                  disabled={isLoading}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                />
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label
                    htmlFor="password"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Password
                  </label>
                  {/* Use to instead of href for react-router-dom */}
                  <Link
                    to="/forgot-password"
                    className="text-sm text-teal-600 hover:text-teal-700"
                  >
                    Forgot password?
                  </Link>
                </div>
                <div className="relative">
                  <input
                    id="password"
                    name="password" // Added name attribute for form handling
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    required
                    disabled={isLoading}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                    tabIndex={-1}
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                className="w-full bg-teal-600 hover:bg-teal-700 text-white py-2 px-4 rounded-md font-medium flex items-center justify-center disabled:opacity-70 disabled:cursor-not-allowed"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Signing in...
                  </>
                ) : (
                  "Sign In"
                )}
              </button>

              <div className="relative my-4">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t border-gray-300" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-white px-2 text-gray-500">
                    Or continue with
                  </span>
                </div>
              </div>

              <button
                type="button"
                className="w-full border border-gray-300 bg-white text-gray-700 py-2 px-4 rounded-md font-medium flex items-center justify-center hover:bg-gray-50 disabled:opacity-70 disabled:cursor-not-allowed"
                onClick={handleGoogleLogin}
                disabled={isGoogleLoading || isLoading}
              >
                {isGoogleLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Connecting...
                  </>
                ) : (
                  <>
                    <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24">
                      <path
                        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                        fill="#4285F4"
                      />
                      <path
                        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                        fill="#34A853"
                      />
                      <path
                        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                        fill="#FBBC05"
                      />
                      <path
                        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                        fill="#EA4335"
                      />
                    </svg>
                    Google
                  </>
                )}
              </button>

              <div className="mt-6 text-center text-sm">
                <p className="text-gray-600 mb-2">New to Next Career?</p>
                <div className="space-y-2">
                  {/* Use to instead of href for react-router-dom */}
                  <Link
                    to="/register"
                    state={location?.state}
                    className="text-teal-600 hover:text-teal-700 font-medium block"
                  >
                    Sign up
                  </Link>
                  {/* <Link
                    to="/recruiterRegistration"
                    state={location?.state}
                    className="text-teal-600 hover:text-teal-700 font-medium block"
                  >
                    Sign up as Recruiter
                  </Link> */}
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
