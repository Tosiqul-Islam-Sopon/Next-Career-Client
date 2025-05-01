"use client";

import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../../Providers/AuthProvider";
import { useQuery } from "@tanstack/react-query";
import useAxiosBase from "../../../CustomHooks/useAxiosBase";
import { Link } from "react-router-dom";
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
} from "lucide-react";
import RecruitmentProgressBar from "./RecruitmentProgressBar";

const MyPostedJobs = () => {
  const { user } = useContext(AuthContext);
  const axiosBase = useAxiosBase();

  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("newest");
  const [applicantCounts, setApplicantCounts] = useState({});

  // Fetch posted jobs by the recruiter
  const {
    data: jobs = [],
    isLoading,
    isError,
    refetch,
  } = useQuery({
    queryKey: ["myPostedJobs", user?.email],
    queryFn: async () => {
      const response = await axiosBase.get(`/jobs/myPostedJobs/${user?.email}`);
      return response.data;
    },
    enabled: !!user?.email,
  });

  // Helper to fetch total applicants per job
  const fetchApplicantsCount = async (jobId) => {
    try {
      const res = await axiosBase.get(`/jobs/totalApplicants/${jobId}`);
      return res.data.totalApplicants || 0;
    } catch (error) {
      return 0;
    }
  };

  // Fetch applicant counts when jobs are loaded
  useEffect(() => {
    const loadCounts = async () => {
      const counts = {};
      for (const job of jobs) {
        const count = await fetchApplicantsCount(job._id);
        counts[job._id] = count;
      }
      setApplicantCounts(counts);
    };

    if (jobs.length > 0) {
      loadCounts();
    }
  }, [jobs]);

  // Search filter
  const filteredJobs = jobs.filter(
    (job) =>
      job.jobTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.jobDescription.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.jobLocation.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Sort logic
  const sortedJobs = [...filteredJobs].sort((a, b) => {
    if (sortBy === "newest") {
      return (
        new Date(b.createdAt || b.deadline) -
        new Date(a.createdAt || a.deadline)
      );
    } else if (sortBy === "oldest") {
      return (
        new Date(a.createdAt || a.deadline) -
        new Date(b.createdAt || b.deadline)
      );
    } else if (sortBy === "salary-high") {
      return parseFloat(b.salary) - parseFloat(a.salary);
    } else if (sortBy === "salary-low") {
      return parseFloat(a.salary) - parseFloat(b.salary);
    }
    return 0;
  });

  // Date formatter
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  // Deadline countdown
  const getDaysRemaining = (deadline) => {
    const today = new Date();
    const deadlineDate = new Date(deadline);
    const diffTime = deadlineDate - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays < 0) return "Expired";
    if (diffDays === 0) return "Today";
    if (diffDays === 1) return "1 day left";
    return `${diffDays} days left`;
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="flex flex-col items-center">
          <div className="w-16 h-16 border-t-4 border-blue-600 border-solid rounded-full animate-spin"></div>
          <p className="mt-4 text-lg text-gray-700">
            Loading your posted jobs...
          </p>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center max-w-md mx-auto p-6 bg-white rounded-xl shadow-md">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-8 w-8 text-red-500"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">
            Failed to Load Jobs
          </h2>
          <p className="text-gray-600 mb-4">
            We couldn&apos;t load your posted jobs. Please try again later or contact
            support if the issue persists.
          </p>
          <button
            onClick={() => refetch()}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="container mx-auto pt-24 pb-16 px-4 md:px-6">
        <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
          {/* Header */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                My Posted Jobs
              </h1>
              <p className="text-gray-600 mt-1">
                Manage and track all your job postings
              </p>
            </div>
            <Link to="/postJob">
              <button className="mt-4 md:mt-0 flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                <Plus className="h-5 w-5 mr-2" />
                Post New Job
              </button>
            </Link>
          </div>

          {/* Search and Sort */}
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="relative flex-grow">
              <input
                type="text"
                placeholder="Search jobs by title, description or location..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
              <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
            </div>
            <div className="relative">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="pl-10 pr-8 py-2 border border-gray-300 rounded-lg appearance-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="newest">Newest First</option>
                <option value="oldest">Oldest First</option>
                <option value="salary-high">Highest Salary</option>
                <option value="salary-low">Lowest Salary</option>
              </select>
              <ArrowUpDown className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
            </div>
          </div>

          {/* Job List */}
          {jobs.length > 0 ? (
            <>
              <div className="bg-blue-50 rounded-lg p-4 mb-6 border border-blue-100">
                <p className="text-blue-800">
                  <span className="font-semibold">{filteredJobs.length}</span>{" "}
                  job postings found
                </p>
              </div>

              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {sortedJobs.map((job) => {
                  const daysRemaining = getDaysRemaining(job.deadline);
                  const isExpired = daysRemaining === "Expired";
                  const totalApplicants = applicantCounts[job._id];

                  return (
                    <div
                      key={job._id}
                      className={`bg-white border rounded-xl overflow-hidden hover:shadow-md transition-shadow duration-300 ${
                        isExpired ? "border-red-200" : "border-gray-200"
                      }`}
                    >
                      <div
                        className={`h-2 ${isExpired ? "bg-red-500" : "bg-blue-600"}`}
                      ></div>
                      <div className="p-6">
                        <div className="flex justify-between items-start mb-4">
                          <h2 className="text-xl font-bold text-gray-900 line-clamp-2">
                            {job.jobTitle}
                          </h2>
                          <span
                            className={`px-3 py-1 text-xs font-medium rounded-full ${
                              isExpired
                                ? "bg-red-100 text-red-800"
                                : "bg-blue-100 text-blue-800"
                            }`}
                          >
                            {daysRemaining}
                          </span>
                        </div>

                        <p className="text-gray-700 mb-4 line-clamp-2">
                          {job.jobDescription}
                        </p>

                        <div className="space-y-2 mb-4">
                          <div className="flex items-center text-gray-600">
                            <MapPin className="h-4 w-4 mr-2 text-gray-500" />
                            <span>{job.jobLocation || "Remote"}</span>
                          </div>
                          <div className="flex items-center text-gray-600">
                            <Users className="h-4 w-4 mr-2 text-gray-500" />
                            <span>Vacancy: {job.vacancy}</span>
                          </div>
                          <div className="flex items-center text-gray-600">
                            <Calendar className="h-4 w-4 mr-2 text-gray-500" />
                            <span>Deadline: {formatDate(job.deadline)}</span>
                          </div>
                        </div>

                        <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                          <div className="text-lg font-semibold text-green-600">
                            ৳ {job.salary}
                            <span className="text-sm font-normal text-gray-600 ml-1">
                              / Month
                            </span>
                          </div>
                          <div className="flex items-center text-gray-500 text-sm">
                            <Clock className="h-4 w-4 mr-1" />
                            <span>
                              {totalApplicants === undefined
                                ? "..."
                                : `${totalApplicants} applicants`}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div>
                        <RecruitmentProgressBar stages={job?.recruitmentStages} completedStages={job?.completedStages} />
                      </div>

                      <div className="bg-gray-50 px-6 py-3 flex justify-between">
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
                  );
                })}
              </div>
            </>
          ) : (
            <div className="text-center py-16">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Briefcase className="h-8 w-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-1">
                No jobs posted yet
              </h3>
              <p className="text-gray-600 max-w-md mx-auto">
                You haven&apos;t posted any jobs yet. Create your first job posting
                to start receiving applications.
              </p>
              <Link to="/post-job">
                <button className="mt-6 px-5 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                  Post Your First Job
                </button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MyPostedJobs;
