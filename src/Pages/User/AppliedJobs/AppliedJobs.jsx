"use client";

import { useQuery } from "@tanstack/react-query";
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../../Providers/AuthProvider";
import useAxiosBase from "../../../CustomHooks/useAxiosBase";
import {
  Briefcase,
  Calendar,
  Building,
  MapPin,
  Clock,
  ChevronRight,
  Search,
} from "lucide-react";
import { Link } from "react-router-dom";

const AppliedJobs = () => {
  const { user } = useContext(AuthContext);
  const axiosBase = useAxiosBase();
  const [applications, setApplications] = useState([]);
  const [appliedJobs, setAppliedJobs] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("all");

  const { data: userInfo = null, isLoading } = useQuery({
    queryKey: ["user", user?.email],
    queryFn: async () => {
      const response = await axiosBase.get(`/user-by-email/${user?.email}`);
      return response.data;
    },
  });

  useEffect(() => {
    const loadAppliedJobs = async () => {
      if (!userInfo?._id) return;

      try {
        const response = await axiosBase.get(
          `/jobs/appliedJobs/${userInfo._id}`
        );
        setApplications(response.data);

        const jobIds = response.data.map((job) => job.jobId);
        if (jobIds.length === 0) return;

        const jobsResponse = await axiosBase.get("/jobs/byIds", {
          params: { jobIds: jobIds.join(",") },
        });

        setAppliedJobs(jobsResponse.data.jobs);
      } catch (error) {
        console.error(
          "Error loading applied jobs:",
          error.response?.data || error.message
        );
      }
    };

    loadAppliedJobs();
  }, [userInfo, axiosBase]);

  const filteredJobs = appliedJobs.filter((job) => {
    // Search filter
    const matchesSearch =
      job.jobTitle?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.companyInfo?.companyName
        ?.toLowerCase()
        .includes(searchTerm.toLowerCase());

    // Job type filter
    const matchesType = filterType === "all" || job.jobType === filterType;

    return matchesSearch && matchesType;
  });

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="flex flex-col items-center">
          <div className="w-16 h-16 border-t-4 border-blue-500 border-solid rounded-full animate-spin"></div>
          <p className="mt-4 text-lg text-gray-700">
            Loading your applications...
          </p>
        </div>
      </div>
    );
  }

  const getStatusBadge = (date) => {
    // For demo purposes, we'll just show "Applied" status
    // In a real app, you might have different statuses like "Reviewing", "Interview", etc.
    return (
      <span className="px-3 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-800">
        Applied
      </span>
    );
  };

  const getRandomDaysAgo = () => {
    return Math.floor(Math.random() * 14) + 1;
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="container mx-auto pt-28 pb-16 px-4 md:px-6">
        <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
              My Applications
            </h1>
            <div className="mt-4 md:mt-0 flex flex-col sm:flex-row gap-3">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search jobs..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 w-full"
                />
                <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
              </div>
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="all">All Types</option>
                <option value="Full-time">Full-time</option>
                <option value="Part-time">Part-time</option>
                <option value="Contract">Contract</option>
                <option value="Internship">Internship</option>
              </select>
            </div>
          </div>

          <div className="bg-blue-50 rounded-lg p-4 mb-6 border border-blue-100">
            <p className="text-blue-800">
              <span className="font-semibold">{applications.length}</span> job
              applications found
            </p>
          </div>

          {applications.length > 0 ? (
            <div className="space-y-6">
              {applications.map((application) => {
                const job = appliedJobs.find(
                  (j) => j._id === application.jobId
                );
                if (!job) return null;

                const appliedUser = application.appliedUsers.find(
                  (user) => user.userId === userInfo._id
                );
                const appliedDate = appliedUser
                  ? new Date(appliedUser.appliedOn).toLocaleDateString()
                  : "N/A";

                return (
                  <div
                    key={application._id}
                    className="bg-white border border-gray-200 rounded-xl overflow-hidden hover:shadow-md transition-shadow duration-300"
                  >
                    <div className="p-6">
                      <div className="flex flex-col md:flex-row md:items-center justify-between mb-4">
                        <div className="flex items-start space-x-4">
                          <div className="flex-shrink-0 w-12 h-12 bg-gray-100 rounded-md flex items-center justify-center">
                            <Building className="h-6 w-6 text-gray-500" />
                          </div>
                          <div>
                            <h3 className="text-xl font-bold text-gray-900">
                              {job.jobTitle}
                            </h3>
                            <p className="text-gray-600">
                              {job.companyInfo?.companyName}
                            </p>
                          </div>
                        </div>
                        <div className="mt-4 md:mt-0">
                          {getStatusBadge(appliedDate)}
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                        <div className="flex items-center text-gray-600">
                          <Briefcase className="h-5 w-5 mr-2 text-gray-500" />
                          <span>{job.jobType}</span>
                        </div>
                        <div className="flex items-center text-gray-600">
                          <MapPin className="h-5 w-5 mr-2 text-gray-500" />
                          <span>{job.location || "Remote"}</span>
                        </div>
                        <div className="flex items-center text-gray-600">
                          <Calendar className="h-5 w-5 mr-2 text-gray-500" />
                          <span>Applied on {appliedDate}</span>
                        </div>
                      </div>

                      <div className="flex flex-col sm:flex-row sm:items-center justify-between pt-4 border-t border-gray-100">
                        <div className="text-lg font-semibold text-gray-900">
                          ৳ {job.salary}
                          <span className="text-sm font-normal text-gray-600 ml-1">
                            {job.salaryType || "per month"}
                          </span>
                        </div>
                        <div className="mt-3 sm:mt-0 flex items-center text-gray-500 text-sm">
                          <Clock className="h-4 w-4 mr-1" />
                          <span>{getRandomDaysAgo()} days ago</span>
                        </div>
                      </div>
                    </div>

                    <div className="bg-gray-50 px-6 py-3 flex justify-end">
                      <Link to={`/jobDetails/${application.jobId}`}>
                        <button className="text-blue-600 hover:text-blue-800 font-medium flex items-center text-sm">
                          View Details
                          <ChevronRight className="h-4 w-4 ml-1" />
                        </button>
                      </Link>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-16">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Briefcase className="h-8 w-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-1">
                No applications yet
              </h3>
              <p className="text-gray-600 max-w-md mx-auto">
                You haven&apos;t applied to any jobs yet. Start exploring
                opportunities and submit your first application.
              </p>
              <button className="mt-6 px-5 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                Browse Jobs
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AppliedJobs;
