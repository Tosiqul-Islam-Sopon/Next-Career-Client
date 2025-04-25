"use client"

import { useEffect, useState } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { useForm } from "react-hook-form"
import useAxiosBase from "../../../CustomHooks/useAxiosBase"

const EditJob = () => {
  const { jobId } = useParams()
  const axiosBase = useAxiosBase()
  const navigate = useNavigate()
  const [isLoading, setIsLoading] = useState(true)
  const [previewImage, setPreviewImage] = useState(null)

  const {
    handleSubmit,
    register,
    reset,
    watch,
    setValue,
    formState: { errors, isDirty, isSubmitting },
  } = useForm()

  useEffect(() => {
    const fetchJobData = async () => {
      try {
        setIsLoading(true)
        const response = await axiosBase.get(`/jobs/job/${jobId}`)
        reset(response.data) // Set previous data as default
        setPreviewImage(response.data.recruitmentImageUrl)
        setIsLoading(false)
      } catch (error) {
        console.error("Error fetching job data:", error)
        setIsLoading(false)
      }
    }
    fetchJobData()
  }, [axiosBase, jobId, reset])

  const onSubmit = async (data) => {
    try {
      // Handle file upload if there's a new image
      if (data.recruitmentImage && data.recruitmentImage[0]) {
        // In a real implementation, you would upload the file to your server/cloud storage
        // and get back a URL to store in the database
        console.log("Would upload file:", data.recruitmentImage[0])

        // For demo purposes, we're just logging the file
        // In a real app, you would replace this with your file upload logic
        // data.recruitmentImageUrl = await uploadFileAndGetUrl(data.recruitmentImage[0])
      }

      // Remove the file input data before sending to API
      const dataToSubmit = { ...data }
      delete dataToSubmit.recruitmentImage

      console.log("Submitting data:", dataToSubmit)
      // Uncomment to actually submit the data
      // await axiosBase.put(`/jobs/job/${jobId}`, dataToSubmit)
      // navigate(`/job-details/${jobId}`)
    } catch (error) {
      console.error("Error updating job:", error)
    }
  }

  const handleCancel = () => {
    navigate(`/jobDetails/${jobId}`)
  }

  const handleImageChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setPreviewImage(reader.result)
      }
      reader.readAsDataURL(file)
    }
  }

  const companyWebsite = watch("companyInfo.website")
  const companyName = watch("companyInfo.companyName")
  const companyLogo = watch("companyInfo.companyLogo")
  const jobTitle = watch("jobTitle")

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center pt-16">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-t-green-500 border-green-200 border-solid rounded-full animate-spin mx-auto mb-4"></div>
          <h2 className="text-xl font-medium text-gray-700">Loading job details...</h2>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-16 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <div className="relative h-32 bg-gradient-to-r from-green-50 to-green-100">
            <div className="absolute inset-0 bg-opacity-50 flex items-center justify-center">
              <div className="w-full h-full bg-[url('https://pattern.monster/dust/')]"></div>
            </div>
          </div>

          <div className="px-6 py-6 md:px-8 md:py-8 relative">
            <div className="flex flex-col items-center -mt-16 mb-6">
              <img
                src={companyLogo || "/placeholder.svg?height=80&width=80&query=company logo"}
                alt={companyName || "Company"}
                className="w-20 h-20 rounded-full border-4 border-white shadow-md object-cover bg-white"
              />
              <h1 className="text-2xl font-bold mt-2 text-gray-900">{companyName || "Company Name"}</h1>
              {companyWebsite && (
                <a
                  href={companyWebsite.startsWith("http") ? companyWebsite : `https://${companyWebsite}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-green-600 hover:underline mt-1 flex items-center"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4 mr-1"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9"
                    />
                  </svg>
                  {companyWebsite}
                </a>
              )}
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
              <div className="border-b border-gray-200 pb-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 text-green-500 mr-2"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  Basic Information
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Job Title*</label>
                    <input
                      type="text"
                      {...register("jobTitle", { required: true })}
                      className="w-full p-2.5 bg-gray-100 text-gray-700 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                      disabled
                    />
                    {errors.jobTitle && <p className="mt-1 text-sm text-red-600">Job title is required</p>}
                  </div>

                  <div className="col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Job Description*</label>
                    <textarea
                      {...register("jobDescription", { required: true })}
                      rows={5}
                      className="w-full p-2.5 text-gray-700 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                      placeholder="Provide a detailed description of the job role and responsibilities"
                    ></textarea>
                    {errors.jobDescription && <p className="mt-1 text-sm text-red-600">Job description is required</p>}
                  </div>

                  <div className="col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Requirements*</label>
                    <textarea
                      {...register("jobRequirements", { required: true })}
                      rows={4}
                      className="w-full p-2.5 text-gray-700 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                      placeholder="List the requirements for this position"
                    ></textarea>
                    {errors.jobRequirements && (
                      <p className="mt-1 text-sm text-red-600">Job requirements are required</p>
                    )}
                  </div>

                  <div className="col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Qualifications*</label>
                    <textarea
                      {...register("jobQualifications", { required: true })}
                      rows={4}
                      className="w-full p-2.5 text-gray-700 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                      placeholder="List the qualifications needed for this position"
                    ></textarea>
                    {errors.jobQualifications && (
                      <p className="mt-1 text-sm text-red-600">Job qualifications are required</p>
                    )}
                  </div>
                </div>
              </div>

              <div className="border-b border-gray-200 pb-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 text-green-500 mr-2"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"
                    />
                  </svg>
                  Job Details
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Category*</label>
                    <select
                      {...register("jobCategory", { required: true })}
                      className="w-full p-2.5 text-gray-700 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                    >
                      <option value="">Select a category</option>
                      <option value="Marketing">Marketing</option>
                      <option value="Development">Development</option>
                      <option value="Design">Design</option>
                      <option value="SoftwareEngineer">Software Engineer</option>
                    </select>
                    {errors.jobCategory && <p className="mt-1 text-sm text-red-600">Category is required</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Job Type*</label>
                    <select
                      {...register("jobType", { required: true })}
                      className="w-full p-2.5 text-gray-700 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                    >
                      <option value="">Select job type</option>
                      <option value="Full Time">Full Time</option>
                      <option value="Part Time">Part Time</option>
                      <option value="Contract">Contract</option>
                      <option value="Intern">Intern</option>
                    </select>
                    {errors.jobType && <p className="mt-1 text-sm text-red-600">Job type is required</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Job Location*</label>
                    <select
                      {...register("jobLocation", { required: true })}
                      className="w-full p-2.5 text-gray-700 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                    >
                      <option value="">Select location type</option>
                      <option value="On Site">On Site</option>
                      <option value="Remote">Remote</option>
                      <option value="Hybrid">Hybrid</option>
                    </select>
                    {errors.jobLocation && <p className="mt-1 text-sm text-red-600">Job location is required</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Location Address
                      <span className="text-xs text-gray-500 ml-1">(if not remote)</span>
                    </label>
                    <input
                      type="text"
                      {...register("onSitePlace")}
                      className="w-full p-2.5 text-gray-700 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                      placeholder="Office address or city"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Salary* (per month)</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                        <span className="text-gray-500">৳</span>
                      </div>
                      <input
                        type="number"
                        {...register("salary", { required: true })}
                        className="w-full p-2.5 pl-7 text-gray-700 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                        placeholder="e.g. 50000"
                      />
                    </div>
                    {errors.salary && <p className="mt-1 text-sm text-red-600">Salary is required</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Vacancy*</label>
                    <input
                      type="number"
                      {...register("vacancy", { required: true, min: 1 })}
                      className="w-full p-2.5 text-gray-700 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                      placeholder="Number of positions"
                      min="1"
                    />
                    {errors.vacancy && <p className="mt-1 text-sm text-red-600">Vacancy is required</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Application Deadline*</label>
                    <input
                      type="date"
                      {...register("deadline", { required: true })}
                      className="w-full p-2.5 text-gray-700 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                    />
                    {errors.deadline && <p className="mt-1 text-sm text-red-600">Deadline is required</p>}
                  </div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row justify-between gap-4 pt-4">
                <button
                  type="button"
                  onClick={handleCancel}
                  className="px-6 py-2.5 bg-white border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 focus:ring-4 focus:ring-gray-200 transition-colors"
                >
                  Cancel
                </button>
                <div className="flex gap-4">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="px-6 py-2.5 bg-green-600 text-white font-medium rounded-lg hover:bg-green-700 focus:ring-4 focus:ring-green-300 transition-colors flex items-center justify-center disabled:opacity-70 disabled:cursor-not-allowed"
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
                      "Save Changes"
                    )}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}

export default EditJob
