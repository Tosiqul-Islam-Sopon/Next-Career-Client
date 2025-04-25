"use client";

// src/components/JobDetails.js
import { useQuery } from "@tanstack/react-query";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import useAxiosBase from "../../../CustomHooks/useAxiosBase";
import { useContext } from "react";
import { AuthContext } from "../../../Providers/AuthProvider";
import Swal from "sweetalert2";
import {
  MdBusinessCenter,
  MdLocationOn,
  MdCalendarToday,
  MdCategory,
  MdWorkOutline,
  MdPeopleAlt,
  MdAttachMoney,
  MdArrowBack,
  MdBookmark,
  MdShare,
  MdCheck,
} from "react-icons/md";
import useUserRole from "../../../CustomHooks/useUserRole";

const JobDetails = () => {
  const { jobId } = useParams();
  const { user } = useContext(AuthContext);
  const { userRole } = useUserRole();
  const axiosBase = useAxiosBase();
  const navigate = useNavigate();
  const location = useLocation();

  const { data: job = null, isLoading } = useQuery({
    queryKey: [`job${jobId}`],
    queryFn: async () => {
      const response = await axiosBase.get(`/jobs/job/${jobId}`);
      return response.data;
    },
  });

  const { data: userInfo = null, isLoading: userLoading } = useQuery({
    queryKey: ["user", user?.email],
    queryFn: async () => {
      const response = await axiosBase.get(`/user-by-email/${user?.email}`);
      return response.data;
    },
  });

  const {
    data: isApplied = null,
    isLoading: applicationCheckLoading,
    refetch: refetchApplicationStatus,
  } = useQuery({
    queryKey: ["job", jobId, userInfo],
    queryFn: async () => {
      const response = await axiosBase.get(`/jobs/checkApplication`, {
        params: {
          jobId: jobId,
          userId: userInfo?._id,
        },
      });
      console.log(response.data);
      return response.data;
    },
    refetchOnWindowFocus: false,
    enabled: !!jobId && !!userInfo?._id, // Only run the query if jobId and userId are present
  });

  if (isLoading || userLoading || applicationCheckLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="flex flex-col items-center">
          <div className="w-16 h-16 border-4 border-gray-200 border-t-blue-600 rounded-full animate-spin mb-4"></div>
          <p className="text-gray-600 font-medium">Loading job details...</p>
        </div>
      </div>
    );
  }

  if (!job) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center p-8 bg-white rounded-lg shadow-md max-w-md">
          <MdBusinessCenter className="w-16 h-16 mx-auto text-gray-300 mb-4" />
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            Job Not Found
          </h2>
          <p className="text-gray-600 mb-6">
            The job you&apos;re looking for doesn&apos;t exist or has been
            removed.
          </p>
          <button
            onClick={() => navigate("/jobs")}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            Browse Jobs
          </button>
        </div>
      </div>
    );
  }

  const {
    jobTitle,
    jobDescription,
    jobRequirements,
    jobQualifications,
    jobCategory,
    jobType,
    jobLocation,
    salary,
    deadline,
    companyInfo,
    onSitePlace,
    vacancy,
    userInfo: jobPosterInfo,
  } = job;

  // Format salary with commas
  const formatSalary = (salaryString) => {
    if (!salaryString) return "Competitive";

    try {
      const numericSalary = Number.parseFloat(
        salaryString.replace(/[^0-9.]/g, "")
      );
      return `৳ ${numericSalary.toLocaleString()}`;
    } catch {
      return `৳ ${salaryString}`;
    }
  };

  // Format date
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date instanceof Date && !isNaN(date)
      ? date.toLocaleDateString("en-US", {
          year: "numeric",
          month: "long",
          day: "numeric",
        })
      : dateString;
  };

  // Calculate days left until deadline
  const calculateDaysLeft = (deadlineDate) => {
    const today = new Date();
    const deadline = new Date(deadlineDate);
    const diffTime = deadline - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays > 0 ? diffDays : 0;
  };

  const daysLeft = calculateDaysLeft(deadline);

  const handleApplyNow = async () => {
    if (user) {
      try {
        // Check if the user has completed their profile
        if (userInfo.personalInfo && userInfo.education) {
          // Send a request to apply for the job
          const applyResponse = await axiosBase.post(`/jobs/apply`, {
            userId: userInfo._id,
            jobId: job._id,
            jobTitle,
            applicantName: user.displayName,
          });

          if (applyResponse.status === 200) {
            Swal.fire({
              title: "Success",
              text: "You have successfully applied for the job!",
              icon: "success",
              confirmButtonText: "OK",
            });
            refetchApplicationStatus();
          } else {
            Swal.fire({
              title: "Error",
              text: "Failed to apply for the job",
              icon: "error",
              confirmButtonText: "OK",
            });
          }
        } else {
          Swal.fire({
            title: "Incomplete Profile",
            text: "Please complete your profile before applying.",
            icon: "warning",
            confirmButtonText: "OK",
          });
        }
      } catch (error) {
        console.error("Error applying for job:", error);
        Swal.fire({
          title: "Error",
          text: "Failed to apply for the job",
          icon: "error",
          confirmButtonText: "OK",
        });
      }
    } else {
      Swal.fire({
        title: "Login Required",
        text: "You need to login to apply for a job.",
        icon: "info",
        confirmButtonText: "Login",
        showCancelButton: true,
        cancelButtonText: "Cancel",
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        allowOutsideClick: false,
        allowEscapeKey: false,
        preConfirm: () => {
          navigate("/login", {
            state: { from: location },
          });
        },
      });
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen pt-24 pb-12">
      {/* Back button */}
      <div className="max-w-6xl mx-auto px-4 mb-6">
        <button
          onClick={() => navigate("/jobs")}
          className="inline-flex items-center text-blue-600 hover:text-blue-800 transition-colors"
        >
          <MdArrowBack className="mr-1" /> Back to Jobs
        </button>
      </div>

      <div className="max-w-6xl mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main content */}
          <div className="lg:col-span-2">
            {/* Job header */}
            <div className="bg-white rounded-lg shadow-sm overflow-hidden mb-6">
              <div className="p-6 border-b border-gray-100">
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-4">
                    <div className="w-16 h-16 rounded-md overflow-hidden border border-gray-200 bg-gray-50 flex items-center justify-center flex-shrink-0">
                      {companyInfo?.companyLogo ? (
                        <img
                          src={companyInfo.companyLogo || "/placeholder.svg"}
                          alt={companyInfo.companyName}
                          className="w-full h-full object-contain"
                          onError={(e) => {
                            e.target.src = "/placeholder.svg";
                            e.target.alt = companyInfo.companyName.charAt(0);
                          }}
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-blue-50 text-blue-700 font-semibold text-xl">
                          {companyInfo?.companyName.charAt(0)}
                        </div>
                      )}
                    </div>
                    <div>
                      <h1 className="text-2xl font-bold text-gray-900 mb-1">
                        {jobTitle}
                      </h1>
                      <p className="text-gray-600 mb-2">
                        {companyInfo?.companyName}
                      </p>
                      <div className="flex flex-wrap items-center gap-3 text-sm text-gray-500">
                        <span className="inline-flex items-center">
                          <MdLocationOn className="mr-1 text-gray-400" />
                          {jobLocation === "Remote" ? "Remote" : onSitePlace}
                        </span>
                        <span className="inline-flex items-center">
                          <MdAttachMoney className="mr-1 text-gray-400" />
                          {formatSalary(salary)}/month
                        </span>
                        <span className="inline-flex items-center">
                          <MdWorkOutline className="mr-1 text-gray-400" />
                          {jobType}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <button className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-full transition-colors">
                      <MdBookmark className="w-5 h-5" />
                    </button>
                    <button className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-full transition-colors">
                      <MdShare className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Job description */}
              <div className="p-6">
                <div className="prose max-w-none">
                  <h2 className="text-xl font-semibold text-gray-900 mb-4">
                    Job Description
                  </h2>
                  <p className="text-gray-700 whitespace-pre-line mb-8">
                    {jobDescription}
                  </p>

                  <h2 className="text-xl font-semibold text-gray-900 mb-4">
                    Requirements
                  </h2>
                  <p className="text-gray-700 whitespace-pre-line mb-8">
                    {jobRequirements}
                  </p>

                  <h2 className="text-xl font-semibold text-gray-900 mb-4">
                    Qualifications
                  </h2>
                  <p className="text-gray-700 whitespace-pre-line mb-8">
                    {jobQualifications}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar - Fixed, non-scrollable */}
          <div className="lg:col-span-1">
            <div className="sticky top-24">
              {/* Apply card */}
              <div className="bg-white rounded-lg shadow-sm overflow-hidden mb-6">
                <div className="p-6">
                  <h2 className="text-lg font-semibold text-gray-900 mb-4">
                    Job Overview
                  </h2>

                  {/* Key details in a compact format */}
                  <div className="grid grid-cols-2 gap-4 mb-6">
                    <div className="flex items-center">
                      <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center flex-shrink-0 mr-2">
                        <MdCalendarToday className="w-4 h-4 text-blue-600" />
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Deadline</p>
                        <p className="text-sm font-medium text-gray-900">
                          {formatDate(deadline)}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center">
                      <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center flex-shrink-0 mr-2">
                        <MdCategory className="w-4 h-4 text-blue-600" />
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Category</p>
                        <p className="text-sm font-medium text-gray-900">
                          {jobCategory}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center">
                      <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center flex-shrink-0 mr-2">
                        <MdPeopleAlt className="w-4 h-4 text-blue-600" />
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Vacancy</p>
                        <p className="text-sm font-medium text-gray-900">
                          {vacancy}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center">
                      <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center flex-shrink-0 mr-2">
                        <MdBusinessCenter className="w-4 h-4 text-blue-600" />
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Job Type</p>
                        <p className="text-sm font-medium text-gray-900">
                          {jobType}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Deadline highlight */}
                  {!isApplied?.hasApplied && daysLeft > 0 && (
                    <div className="bg-amber-50 border border-amber-100 rounded-md p-3 mb-6 flex items-center">
                      <div className="w-8 h-8 rounded-full bg-amber-100 flex items-center justify-center flex-shrink-0 mr-3">
                        <MdCalendarToday className="w-4 h-4 text-amber-600" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-amber-800">
                          Application Closing Soon
                        </p>
                        <p className="text-xs text-amber-700">
                          {daysLeft} days left to apply
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Company info card - condensed */}
              {companyInfo && (
                <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                  <div className="p-6">
                    <div className="flex items-center mb-4">
                      <div className="w-10 h-10 rounded-md overflow-hidden border border-gray-200 bg-gray-50 flex items-center justify-center flex-shrink-0 mr-3">
                        {companyInfo.companyLogo ? (
                          <img
                            src={companyInfo.companyLogo || "/placeholder.svg"}
                            alt={companyInfo.companyName}
                            className="w-full h-full object-contain"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center bg-blue-50 text-blue-700 font-semibold text-sm">
                            {companyInfo.companyName.charAt(0)}
                          </div>
                        )}
                      </div>
                      <div>
                        <h3 className="font-medium text-gray-900 text-sm">
                          {companyInfo.companyName}
                        </h3>
                        {companyInfo.companyWebsite && (
                          <a
                            href={companyInfo.companyWebsite}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-xs text-blue-600 hover:underline"
                          >
                            Visit Website
                          </a>
                        )}
                      </div>
                    </div>
                    {companyInfo.companyDescription && (
                      <p className="text-gray-700 text-xs line-clamp-3">
                        {companyInfo.companyDescription}
                      </p>
                    )}
                  </div>
                </div>
              )}

              <div className="mt-5">
                {userRole === "user" ? (
                  <>
                    {/* Apply button */}
                    {!isApplied?.hasApplied ? (
                      <button
                        onClick={handleApplyNow}
                        className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-md transition-colors flex items-center justify-center"
                      >
                        Apply Now
                      </button>
                    ) : isApplied && isApplied.hasSchedule ? (
                      <div className="bg-indigo-50 border border-indigo-200 rounded-md p-4 text-sm text-indigo-900">
                        <p className="font-semibold text-indigo-700 mb-2 flex items-center">
                          <MdCalendarToday className="mr-2 text-indigo-600" />
                          Scheduled Interview
                        </p>
                        <div className="text-sm text-gray-800 space-y-1">
                          <p>
                            <strong>Stage:</strong>{" "}
                            {isApplied.schedule.stageName}
                          </p>
                          <p>
                            <strong>Date:</strong>{" "}
                            {isApplied.schedule.scheduledDate}
                          </p>
                          <p>
                            <strong>Time:</strong>{" "}
                            {isApplied.schedule.startTime} -{" "}
                            {isApplied.schedule.endTime}
                          </p>
                          <p>
                            <strong>Instruction:</strong>{" "}
                            {isApplied.schedule.note}
                          </p>
                        </div>
                      </div>
                    ) : (
                      <div className="bg-green-50 border border-green-100 rounded-md p-4 text-center">
                        <div className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-green-100 text-green-600 mb-2">
                          <MdCheck className="w-6 h-6" />
                        </div>
                        <p className="text-green-800 font-medium text-sm">
                          Application Submitted
                        </p>
                      </div>
                    )}
                  </>
                ) : (
                  jobPosterInfo?.email === user?.email && (
                    <>
                      <div className="bg-white rounded-xl shadow-sm p-6 md:p-8">
                        <Link to={`/editJob/${jobId}`}>
                          <button className="w-full bg-green-600 hover:bg-green-700 text-white font-medium py-3 px-4 rounded-lg shadow-sm transition duration-200 flex items-center justify-center">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-5 w-5 mr-2"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                              />
                            </svg>
                            Edit Job Posting
                          </button>
                        </Link>
                      </div>
                    </>
                  )
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JobDetails;
