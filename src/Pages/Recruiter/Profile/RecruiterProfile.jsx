"use client"

import { useQuery } from "@tanstack/react-query"
import { useContext } from "react"
import { Link } from "react-router-dom"
import { AuthContext } from "../../../Providers/AuthProvider"
import useAxiosBase from "../../../CustomHooks/useAxiosBase"
import {
  Mail,
  Globe,
  MapPin,
  Phone,
  Briefcase,
  Building,
  Edit2,
  Users,
  FileText,
  Clock,
  CheckCircle,
  Calendar,
  TrendingUp,
  BarChart2,
  ChevronRight,
} from "lucide-react"

const RecruiterProfile = () => {
  const { user } = useContext(AuthContext)
  const axiosBase = useAxiosBase()

  const { data: recruiter = null, isLoading } = useQuery({
    queryKey: ["recruiter", user?.email],
    queryFn: async () => {
      const response = await axiosBase.get(`/user-by-email/${user?.email}`)
      return response.data
    },
  })

  // Mock data for statistics and recent activity
  const stats = {
    jobsPosted: 12,
    activeJobs: 5,
    totalApplications: 87,
    hiringRate: 68,
  }

  const recentActivity = [
    {
      id: 1,
      action: "Posted a new job",
      position: "Senior Frontend Developer",
      date: "2 days ago",
    },
    {
      id: 2,
      action: "Scheduled an interview",
      position: "UX Designer",
      date: "3 days ago",
    },
    {
      id: 3,
      action: "Reviewed applications",
      position: "Full Stack Developer",
      date: "1 week ago",
    },
  ]

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh]">
        <div className="relative">
          <div className="w-16 h-16 border-4 border-orange-100 rounded-full animate-spin"></div>
          <div className="absolute top-0 left-0 w-16 h-16 border-t-4 border-orange-500 rounded-full animate-spin"></div>
          <div className="absolute top-1/2 left-1/2 w-3 h-3 bg-orange-500 rounded-full -translate-x-1/2 -translate-y-1/2"></div>
        </div>
        <p className="mt-4 text-orange-600 font-medium">Loading your profile...</p>
      </div>
    )
  }

  return (
    <div className="max-w-5xl mx-auto">
      {/* Header Section */}
      <div className="relative bg-gradient-to-r from-orange-500 to-orange-600 rounded-xl overflow-hidden shadow-md mb-6">
        <div className="absolute top-4 right-4">
          <Link to="/dashboard/recruiterProfileEdit">
            <button className="group flex items-center gap-1.5 rounded-full bg-white px-3 py-1.5 text-sm font-medium text-orange-600 shadow-sm transition-all hover:bg-orange-50">
              <Edit2 size={14} className="text-orange-500 group-hover:text-orange-600" />
              <span>Edit Profile</span>
            </button>
          </Link>
        </div>

        <div className="px-8 py-10 flex flex-col md:flex-row items-center md:items-start gap-6">
          <div className="relative">
            <div className="w-28 h-28 rounded-full border-4 border-white shadow-md overflow-hidden bg-white">
              {user?.photoURL ? (
                <img
                  src={user.photoURL || "/placeholder.svg"}
                  alt={`${recruiter?.name || "Recruiter"} Logo`}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-orange-100">
                  <Building size={40} className="text-orange-500" />
                </div>
              )}
            </div>
          </div>

          <div className="text-center md:text-left text-white">
            <h1 className="text-2xl md:text-3xl font-bold">{recruiter?.name || "Recruiter Name"}</h1>
            <p className="text-orange-100 text-lg mt-1">{recruiter?.position || "Position"}</p>
            <p className="text-orange-100 flex items-center justify-center md:justify-start mt-2">
              <Building size={16} className="mr-1.5" />
              {recruiter?.companyName || "Company Name"}
            </p>
            <div className="mt-4 flex flex-wrap gap-2 justify-center md:justify-start">
              <span className="px-3 py-1 bg-white bg-opacity-20 rounded-full text-sm backdrop-blur-sm">
                {recruiter?.industry || "Technology"}
              </span>
              <span className="px-3 py-1 bg-white bg-opacity-20 rounded-full text-sm backdrop-blur-sm">
                {recruiter?.location || "Location"}
              </span>
              <span className="px-3 py-1 bg-white bg-opacity-20 rounded-full text-sm backdrop-blur-sm">
                <CheckCircle size={14} className="inline mr-1" />
                Verified Recruiter
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column */}
        <div className="lg:col-span-2 space-y-6">
          {/* About Section */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-200">
              <h2 className="font-semibold text-slate-800">About {recruiter?.companyName || "Company"}</h2>
            </div>
            <div className="p-6">
              <p className="text-slate-600 leading-relaxed">
                {recruiter?.about ||
                  `We are a leading technology company focused on creating innovative solutions for businesses worldwide. 
                  Our team of talented professionals is dedicated to delivering high-quality products and exceptional service.`}
              </p>

              {/* Company Details */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4 mt-6">
                <div className="flex items-start">
                  <Mail className="w-5 h-5 text-orange-500 mt-0.5 mr-3 flex-shrink-0" />
                  <div>
                    <p className="text-xs text-slate-500 mb-1">Email</p>
                    <a
                      href={`mailto:${recruiter?.email}`}
                      className="text-slate-700 hover:text-orange-600 transition-colors"
                    >
                      {recruiter?.email}
                    </a>
                  </div>
                </div>

                <div className="flex items-start">
                  <Globe className="w-5 h-5 text-orange-500 mt-0.5 mr-3 flex-shrink-0" />
                  <div>
                    <p className="text-xs text-slate-500 mb-1">Website</p>
                    <a
                      href={recruiter?.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-slate-700 hover:text-orange-600 transition-colors"
                    >
                      {recruiter?.website || "company-website.com"}
                    </a>
                  </div>
                </div>

                <div className="flex items-start">
                  <MapPin className="w-5 h-5 text-orange-500 mt-0.5 mr-3 flex-shrink-0" />
                  <div>
                    <p className="text-xs text-slate-500 mb-1">Location</p>
                    <p className="text-slate-700">{recruiter?.location || "San Francisco, CA"}</p>
                  </div>
                </div>

                <div className="flex items-start">
                  <Phone className="w-5 h-5 text-orange-500 mt-0.5 mr-3 flex-shrink-0" />
                  <div>
                    <p className="text-xs text-slate-500 mb-1">Contact</p>
                    <p className="text-slate-700">{recruiter?.phone || "+1 (555) 123-4567"}</p>
                  </div>
                </div>

                <div className="flex items-start">
                  <Briefcase className="w-5 h-5 text-orange-500 mt-0.5 mr-3 flex-shrink-0" />
                  <div>
                    <p className="text-xs text-slate-500 mb-1">Industry</p>
                    <p className="text-slate-700">{recruiter?.industry || "Technology"}</p>
                  </div>
                </div>

                <div className="flex items-start">
                  <Users className="w-5 h-5 text-orange-500 mt-0.5 mr-3 flex-shrink-0" />
                  <div>
                    <p className="text-xs text-slate-500 mb-1">Company Size</p>
                    <p className="text-slate-700">{recruiter?.companySize || "51-200 employees"}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Recent Activity */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-200">
              <h2 className="font-semibold text-slate-800">Recent Activity</h2>
            </div>
            <div className="divide-y divide-slate-100">
              {recentActivity.map((activity) => (
                <div key={activity.id} className="px-6 py-4 hover:bg-slate-50 transition-colors">
                  <div className="flex items-start">
                    <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center mr-3 mt-0.5">
                      {activity.action.includes("Posted") ? (
                        <FileText size={18} className="text-orange-600" />
                      ) : activity.action.includes("Scheduled") ? (
                        <Calendar size={18} className="text-orange-600" />
                      ) : (
                        <Users size={18} className="text-orange-600" />
                      )}
                    </div>
                    <div>
                      <p className="text-slate-800 font-medium">{activity.action}</p>
                      <p className="text-slate-600 text-sm mt-0.5">{activity.position}</p>
                      <p className="text-xs text-slate-500 mt-1 flex items-center">
                        <Clock size={12} className="mr-1" />
                        {activity.date}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          {/* Stats Cards */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-200">
              <h2 className="font-semibold text-slate-800">Recruitment Stats</h2>
            </div>
            <div className="p-6 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center mr-3">
                    <Briefcase size={18} className="text-blue-600" />
                  </div>
                  <span className="text-slate-700">Jobs Posted</span>
                </div>
                <span className="text-xl font-bold text-slate-800">{stats.jobsPosted}</span>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center mr-3">
                    <CheckCircle size={18} className="text-green-600" />
                  </div>
                  <span className="text-slate-700">Active Jobs</span>
                </div>
                <span className="text-xl font-bold text-slate-800">{stats.activeJobs}</span>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center mr-3">
                    <Users size={18} className="text-purple-600" />
                  </div>
                  <span className="text-slate-700">Applications</span>
                </div>
                <span className="text-xl font-bold text-slate-800">{stats.totalApplications}</span>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center mr-3">
                    <TrendingUp size={18} className="text-amber-600" />
                  </div>
                  <span className="text-slate-700">Hiring Rate</span>
                </div>
                <span className="text-xl font-bold text-slate-800">{stats.hiringRate}%</span>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-200">
              <h2 className="font-semibold text-slate-800">Quick Actions</h2>
            </div>
            <div className="p-6 space-y-3">
              <Link to="/dashboard/postedJobs">
                <button className="w-full flex items-center justify-between p-3 rounded-lg border border-slate-200 hover:bg-orange-50 hover:border-orange-200 transition-colors group">
                  <div className="flex items-center">
                    <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center mr-3">
                      <Briefcase size={18} className="text-orange-600" />
                    </div>
                    <span className="font-medium text-slate-700 group-hover:text-orange-600 transition-colors">
                      Manage Job Postings
                    </span>
                  </div>
                  <ChevronRight size={18} className="text-slate-400 group-hover:text-orange-500" />
                </button>
              </Link>

              <Link to="/dashboard/interviews">
                <button className="w-full flex items-center justify-between p-3 rounded-lg border border-slate-200 hover:bg-orange-50 hover:border-orange-200 transition-colors group">
                  <div className="flex items-center">
                    <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center mr-3">
                      <Calendar size={18} className="text-orange-600" />
                    </div>
                    <span className="font-medium text-slate-700 group-hover:text-orange-600 transition-colors">
                      Interview Schedule
                    </span>
                  </div>
                  <ChevronRight size={18} className="text-slate-400 group-hover:text-orange-500" />
                </button>
              </Link>

              <Link to="/dashboard/statistics">
                <button className="w-full flex items-center justify-between p-3 rounded-lg border border-slate-200 hover:bg-orange-50 hover:border-orange-200 transition-colors group">
                  <div className="flex items-center">
                    <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center mr-3">
                      <BarChart2 size={18} className="text-orange-600" />
                    </div>
                    <span className="font-medium text-slate-700 group-hover:text-orange-600 transition-colors">
                      View Analytics
                    </span>
                  </div>
                  <ChevronRight size={18} className="text-slate-400 group-hover:text-orange-500" />
                </button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default RecruiterProfile
