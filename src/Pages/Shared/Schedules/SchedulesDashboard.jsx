"use client";

import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { useContext, useEffect, useState } from "react";
import {
  Calendar,
  Clock,
  Briefcase,
  Building,
  MapPin,
  Users,
  Video,
  Phone,
  User,
  AlertCircle,
  ChevronRight,
  ChevronLeft,
  Filter,
  Search,
} from "lucide-react";
import useUserRole from "../../../CustomHooks/useUserRole";
import useAxiosBase from "../../../CustomHooks/useAxiosBase";
import { AuthContext } from "../../../Providers/AuthProvider";

const InterviewSchedules = () => {
  const { user } = useContext(AuthContext);
  const { userRole } = useUserRole();
  const axiosBase = useAxiosBase();
  const [jobs, setJobs] = useState([]);
  const [isJobFetchLoading, setIsJobFetchLoading] = useState(false);
  const [filterStatus, setFilterStatus] = useState("all"); // all, upcoming, today, past
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDate, setSelectedDate] = useState(null);
  const [calendarView, setCalendarView] = useState(false);

  // Get current date for calendar navigation
  const [currentMonth, setCurrentMonth] = useState(new Date());

  const { data: userInfo = null, isLoading: isUserLoading } = useQuery({
    queryKey: ["user", user?.email],
    queryFn: async () => {
      const response = await axiosBase.get(`/user-by-email/${user?.email}`);
      return response.data;
    },
    enabled: !!user?.email,
  });

  const { data: schedules, isLoading } = useQuery({
    queryKey: ["schedules", userInfo?._id],
    queryFn: async () => {
      const fetchLink = `/job/schedules/recruiter/${userInfo?._id}`;
      const res = await axiosBase.get(fetchLink);
      return res.data;
    },
    enabled: !!userInfo?._id,
  });

  useEffect(() => {
    const fetchJobs = async () => {
      if (!schedules) return;
      const jobsArray = [];
      for (const schedule of schedules) {
        try {
          setIsJobFetchLoading(true);
          const res = await axiosBase.get(`/jobs/job/${schedule.jobId}`);
          if (res.data) {
            jobsArray.push(res.data);
          }
          setIsJobFetchLoading(false);
        } catch (err) {
          setIsJobFetchLoading(false);
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

  // Helper function to format short date
  const formatShortDate = (dateString) => {
    const options = {
      month: "short",
      day: "numeric",
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  // Helper function to determine status color
  const getStatusColor = (date) => {
    const scheduleDate = new Date(date);
    const today = new Date();

    // Reset time part for accurate day comparison
    today.setHours(0, 0, 0, 0);
    scheduleDate.setHours(0, 0, 0, 0);

    const diffTime = scheduleDate - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays < 0) return "past";
    if (diffDays === 0) return "today";
    if (diffDays <= 2) return "soon";
    return "upcoming";
  };

  // Filter schedules based on status and search term
  const filteredSchedules = schedules
    ? schedules.filter((schedule) => {
        const job = jobs.find((j) => j._id === schedule.jobId);
        const status = getStatusColor(schedule.scheduledDate);
        const matchesStatus =
          filterStatus === "all" ||
          (filterStatus === "upcoming" &&
            (status === "upcoming" || status === "soon")) ||
          (filterStatus === "today" && status === "today") ||
          (filterStatus === "past" && status === "past");

        const matchesSearch =
          searchTerm === "" ||
          schedule.stageName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          (job &&
            job.jobTitle &&
            job.jobTitle.toLowerCase().includes(searchTerm.toLowerCase())) ||
          (job &&
            job.companyInfo &&
            job.companyInfo.companyName &&
            job.companyInfo.companyName
              .toLowerCase()
              .includes(searchTerm.toLowerCase()));

        const matchesSelectedDate =
          !selectedDate ||
          new Date(schedule.scheduledDate).toDateString() ===
            selectedDate.toDateString();

        return matchesStatus && matchesSearch && matchesSelectedDate;
      })
    : [];

  // Group schedules by date for better organization
  const groupedSchedules = filteredSchedules.reduce((groups, schedule) => {
    const date = new Date(schedule.scheduledDate).toDateString();
    if (!groups[date]) {
      groups[date] = [];
    }
    groups[date].push(schedule);
    return groups;
  }, {});

  // Sort dates for display
  const sortedDates = Object.keys(groupedSchedules).sort(
    (a, b) => new Date(a) - new Date(b)
  );

  // Calendar functions
  const daysInMonth = (month, year) => {
    return new Date(year, month + 1, 0).getDate();
  };

  const firstDayOfMonth = (month, year) => {
    return new Date(year, month, 1).getDay();
  };

  const renderCalendar = () => {
    const month = currentMonth.getMonth();
    const year = currentMonth.getFullYear();
    const daysCount = daysInMonth(month, year);
    const firstDay = firstDayOfMonth(month, year);

    const days = [];

    // Add empty cells for days before the first day of the month
    for (let i = 0; i < firstDay; i++) {
      days.push(<div key={`empty-${i}`} className="h-10 w-10"></div>);
    }

    // Create calendar days
    for (let day = 1; day <= daysCount; day++) {
      const date = new Date(year, month, day);
      const dateString = date.toDateString();

      // Check if there are schedules for this day
      const hasSchedules = schedules
        ? schedules.some(
            (schedule) =>
              new Date(schedule.scheduledDate).toDateString() === dateString
          )
        : false;

      // Check if this is the selected date
      const isSelected =
        selectedDate && selectedDate.toDateString() === dateString;

      days.push(
        <div
          key={day}
          className={`h-10 w-10 flex items-center justify-center rounded-full cursor-pointer
            ${hasSchedules ? "font-medium" : "text-slate-500"}
            ${isSelected ? "bg-orange-500 text-white" : hasSchedules ? "hover:bg-orange-100" : "hover:bg-slate-100"}
          `}
          onClick={() => setSelectedDate(date)}
        >
          {day}
          {hasSchedules && !isSelected && (
            <div className="absolute bottom-1 w-1 h-1 rounded-full bg-orange-500"></div>
          )}
        </div>
      );
    }

    return days;
  };

  // Navigation for calendar
  const prevMonth = () => {
    setCurrentMonth(
      new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1)
    );
  };

  const nextMonth = () => {
    setCurrentMonth(
      new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1)
    );
  };

  // Reset date filter
  const clearDateFilter = () => {
    setSelectedDate(null);
  };

  // Count schedules by status
  const counts = {
    all: filteredSchedules.length,
    upcoming: filteredSchedules.filter((s) =>
      ["upcoming", "soon"].includes(getStatusColor(s.scheduledDate))
    ).length,
    today: filteredSchedules.filter(
      (s) => getStatusColor(s.scheduledDate) === "today"
    ).length,
    past: filteredSchedules.filter(
      (s) => getStatusColor(s.scheduledDate) === "past"
    ).length,
  };

  if (isLoading || isJobFetchLoading || isUserLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh]">
        <div className="relative">
          <div className="w-16 h-16 border-4 border-orange-100 rounded-full animate-spin"></div>
          <div className="absolute top-0 left-0 w-16 h-16 border-t-4 border-orange-500 rounded-full animate-spin"></div>
          <div className="absolute top-1/2 left-1/2 w-3 h-3 bg-orange-500 rounded-full -translate-x-1/2 -translate-y-1/2"></div>
        </div>
        <p className="mt-4 text-orange-600 font-medium">
          Loading your schedules...
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto">
      {/* Dashboard Header */}
      <div className="mb-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-slate-800 flex items-center">
              <Calendar className="mr-2 text-orange-600" size={28} />
              Interview Schedules
            </h1>
            <p className="text-slate-500 mt-1">
              {userRole === "recruiter"
                ? "Manage your upcoming interviews and meetings with candidates"
                : "Your upcoming interviews and meetings with recruiters"}
            </p>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
        <div
          className={`bg-white rounded-xl p-4 border ${
            filterStatus === "all"
              ? "border-orange-300 ring-1 ring-orange-300"
              : "border-slate-200"
          } shadow-sm cursor-pointer hover:border-orange-300 transition-colors`}
          onClick={() => setFilterStatus("all")}
        >
          <div className="flex items-center justify-between mb-2">
            <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
              <Calendar size={20} className="text-blue-600" />
            </div>
            <span className="text-xs font-medium text-blue-600 bg-blue-100 px-2 py-1 rounded-full">
              All
            </span>
          </div>
          <h3 className="text-2xl font-bold text-slate-800">{counts.all}</h3>
          <p className="text-sm text-slate-500">Total Schedules</p>
        </div>

        <div
          className={`bg-white rounded-xl p-4 border ${
            filterStatus === "upcoming"
              ? "border-orange-300 ring-1 ring-orange-300"
              : "border-slate-200"
          } shadow-sm cursor-pointer hover:border-orange-300 transition-colors`}
          onClick={() => setFilterStatus("upcoming")}
        >
          <div className="flex items-center justify-between mb-2">
            <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
              <Calendar size={20} className="text-green-600" />
            </div>
            <span className="text-xs font-medium text-green-600 bg-green-100 px-2 py-1 rounded-full">
              Upcoming
            </span>
          </div>
          <h3 className="text-2xl font-bold text-slate-800">
            {counts.upcoming}
          </h3>
          <p className="text-sm text-slate-500">Upcoming Interviews</p>
        </div>

        <div
          className={`bg-white rounded-xl p-4 border ${
            filterStatus === "today"
              ? "border-orange-300 ring-1 ring-orange-300"
              : "border-slate-200"
          } shadow-sm cursor-pointer hover:border-orange-300 transition-colors`}
          onClick={() => setFilterStatus("today")}
        >
          <div className="flex items-center justify-between mb-2">
            <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center">
              <Clock size={20} className="text-amber-600" />
            </div>
            <span className="text-xs font-medium text-amber-600 bg-amber-100 px-2 py-1 rounded-full">
              Today
            </span>
          </div>
          <h3 className="text-2xl font-bold text-slate-800">{counts.today}</h3>
          <p className="text-sm text-slate-500">Today&apos;s Interviews</p>
        </div>

        <div
          className={`bg-white rounded-xl p-4 border ${
            filterStatus === "past"
              ? "border-orange-300 ring-1 ring-orange-300"
              : "border-slate-200"
          } shadow-sm cursor-pointer hover:border-orange-300 transition-colors`}
          onClick={() => setFilterStatus("past")}
        >
          <div className="flex items-center justify-between mb-2">
            <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center">
              <Clock size={20} className="text-slate-600" />
            </div>
            <span className="text-xs font-medium text-slate-600 bg-slate-100 px-2 py-1 rounded-full">
              Past
            </span>
          </div>
          <h3 className="text-2xl font-bold text-slate-800">{counts.past}</h3>
          <p className="text-sm text-slate-500">Past Interviews</p>
        </div>
      </div>

      {/* Search and View Toggle */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden mb-6">
        <div className="p-4 border-b border-slate-200">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-grow">
              <input
                type="text"
                placeholder="Search by job title, company, or stage..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 w-full border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              />
              <Search className="absolute left-3 top-2.5 h-5 w-5 text-slate-400" />
            </div>

            <div className="flex gap-2">
              <div className="relative">
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="pl-10 pr-8 py-2 border border-slate-300 rounded-md appearance-none focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                >
                  <option value="all">All Schedules</option>
                  <option value="upcoming">Upcoming</option>
                  <option value="today">Today</option>
                  <option value="past">Past</option>
                </select>
                <Filter className="absolute left-3 top-2.5 h-5 w-5 text-slate-400" />
              </div>

              <div className="flex border border-slate-300 rounded-md overflow-hidden">
                <button
                  onClick={() => setCalendarView(false)}
                  className={`px-3 py-2 ${!calendarView ? "bg-orange-100 text-orange-600" : "bg-white text-slate-500"}`}
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
                <button
                  onClick={() => setCalendarView(true)}
                  className={`px-3 py-2 ${calendarView ? "bg-orange-100 text-orange-600" : "bg-white text-slate-500"}`}
                >
                  <Calendar size={20} />
                </button>
              </div>
            </div>
          </div>
        </div>

        {selectedDate && (
          <div className="px-4 py-3 bg-orange-50 border-b border-orange-100 flex items-center justify-between">
            <p className="text-sm text-orange-800">
              <span className="font-medium">Filtered by date:</span>{" "}
              {formatDate(selectedDate)}
            </p>
            <button
              onClick={clearDateFilter}
              className="text-orange-600 hover:text-orange-800 text-sm font-medium"
            >
              Clear filter
            </button>
          </div>
        )}

        <div className="px-4 py-3 bg-slate-50 border-b border-slate-200 flex flex-wrap items-center justify-between">
          <p className="text-sm text-slate-600">
            <span className="font-medium">{filteredSchedules.length}</span>{" "}
            schedule
            {filteredSchedules.length !== 1 && "s"} found
          </p>
        </div>
      </div>

      {/* Calendar View */}
      {calendarView && (
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden mb-6">
          <div className="p-4 border-b border-slate-200 flex items-center justify-between">
            <button
              onClick={prevMonth}
              className="p-2 rounded-full hover:bg-slate-100 text-slate-600"
            >
              <ChevronLeft size={20} />
            </button>
            <h3 className="text-lg font-medium text-slate-800">
              {currentMonth.toLocaleDateString("en-US", {
                month: "long",
                year: "numeric",
              })}
            </h3>
            <button
              onClick={nextMonth}
              className="p-2 rounded-full hover:bg-slate-100 text-slate-600"
            >
              <ChevronRight size={20} />
            </button>
          </div>

          <div className="p-4">
            <div className="grid grid-cols-7 gap-1 mb-2">
              {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
                <div
                  key={day}
                  className="h-10 flex items-center justify-center text-sm font-medium text-slate-500"
                >
                  {day}
                </div>
              ))}
            </div>

            <div className="grid grid-cols-7 gap-1 relative">
              {renderCalendar()}
            </div>
          </div>
        </div>
      )}

      {/* Schedules List */}
      {!schedules?.length ? (
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="text-center py-16">
            <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Calendar className="h-8 w-8 text-slate-400" />
            </div>
            <h3 className="text-lg font-medium text-slate-800 mb-1">
              No schedules found
            </h3>
            <p className="text-slate-600 max-w-md mx-auto">
              You don&apos;t have any upcoming interviews or meetings scheduled.
            </p>
          </div>
        </div>
      ) : filteredSchedules.length === 0 ? (
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="text-center py-16">
            <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <AlertCircle className="h-8 w-8 text-slate-400" />
            </div>
            <h3 className="text-lg font-medium text-slate-800 mb-1">
              No matching schedules
            </h3>
            <p className="text-slate-600 max-w-md mx-auto">
              No schedules match your current filters. Try adjusting your search
              or filter criteria.
            </p>
            <button
              onClick={() => {
                setFilterStatus("all");
                setSearchTerm("");
                setSelectedDate(null);
              }}
              className="mt-4 px-4 py-2 bg-orange-600 text-white rounded-md hover:bg-orange-700 transition-colors"
            >
              Reset Filters
            </button>
          </div>
        </div>
      ) : (
        <div className="space-y-8">
          {sortedDates.map((dateString) => {
            const date = new Date(dateString);
            const isToday = date.toDateString() === new Date().toDateString();
            const isPast = date < new Date() && !isToday;

            return (
              <div key={dateString}>
                <div className="flex items-center mb-4">
                  <div
                    className={`w-12 h-12 rounded-full flex items-center justify-center mr-4 ${
                      isToday
                        ? "bg-amber-100"
                        : isPast
                          ? "bg-slate-100"
                          : "bg-green-100"
                    }`}
                  >
                    <span
                      className={`text-xl font-bold ${
                        isToday
                          ? "text-amber-600"
                          : isPast
                            ? "text-slate-600"
                            : "text-green-600"
                      }`}
                    >
                      {date.getDate()}
                    </span>
                  </div>
                  <div>
                    <h3
                      className={`text-lg font-semibold ${
                        isToday
                          ? "text-amber-600"
                          : isPast
                            ? "text-slate-600"
                            : "text-green-600"
                      }`}
                    >
                      {isToday ? "Today" : formatDate(date).split(",")[0]}
                    </h3>
                    <p className="text-slate-500">
                      {date.toLocaleDateString(undefined, {
                        month: "long",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </p>
                  </div>
                </div>

                <div className="space-y-4">
                  {groupedSchedules[dateString].map((schedule) => {
                    const job = jobs.find((j) => j._id === schedule.jobId);
                    const status = getStatusColor(schedule.scheduledDate);

                    return (
                      <div
                        key={schedule._id}
                        className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden hover:shadow-md transition-shadow"
                      >
                        <div
                          className={`h-1 ${
                            status === "past"
                              ? "bg-slate-400"
                              : status === "today"
                                ? "bg-amber-500"
                                : status === "soon"
                                  ? "bg-orange-500"
                                  : "bg-green-500"
                          }`}
                        ></div>

                        <div className="p-6">
                          <div className="flex flex-col md:flex-row gap-6">
                            {/* Left side - Time */}
                            <div className="md:w-1/4 flex flex-col">
                              <div className="flex items-center mb-3">
                                <Clock className="h-5 w-5 text-slate-400 mr-2" />
                                <span className="text-slate-800 font-medium">
                                  {schedule.startTime} - {schedule.endTime}
                                </span>
                              </div>

                              <div className="flex items-center mb-3">
                                <div
                                  className={`px-3 py-1 rounded-full text-sm font-medium ${
                                    status === "past"
                                      ? "bg-slate-100 text-slate-600"
                                      : status === "today"
                                        ? "bg-amber-100 text-amber-800"
                                        : status === "soon"
                                          ? "bg-orange-100 text-orange-800"
                                          : "bg-green-100 text-green-800"
                                  }`}
                                >
                                  {status === "past"
                                    ? "Past"
                                    : status === "today"
                                      ? "Today"
                                      : status === "soon"
                                        ? "Coming Soon"
                                        : "Upcoming"}
                                </div>
                              </div>

                              {schedule.meetingType && (
                                <div className="flex items-center">
                                  {schedule.meetingType
                                    .toLowerCase()
                                    .includes("video") ? (
                                    <Video className="h-4 w-4 text-blue-500 mr-2" />
                                  ) : schedule.meetingType
                                      .toLowerCase()
                                      .includes("phone") ? (
                                    <Phone className="h-4 w-4 text-green-500 mr-2" />
                                  ) : (
                                    <Users className="h-4 w-4 text-purple-500 mr-2" />
                                  )}
                                  <span className="text-slate-600 text-sm">
                                    {schedule.meetingType}
                                  </span>
                                </div>
                              )}
                            </div>

                            {/* Right side - Details */}
                            <div className="md:w-3/4 md:border-l md:pl-6">
                              <div className="flex flex-col md:flex-row md:justify-between md:items-start">
                                <div>
                                  <h3 className="text-xl font-semibold text-slate-800 mb-2">
                                    {schedule.stageName}
                                  </h3>

                                  {job && (
                                    <div className="space-y-2 mb-4">
                                      <div className="flex items-center">
                                        <Briefcase className="h-4 w-4 text-slate-400 mr-2" />
                                        <span className="text-slate-700">
                                          {job.jobTitle || "Unknown Title"}
                                        </span>
                                      </div>

                                      <div className="flex items-center">
                                        <Building className="h-4 w-4 text-slate-400 mr-2" />
                                        <span className="text-slate-700">
                                          {job.companyInfo?.companyName ||
                                            "Unknown Company"}
                                        </span>
                                      </div>

                                      {job.jobLocation && (
                                        <div className="flex items-center">
                                          <MapPin className="h-4 w-4 text-slate-400 mr-2" />
                                          <span className="text-slate-700">
                                            {job.jobLocation}
                                          </span>
                                        </div>
                                      )}
                                    </div>
                                  )}
                                </div>

                                {userRole === "recruiter" &&
                                  schedule.candidateName && (
                                    <div className="mt-4 md:mt-0 flex items-center bg-slate-50 px-3 py-2 rounded-lg">
                                      <User className="h-5 w-5 text-slate-400 mr-2" />
                                      <div>
                                        <p className="text-xs text-slate-500">
                                          Candidate
                                        </p>
                                        <p className="text-slate-700 font-medium">
                                          {schedule.candidateName}
                                        </p>
                                      </div>
                                    </div>
                                  )}
                              </div>

                              {schedule.note && (
                                <div className="mt-4 bg-slate-50 p-4 rounded-lg border border-slate-200">
                                  <div className="flex">
                                    <AlertCircle className="h-5 w-5 text-slate-400 mr-2 flex-shrink-0" />
                                    <div>
                                      <p className="text-xs font-medium text-slate-500 mb-1">
                                        Notes
                                      </p>
                                      <p className="text-sm text-slate-700">
                                        {schedule.note}
                                      </p>
                                    </div>
                                  </div>
                                </div>
                              )}

                              {schedule.meetingLink && (
                                <div className="mt-4">
                                  <a
                                    href={schedule.meetingLink}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                                  >
                                    <Video className="h-4 w-4 mr-2" />
                                    Join Meeting
                                  </a>
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
            );
          })}
        </div>
      )}
    </div>
  );
};

export default InterviewSchedules;
