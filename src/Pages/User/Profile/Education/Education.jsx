"use client"

import { useContext, useState } from "react"
import { useForm } from "react-hook-form"
import { useQuery } from "@tanstack/react-query"
import Swal from "sweetalert2"
import {
  GraduationCap,
  Building,
  BookOpen,
  Calendar,
  Award,
  Users,
  FileText,
  Plus,
  X,
  ChevronRight,
  School,
  Clock,
  Save,
} from "lucide-react"
import { Link } from "react-router-dom"

// These would be your actual imports in your project
import { AuthContext } from "../../../../Providers/AuthProvider"
import useAxiosBase from "../../../../CustomHooks/useAxiosBase"

export default function Education() {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm()
  const [isFormVisible, setIsFormVisible] = useState(false)
  const { user } = useContext(AuthContext)
  const axiosBase = useAxiosBase()

  const {
    data: userInfo = null,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["user", user?.email],
    queryFn: async () => {
      const response = await axiosBase.get(`/user-by-email/${user?.email}`)
      return response.data
    },
  })

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="relative">
          <div className="w-16 h-16 border-4 border-emerald-100 rounded-full animate-spin"></div>
          <div className="absolute top-0 left-0 w-16 h-16 border-t-4 border-emerald-500 rounded-full animate-spin"></div>
          <div className="absolute top-1/2 left-1/2 w-3 h-3 bg-emerald-500 rounded-full -translate-x-1/2 -translate-y-1/2"></div>
        </div>
        <p className="ml-4 text-emerald-600 font-medium">Loading your education history...</p>
      </div>
    )
  }

  const onSubmit = async (data) => {
    try {
      const response = await axiosBase.patch(`/user/${userInfo._id}/education`, data)

      if (response.status === 200) {
        Swal.fire({
          title: "Success!",
          text: "Education record added successfully",
          icon: "success",
          confirmButtonText: "Great!",
          confirmButtonColor: "#10b981",
        })
        setIsFormVisible(false)
        reset()
        refetch()
      }
    } catch (error) {
      console.error("Error adding education data:", error)
      Swal.fire({
        title: "Error",
        text: "Failed to add education record",
        icon: "error",
        confirmButtonText: "Try Again",
        confirmButtonColor: "#ef4444",
      })
    }
  }

  const handleAddEducationClick = () => {
    setIsFormVisible(true)
    reset()
    // Scroll to form
    setTimeout(() => {
      document.getElementById("education-form")?.scrollIntoView({ behavior: "smooth" })
    }, 100)
  }

  const handleCancelClick = () => {
    setIsFormVisible(false)
    reset()
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="mb-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-slate-800 flex items-center">
              <GraduationCap className="mr-2 text-emerald-600" size={28} />
              Education History
            </h1>
            <p className="text-slate-500 mt-1">Manage your academic qualifications and achievements</p>
          </div>

          <div className="flex items-center">
            <Link
              to="/dashboard"
              className="text-sm text-slate-500 hover:text-slate-700 flex items-center mr-4 transition-colors"
            >
              <span>Dashboard</span>
              <ChevronRight size={16} />
            </Link>
            {!isFormVisible && (
              <button
                type="button"
                className="flex items-center px-4 py-2 bg-emerald-600 text-white font-medium rounded-md hover:bg-emerald-700 transition-colors shadow-sm"
                onClick={handleAddEducationClick}
              >
                <Plus size={18} className="mr-1" />
                Add Education
              </button>
            )}
          </div>
        </div>

        {/* Education List */}
        {userInfo.education && userInfo.education.length > 0 ? (
          <div className="space-y-6">
            {userInfo.education.map((edu) => (
              <div
                key={edu._id}
                className="p-6 bg-white border border-slate-200 rounded-xl shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="flex flex-col md:flex-row md:items-start gap-4">
                  <div className="flex-shrink-0 w-16 h-16 bg-emerald-100 rounded-lg flex items-center justify-center">
                    <School className="h-8 w-8 text-emerald-600" />
                  </div>

                  <div className="flex-grow">
                    <div className="flex flex-col md:flex-row md:items-center justify-between mb-2">
                      <h3 className="text-xl font-bold text-slate-800">{edu.degree}</h3>
                      <div className="flex items-center text-sm text-slate-500 mt-1 md:mt-0">
                        <Clock size={14} className="mr-1" />
                        <span>
                          {edu.startDate} - {edu.endDate || "Present"}
                        </span>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-2 mt-3">
                      <div className="flex items-start">
                        <Building size={16} className="mr-2 text-slate-400 mt-0.5 flex-shrink-0" />
                        <div>
                          <p className="text-xs text-slate-500">Institution</p>
                          <p className="text-slate-700 font-medium">{edu.institution}</p>
                        </div>
                      </div>

                      <div className="flex items-start">
                        <BookOpen size={16} className="mr-2 text-slate-400 mt-0.5 flex-shrink-0" />
                        <div>
                          <p className="text-xs text-slate-500">Field of Study</p>
                          <p className="text-slate-700 font-medium">{edu.subject}</p>
                        </div>
                      </div>

                      {edu.grade && (
                        <div className="flex items-start">
                          <Award size={16} className="mr-2 text-slate-400 mt-0.5 flex-shrink-0" />
                          <div>
                            <p className="text-xs text-slate-500">Grade</p>
                            <p className="text-slate-700 font-medium">{edu.grade}</p>
                          </div>
                        </div>
                      )}

                      {edu.activities && (
                        <div className="flex items-start">
                          <Users size={16} className="mr-2 text-slate-400 mt-0.5 flex-shrink-0" />
                          <div>
                            <p className="text-xs text-slate-500">Activities</p>
                            <p className="text-slate-700">{edu.activities}</p>
                          </div>
                        </div>
                      )}
                    </div>

                    {edu.description && (
                      <div className="mt-4 pt-4 border-t border-slate-100">
                        <div className="flex items-start">
                          <FileText size={16} className="mr-2 text-slate-400 mt-0.5 flex-shrink-0" />
                          <div>
                            <p className="text-xs text-slate-500 mb-1">Description</p>
                            <p className="text-slate-600 text-sm">{edu.description}</p>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white border border-slate-200 rounded-xl p-8 text-center shadow-sm">
            <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <GraduationCap className="h-8 w-8 text-slate-400" />
            </div>
            <h3 className="text-lg font-medium text-slate-800 mb-2">No education records yet</h3>
            <p className="text-slate-500 mb-6">Add your educational background to complete your profile</p>
            {!isFormVisible && (
              <button
                type="button"
                className="inline-flex items-center px-4 py-2 bg-emerald-600 text-white font-medium rounded-md hover:bg-emerald-700 transition-colors"
                onClick={handleAddEducationClick}
              >
                <Plus size={18} className="mr-1" />
                Add Education
              </button>
            )}
          </div>
        )}
      </div>

      {/* Add Education Form */}
      {isFormVisible && (
        <div
          id="education-form"
          className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden transition-all duration-300 mb-8"
        >
          <div className="bg-gradient-to-r from-emerald-50 to-teal-50 px-6 py-4 border-b border-slate-200 flex justify-between items-center">
            <h2 className="text-lg font-semibold text-slate-800">Add Education</h2>
            <button
              type="button"
              onClick={handleCancelClick}
              className="text-slate-400 hover:text-slate-600 transition-colors"
            >
              <X size={20} />
            </button>
          </div>

          <form className="p-6" onSubmit={handleSubmit(onSubmit)}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
              {/* Degree/Qualification */}
              <div className="space-y-1">
                <label className="flex items-center text-sm font-medium text-slate-700">
                  <GraduationCap size={16} className="mr-2 text-slate-400" />
                  Degree/Qualification <span className="text-red-500 ml-1">*</span>
                </label>
                <input
                  type="text"
                  {...register("degree", { required: "This field is required" })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
                  placeholder="Bachelor of Science, Master's Degree, etc."
                />
                {errors.degree && <p className="text-red-500 text-xs mt-1">{errors.degree.message}</p>}
              </div>

              {/* Institution Name */}
              <div className="space-y-1">
                <label className="flex items-center text-sm font-medium text-slate-700">
                  <Building size={16} className="mr-2 text-slate-400" />
                  Institution Name <span className="text-red-500 ml-1">*</span>
                </label>
                <input
                  type="text"
                  {...register("institution", { required: "This field is required" })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
                  placeholder="University or School Name"
                />
                {errors.institution && <p className="text-red-500 text-xs mt-1">{errors.institution.message}</p>}
              </div>

              {/* Field of Study */}
              <div className="space-y-1">
                <label className="flex items-center text-sm font-medium text-slate-700">
                  <BookOpen size={16} className="mr-2 text-slate-400" />
                  Field of Study / Subject <span className="text-red-500 ml-1">*</span>
                </label>
                <input
                  type="text"
                  {...register("subject", { required: "This field is required" })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
                  placeholder="Computer Science, Business, etc."
                />
                {errors.subject && <p className="text-red-500 text-xs mt-1">{errors.subject.message}</p>}
              </div>

              {/* Grade */}
              <div className="space-y-1">
                <label className="flex items-center text-sm font-medium text-slate-700">
                  <Award size={16} className="mr-2 text-slate-400" />
                  Grade
                </label>
                <input
                  type="text"
                  {...register("grade")}
                  className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
                  placeholder="A, 3.8 GPA, First Class, etc."
                />
              </div>

              {/* Start Date */}
              <div className="space-y-1">
                <label className="flex items-center text-sm font-medium text-slate-700">
                  <Calendar size={16} className="mr-2 text-slate-400" />
                  Start Date <span className="text-red-500 ml-1">*</span>
                </label>
                <input
                  type="date"
                  {...register("startDate", { required: "This field is required" })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
                />
                {errors.startDate && <p className="text-red-500 text-xs mt-1">{errors.startDate.message}</p>}
              </div>

              {/* End Date */}
              <div className="space-y-1">
                <label className="flex items-center text-sm font-medium text-slate-700">
                  <Calendar size={16} className="mr-2 text-slate-400" />
                  End Date <span className="text-slate-400 text-xs ml-1">(or expected)</span>
                </label>
                <input
                  type="date"
                  {...register("endDate")}
                  className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
                />
              </div>

              {/* Activities */}
              <div className="space-y-1 md:col-span-2">
                <label className="flex items-center text-sm font-medium text-slate-700">
                  <Users size={16} className="mr-2 text-slate-400" />
                  Activities and Societies
                </label>
                <input
                  type="text"
                  {...register("activities")}
                  className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
                  placeholder="Clubs, sports, volunteer work, etc."
                />
              </div>

              {/* Description */}
              <div className="space-y-1 md:col-span-2">
                <label className="flex items-center text-sm font-medium text-slate-700">
                  <FileText size={16} className="mr-2 text-slate-400" />
                  Description
                </label>
                <textarea
                  {...register("description")}
                  rows={4}
                  className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
                  placeholder="Additional details about your education, achievements, thesis, etc."
                ></textarea>
              </div>
            </div>

            <div className="mt-6 flex justify-end space-x-3">
              <button
                type="button"
                className="px-4 py-2 border border-slate-300 rounded-md text-slate-700 font-medium hover:bg-slate-50 transition-colors"
                onClick={handleCancelClick}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex items-center px-6 py-2 bg-emerald-600 text-white font-medium rounded-md hover:bg-emerald-700 transition-colors shadow-sm"
              >
                <Save size={18} className="mr-2" />
                Save Education
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  )
}
