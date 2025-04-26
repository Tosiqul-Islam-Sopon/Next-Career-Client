"use client"

import { useState, useContext } from "react"
import { useForm } from "react-hook-form"
import { useQuery } from "@tanstack/react-query"
import { useNavigate } from "react-router-dom"
import Swal from "sweetalert2"
import { User, Building, Mail, Globe, Briefcase, Upload, Save, ArrowLeft, Camera, X, Info } from "lucide-react"

// These would be your actual imports in your project
import { AuthContext } from "../../../Providers/AuthProvider"
import useAxiosBase, { baseUrl } from "../../../CustomHooks/useAxiosBase"

const RecruiterProfileEdit = () => {
  const { user, setNameAndPhoto } = useContext(AuthContext)
  const axiosBase = useAxiosBase()
  const navigate = useNavigate()

  // Fetch recruiter data
  const { data: recruiter = {} } = useQuery({
    queryKey: ["recruiter", user?.email],
    queryFn: async () => {
      const response = await axiosBase.get(`/user-by-email/${user?.email}`)
      return response.data
    },
  })

  const [profileImage, setProfileImage] = useState(null)
  const [previewProfileImage, setPreviewProfileImage] = useState(user?.photoURL || null)
  const [companyLogo, setCompanyLogo] = useState(null)
  const [previewCompanyLogo, setPreviewCompanyLogo] = useState(recruiter?.companyLogo || null)
  const [loading, setLoading] = useState(false)

  // React Hook Form setup
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      name: recruiter?.name || "",
    },
  })

  // Handle profile image preview
  const handleProfileImageChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      setProfileImage(file)
      const previewUrl = URL.createObjectURL(file)
      setPreviewProfileImage(previewUrl)
    }
  }

  // Handle company logo preview
  const handleCompanyLogoChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      setCompanyLogo(file)
      const previewUrl = URL.createObjectURL(file)
      setPreviewCompanyLogo(previewUrl)
    }
  }

  // Remove profile image preview
  const removeProfileImage = () => {
    setProfileImage(null)
    setPreviewProfileImage(user?.photoURL || null)
  }

  // Remove company logo preview
  const removeCompanyLogo = () => {
    setCompanyLogo(null)
    setPreviewCompanyLogo(recruiter?.companyLogo || null)
  }

  // Handle form submission
  const onSubmit = async (data) => {
    setLoading(true) // Indicate loading state

    try {
      // 1. Upload profile image if provided
      if (profileImage) {
        const profileImageFormData = new FormData()
        profileImageFormData.append("file", profileImage)

        try {
          await axiosBase.post(`/uploadProfileImage/${recruiter._id}`, profileImageFormData, {
            headers: { "Content-Type": "multipart/form-data" },
          })
        } catch (error) {
          console.error("Error uploading profile image:", error)
          throw new Error("Failed to upload profile image.")
        }
      }

      // 2. Upload company logo if provided
      if (companyLogo) {
        const companyLogoFormData = new FormData()
        companyLogoFormData.append("file", companyLogo)

        try {
          await axiosBase.post(`/uploadCompanyLogo/${recruiter._id}`, companyLogoFormData, {
            headers: { "Content-Type": "multipart/form-data" },
          })
        } catch (error) {
          console.error("Error uploading company logo:", error)
          throw new Error("Failed to upload company logo.")
        }
      }

      // 3. Construct URLs for profile image and company logo
      const profileImageLink = `${baseUrl}/profileImage/${recruiter._id}`
      const companyLogoLink = `${baseUrl}/companyLogo/${recruiter._id}`

      // 4. Create an updated recruiter object
      const { _id, ...recruiterWithoutId } = recruiter // Destructure and exclude _id

      const updatedRecruiter = {
        ...recruiterWithoutId, // Spread the recruiter properties without _id
        name: data.name, // Update name
        companyLogo: companyLogoLink, // Update company logo URL
      }

      // 5. Update recruiter details on Firebase
      try {
        await setNameAndPhoto(data.name, profileImageLink)
      } catch (error) {
        console.error("Error updating name and photo in Firebase:", error)
        throw new Error("Failed to update name and photo in Firebase.")
      }

      // 6. Update recruiter details in the database
      try {
        await axiosBase.patch(`/recruiter/${recruiter._id}`, updatedRecruiter, {
          headers: { "Content-Type": "application/json" },
        })
      } catch (error) {
        console.error("Error updating recruiter in database:", error)
        throw new Error("Failed to update recruiter in the database.")
      }

      navigate("/dashboard/recruiterProfile")
      Swal.fire({
        position: "center",
        icon: "success",
        title: "Profile Updated Successfully",
        text: "Your profile information has been updated.",
        showConfirmButton: false,
        timer: 2000,
      })
    } catch (error) {
      // Handle overall errors
      console.error("Error updating profile:", error)
      Swal.fire({
        position: "center",
        icon: "error",
        title: "Update Failed",
        text: "There was a problem updating your profile. Please try again.",
        showConfirmButton: true,
      })
    } finally {
      setLoading(false) // End loading state
    }
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-6 flex items-center">
        <button
          onClick={() => navigate("/dashboard/recruiterProfile")}
          className="flex items-center text-slate-600 hover:text-orange-600 transition-colors"
        >
          <ArrowLeft size={16} className="mr-1" />
          <span>Back to Profile</span>
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-md border border-slate-200 overflow-hidden">
        <div className="bg-gradient-to-r from-orange-500 to-orange-600 px-6 py-4 border-b border-slate-200">
          <h1 className="text-xl font-semibold text-white">Edit Recruiter Profile</h1>
          <p className="text-orange-100 text-sm mt-1">Update your profile information and company details</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="p-6">
          {/* Profile Images Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
            {/* User Profile Image */}
            <div className="flex flex-col items-center">
              <div className="relative group">
                <div className="h-32 w-32 rounded-full overflow-hidden border-4 border-white shadow-md bg-slate-100">
                  {previewProfileImage ? (
                    <img
                      src={previewProfileImage || "/placeholder.svg"}
                      alt="User Profile"
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="h-full w-full flex items-center justify-center bg-slate-100">
                      <User size={40} className="text-slate-400" />
                    </div>
                  )}
                  <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 flex items-center justify-center transition-all duration-200 rounded-full">
                    <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                      <label className="cursor-pointer bg-white text-orange-600 p-2 rounded-full shadow-md hover:bg-orange-50">
                        <Camera size={18} />
                        <input type="file" accept="image/*" className="hidden" onChange={handleProfileImageChange} />
                        <span className="sr-only">Upload Profile Image</span>
                      </label>
                      {profileImage && (
                        <button
                          type="button"
                          onClick={removeProfileImage}
                          className="bg-white text-red-600 p-2 rounded-full shadow-md hover:bg-red-50"
                        >
                          <X size={18} />
                          <span className="sr-only">Remove Image</span>
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
              <h3 className="font-medium text-slate-800 mt-4">Profile Picture</h3>
              <p className="text-xs text-slate-500 mt-1 text-center">
                Click on the image to upload a new profile picture
              </p>
            </div>

            {/* Company Logo */}
            <div className="flex flex-col items-center">
              <div className="relative group">
                <div className="h-32 w-32 rounded-full overflow-hidden border-4 border-white shadow-md bg-slate-100">
                  {previewCompanyLogo ? (
                    <img
                      src={previewCompanyLogo || "/placeholder.svg"}
                      alt="Company Logo"
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="h-full w-full flex items-center justify-center bg-slate-100">
                      <Building size={40} className="text-slate-400" />
                    </div>
                  )}
                  <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 flex items-center justify-center transition-all duration-200 rounded-full">
                    <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                      <label className="cursor-pointer bg-white text-orange-600 p-2 rounded-full shadow-md hover:bg-orange-50">
                        <Upload size={18} />
                        <input type="file" accept="image/*" className="hidden" onChange={handleCompanyLogoChange} />
                        <span className="sr-only">Upload Company Logo</span>
                      </label>
                      {companyLogo && (
                        <button
                          type="button"
                          onClick={removeCompanyLogo}
                          className="bg-white text-red-600 p-2 rounded-full shadow-md hover:bg-red-50"
                        >
                          <X size={18} />
                          <span className="sr-only">Remove Logo</span>
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
              <h3 className="font-medium text-slate-800 mt-4">Company Logo</h3>
              <p className="text-xs text-slate-500 mt-1 text-center">Click on the image to upload a new company logo</p>
            </div>
          </div>

          {/* Form Fields */}
          <div className="space-y-6">
            <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 mb-6">
              <div className="flex items-start">
                <Info size={20} className="text-orange-500 mt-0.5 mr-3 flex-shrink-0" />
                <div>
                  <h3 className="font-medium text-slate-800">Note</h3>
                  <p className="text-sm text-slate-600 mt-1">
                    You can update your name and upload new images. Other profile details can only be changed by
                    contacting support.
                  </p>
                </div>
              </div>
            </div>

            {/* Name */}
            <div className="space-y-1">
              <label className="flex items-center text-sm font-medium text-slate-700">
                <User size={16} className="mr-2 text-slate-400" />
                Full Name <span className="text-red-500 ml-1">*</span>
              </label>
              <input
                type="text"
                {...register("name", { required: "Name is required" })}
                className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
                placeholder="Enter your full name"
              />
              {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>}
            </div>

            {/* Disabled Fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4 mt-6">
              {/* Email */}
              <div className="space-y-1">
                <label className="flex items-center text-sm font-medium text-slate-700">
                  <Mail size={16} className="mr-2 text-slate-400" />
                  Email Address
                </label>
                <input
                  type="email"
                  value={recruiter?.email || ""}
                  disabled
                  className="w-full px-3 py-2 border border-slate-200 rounded-md bg-slate-50 text-slate-500 cursor-not-allowed"
                />
              </div>

              {/* Company Name */}
              <div className="space-y-1">
                <label className="flex items-center text-sm font-medium text-slate-700">
                  <Building size={16} className="mr-2 text-slate-400" />
                  Company Name
                </label>
                <input
                  type="text"
                  value={recruiter?.companyName || ""}
                  disabled
                  className="w-full px-3 py-2 border border-slate-200 rounded-md bg-slate-50 text-slate-500 cursor-not-allowed"
                />
              </div>

              {/* Position */}
              <div className="space-y-1">
                <label className="flex items-center text-sm font-medium text-slate-700">
                  <Briefcase size={16} className="mr-2 text-slate-400" />
                  Position
                </label>
                <input
                  type="text"
                  value={recruiter?.position || ""}
                  disabled
                  className="w-full px-3 py-2 border border-slate-200 rounded-md bg-slate-50 text-slate-500 cursor-not-allowed"
                />
              </div>

              {/* Website */}
              <div className="space-y-1">
                <label className="flex items-center text-sm font-medium text-slate-700">
                  <Globe size={16} className="mr-2 text-slate-400" />
                  Website
                </label>
                <input
                  type="text"
                  value={recruiter?.website || ""}
                  disabled
                  className="w-full px-3 py-2 border border-slate-200 rounded-md bg-slate-50 text-slate-500 cursor-not-allowed"
                />
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <div className="mt-8 flex justify-end">
            <button
              type="button"
              onClick={() => navigate("/dashboard/recruiterProfile")}
              className="px-4 py-2 mr-3 border border-slate-300 rounded-md text-slate-700 hover:bg-slate-50 transition-colors"
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex items-center px-6 py-2 bg-orange-600 text-white font-medium rounded-md hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {loading ? (
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
                  Saving...
                </>
              ) : (
                <>
                  <Save size={18} className="mr-2" />
                  Save Changes
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default RecruiterProfileEdit
