"use client"

import { useState } from "react"
import useAxiosBase, { baseUrl } from "../../../CustomHooks/useAxiosBase"
import { Link, useParams } from "react-router-dom"
import { useQuery } from "@tanstack/react-query"
import {
  Briefcase,
  Calendar,
  ChevronDown,
  Clock,
  Filter,
  Mail,
  MapPin,
  Search,
  SlidersHorizontal,
  Users,
  X,
  CheckCircle,
  Clock3,
} from "lucide-react"
import RecruitmentProgressBar from "./RecruitmentProgressBar"

const SeeApplicants = () => {
  const { jobId } = useParams()
  const axiosBase = useAxiosBase()
  const [searchTerm, setSearchTerm] = useState("")
  const [filterStatus, setFilterStatus] = useState("all")
  const [sortBy, setSortBy] = useState("recent")

  // Fetch applicants data
  const { data: applicants = [], isLoading } = useQuery({
    queryKey: ["applicants", jobId],
    queryFn: async () => {
      const response = await axiosBase.get(`/jobs/applicants/${jobId}`)
      return response.data
    },
  })

  // Fetch job details
  const { data: job = null, isLoading: jobLoading } = useQuery({
    queryKey: ["job", jobId],
    queryFn: async () => {
      const response = await axiosBase.get(`/jobs/job/${jobId}`)
      return response.data
    },
  })

  // Filter and sort applicants
  const filteredApplicants = applicants
    ? applicants.filter((applicant) => {
        // Search filter
        const matchesSearch = applicant.name.toLowerCase().includes(searchTerm.toLowerCase())

        // Status filter (this is a placeholder - you would need to add status to your applicants data)
        const matchesStatus = filterStatus === "all" || applicant.status === filterStatus

        return matchesSearch && matchesStatus
      })
    : []

  // Sort applicants
  const sortedApplicants = [...filteredApplicants].sort((a, b) => {
    if (sortBy === "recent") {
      return new Date(b.appliedDate || Date.now()) - new Date(a.appliedDate || Date.now())
    } else if (sortBy === "name-asc") {
      return a.name.localeCompare(b.name)
    } else if (sortBy === "name-desc") {
      return b.name.localeCompare(a.name)
    }
    return 0
  })

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return ""
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  // Helper function to determine rejection stage
  const getRejectionStageInfo = (applicant, job) => {
    if (!job?.recruitmentStages || !applicant.progressStages) return ""

    const completedStages = applicant.progressStages.length
    const totalStages = job.recruitmentStages.length

    if (completedStages === 0) {
      return `Rejected at the first stage (${job.recruitmentStages[0]})`
    } else if (completedStages < totalStages) {
      return `Rejected at the ${job.recruitmentStages[completedStages]} stage`
    } else {
      return "Rejected after completing all stages"
    }
  }

  // Helper function to get applicant status
  const getApplicantStatus = (applicant, job) => {
    if (!job?.recruitmentStages || !applicant.progressStages) {
      return { badge: "New Applicant", color: "blue", icon: null }
    }

    if (applicant.rejected) {
      return { badge: "Rejected", color: "red", icon: <X className="h-3 w-3 mr-1" /> }
    }

    const completedStages = applicant.progressStages.length
    const totalStages = job.recruitmentStages.length

    if (completedStages === 0) {
      return { badge: "New Applicant", color: "blue", icon: null }
    } else if (completedStages === totalStages) {
      return { badge: "Hired", color: "green", icon: <CheckCircle className="h-3 w-3 mr-1" /> }
    } else {
      const currentStage = job.recruitmentStages[completedStages - 1]
      return {
        badge: `In ${currentStage}`,
        color: "yellow",
        icon: <Clock3 className="h-3 w-3 mr-1" />,
      }
    }
  }

  if (isLoading || jobLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="flex flex-col items-center">
          <div className="w-16 h-16 border-t-4 border-blue-600 border-solid rounded-full animate-spin"></div>
          <p className="mt-4 text-lg text-gray-700">Loading applicants...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="container mx-auto pt-24 pb-16 px-4 md:px-6">
        {/* Job Summary Card */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900">{job?.jobTitle}</h1>
              <div className="flex flex-wrap gap-3 mt-2">
                <div className="flex items-center text-gray-600 text-sm">
                  <Briefcase className="h-4 w-4 mr-1 text-gray-500" />
                  <span>{job?.jobType || "Full-time"}</span>
                </div>
                <div className="flex items-center text-gray-600 text-sm">
                  <MapPin className="h-4 w-4 mr-1 text-gray-500" />
                  <span>{job?.jobLocation || "Remote"}</span>
                </div>
                <div className="flex items-center text-gray-600 text-sm">
                  <Calendar className="h-4 w-4 mr-1 text-gray-500" />
                  <span>Deadline: {formatDate(job?.deadline)}</span>
                </div>
              </div>
            </div>
            <div className="mt-4 md:mt-0 flex items-center">
              <div className="bg-blue-100 text-blue-800 px-4 py-2 rounded-lg flex items-center">
                <Users className="h-5 w-5 mr-2" />
                <span className="font-medium">{applicants?.length || 0} Applicants</span>
              </div>
            </div>
          </div>
        </div>

        {/* Filters and Search */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-grow">
              <input
                type="text"
                placeholder="Search applicants by name..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
              <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
            </div>
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative">
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="pl-10 pr-8 py-2 border border-gray-300 rounded-lg appearance-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="all">All Statuses</option>
                  <option value="new">New</option>
                  <option value="reviewing">Reviewing</option>
                  <option value="shortlisted">Shortlisted</option>
                  <option value="rejected">Rejected</option>
                </select>
                <Filter className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                <ChevronDown className="absolute right-3 top-2.5 h-5 w-5 text-gray-400" />
              </div>
              <div className="relative">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="pl-10 pr-8 py-2 border border-gray-300 rounded-lg appearance-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="recent">Most Recent</option>
                  <option value="name-asc">Name (A-Z)</option>
                  <option value="name-desc">Name (Z-A)</option>
                </select>
                <SlidersHorizontal className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                <ChevronDown className="absolute right-3 top-2.5 h-5 w-5 text-gray-400" />
              </div>
            </div>
          </div>
        </div>

        {/* Applicants List */}
        {applicants?.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {sortedApplicants.map((applicant, index) => {
              const status = getApplicantStatus(applicant, job)
              const colorClasses = {
                blue: "bg-blue-100 text-blue-800",
                red: "bg-red-100 text-red-800",
                green: "bg-green-100 text-green-800",
                yellow: "bg-yellow-100 text-yellow-800",
              }

              return (
                <Link
                  key={index}
                  to={`/profile/${applicant._id}`}
                  state={{ jobId }}
                  className="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-md transition-all duration-300"
                >
                  <div className="h-24 bg-gradient-to-r from-blue-600 to-blue-400 relative"></div>
                  <div className="px-6 pt-0 pb-6 relative">
                    <div className="flex flex-col items-center">
                      <div className="h-24 w-24 rounded-full border-4 border-white bg-white overflow-hidden -mt-12 shadow-md flex items-center justify-center">
                        <img
                          className="h-full w-full object-cover"
                          src={`${baseUrl}/profileImage/${applicant._id}`}
                          alt={`${applicant.name}`}
                          onError={(e) => {
                            e.target.onerror = null
                            e.target.src = "/placeholder.svg"
                          }}
                        />
                      </div>
                      <h2 className="text-xl font-bold text-gray-900 mt-3 text-center">{applicant.name}</h2>
                      <p className="text-gray-600 text-sm mt-1">{applicant.title || "Applicant"}</p>

                      {/* Status Badge */}
                      <div className="mt-3">
                        <span
                          className={`px-3 py-1 text-xs font-medium rounded-full flex items-center ${colorClasses[status.color]}`}
                        >
                          {status.icon}
                          {status.badge}
                        </span>
                      </div>

                      {/* Show rejection info or progress bar */}
                      {applicant.rejected ? (
                        <div className="w-full mt-3 text-center">
                          <p className="text-xs text-gray-600">{getRejectionStageInfo(applicant, job)}</p>
                        </div>
                      ) : (
                        <RecruitmentProgressBar
                          stages={job?.recruitmentStages || []}
                          completedStages={applicant?.progressStages || []}
                        />
                      )}

                      <div className="w-full mt-4 pt-4 border-t border-gray-100">
                        <div className="flex justify-between items-center">
                          {applicant.email && (
                            <div className="flex items-center text-gray-600 text-sm">
                              <Mail className="h-4 w-4 mr-1 text-gray-500" />
                              <span className="truncate max-w-[150px]">{applicant.email}</span>
                            </div>
                          )}
                          <div className="flex items-center text-gray-600 text-sm">
                            <Clock className="h-4 w-4 mr-1 text-gray-500" />
                            <span>{formatDate(applicant.appliedDate) || "Recently"}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              )
            })}
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-sm p-12 text-center">
            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Users className="h-10 w-10 text-gray-400" />
            </div>
            <h3 className="text-xl font-medium text-gray-900 mb-2">No applicants yet</h3>
            <p className="text-gray-600 max-w-md mx-auto">
              No one has applied to this job posting yet. Check back later or consider promoting your job listing to
              attract more candidates.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}

export default SeeApplicants
