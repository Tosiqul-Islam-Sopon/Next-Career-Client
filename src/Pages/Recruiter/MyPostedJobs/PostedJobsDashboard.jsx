"use client"

import { useContext, useEffect, useState } from "react"
import { Link } from "react-router-dom"
import { useQuery } from "@tanstack/react-query"
import {
  Briefcase,
  MapPin,
  Calendar,
  Users,
  Clock,
  Search,
  Edit,
  Plus,
  ArrowUpDown,
  Filter,
  Eye,
  CheckCircle,
  AlertCircle,
} from "lucide-react"
import { AuthContext } from "../../../Providers/AuthProvider"
import useAxiosBase from "../../../CustomHooks/useAxiosBase"
import RecruitmentProgressBar from "./RecruitmentProgressBar"

// These would be your actual imports in your project


const PostedJobs = () => {
  const { user } = useContext(AuthContext)
  const axiosBase = useAxiosBase()

  const [searchTerm, setSearchTerm] = useState("")
  const [sortBy, setSortBy] = useState("newest")
  const [filterStatus, setFilterStatus] = useState("all")
  const [applicantCounts, setApplicantCounts] = useState({})
  const [viewMode, setViewMode] = useState("grid") // grid or list

  // Fetch posted jobs by the recruiter
  const {
    data: jobs = [],
    isLoading,
    isError,
    refetch,
  } = useQuery({
    queryKey: ["myPostedJobs", user?.email],
    queryFn: async () => {
      const response = await axiosBase.get(`/jobs/myPostedJobs/${user?.email}`)
      return response.data
    },
    enabled: !!user?.email,
  })

  // Helper to fetch total applicants per job
  const fetchApplicantsCount = async (jobId) => {
    try {
      const res = await axiosBase.get(`/jobs/totalApplicants/${jobId}`)
      return res.data.totalApplicants || 0
    } catch (error) {
      return 0
    }
  }

  // Fetch applicant counts when jobs are loaded
  useEffect(() => {
    const loadCounts = async () => {
      const counts = {}
      for (const job of jobs) {
        const count = await fetchApplicantsCount(job._id)
        counts[job._id] = count
      }
      setApplicantCounts(counts)
    }

    if (jobs.length > 0) {
      loadCounts()
    }
  }, [jobs])

  // Filter by status and search term
  const filteredJobs = jobs.filter((job) => {
    const matchesSearch =
      job.jobTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.jobDescription.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.jobLocation.toLowerCase().includes(searchTerm.toLowerCase())

    if (filterStatus === "all") return matchesSearch

    const daysRemaining = getDaysRemaining(job.deadline)
    if (filterStatus === "active" && daysRemaining !== "Expired") return matchesSearch
    if (filterStatus === "expired" && daysRemaining === "Expired") return matchesSearch

    return false
  })

  // Sort logic
  const sortedJobs = [...filteredJobs].sort((a, b) => {
    if (sortBy === "newest") {
      return new Date(b.createdAt || b.deadline) - new Date(a.createdAt || a.deadline)
    } else if (sortBy === "oldest") {
      return new Date(a.createdAt || a.deadline) - new Date(b.createdAt || b.deadline)
    } else if (sortBy === "salary-high") {
      return Number.parseFloat(b.salary) - Number.parseFloat(a.salary)
    } else if (sortBy === "salary-low") {
      return Number.parseFloat(a.salary) - Number.parseFloat(b.salary)
    } else if (sortBy === "applicants-high") {
      return (applicantCounts[b._id] || 0) - (applicantCounts[a._id] || 0)
    }
    return 0
  })

  // Date formatter
  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  // Deadline countdown
  const getDaysRemaining = (deadline) => {
    const today = new Date()
    const deadlineDate = new Date(deadline)
    const diffTime = deadlineDate - today
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

    if (diffDays < 0) return "Expired"
    if (diffDays === 0) return "Today"
    if (diffDays === 1) return "1 day left"
    return `${diffDays} days left`
  }

  // Get job status color
  const getStatusColor = (deadline) => {
    const status = getDaysRemaining(deadline)
    if (status === "Expired") return "red"
    if (status === "Today" || status === "1 day left") return "amber"
    return "green"
  }

  // Count jobs by status
  const activeJobs = jobs.filter((job) => getDaysRemaining(job.deadline) !== "Expired").length
  const expiredJobs = jobs.length - activeJobs

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh]">
        <div className="relative">
          <div className="w-16 h-16 border-4 border-orange-100 rounded-full animate-spin"></div>
          <div className="absolute top-0 left-0 w-16 h-16 border-t-4 border-orange-500 rounded-full animate-spin"></div>
          <div className="absolute top-1/2 left-1/2 w-3 h-3 bg-orange-500 rounded-full -translate-x-1/2 -translate-y-1/2"></div>
        </div>
        <p className="mt-4 text-orange-600 font-medium">Loading your posted jobs...</p>
      </div>
    )
  }

  if (isError) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="text-center max-w-md mx-auto p-6 bg-white rounded-xl shadow-md">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <AlertCircle className="h-8 w-8 text-red-500" />
          </div>
          <h2 className="text-xl font-bold text-slate-800 mb-2">Failed to Load Jobs</h2>
          <p className="text-slate-600 mb-4">
            We couldn&apos;t load your posted jobs. Please try again later or contact support if the issue persists.
          </p>
          <button
            onClick={() => refetch()}
            className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto">
      {/* Dashboard Header */}
      <div className="mb-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-slate-800 flex items-center">
              <Briefcase className="mr-2 text-orange-600" size={28} />
              Posted Jobs
            </h1>
            <p className="text-slate-500 mt-1">Manage and track all your job postings</p>
          </div>

          <div className="mt-4 md:mt-0">
            <Link to="/post-job">
              <button className="flex items-center px-4 py-2 bg-orange-600 text-white font-medium rounded-md hover:bg-orange-700 transition-colors shadow-sm">
                <Plus size={18} className="mr-2" />
                Post New Job
              </button>
            </Link>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
              <Briefcase size={20} className="text-blue-600" />
            </div>
            <span className="text-xs font-medium text-blue-600 bg-blue-100 px-2 py-1 rounded-full">Total</span>
          </div>
          <h3 className="text-2xl font-bold text-slate-800">{jobs.length}</h3>
          <p className="text-sm text-slate-500">Total Job Postings</p>
        </div>

        <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
              <CheckCircle size={20} className="text-green-600" />
            </div>
            <span className="text-xs font-medium text-green-600 bg-green-100 px-2 py-1 rounded-full">Active</span>
          </div>
          <h3 className="text-2xl font-bold text-slate-800">{activeJobs}</h3>
          <p className="text-sm text-slate-500">Active Jobs</p>
        </div>

        <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center">
              <Clock size={20} className="text-amber-600" />
            </div>
            <span className="text-xs font-medium text-amber-600 bg-amber-100 px-2 py-1 rounded-full">Expired</span>
          </div>
          <h3 className="text-2xl font-bold text-slate-800">{expiredJobs}</h3>
          <p className="text-sm text-slate-500">Expired Jobs</p>
        </div>

        <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center">
              <Users size={20} className="text-purple-600" />
            </div>
            <span className="text-xs font-medium text-purple-600 bg-purple-100 px-2 py-1 rounded-full">Applicants</span>
          </div>
          <h3 className="text-2xl font-bold text-slate-800">
            {Object.values(applicantCounts).reduce((sum, count) => sum + count, 0)}
          </h3>
          <p className="text-sm text-slate-500">Total Applicants</p>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden mb-6">
        <div className="p-4 border-b border-slate-200">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-grow">
              <input
                type="text"
                placeholder="Search jobs by title, description or location..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 w-full border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              />
              <Search className="absolute left-3 top-2.5 h-5 w-5 text-slate-400" />
            </div>

            <div className="flex gap-2">
              <div className="relative">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="pl-10 pr-8 py-2 border border-slate-300 rounded-md appearance-none focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                >
                  <option value="newest">Newest First</option>
                  <option value="oldest">Oldest First</option>
                  <option value="salary-high">Highest Salary</option>
                  <option value="salary-low">Lowest Salary</option>
                  <option value="applicants-high">Most Applicants</option>
                </select>
                <ArrowUpDown className="absolute left-3 top-2.5 h-5 w-5 text-slate-400" />
              </div>

              <div className="relative">
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="pl-10 pr-8 py-2 border border-slate-300 rounded-md appearance-none focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                >
                  <option value="all">All Jobs</option>
                  <option value="active">Active Jobs</option>
                  <option value="expired">Expired Jobs</option>
                </select>
                <Filter className="absolute left-3 top-2.5 h-5 w-5 text-slate-400" />
              </div>

              <div className="flex border border-slate-300 rounded-md overflow-hidden">
                <button
                  onClick={() => setViewMode("grid")}
                  className={`px-3 py-2 ${
                    viewMode === "grid" ? "bg-orange-100 text-orange-600" : "bg-white text-slate-500"
                  }`}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <rect x="3" y="3" width="7" height="7" />
                    <rect x="14" y="3" width="7" height="7" />
                    <rect x="3" y="14" width="7" height="7" />
                    <rect x="14" y="14" width="7" height="7" />
                  </svg>
                </button>
                <button
                  onClick={() => setViewMode("list")}
                  className={`px-3 py-2 ${
                    viewMode === "list" ? "bg-orange-100 text-orange-600" : "bg-white text-slate-500"
                  }`}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <line x1="8" y1="6" x2="21" y2="6" />
                    <line x1="8" y1="12" x2="21" y2="12" />
                    <line x1="8" y1="18" x2="21" y2="18" />
                    <line x1="3" y1="6" x2="3.01" y2="6" />
                    <line x1="3" y1="12" x2="3.01" y2="12" />
                    <line x1="3" y1="18" x2="3.01" y2="18" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="px-4 py-3 bg-slate-50 border-b border-slate-200 flex flex-wrap items-center justify-between">
          <p className="text-sm text-slate-600">
            <span className="font-medium">{filteredJobs.length}</span> job{filteredJobs.length !== 1 && "s"} found
          </p>
          <div className="flex items-center text-sm">
            <span className="text-slate-500">Quick actions:</span>
            <Link to="/post-job" className="ml-3 text-orange-600 hover:text-orange-700 font-medium">
              Post New Job
            </Link>
            <Link to="/dashboard/statistics" className="ml-3 text-orange-600 hover:text-orange-700 font-medium">
              View Analytics
            </Link>
          </div>
        </div>
      </div>

      {/* Job List */}
      {jobs.length > 0 ? (
        viewMode === "grid" ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {sortedJobs.map((job) => {
              const daysRemaining = getDaysRemaining(job.deadline)
              const isExpired = daysRemaining === "Expired"
              const statusColor = getStatusColor(job.deadline)
              const totalApplicants = applicantCounts[job._id] || 0

              return (
                <div
                  key={job._id}
                  className={`bg-white border rounded-xl overflow-hidden hover:shadow-md transition-shadow duration-300 ${
                    isExpired ? "border-red-200" : "border-slate-200"
                  }`}
                >
                  <div
                    className={`h-2 ${
                      statusColor === "red" ? "bg-red-500" : statusColor === "amber" ? "bg-amber-500" : "bg-green-500"
                    }`}
                  ></div>
                  <div className="p-6">
                    <div className="flex justify-between items-start mb-4">
                      <h2 className="text-xl font-bold text-slate-800 line-clamp-2">{job.jobTitle}</h2>
                      <span
                        className={`px-3 py-1 text-xs font-medium rounded-full ${
                          statusColor === "red"
                            ? "bg-red-100 text-red-800"
                            : statusColor === "amber"
                              ? "bg-amber-100 text-amber-800"
                              : "bg-green-100 text-green-800"
                        }`}
                      >
                        {daysRemaining}
                      </span>
                    </div>

                    <p className="text-slate-600 mb-4 line-clamp-2">{job.jobDescription}</p>

                    <div className="space-y-2 mb-4">
                      <div className="flex items-center text-slate-600">
                        <MapPin className="h-4 w-4 mr-2 text-slate-500" />
                        <span>{job.jobLocation || "Remote"}</span>
                      </div>
                      <div className="flex items-center text-slate-600">
                        <Users className="h-4 w-4 mr-2 text-slate-500" />
                        <span>Vacancy: {job.vacancy}</span>
                      </div>
                      <div className="flex items-center text-slate-600">
                        <Calendar className="h-4 w-4 mr-2 text-slate-500" />
                        <span>Deadline: {formatDate(job.deadline)}</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                      <div className="text-lg font-semibold text-green-600">
                        ৳ {job.salary}
                        <span className="text-sm font-normal text-slate-600 ml-1">/ Month</span>
                      </div>
                      <div className="flex items-center text-slate-500 text-sm">
                        <Users className="h-4 w-4 mr-1" />
                        <span>
                          {totalApplicants} applicant{totalApplicants !== 1 && "s"}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <RecruitmentProgressBar stages={job?.recruitmentStages} completedStages={job?.completedStages} />
                  </div>

                  <div className="bg-slate-50 px-6 py-3 flex justify-between">
                    <Link to={`/seeApplicants/${job._id}`}>
                      <button className="flex items-center text-blue-600 hover:text-blue-800 font-medium text-sm">
                        <Users className="h-4 w-4 mr-1" />
                        Applicants
                      </button>
                    </Link>
                    <Link to={`/jobDetailsAndEdit/${job._id}`}>
                      <button className="flex items-center text-green-600 hover:text-green-800 font-medium text-sm">
                        <Edit className="h-4 w-4 mr-1" />
                        Edit
                      </button>
                    </Link>
                  </div>
                </div>
              )
            })}
          </div>
        ) : (
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200">
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                      Job Title
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                      Location
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                      Salary
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                      Deadline
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                      Applicants
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-slate-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {sortedJobs.map((job) => {
                    const daysRemaining = getDaysRemaining(job.deadline)
                    const isExpired = daysRemaining === "Expired"
                    const statusColor = getStatusColor(job.deadline)
                    const totalApplicants = applicantCounts[job._id] || 0

                    return (
                      <tr key={job._id} className="hover:bg-slate-50 transition-colors">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div
                              className={`w-2 h-2 rounded-full mr-2 ${
                                statusColor === "red"
                                  ? "bg-red-500"
                                  : statusColor === "amber"
                                    ? "bg-amber-500"
                                    : "bg-green-500"
                              }`}
                            ></div>
                            <div className="font-medium text-slate-800">{job.jobTitle}</div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center text-slate-600">
                            <MapPin size={14} className="mr-1 text-slate-400" />
                            <span>{job.jobLocation || "Remote"}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-green-600 font-medium">৳ {job.salary}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-slate-600">{formatDate(job.deadline)}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <Users size={14} className="text-slate-400 mr-1" />
                            <span>{totalApplicants}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span
                            className={`px-2 py-1 text-xs font-medium rounded-full ${
                              statusColor === "red"
                                ? "bg-red-100 text-red-800"
                                : statusColor === "amber"
                                  ? "bg-amber-100 text-amber-800"
                                  : "bg-green-100 text-green-800"
                            }`}
                          >
                            {daysRemaining}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right">
                          <div className="flex items-center justify-end space-x-2">
                            <Link to={`/seeApplicants/${job._id}`}>
                              <button className="p-1 text-blue-600 hover:text-blue-800 rounded-full hover:bg-blue-50">
                                <Users size={16} />
                              </button>
                            </Link>
                            <Link to={`/jobDetailsAndEdit/${job._id}`}>
                              <button className="p-1 text-green-600 hover:text-green-800 rounded-full hover:bg-green-50">
                                <Edit size={16} />
                              </button>
                            </Link>
                            <button className="p-1 text-slate-600 hover:text-slate-800 rounded-full hover:bg-slate-50">
                              <Eye size={16} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )
      ) : (
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="text-center py-16">
            <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Briefcase className="h-8 w-8 text-slate-400" />
            </div>
            <h3 className="text-lg font-medium text-slate-800 mb-1">No jobs posted yet</h3>
            <p className="text-slate-600 max-w-md mx-auto">
              You haven&apos;t posted any jobs yet. Create your first job posting to start receiving applications.
            </p>
            <Link to="/post-job">
              <button className="mt-6 px-5 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors">
                Post Your First Job
              </button>
            </Link>
          </div>
        </div>
      )}
    </div>
  )
}

export default PostedJobs
