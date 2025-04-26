"use client";

import { useState } from "react";
import { Link } from "react-router-dom";
import {
  User,
  Briefcase,
  Calendar,
  CheckCircle,
  Clock,
  TrendingUp,
  FileText,
  Users,
  Search,
  ChevronRight,
  Eye,
  MessageSquare,
  BarChart2,
  Bookmark,
  Plus,
  MapPin,
} from "lucide-react";

// These would be your actual imports in your project
import useUserRole from "../CustomHooks/useUserRole";
import useAxiosBase from "../CustomHooks/useAxiosBase";
import { useQuery } from "@tanstack/react-query";
import { useContext } from "react";
import { AuthContext } from "../Providers/AuthProvider";

export default function DashboardHome() {
  const { userRole } = useUserRole();
  const { user } = useContext(AuthContext);
  const axiosBase = useAxiosBase();
  const [activeTab, setActiveTab] = useState("overview");

  // Fetch user data
  const { data: userInfo = null, isLoading } = useQuery({
    queryKey: ["user", user?.email],
    queryFn: async () => {
      const response = await axiosBase.get(`/user-by-email/${user?.email}`);
      return response.data;
    },
  });

  // Mock data for demonstration
  const jobSeekerStats = {
    profileCompletion: 85,
    applicationsSubmitted: 12,
    interviewsScheduled: 3,
    savedJobs: 8,
  };

  const recruiterStats = {
    activeJobs: 5,
    totalApplications: 47,
    interviewsScheduled: 8,
    hiringRate: 72,
  };

  const recentActivity = [
    {
      id: 1,
      type: "application",
      title: "Applied to Senior Developer position at TechCorp",
      time: "2 days ago",
      icon: <Briefcase size={16} className="text-blue-500" />,
    },
    {
      id: 2,
      type: "profile",
      title: "Updated your experience information",
      time: "4 days ago",
      icon: <FileText size={16} className="text-green-500" />,
    },
    {
      id: 3,
      type: "interview",
      title: "Interview scheduled with InnovateTech",
      time: "1 week ago",
      icon: <Calendar size={16} className="text-purple-500" />,
    },
  ];

  const recommendedJobs = [
    {
      id: 1,
      title: "Senior Frontend Developer",
      company: "TechCorp",
      location: "San Francisco, CA",
      salary: "$120k - $150k",
      match: 95,
      posted: "2 days ago",
      logo: "/abstract-tc.png",
    },
    {
      id: 2,
      title: "Full Stack Engineer",
      company: "InnovateTech",
      location: "Remote",
      salary: "$100k - $130k",
      match: 88,
      posted: "1 week ago",
      logo: "/abstract-it-network.png",
    },
    {
      id: 3,
      title: "UI/UX Designer",
      company: "DesignHub",
      location: "New York, NY",
      salary: "$90k - $110k",
      match: 82,
      posted: "3 days ago",
      logo: "/intertwined-letters.png",
    },
  ];

  const recruiterJobs = [
    {
      id: 1,
      title: "Senior Frontend Developer",
      applications: 18,
      views: 245,
      status: "Active",
      posted: "2 days ago",
    },
    {
      id: 2,
      title: "Full Stack Engineer",
      applications: 24,
      views: 312,
      status: "Active",
      posted: "1 week ago",
    },
    {
      id: 3,
      title: "UI/UX Designer",
      applications: 5,
      views: 87,
      status: "Active",
      posted: "3 days ago",
    },
  ];

  const upcomingInterviews = [
    {
      id: 1,
      candidate: "John Smith",
      position: "Senior Frontend Developer",
      date: "Tomorrow, 10:00 AM",
      type: "Video Call",
    },
    {
      id: 2,
      candidate: "Sarah Johnson",
      position: "Full Stack Engineer",
      date: "May 15, 2:30 PM",
      type: "In-person",
    },
  ];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="relative">
          <div className="w-16 h-16 border-4 border-orange-100 rounded-full animate-spin"></div>
          <div className="absolute top-0 left-0 w-16 h-16 border-t-4 border-orange-500 rounded-full animate-spin"></div>
          <div className="absolute top-1/2 left-1/2 w-3 h-3 bg-orange-500 rounded-full -translate-x-1/2 -translate-y-1/2"></div>
        </div>
        <p className="ml-4 text-orange-600 font-medium">
          Loading your dashboard...
        </p>
      </div>
    );
  }

  // Calculate profile completion percentage
  const calculateProfileCompletion = () => {
    let completed = 0;
    const total = 3; // Basic info, education, experience

    if (userInfo?.name && userInfo?.email) completed++;
    if (userInfo?.education && userInfo.education.length > 0) completed++;
    if (userInfo?.experience && userInfo.experience.length > 0) completed++;

    return Math.round((completed / total) * 100);
  };

  const profileCompletion = calculateProfileCompletion();

  return (
    <div className="max-w-7xl mx-auto">
      {/* Welcome Section */}
      <div className="mb-8">
        <div className="bg-gradient-to-r from-orange-500 to-orange-600 rounded-xl p-6 text-white shadow-md">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-2xl font-bold">
                Welcome back, {userInfo?.name || "User"}!
              </h1>
              <p className="mt-1 text-orange-100">
                {userRole === "user"
                  ? "Here's an overview of your job search progress"
                  : "Here's an overview of your recruitment activities"}
              </p>
            </div>
            <div className="mt-4 md:mt-0">
              {userRole === "user" ? (
                <Link
                  to="/dashboard/personalInfo"
                  className="inline-flex items-center px-4 py-2 bg-white text-orange-600 rounded-lg font-medium hover:bg-orange-50 transition-colors"
                >
                  <User size={18} className="mr-2" />
                  Complete Your Profile
                </Link>
              ) : (
                <Link
                  to="/dashboard/postedJobs"
                  className="inline-flex items-center px-4 py-2 bg-white text-orange-600 rounded-lg font-medium hover:bg-orange-50 transition-colors"
                >
                  <Plus size={18} className="mr-2" />
                  Post New Job
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Dashboard Tabs */}
      <div className="mb-6">
        <div className="border-b border-slate-200">
          <nav className="flex space-x-8">
            <button
              onClick={() => setActiveTab("overview")}
              className={`py-4 px-1 inline-flex items-center border-b-2 font-medium text-sm ${
                activeTab === "overview"
                  ? "border-orange-500 text-orange-600"
                  : "border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300"
              }`}
            >
              <BarChart2 size={18} className="mr-2" />
              Overview
            </button>
            {userRole === "user" ? (
              <>
                <button
                  onClick={() => setActiveTab("jobs")}
                  className={`py-4 px-1 inline-flex items-center border-b-2 font-medium text-sm ${
                    activeTab === "jobs"
                      ? "border-orange-500 text-orange-600"
                      : "border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300"
                  }`}
                >
                  <Briefcase size={18} className="mr-2" />
                  Recommended Jobs
                </button>
                <button
                  onClick={() => setActiveTab("applications")}
                  className={`py-4 px-1 inline-flex items-center border-b-2 font-medium text-sm ${
                    activeTab === "applications"
                      ? "border-orange-500 text-orange-600"
                      : "border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300"
                  }`}
                >
                  <FileText size={18} className="mr-2" />
                  My Applications
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={() => setActiveTab("jobs")}
                  className={`py-4 px-1 inline-flex items-center border-b-2 font-medium text-sm ${
                    activeTab === "jobs"
                      ? "border-orange-500 text-orange-600"
                      : "border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300"
                  }`}
                >
                  <Briefcase size={18} className="mr-2" />
                  Posted Jobs
                </button>
                <button
                  onClick={() => setActiveTab("candidates")}
                  className={`py-4 px-1 inline-flex items-center border-b-2 font-medium text-sm ${
                    activeTab === "candidates"
                      ? "border-orange-500 text-orange-600"
                      : "border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300"
                  }`}
                >
                  <Users size={18} className="mr-2" />
                  Candidates
                </button>
              </>
            )}
          </nav>
        </div>
      </div>

      {/* Main Dashboard Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column */}
        <div className="lg:col-span-2 space-y-6">
          {/* Stats Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {userRole === "user" ? (
              <>
                <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-sm">
                  <div className="flex items-center justify-between mb-2">
                    <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                      <User size={20} className="text-blue-600" />
                    </div>
                    <span className="text-xs font-medium text-blue-600 bg-blue-100 px-2 py-1 rounded-full">
                      Profile
                    </span>
                  </div>
                  <h3 className="text-2xl font-bold text-slate-800">
                    {profileCompletion}%
                  </h3>
                  <p className="text-sm text-slate-500">Profile Completion</p>
                </div>

                <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-sm">
                  <div className="flex items-center justify-between mb-2">
                    <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
                      <FileText size={20} className="text-green-600" />
                    </div>
                    <span className="text-xs font-medium text-green-600 bg-green-100 px-2 py-1 rounded-full">
                      Applications
                    </span>
                  </div>
                  <h3 className="text-2xl font-bold text-slate-800">
                    {jobSeekerStats.applicationsSubmitted}
                  </h3>
                  <p className="text-sm text-slate-500">Applications Sent</p>
                </div>

                <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-sm">
                  <div className="flex items-center justify-between mb-2">
                    <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center">
                      <Calendar size={20} className="text-purple-600" />
                    </div>
                    <span className="text-xs font-medium text-purple-600 bg-purple-100 px-2 py-1 rounded-full">
                      Interviews
                    </span>
                  </div>
                  <h3 className="text-2xl font-bold text-slate-800">
                    {jobSeekerStats.interviewsScheduled}
                  </h3>
                  <p className="text-sm text-slate-500">Interviews Scheduled</p>
                </div>

                <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-sm">
                  <div className="flex items-center justify-between mb-2">
                    <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center">
                      <Bookmark size={20} className="text-amber-600" />
                    </div>
                    <span className="text-xs font-medium text-amber-600 bg-amber-100 px-2 py-1 rounded-full">
                      Saved
                    </span>
                  </div>
                  <h3 className="text-2xl font-bold text-slate-800">
                    {jobSeekerStats.savedJobs}
                  </h3>
                  <p className="text-sm text-slate-500">Saved Jobs</p>
                </div>
              </>
            ) : (
              <>
                <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-sm">
                  <div className="flex items-center justify-between mb-2">
                    <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                      <Briefcase size={20} className="text-blue-600" />
                    </div>
                    <span className="text-xs font-medium text-blue-600 bg-blue-100 px-2 py-1 rounded-full">
                      Jobs
                    </span>
                  </div>
                  <h3 className="text-2xl font-bold text-slate-800">
                    {recruiterStats.activeJobs}
                  </h3>
                  <p className="text-sm text-slate-500">Active Job Postings</p>
                </div>

                <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-sm">
                  <div className="flex items-center justify-between mb-2">
                    <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
                      <Users size={20} className="text-green-600" />
                    </div>
                    <span className="text-xs font-medium text-green-600 bg-green-100 px-2 py-1 rounded-full">
                      Applications
                    </span>
                  </div>
                  <h3 className="text-2xl font-bold text-slate-800">
                    {recruiterStats.totalApplications}
                  </h3>
                  <p className="text-sm text-slate-500">Total Applications</p>
                </div>

                <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-sm">
                  <div className="flex items-center justify-between mb-2">
                    <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center">
                      <Calendar size={20} className="text-purple-600" />
                    </div>
                    <span className="text-xs font-medium text-purple-600 bg-purple-100 px-2 py-1 rounded-full">
                      Interviews
                    </span>
                  </div>
                  <h3 className="text-2xl font-bold text-slate-800">
                    {recruiterStats.interviewsScheduled}
                  </h3>
                  <p className="text-sm text-slate-500">Interviews Scheduled</p>
                </div>

                <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-sm">
                  <div className="flex items-center justify-between mb-2">
                    <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center">
                      <TrendingUp size={20} className="text-amber-600" />
                    </div>
                    <span className="text-xs font-medium text-amber-600 bg-amber-100 px-2 py-1 rounded-full">
                      Rate
                    </span>
                  </div>
                  <h3 className="text-2xl font-bold text-slate-800">
                    {recruiterStats.hiringRate}%
                  </h3>
                  <p className="text-sm text-slate-500">Hiring Rate</p>
                </div>
              </>
            )}
          </div>

          {/* Main Content Based on Active Tab */}
          {activeTab === "overview" && (
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
              <div className="px-6 py-4 border-b border-slate-200">
                <h2 className="font-semibold text-slate-800">
                  Recent Activity
                </h2>
              </div>
              <div className="divide-y divide-slate-100">
                {recentActivity.map((activity) => (
                  <div
                    key={activity.id}
                    className="px-6 py-4 hover:bg-slate-50 transition-colors"
                  >
                    <div className="flex items-start">
                      <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center mr-3 mt-0.5">
                        {activity.icon}
                      </div>
                      <div>
                        <p className="text-slate-800">{activity.title}</p>
                        <p className="text-xs text-slate-500 mt-1">
                          {activity.time}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
                {recentActivity.length === 0 && (
                  <div className="px-6 py-8 text-center">
                    <p className="text-slate-500">
                      No recent activity to display
                    </p>
                  </div>
                )}
              </div>
              <div className="px-6 py-3 bg-slate-50 border-t border-slate-200">
                <Link
                  to="#"
                  className="text-sm text-orange-600 hover:text-orange-700 font-medium flex items-center justify-center"
                >
                  View All Activity
                  <ChevronRight size={16} className="ml-1" />
                </Link>
              </div>
            </div>
          )}

          {activeTab === "jobs" &&
            (userRole === "user" ? (
              <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                <div className="px-6 py-4 border-b border-slate-200 flex justify-between items-center">
                  <h2 className="font-semibold text-slate-800">
                    Recommended Jobs
                  </h2>
                  <div className="relative">
                    <Search
                      className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400"
                      size={16}
                    />
                    <input
                      type="text"
                      placeholder="Search jobs..."
                      className="pl-9 pr-4 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    />
                  </div>
                </div>
                <div className="divide-y divide-slate-100">
                  {recommendedJobs.map((job) => (
                    <div
                      key={job.id}
                      className="px-6 py-4 hover:bg-slate-50 transition-colors"
                    >
                      <div className="flex items-start">
                        <img
                          src={job.logo || "/placeholder.svg"}
                          alt={job.company}
                          className="w-10 h-10 rounded-md object-cover mr-4 mt-1"
                        />
                        <div className="flex-grow">
                          <div className="flex justify-between">
                            <h3 className="font-medium text-slate-800">
                              {job.title}
                            </h3>
                            <span className="text-sm font-medium text-orange-600 bg-orange-50 px-2 py-0.5 rounded-full">
                              {job.match}% Match
                            </span>
                          </div>
                          <p className="text-slate-600 text-sm mt-1">
                            {job.company}
                          </p>
                          <div className="flex items-center text-xs text-slate-500 mt-2">
                            <MapPin size={14} className="mr-1" />
                            <span>{job.location}</span>
                            <span className="mx-2">•</span>
                            <span>{job.salary}</span>
                            <span className="mx-2">•</span>
                            <span>{job.posted}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="px-6 py-3 bg-slate-50 border-t border-slate-200">
                  <Link
                    to="#"
                    className="text-sm text-orange-600 hover:text-orange-700 font-medium flex items-center justify-center"
                  >
                    View All Recommended Jobs
                    <ChevronRight size={16} className="ml-1" />
                  </Link>
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                <div className="px-6 py-4 border-b border-slate-200 flex justify-between items-center">
                  <h2 className="font-semibold text-slate-800">
                    Your Job Postings
                  </h2>
                  <Link
                    to="#"
                    className="text-sm text-orange-600 hover:text-orange-700 font-medium flex items-center"
                  >
                    <Plus size={16} className="mr-1" />
                    Post New Job
                  </Link>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="bg-slate-50">
                        <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                          Job Title
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                          Applications
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                          Views
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                          Status
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                          Posted
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200">
                      {recruiterJobs.map((job) => (
                        <tr
                          key={job.id}
                          className="hover:bg-slate-50 transition-colors"
                        >
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="font-medium text-slate-800">
                              {job.title}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <Users
                                size={14}
                                className="text-slate-400 mr-1"
                              />
                              <span>{job.applications}</span>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <Eye size={14} className="text-slate-400 mr-1" />
                              <span>{job.views}</span>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className="px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800">
                              {job.status}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-slate-500 text-sm">
                            {job.posted}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            ))}

          {activeTab === "applications" && userRole === "user" && (
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
              <div className="px-6 py-4 border-b border-slate-200">
                <h2 className="font-semibold text-slate-800">
                  Your Applications
                </h2>
              </div>
              <div className="p-6 text-center">
                <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <FileText size={24} className="text-slate-400" />
                </div>
                <h3 className="text-lg font-medium text-slate-800 mb-2">
                  No applications yet
                </h3>
                <p className="text-slate-500 mb-6">
                  Start applying to jobs to see your applications here
                </p>
                <Link
                  to="#"
                  className="inline-flex items-center px-4 py-2 bg-orange-600 text-white rounded-lg font-medium hover:bg-orange-700 transition-colors"
                >
                  <Search size={18} className="mr-2" />
                  Browse Jobs
                </Link>
              </div>
            </div>
          )}

          {activeTab === "candidates" && userRole === "recruiter" && (
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
              <div className="px-6 py-4 border-b border-slate-200">
                <h2 className="font-semibold text-slate-800">
                  Upcoming Interviews
                </h2>
              </div>
              <div className="divide-y divide-slate-100">
                {upcomingInterviews.map((interview) => (
                  <div
                    key={interview.id}
                    className="px-6 py-4 hover:bg-slate-50 transition-colors"
                  >
                    <div className="flex items-start">
                      <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center mr-3 mt-0.5">
                        <User size={20} className="text-slate-600" />
                      </div>
                      <div className="flex-grow">
                        <div className="flex justify-between">
                          <h3 className="font-medium text-slate-800">
                            {interview.candidate}
                          </h3>
                          <span className="text-sm text-slate-500">
                            {interview.date}
                          </span>
                        </div>
                        <p className="text-slate-600 text-sm mt-1">
                          {interview.position}
                        </p>
                        <div className="flex items-center text-xs text-slate-500 mt-2">
                          <span className="px-2 py-0.5 bg-blue-100 text-blue-700 rounded-full">
                            {interview.type}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="px-6 py-3 bg-slate-50 border-t border-slate-200">
                <Link
                  to="#"
                  className="text-sm text-orange-600 hover:text-orange-700 font-medium flex items-center justify-center"
                >
                  View All Interviews
                  <ChevronRight size={16} className="ml-1" />
                </Link>
              </div>
            </div>
          )}
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          {/* Profile Completion Card */}
          {userRole === "user" && (
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
              <div className="px-6 py-4 border-b border-slate-200">
                <h2 className="font-semibold text-slate-800">
                  Complete Your Profile
                </h2>
              </div>
              <div className="px-6 py-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-slate-600">
                    Profile Completion
                  </span>
                  <span className="text-sm font-medium text-slate-800">
                    {profileCompletion}%
                  </span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-2.5">
                  <div
                    className="bg-orange-500 h-2.5 rounded-full"
                    style={{ width: `${profileCompletion}%` }}
                  ></div>
                </div>
                <p className="text-xs text-slate-500 mt-2">
                  Complete your profile to increase your chances of getting
                  hired
                </p>
              </div>
              <div className="px-6 py-4 border-t border-slate-100">
                <ul className="space-y-3">
                  <li className="flex items-center">
                    {userInfo?.name ? (
                      <CheckCircle size={16} className="text-green-500 mr-2" />
                    ) : (
                      <Clock size={16} className="text-orange-500 mr-2" />
                    )}
                    <span
                      className={`text-sm ${userInfo?.name ? "text-slate-500" : "text-slate-800 font-medium"}`}
                    >
                      Basic Information
                    </span>
                    {!userInfo?.name && (
                      <Link
                        to="/dashboard/personalInfo"
                        className="ml-auto text-xs text-orange-600 hover:text-orange-700"
                      >
                        Complete
                      </Link>
                    )}
                  </li>
                  <li className="flex items-center">
                    {userInfo?.education && userInfo.education.length > 0 ? (
                      <CheckCircle size={16} className="text-green-500 mr-2" />
                    ) : (
                      <Clock size={16} className="text-orange-500 mr-2" />
                    )}
                    <span
                      className={`text-sm ${
                        userInfo?.education && userInfo.education.length > 0
                          ? "text-slate-500"
                          : "text-slate-800 font-medium"
                      }`}
                    >
                      Education History
                    </span>
                    {(!userInfo?.education ||
                      userInfo.education.length === 0) && (
                      <Link
                        to="/dashboard/education"
                        className="ml-auto text-xs text-orange-600 hover:text-orange-700"
                      >
                        Complete
                      </Link>
                    )}
                  </li>
                  <li className="flex items-center">
                    {userInfo?.experience && userInfo.experience.length > 0 ? (
                      <CheckCircle size={16} className="text-green-500 mr-2" />
                    ) : (
                      <Clock size={16} className="text-orange-500 mr-2" />
                    )}
                    <span
                      className={`text-sm ${
                        userInfo?.experience && userInfo.experience.length > 0
                          ? "text-slate-500"
                          : "text-slate-800 font-medium"
                      }`}
                    >
                      Work Experience
                    </span>
                    {(!userInfo?.experience ||
                      userInfo.experience.length === 0) && (
                      <Link
                        to="/dashboard/experience"
                        className="ml-auto text-xs text-orange-600 hover:text-orange-700"
                      >
                        Complete
                      </Link>
                    )}
                  </li>
                </ul>
              </div>
            </div>
          )}

          {/* Upcoming Interviews or Calendar */}
          {userRole === "user" ? (
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
              <div className="px-6 py-4 border-b border-slate-200">
                <h2 className="font-semibold text-slate-800">
                  Upcoming Interviews
                </h2>
              </div>
              {jobSeekerStats.interviewsScheduled > 0 ? (
                <div className="px-6 py-4">
                  <div className="space-y-3">
                    <div className="p-3 bg-blue-50 border border-blue-100 rounded-lg">
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="font-medium text-slate-800">
                            TechCorp Interview
                          </p>
                          <p className="text-sm text-slate-600 mt-1">
                            Senior Frontend Developer
                          </p>
                        </div>
                        <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs font-medium rounded-full">
                          Video Call
                        </span>
                      </div>
                      <div className="flex items-center mt-3 text-sm text-slate-500">
                        <Calendar size={14} className="mr-1" />
                        <span>Tomorrow, 10:00 AM</span>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="px-6 py-8 text-center">
                  <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Calendar size={20} className="text-slate-400" />
                  </div>
                  <p className="text-slate-500 text-sm">
                    No upcoming interviews
                  </p>
                </div>
              )}
            </div>
          ) : (
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
              <div className="px-6 py-4 border-b border-slate-200">
                <h2 className="font-semibold text-slate-800">
                  Recruitment Analytics
                </h2>
              </div>
              <div className="px-6 py-4">
                <div className="space-y-4">
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm text-slate-600">
                        Application Rate
                      </span>
                      <span className="text-sm font-medium text-slate-800">
                        68%
                      </span>
                    </div>
                    <div className="w-full bg-slate-100 rounded-full h-2">
                      <div
                        className="bg-blue-500 h-2 rounded-full"
                        style={{ width: "68%" }}
                      ></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm text-slate-600">
                        Interview Rate
                      </span>
                      <span className="text-sm font-medium text-slate-800">
                        42%
                      </span>
                    </div>
                    <div className="w-full bg-slate-100 rounded-full h-2">
                      <div
                        className="bg-purple-500 h-2 rounded-full"
                        style={{ width: "42%" }}
                      ></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm text-slate-600">
                        Hiring Rate
                      </span>
                      <span className="text-sm font-medium text-slate-800">
                        72%
                      </span>
                    </div>
                    <div className="w-full bg-slate-100 rounded-full h-2">
                      <div
                        className="bg-green-500 h-2 rounded-full"
                        style={{ width: "72%" }}
                      ></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Resources or Tips */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-200">
              <h2 className="font-semibold text-slate-800">
                {userRole === "user" ? "Career Resources" : "Recruitment Tips"}
              </h2>
            </div>
            <div className="divide-y divide-slate-100">
              {userRole === "user" ? (
                <>
                  <div className="px-6 py-4 hover:bg-slate-50 transition-colors">
                    <div className="flex items-start">
                      <div className="w-8 h-8 rounded-full bg-orange-100 flex items-center justify-center mr-3 mt-0.5">
                        <FileText size={16} className="text-orange-600" />
                      </div>
                      <div>
                        <Link
                          to="#"
                          className="text-slate-800 hover:text-orange-600 font-medium"
                        >
                          How to Create a Standout Resume
                        </Link>
                        <p className="text-xs text-slate-500 mt-1">
                          5 min read
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="px-6 py-4 hover:bg-slate-50 transition-colors">
                    <div className="flex items-start">
                      <div className="w-8 h-8 rounded-full bg-orange-100 flex items-center justify-center mr-3 mt-0.5">
                        <MessageSquare size={16} className="text-orange-600" />
                      </div>
                      <div>
                        <Link
                          to="#"
                          className="text-slate-800 hover:text-orange-600 font-medium"
                        >
                          Ace Your Next Interview: Top Tips
                        </Link>
                        <p className="text-xs text-slate-500 mt-1">
                          8 min read
                        </p>
                      </div>
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <div className="px-6 py-4 hover:bg-slate-50 transition-colors">
                    <div className="flex items-start">
                      <div className="w-8 h-8 rounded-full bg-orange-100 flex items-center justify-center mr-3 mt-0.5">
                        <Users size={16} className="text-orange-600" />
                      </div>
                      <div>
                        <Link
                          to="#"
                          className="text-slate-800 hover:text-orange-600 font-medium"
                        >
                          Effective Candidate Screening Techniques
                        </Link>
                        <p className="text-xs text-slate-500 mt-1">
                          7 min read
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="px-6 py-4 hover:bg-slate-50 transition-colors">
                    <div className="flex items-start">
                      <div className="w-8 h-8 rounded-full bg-orange-100 flex items-center justify-center mr-3 mt-0.5">
                        <Briefcase size={16} className="text-orange-600" />
                      </div>
                      <div>
                        <Link
                          to="#"
                          className="text-slate-800 hover:text-orange-600 font-medium"
                        >
                          Writing Job Descriptions That Attract Top Talent
                        </Link>
                        <p className="text-xs text-slate-500 mt-1">
                          6 min read
                        </p>
                      </div>
                    </div>
                  </div>
                </>
              )}
            </div>
            <div className="px-6 py-3 bg-slate-50 border-t border-slate-200">
              <Link
                to="#"
                className="text-sm text-orange-600 hover:text-orange-700 font-medium flex items-center justify-center"
              >
                View All Resources
                <ChevronRight size={16} className="ml-1" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
