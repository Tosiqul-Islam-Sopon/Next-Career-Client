"use client";

import { useParams } from "react-router-dom";
import useUserRole from "../../../CustomHooks/useUserRole";
import { useQuery } from "@tanstack/react-query";
import useAxiosBase from "../../../CustomHooks/useAxiosBase";
import { useEffect, useState } from "react";

const Schedules = () => {
  const { userId } = useParams();
  const { userRole } = useUserRole();
  const axiosBase = useAxiosBase();
  const [jobs, setJobs] = useState([]);
  const [isJobFeatchLoading, setIsJobFeatchLoading] = useState(false);
  const [schedules, setSchedules] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchSchedules = async () => {
      const fetchLink =
        userRole === "recruiter"
          ? `/job/schedules/recruiter/${userId}`
          : `/job/schedules/candidate/${userId}`;
      try{
        setIsLoading(true);
        const res = await axiosBase.get(fetchLink);
        setSchedules(res.data);
        setIsLoading(false);
      } catch (err) {
        console.log(err);
        setIsLoading(false);
      }
    }

    fetchSchedules();
  }, [userRole, userId, axiosBase]);

  useEffect(() => {
    const fetchJobs = async () => {
      if (!schedules) return;
      const jobsArray = [];
      for (const schedule of schedules) {
        try {
          setIsJobFeatchLoading(true);
          const res = await axiosBase.get(`/jobs/job/${schedule.jobId}`);
          if (res.data) {
            jobsArray.push(res.data);
          }
          setIsJobFeatchLoading(false);
        } catch (err) {
          setIsJobFeatchLoading(false);
          console.error("❌ Failed to fetch job", err);
        }
      }
      setJobs(jobsArray);
    };

    fetchJobs();
  }, [schedules, axiosBase]);

  // Helper function to format date
  const formatDate = (dateString) => {
    const options = {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  // Helper function to determine status color
  const getStatusColor = (date) => {
    const scheduleDate = new Date(date);
    const today = new Date();
    const diffTime = scheduleDate - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays < 0) return "text-gray-500"; // Past
    if (diffDays === 0) return "text-red-500"; // Today
    if (diffDays <= 2) return "text-amber-500"; // Soon
    return "text-green-500"; // Future
  };

  if (isLoading || isJobFeatchLoading) {
    return (
      <div className="min-h-screen bg-gray-50 pt-24 px-4 md:px-12">
        <div className="max-w-5xl mx-auto">
          <div className="flex flex-col items-center justify-center">
            <div className="w-16 h-16 border-4 border-t-blue-600 border-b-blue-600 border-l-transparent border-r-transparent rounded-full animate-spin"></div>
            <h2 className="mt-6 text-xl font-medium text-gray-700">
              Loading your schedules...
            </h2>
          </div>
        </div>
      </div>
    );
  }

  if (!schedules?.length) {
    return (
      <div className="min-h-screen bg-gray-50 pt-24 px-4 md:px-12">
        <div className="max-w-5xl mx-auto">
          <div className="flex flex-col items-center justify-center">
            <div className="w-24 h-24 rounded-full bg-gray-100 flex items-center justify-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-12 w-12 text-gray-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
            </div>
            <h2 className="mt-6 text-2xl font-semibold text-gray-700">
              No schedules found
            </h2>
            <p className="mt-2 text-gray-500">
              You don&apos;t have any upcoming interviews or meetings scheduled.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-24 px-4 md:px-12 pb-16">
      <div className="max-w-5xl mx-auto">
        <header className="mb-10">
          <h1 className="text-3xl font-bold text-gray-900 text-center">
            Upcoming Schedules
          </h1>
          <p className="mt-2 text-center text-gray-600 max-w-2xl mx-auto">
            {userRole === "recruiter"
              ? "Manage your upcoming interviews and meetings with candidates"
              : "Your upcoming interviews and meetings with recruiters"}
          </p>
        </header>

        <div className="space-y-6">
          {schedules.map((schedule) => {
            const job = jobs.find((j) => j._id === schedule.jobId);
            const statusColor = getStatusColor(schedule.scheduledDate);

            return (
              <div
                key={schedule._id}
                className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden transition-all hover:shadow-md"
              >
                <div className="p-6">
                  <div className="flex flex-col md:flex-row md:items-start gap-4">
                    {/* Left side - Date */}
                    <div className="md:w-1/4 flex flex-col items-center md:items-start">
                      <div
                        className={`text-sm font-medium uppercase ${statusColor}`}
                      >
                        {new Date(schedule.scheduledDate) <= new Date()
                          ? "Today"
                          : formatDate(schedule.scheduledDate).split(",")[0]}
                      </div>
                      <div className="text-2xl font-bold text-gray-900">
                        {new Date(schedule.scheduledDate).getDate()}
                      </div>
                      <div className="text-gray-500">
                        {new Date(schedule.scheduledDate).toLocaleDateString(
                          undefined,
                          {
                            month: "long",
                            year: "numeric",
                          }
                        )}
                      </div>
                      <div className="mt-2 flex items-center">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-4 w-4 text-gray-400 mr-1"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                          />
                        </svg>
                        <span className="text-gray-600 text-sm">
                          {schedule.startTime} - {schedule.endTime}
                        </span>
                      </div>
                    </div>

                    {/* Right side - Details */}
                    <div className="md:w-3/4 md:border-l md:pl-6">
                      <div className="flex flex-col md:flex-row md:justify-between md:items-start">
                        <div>
                          <h3 className="text-xl font-semibold text-gray-900 mb-1">
                            {schedule.stageName}
                          </h3>

                          {job && (
                            <div className="mt-2 space-y-1">
                              <div className="flex items-center">
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  className="h-4 w-4 text-gray-400 mr-2"
                                  fill="none"
                                  viewBox="0 0 24 24"
                                  stroke="currentColor"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                                  />
                                </svg>
                                <span className="text-gray-700">
                                  {job.jobTitle || "Unknown Title"}
                                </span>
                              </div>

                              <div className="flex items-center">
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  className="h-4 w-4 text-gray-400 mr-2"
                                  fill="none"
                                  viewBox="0 0 24 24"
                                  stroke="currentColor"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                                  />
                                </svg>
                                <span className="text-gray-700">
                                  {job.companyInfo?.companyName ||
                                    "Unknown Company"}
                                </span>
                              </div>
                            </div>
                          )}
                        </div>

                        <div className="mt-4 md:mt-0">
                          <span
                            className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${statusColor.replace("text", "bg").replace("500", "100")} ${statusColor}`}
                          >
                            {new Date(schedule.scheduledDate) < new Date()
                              ? "Past"
                              : new Date(
                                    schedule.scheduledDate
                                  ).toDateString() === new Date().toDateString()
                                ? "Today"
                                : "Upcoming"}
                          </span>
                        </div>
                      </div>

                      {schedule.note && userRole === "user" && (
                        <div className="mt-4 bg-gray-50 p-3 rounded-lg border border-gray-100">
                          <div className="flex">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-5 w-5 text-gray-400 mr-2 flex-shrink-0"
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
                            <p className="text-sm text-gray-600">
                              {schedule.note}
                            </p>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Schedules;
