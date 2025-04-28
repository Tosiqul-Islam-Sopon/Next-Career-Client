"use client"

import PropTypes from "prop-types"
import { PiOfficeChairLight, PiEyeBold } from "react-icons/pi"
import { MdGroups, MdLocationOn, MdCalendarToday, MdAttachMoney, MdWorkOutline } from "react-icons/md"
import { Link } from "react-router-dom"
import useAxiosBase, { baseUrl } from "../../../CustomHooks/useAxiosBase"
import { useEffect, useState } from "react"
import { io } from "socket.io-client"

const socket = io(baseUrl)

const JobCard = ({ job }) => {
  const { _id, jobTitle, jobPosition, salary, deadline, companyInfo, jobLocation, onSitePlace, vacancy, view } = job
  const { companyName, companyLogo } = companyInfo
  const axiosBase = useAxiosBase()

  const [totalApplicants, setTotalApplicants] = useState(0)
  const [viewCount, setViewCount] = useState(view || 0)

  useEffect(() => {
    // Listen for updates
    socket.on("jobViewIncremented", (data) => {
      if (data.jobId === _id) {
        // Update only if it's this job's ID
        setViewCount(data.newViewCount)
      }
    })

    // Cleanup listener on unmount
    return () => {
      socket.off("jobViewIncremented")
    }
  }, [_id])

  useEffect(() => {
    const loadTotalApplicants = async () => {
      const response = await axiosBase.get(`/jobs/totalApplicants/${_id}`)
      setTotalApplicants(response.data.totalApplicants)
    }
    loadTotalApplicants()
  }, [axiosBase, _id])

  const handleViewCount = async (jobId) => {
    try {
      await axiosBase.patch(`/jobs/incrementView/${jobId}`)
    } catch (error) {
      console.error("Failed to increment view count", error)
    }
  }

  // Format deadline to be more readable
  const formatDeadline = (dateString) => {
    const date = new Date(dateString)
    return date instanceof Date && !isNaN(date)
      ? date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
      : dateString
  }

  // Format salary with commas
  const formatSalary = (salaryString) => {
    if (!salaryString) return "Competitive"

    // If it's already a number with commas or has special formatting, return as is
    if (typeof salaryString === "string" && (salaryString.includes(",") || salaryString.includes("-"))) {
      return `৳ ${salaryString}`
    }

    // Try to format as number with commas
    try {
      const numericSalary = Number.parseFloat(salaryString.replace(/[^0-9.]/g, ""))
      return `৳ ${numericSalary.toLocaleString()}`
    } catch {
      return `৳ ${salaryString}`
    }
  }

  return (
    <div className="overflow-hidden transition-all duration-300 hover:shadow-md bg-white border border-gray-200 rounded-lg">
      {/* Company header section */}
      <div className="p-5 border-b border-gray-100">
        <div className="flex items-center gap-4">
          <div className="flex-shrink-0 w-12 h-12 rounded-md overflow-hidden border border-gray-200 bg-gray-50 flex items-center justify-center">
            {companyLogo ? (
              <img
                className="w-full h-full object-contain"
                src={companyLogo || "/placeholder.svg"}
                alt={companyName}
                onError={(e) => {
                  e.target.src = "/placeholder.svg"
                  e.target.alt = companyName.charAt(0)
                }}
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-blue-50 text-blue-700 font-semibold text-lg">
                {companyName.charAt(0)}
              </div>
            )}
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-lg font-semibold text-gray-900 truncate">{jobTitle}</h3>
            <div className="flex items-center">
              <p className="text-sm text-gray-500">{companyName}</p>
              {jobPosition && (
                <>
                  <span className="mx-1.5 text-gray-300">•</span>
                  <div className="flex items-center text-sm text-gray-500">
                    <MdWorkOutline className="h-3.5 w-3.5 mr-1" />
                    <span>{jobPosition}</span>
                  </div>
                </>
              )}
            </div>
          </div>
          <span
            className={`px-2.5 py-0.5 text-xs font-medium rounded-full ${
              jobLocation === "Remote"
                ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                : "bg-blue-50 text-blue-700 border border-blue-200"
            }`}
          >
            {jobLocation === "Remote" ? "Remote" : onSitePlace}
          </span>
        </div>
      </div>

      {/* Job details section */}
      <div className="p-5 space-y-4">
        <div className="grid grid-cols-3 gap-4">
          <div className="space-y-1">
            <div className="flex items-center text-gray-500 text-xs">
              <MdAttachMoney className="h-3.5 w-3.5 mr-1.5" />
              <span>Salary</span>
            </div>
            <p className="text-sm font-medium text-gray-900">{formatSalary(salary)}</p>
          </div>

          <div className="space-y-1">
            <div className="flex items-center text-gray-500 text-xs">
              <MdLocationOn className="h-3.5 w-3.5 mr-1.5" />
              <span>Location</span>
            </div>
            <p className="text-sm font-medium text-gray-900 truncate">
              {jobLocation === "Remote" ? "Remote" : onSitePlace}
            </p>
          </div>

          <div className="space-y-1">
            <div className="flex items-center text-gray-500 text-xs">
              <MdCalendarToday className="h-3.5 w-3.5 mr-1.5" />
              <span>Deadline</span>
            </div>
            <p className="text-sm font-medium text-gray-900">{formatDeadline(deadline)}</p>
          </div>
        </div>

        <div className="h-px w-full bg-gray-200 my-4"></div>

        <div className="grid grid-cols-3 gap-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center flex-shrink-0">
              <PiOfficeChairLight className="h-4 w-4 text-blue-600" />
            </div>
            <div>
              <p className="text-xs text-gray-500">Vacancy</p>
              <p className="text-sm font-semibold text-gray-900">{vacancy}</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-indigo-50 flex items-center justify-center flex-shrink-0">
              <PiEyeBold className="h-4 w-4 text-indigo-600" />
            </div>
            <div>
              <p className="text-xs text-gray-500">Visitors</p>
              <p className="text-sm font-semibold text-gray-900">{viewCount}</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-amber-50 flex items-center justify-center flex-shrink-0">
              <MdGroups className="h-4 w-4 text-amber-600" />
            </div>
            <div>
              <p className="text-xs text-gray-500">Applied</p>
              <p className="text-sm font-semibold text-gray-900">{totalApplicants}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Action button */}
      <div className="px-5 pb-5">
        <Link to={`/jobDetails/${_id}`} className="block w-full">
          <button
            onClick={() => handleViewCount(_id)}
            className="w-full py-2.5 px-4 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-md transition-colors duration-200 text-sm"
          >
            View Details
          </button>
        </Link>
      </div>
    </div>
  )
}

export default JobCard

JobCard.propTypes = {
  job: PropTypes.object.isRequired,
}
