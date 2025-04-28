"use client"

import { useContext, useState } from "react"
import { Eye, EyeOff } from "lucide-react"
import { Link, useLocation, useNavigate } from "react-router-dom"
import { AuthContext } from "../../../Providers/AuthProvider"
import Swal from "sweetalert2"
import useAxiosBase from "../../../CustomHooks/useAxiosBase"
import registerImg from "../../../assets/Images/register.jpg"
import interviewImg from "../../../assets/Images/interview.jpg"
import recruiteImg from "../../../assets/Images/recruite.jpg"

const image_hosting_key = import.meta.env.VITE_IMAGE_UPLOAD_KEY_IMAGEBB
const image_hosting_api = `https://api.imgbb.com/1/upload?key=${image_hosting_key}`

const Registration = () => {
  const [activeTab, setActiveTab] = useState("jobseeker")
  const [showPassword, setShowPassword] = useState(false)
  const [photoFile, setPhotoFile] = useState(null)
  const [logoFile, setLogoFile] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const [isGoogleLoading, setIsGoogleLoading] = useState(false)

  const { createUser, setNameAndPhoto, googleSignIn } = useContext(AuthContext)
  const location = useLocation()
  const navigate = useNavigate()
  const axiosBase = useAxiosBase()
  const goTo = location?.state?.from || "/"

  const validatePassword = (password) => {
    if (password.length < 6) {
      return "Password must be at least 6 characters long."
    }
    if (!/[A-Z]/.test(password)) {
      return "Password must contain at least one capital letter."
    }
    if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
      return "Password must contain at least one special character."
    }
    if (!/\d/.test(password)) {
      return "Password must contain at least one numeric character."
    }
    return true
  }

  const handleJobSeekerRegister = async (e) => {
    e.preventDefault()
    setIsLoading(true)
    const name = e.target.name.value
    const email = e.target.email.value
    const password = e.target.password.value

    if (validatePassword(password) !== true) {
      Swal.fire({
        title: "Sorry!",
        text: validatePassword(password),
        icon: "error",
      })
      setIsLoading(false)
      return
    }

    if (!photoFile) {
      Swal.fire({
        title: "Sorry!",
        text: "Please upload a photo.",
        icon: "error",
      })
      setIsLoading(false)
      return
    }

    try {
      const formData = new FormData()
      formData.append("image", photoFile)
      const response = await fetch(image_hosting_api, {
        method: "POST",
        body: formData,
      })
      const data = await response.json()

      if (data.success) {
        const url = data.data.url
        createUser(email, password)
          .then(() => {
            setNameAndPhoto(name, url)
              .then(() => {
                const userInfo = {
                  name,
                  email,
                  role: "user",
                }
                axiosBase
                  .post("/users", userInfo)
                  .then((res) => {
                    if (res.data.insertedId) {
                      Swal.fire({
                        position: "center",
                        icon: "success",
                        title: "Registration Successful",
                        showConfirmButton: false,
                        timer: 1500,
                      })
                      navigate(goTo)
                    }
                  })
                  .catch(() => {
                    Swal.fire({
                      position: "center",
                      icon: "error",
                      title: "Sorry!!! Something went wrong",
                      showConfirmButton: false,
                      timer: 1500,
                    })
                  })
                  .finally(() => {
                    setIsLoading(false)
                  })
              })
              .catch(() => {
                Swal.fire({
                  position: "center",
                  icon: "error",
                  title: "Sorry!!! Something went wrong",
                  showConfirmButton: false,
                  timer: 1500,
                })
                setIsLoading(false)
              })
          })
          .catch((error) => {
            Swal.fire({
              title: "Sorry!",
              text: `${error.message}`,
              icon: "error",
            })
            setIsLoading(false)
          })
      } else {
        Swal.fire({
          title: "Sorry!",
          text: "Image upload failed. Please try again.",
          icon: "error",
        })
        setIsLoading(false)
      }
    } catch (error) {
      Swal.fire({
        title: "Sorry!",
        text: "Image upload failed. Please try again.",
        icon: "error",
      })
      setIsLoading(false)
    }
  }

  const handleRecruiterRegister = async (e) => {
    e.preventDefault()
    setIsLoading(true)
    const name = e.target.name.value
    const email = e.target.email.value
    const password = e.target.password.value
    const companyName = e.target.companyName.value
    const position = e.target.position.value
    const website = e.target.website.value

    if (validatePassword(password) !== true) {
      Swal.fire({
        title: "Sorry!",
        text: validatePassword(password),
        icon: "error",
      })
      setIsLoading(false)
      return
    }

    if (!photoFile || !logoFile) {
      Swal.fire({
        title: "Sorry!",
        text: "Please upload both photo and company logo.",
        icon: "error",
      })
      setIsLoading(false)
      return
    }

    try {
      const photoFormData = new FormData()
      photoFormData.append("image", photoFile)
      const photoResponse = await fetch(image_hosting_api, {
        method: "POST",
        body: photoFormData,
      })
      const photoData = await photoResponse.json()

      const logoFormData = new FormData()
      logoFormData.append("image", logoFile)
      const logoResponse = await fetch(image_hosting_api, {
        method: "POST",
        body: logoFormData,
      })
      const logoData = await logoResponse.json()

      if (photoData.success && logoData.success) {
        const photoUrl = photoData.data.url
        const companyLogo = logoData.data.url

        createUser(email, password)
          .then(() => {
            setNameAndPhoto(name, photoUrl)
              .then(() => {
                const userInfo = {
                  name,
                  email,
                  role: "recruiter",
                  companyName,
                  position,
                  website,
                  companyLogo,
                }
                axiosBase
                  .post("/users", userInfo)
                  .then((res) => {
                    if (res.data.insertedId) {
                      Swal.fire({
                        position: "center",
                        icon: "success",
                        title: "Registration Successful",
                        showConfirmButton: false,
                        timer: 1500,
                      })
                      navigate(goTo)
                    }
                  })
                  .catch(() => {
                    Swal.fire({
                      position: "center",
                      icon: "error",
                      title: "Sorry!!! Something went wrong",
                      showConfirmButton: false,
                      timer: 1500,
                    })
                  })
                  .finally(() => {
                    setIsLoading(false)
                  })
              })
              .catch(() => {
                Swal.fire({
                  position: "center",
                  icon: "error",
                  title: "Sorry!!! Something went wrong",
                  showConfirmButton: false,
                  timer: 1500,
                })
                setIsLoading(false)
              })
          })
          .catch((error) => {
            Swal.fire({
              title: "Sorry!",
              text: `${error.message}`,
              icon: "error",
            })
            setIsLoading(false)
          })
      } else {
        Swal.fire({
          title: "Sorry!",
          text: "Image upload failed. Please try again.",
          icon: "error",
        })
        setIsLoading(false)
      }
    } catch (error) {
      Swal.fire({
        title: "Sorry!",
        text: "Image upload failed. Please try again.",
        icon: "error",
      })
      setIsLoading(false)
    }
  }

  const handleGoogleLogin = () => {
    setIsGoogleLoading(true)
    googleSignIn()
      .then((res) => {
        const userInfo = {
          name: res.user?.displayName,
          email: res.user?.email,
          role: "user",
        }
        axiosBase
          .post("/users", userInfo)
          .then((res) => {
            if (res.data.insertedId) {
              Swal.fire({
                position: "center",
                icon: "success",
                title: "Registration Successful",
                showConfirmButton: false,
                timer: 1500,
              })
              navigate(goTo)
            }
          })
          .catch(() => {
            Swal.fire({
              position: "center",
              icon: "error",
              title: "Sorry!!! Something went wrong",
              showConfirmButton: false,
              timer: 1500,
            })
          })
          .finally(() => {
            setIsGoogleLoading(false)
          })
      })
      .catch((error) => {
        Swal.fire({
          title: "OPPS!!!",
          text: `${error.message}`,
          icon: "error",
        })
      })
      .finally(() => {
        setIsGoogleLoading(false)
      })
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-12 pt-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900">Create Your Account</h1>
          <p className="mt-3 text-lg text-gray-600">Join Next Career and connect with opportunities</p>
        </div>

        {/* Tabs */}
        <div className="flex justify-center mb-8">
          <div className="inline-flex rounded-md shadow-sm" role="group">
            <button
              type="button"
              className={`px-6 py-3 text-sm font-medium rounded-l-lg ${
                activeTab === "jobseeker" ? "z-10 ring-2 ring-blue-500 text-blue-700" : "bg-white text-gray-700 hover:bg-gray-50"
              } border border-gray-200`}
              onClick={() => setActiveTab("jobseeker")}
              disabled={isLoading || isGoogleLoading}
            >
              Job Seeker
            </button>
            <button
              type="button"
              className={`px-6 py-3 text-sm font-medium rounded-r-lg ${
                activeTab === "recruiter" ? "z-10 ring-2 ring-blue-500 text-blue-700" : "bg-white text-gray-700 hover:bg-gray-50"
              } border border-gray-200`}
              onClick={() => setActiveTab("recruiter")}
              disabled={isLoading || isGoogleLoading}
            >
              Recruiter
            </button>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="md:grid md:grid-cols-2">
            {/* Left side - Image */}
            <div className="hidden md:block relative">
              <img src={ activeTab === "jobseeker" ? interviewImg : recruiteImg} alt="Registration" className="h-full w-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex flex-col justify-end p-8">
                <h2 className="text-white text-3xl font-bold mb-2">
                  {activeTab === "jobseeker" ? "Find Your Dream Job" : "Hire Top Talent"}
                </h2>
                <p className="text-white/90 text-lg">
                  {activeTab === "jobseeker"
                    ? "Connect with top employers and opportunities"
                    : "Find the perfect candidates for your company"}
                </p>
              </div>
            </div>

            {/* Right side - Forms */}
            <div className="p-8">
              <div className="mb-6">
                <h2 className="text-2xl font-bold text-gray-900">
                  {activeTab === "jobseeker" ? "Job Seeker Registration" : "Recruiter Registration"}
                </h2>
                <p className="mt-1 text-sm text-gray-600">
                  {activeTab === "jobseeker"
                    ? "Create your job seeker account to find opportunities"
                    : "Create your recruiter account to find talent"}
                </p>
              </div>

              {/* Job Seeker Form */}
              {activeTab === "jobseeker" && (
                <form onSubmit={handleJobSeekerRegister} className="space-y-4">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                      Full Name*
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      placeholder="Your full name"
                      required
                      disabled={isLoading}
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>

                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                      Email*
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      placeholder="you@example.com"
                      required
                      disabled={isLoading}
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>

                  <div>
                    <label htmlFor="photo" className="block text-sm font-medium text-gray-700">
                      Profile Picture*
                    </label>
                    <input
                      type="file"
                      id="photo"
                      name="photo"
                      onChange={(e) => setPhotoFile(e.target.files[0])}
                      required
                      disabled={isLoading}
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                    />
                  </div>

                  <div className="relative">
                    <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                      Password*
                    </label>
                    <div className="mt-1 relative rounded-md shadow-sm">
                      <input
                        type={showPassword ? "text" : "password"}
                        id="password"
                        name="password"
                        placeholder="••••••••"
                        required
                        disabled={isLoading}
                        className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 pr-10"
                      />
                      <button
                        type="button"
                        className="absolute inset-y-0 right-0 pr-3 flex items-center"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? (
                          <EyeOff className="h-5 w-5 text-gray-400" />
                        ) : (
                          <Eye className="h-5 w-5 text-gray-400" />
                        )}
                      </button>
                    </div>
                    <p className="mt-1 text-xs text-gray-500">
                      Password must be at least 6 characters with 1 capital letter, 1 number, and 1 special character.
                    </p>
                  </div>

                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isLoading ? (
                      <>
                        <svg
                          className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          ></circle>
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          ></path>
                        </svg>
                        Registering...
                      </>
                    ) : (
                      "Register as Job Seeker"
                    )}
                  </button>

                  <div className="relative my-4">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-gray-300"></div>
                    </div>
                    <div className="relative flex justify-center text-sm">
                      <span className="px-2 bg-white text-gray-500">Or continue with</span>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={handleGoogleLogin}
                    disabled={isGoogleLoading || isLoading}
                    className="w-full flex justify-center items-center py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isGoogleLoading ? (
                      <>
                        <svg
                          className="animate-spin -ml-1 mr-2 h-4 w-4 text-gray-700"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          ></circle>
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          ></path>
                        </svg>
                        Connecting...
                      </>
                    ) : (
                      <>
                        <svg className="mr-2 h-5 w-5" viewBox="0 0 24 24">
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
                        Continue with Google
                      </>
                    )}
                  </button>
                </form>
              )}

              {/* Recruiter Form */}
              {activeTab === "recruiter" && (
                <form onSubmit={handleRecruiterRegister} className="space-y-4">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                      Full Name*
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      placeholder="Your full name"
                      required
                      disabled={isLoading}
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>

                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                      Email*
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      placeholder="you@example.com"
                      required
                      disabled={isLoading}
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>

                  <div>
                    <label htmlFor="companyName" className="block text-sm font-medium text-gray-700">
                      Company Name*
                    </label>
                    <input
                      type="text"
                      id="companyName"
                      name="companyName"
                      placeholder="Your company name"
                      required
                      disabled={isLoading}
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>

                  <div>
                    <label htmlFor="position" className="block text-sm font-medium text-gray-700">
                      Position*
                    </label>
                    <input
                      type="text"
                      id="position"
                      name="position"
                      placeholder="Your position at the company"
                      required
                      disabled={isLoading}
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>

                  <div>
                    <label htmlFor="website" className="block text-sm font-medium text-gray-700">
                      Company Website*
                    </label>
                    <input
                      type="text"
                      id="website"
                      name="website"
                      placeholder="https://example.com"
                      required
                      disabled={isLoading}
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>

                  <div>
                    <label htmlFor="logo" className="block text-sm font-medium text-gray-700">
                      Company Logo*
                    </label>
                    <input
                      type="file"
                      id="logo"
                      name="logo"
                      onChange={(e) => setLogoFile(e.target.files[0])}
                      required
                      disabled={isLoading}
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                    />
                  </div>

                  <div>
                    <label htmlFor="photo" className="block text-sm font-medium text-gray-700">
                      Your Picture*
                    </label>
                    <input
                      type="file"
                      id="photo"
                      name="photo"
                      onChange={(e) => setPhotoFile(e.target.files[0])}
                      required
                      disabled={isLoading}
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                    />
                  </div>

                  <div className="relative">
                    <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                      Password*
                    </label>
                    <div className="mt-1 relative rounded-md shadow-sm">
                      <input
                        type={showPassword ? "text" : "password"}
                        id="password"
                        name="password"
                        placeholder="••••••••"
                        required
                        disabled={isLoading}
                        className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 pr-10"
                      />
                      <button
                        type="button"
                        className="absolute inset-y-0 right-0 pr-3 flex items-center"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? (
                          <EyeOff className="h-5 w-5 text-gray-400" />
                        ) : (
                          <Eye className="h-5 w-5 text-gray-400" />
                        )}
                      </button>
                    </div>
                    <p className="mt-1 text-xs text-gray-500">
                      Password must be at least 6 characters with 1 capital letter, 1 number, and 1 special character.
                    </p>
                  </div>

                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isLoading ? (
                      <>
                        <svg
                          className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          ></circle>
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          ></path>
                        </svg>
                        Registering...
                      </>
                    ) : (
                      "Register as Recruiter"
                    )}
                  </button>
                </form>
              )}

              <div className="mt-6 text-center text-sm">
                <p className="text-gray-600">
                  Already have an account?{" "}
                  <Link to="/login" state={location?.state} className="font-medium text-blue-600 hover:text-blue-500">
                    Sign in
                  </Link>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Registration
