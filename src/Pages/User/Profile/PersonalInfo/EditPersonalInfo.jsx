"use client"

import { useContext, useState } from "react"
import { useForm } from "react-hook-form"
import { useQuery } from "@tanstack/react-query"
// import { useNavigate } from "next/navigation"
import Swal from "sweetalert2"
import {
  User,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Flag,
  Globe,
  Github,
  Linkedin,
  Upload,
  Save,
  ArrowLeft,
} from "lucide-react"

// These would be your actual imports in your project
import { AuthContext } from "../../../../Providers/AuthProvider"
import useAxiosBase from "../../../../CustomHooks/useAxiosBase"
import { useNavigate } from "react-router-dom"

const image_hosting_key = import.meta.env.VITE_IMAGE_UPLOAD_KEY_IMAGEBB
const image_hosting_api = `https://api.imgbb.com/1/upload?key=${image_hosting_key}`

export default function EditPersonalInfo() {
  // In a real implementation, you'd use your actual context and hooks
  const { user, loading, setNameAndPhoto } = useContext(AuthContext)
  const [photoURL, setPhotoURL] = useState(user?.photoURL)
  const [selectedFile, setSelectedFile] = useState(null)
  const axiosBase = useAxiosBase()
  const navigate = useNavigate()
  const [isSubmitting, setIsSubmitting] = useState(false)

  const { data: userInfo = null, isLoading } = useQuery({
    queryKey: ["user", user?.email],
    queryFn: async () => {
      const response = await axiosBase.get(`/user-by-email/${user?.email}`)
      return response.data
    },
  })

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm()

  if (isLoading || loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-pulse flex flex-col items-center">
          <div className="h-32 w-32 bg-slate-200 rounded-full mb-4"></div>
          <div className="h-6 w-48 bg-slate-200 rounded mb-8"></div>
          <div className="space-y-3 w-full max-w-md">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="h-10 bg-slate-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  const handleImageClick = () => {
    Swal.fire({
      title: "Update profile picture?",
      text: "Choose a new profile image",
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#10b981",
      cancelButtonColor: "#6b7280",
      confirmButtonText: "Choose Image",
      cancelButtonText: "Cancel",
    }).then((result) => {
      if (result.isConfirmed) {
        document.getElementById("fileInput").click()
      }
    })
  }

  const handleFileChange = (event) => {
    const file = event.target.files[0]
    if (file) {
      setSelectedFile(file)
      const reader = new FileReader()
      reader.onloadend = () => {
        setPhotoURL(reader.result)
      }
      reader.readAsDataURL(file)
    }
  }

  const onSubmit = async (data) => {
    setIsSubmitting(true)
    data.email = userInfo.email

    const updateUser = async () => {
      try {
        const updateResponse = await axiosBase.patch(`/user/${userInfo._id}`, data)

        if (updateResponse.status === 200) {
          Swal.fire({
            position: "center",
            icon: "success",
            title: "Profile updated successfully!",
            showConfirmButton: false,
            timer: 1500,
          })
          navigate("/dashboard/personalInfo")
        } else {
          throw new Error("Failed to update personal info")
        }
      } catch (error) {
        Swal.fire({
          position: "center",
          icon: "error",
          title: "Update failed",
          text: "There was a problem updating your information",
          showConfirmButton: true,
        })
      } finally {
        setIsSubmitting(false)
      }
    }

    if (selectedFile) {
      const formData = new FormData()
      formData.append("image", selectedFile)

      try {
        const response = await fetch(image_hosting_api, {
          method: "POST",
          body: formData,
        })
        const result = await response.json()

        if (result.success) {
          data.photoURL = result.data.url

          await setNameAndPhoto(data.name, data.photoURL)
          await updateUser()
        } else {
          throw new Error("Image upload failed")
        }
      } catch (error) {
        Swal.fire({
          position: "center",
          icon: "error",
          title: "Image upload failed",
          text: "There was a problem uploading your profile picture",
          showConfirmButton: true,
        })
        setIsSubmitting(false)
      }
    } else if (data.name !== user.displayName) {
      try {
        await setNameAndPhoto(data.name, user.photoURL)
        await updateUser()
      } catch {
        Swal.fire({
          position: "center",
          icon: "error",
          title: "Update failed",
          text: "There was a problem updating your name",
          showConfirmButton: true,
        })
        setIsSubmitting(false)
      }
    } else {
      await updateUser()
    }
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <div className="mb-6 flex items-center">
        <button
          onClick={() => navigate("/dashboard/personalInfo")}
          className="flex items-center text-slate-600 hover:text-slate-900 transition-colors"
        >
          <ArrowLeft size={16} className="mr-1" />
          <span>Back to Profile</span>
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="bg-gradient-to-r from-emerald-50 to-teal-50 px-6 py-4 border-b border-slate-200">
          <h1 className="text-xl font-semibold text-slate-800">Edit Personal Information</h1>
          <p className="text-slate-500 text-sm mt-1">Update your profile details and information</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="p-6">
          {/* Profile Image Section */}
          <div className="flex flex-col items-center mb-8">
            <div className="relative group">
              <div className="h-32 w-32 rounded-full overflow-hidden border-4 border-white shadow-md">
                <img src={photoURL || "/placeholder.svg"} alt="Profile" className="h-full w-full object-cover" />
                <div
                  className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 flex items-center justify-center transition-all duration-200 cursor-pointer rounded-full"
                  onClick={handleImageClick}
                >
                  <Upload
                    size={24}
                    className="text-white opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                  />
                </div>
              </div>
              <input id="fileInput" type="file" className="hidden" accept="image/*" onChange={handleFileChange} />
            </div>
            <p className="text-sm text-slate-500 mt-2">Click on the image to change your profile picture</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
            {/* Basic Information */}
            <div className="md:col-span-2">
              <h2 className="text-lg font-medium text-slate-800 mb-3">Basic Information</h2>
            </div>

            {/* Name Field */}
            <div className="space-y-1">
              <label className="flex items-center text-sm font-medium text-slate-700">
                <User size={16} className="mr-2 text-slate-400" />
                Full Name <span className="text-red-500 ml-1">*</span>
              </label>
              <input
                type="text"
                {...register("name", { required: "Name is required" })}
                defaultValue={userInfo?.name}
                className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
                placeholder="Your full name"
              />
              {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>}
            </div>

            {/* Email Field */}
            <div className="space-y-1">
              <label className="flex items-center text-sm font-medium text-slate-700">
                <Mail size={16} className="mr-2 text-slate-400" />
                Email Address
              </label>
              <input
                type="email"
                value={userInfo?.email}
                className="w-full px-3 py-2 border border-slate-200 rounded-md bg-slate-50 text-slate-500 cursor-not-allowed"
                disabled
              />
            </div>

            {/* Contact Number */}
            <div className="space-y-1">
              <label className="flex items-center text-sm font-medium text-slate-700">
                <Phone size={16} className="mr-2 text-slate-400" />
                Contact Number <span className="text-red-500 ml-1">*</span>
              </label>
              <input
                type="tel"
                {...register("contactNo", { required: "Contact number is required" })}
                defaultValue={userInfo?.personalInfo?.contactNo}
                className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
                placeholder="+1 (123) 456-7890"
              />
              {errors.contactNo && <p className="text-red-500 text-xs mt-1">{errors.contactNo.message}</p>}
            </div>

            {/* Gender */}
            <div className="space-y-1">
              <label className="flex items-center text-sm font-medium text-slate-700">
                <User size={16} className="mr-2 text-slate-400" />
                Gender <span className="text-red-500 ml-1">*</span>
              </label>
              <select
                {...register("gender", { required: "Please select your gender" })}
                defaultValue={userInfo?.personalInfo?.gender || ""}
                className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
              >
                <option disabled value="">
                  Select Gender
                </option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
              {errors.gender && <p className="text-red-500 text-xs mt-1">{errors.gender.message}</p>}
            </div>

            {/* Address Section */}
            <div className="md:col-span-2 mt-4">
              <h2 className="text-lg font-medium text-slate-800 mb-3">Address Information</h2>
            </div>

            {/* Present Address */}
            <div className="space-y-1 md:col-span-2">
              <label className="flex items-center text-sm font-medium text-slate-700">
                <MapPin size={16} className="mr-2 text-slate-400" />
                Present Address <span className="text-red-500 ml-1">*</span>
              </label>
              <input
                type="text"
                {...register("presentAddress", { required: "Present address is required" })}
                defaultValue={userInfo?.personalInfo?.presentAddress}
                className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
                placeholder="Your current address"
              />
              {errors.presentAddress && <p className="text-red-500 text-xs mt-1">{errors.presentAddress.message}</p>}
            </div>

            {/* Permanent Address */}
            <div className="space-y-1 md:col-span-2">
              <label className="flex items-center text-sm font-medium text-slate-700">
                <MapPin size={16} className="mr-2 text-slate-400" />
                Permanent Address <span className="text-red-500 ml-1">*</span>
              </label>
              <input
                type="text"
                {...register("permanentAddress", { required: "Permanent address is required" })}
                defaultValue={userInfo?.personalInfo?.permanentAddress}
                className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
                placeholder="Your permanent address"
              />
              {errors.permanentAddress && (
                <p className="text-red-500 text-xs mt-1">{errors.permanentAddress.message}</p>
              )}
            </div>

            {/* Additional Information */}
            <div className="md:col-span-2 mt-4">
              <h2 className="text-lg font-medium text-slate-800 mb-3">Additional Information</h2>
            </div>

            {/* Date of Birth */}
            <div className="space-y-1">
              <label className="flex items-center text-sm font-medium text-slate-700">
                <Calendar size={16} className="mr-2 text-slate-400" />
                Date of Birth <span className="text-red-500 ml-1">*</span>
              </label>
              <input
                type="date"
                {...register("dateOfBirth", { required: "Date of birth is required" })}
                defaultValue={userInfo?.personalInfo?.dateOfBirth}
                className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
              />
              {errors.dateOfBirth && <p className="text-red-500 text-xs mt-1">{errors.dateOfBirth.message}</p>}
            </div>

            {/* Nationality */}
            <div className="space-y-1">
              <label className="flex items-center text-sm font-medium text-slate-700">
                <Flag size={16} className="mr-2 text-slate-400" />
                Nationality <span className="text-red-500 ml-1">*</span>
              </label>
              <input
                type="text"
                {...register("nationality", { required: "Nationality is required" })}
                defaultValue={userInfo?.personalInfo?.nationality}
                className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
                placeholder="Your nationality"
              />
              {errors.nationality && <p className="text-red-500 text-xs mt-1">{errors.nationality.message}</p>}
            </div>

            {/* Online Profiles Section */}
            <div className="md:col-span-2 mt-4">
              <h2 className="text-lg font-medium text-slate-800 mb-3">Online Profiles</h2>
            </div>

            {/* LinkedIn */}
            <div className="space-y-1">
              <label className="flex items-center text-sm font-medium text-slate-700">
                <Linkedin size={16} className="mr-2 text-slate-400" />
                LinkedIn Profile
              </label>
              <input
                type="url"
                {...register("linkedIn")}
                defaultValue={userInfo?.personalInfo?.linkedIn}
                className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
                placeholder="https://linkedin.com/in/yourprofile"
              />
            </div>

            {/* GitHub */}
            <div className="space-y-1">
              <label className="flex items-center text-sm font-medium text-slate-700">
                <Github size={16} className="mr-2 text-slate-400" />
                GitHub Profile
              </label>
              <input
                type="url"
                {...register("github")}
                defaultValue={userInfo?.personalInfo?.github}
                className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
                placeholder="https://github.com/yourusername"
              />
            </div>

            {/* Personal Website */}
            <div className="space-y-1 md:col-span-2">
              <label className="flex items-center text-sm font-medium text-slate-700">
                <Globe size={16} className="mr-2 text-slate-400" />
                Personal Website
              </label>
              <input
                type="url"
                {...register("personalWebsite")}
                defaultValue={userInfo?.personalInfo?.personalWebsite}
                className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
                placeholder="https://yourwebsite.com"
              />
            </div>

            {/* Bio */}
            <div className="space-y-1 md:col-span-2">
              <label className="flex items-center text-sm font-medium text-slate-700">
                <User size={16} className="mr-2 text-slate-400" />
                Bio / Summary
              </label>
              <textarea
                {...register("bio")}
                defaultValue={userInfo?.personalInfo?.bio}
                rows={4}
                className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
                placeholder="Tell us about yourself..."
              ></textarea>
            </div>
          </div>

          {/* Submit Button */}
          <div className="mt-8 flex justify-end">
            <button
              type="button"
              onClick={() => navigate("/dashboard/personalInfo")}
              className="px-4 py-2 mr-3 border border-slate-300 rounded-md text-slate-700 hover:bg-slate-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex items-center px-6 py-2 bg-emerald-600 text-white font-medium rounded-md hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
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
