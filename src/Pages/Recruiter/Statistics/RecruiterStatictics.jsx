"use client";

import { useState, useContext } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  BarChart2,
  Users,
  Clock,
  Calendar,
  Filter,
  ChevronDown,
  CheckCircle,
  UserCheck,
  AlertCircle,
  ArrowUpRight,
  ArrowDownRight,
} from "lucide-react";

// These would be your actual imports in your project
import { AuthContext } from "../../../Providers/AuthProvider";
import useAxiosBase from "../../../CustomHooks/useAxiosBase";

// Chart components
import {
  ResponsiveContainer,
  BarChart,
  Bar as RechartsBar,
  LineChart,
  Line as RechartsLine,
  PieChart,
  Pie as RechartsPie,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  AreaChart,
  Area,
  Cell,
} from "recharts";

const RecruiterStatistics = () => {
  const { user } = useContext(AuthContext);
  const axiosBase = useAxiosBase();
  const [timeRange, setTimeRange] = useState("last30days");
  const [selectedMetric, setSelectedMetric] = useState("applications");
  const [selectedJob, setSelectedJob] = useState("all");

  // Fetch recruiter's jobs
  const { data: jobs = [], isLoading: isJobsLoading } = useQuery({
    queryKey: ["recruiterJobs", user?.email],
    queryFn: async () => {
      const response = await axiosBase.get(`/jobs/myPostedJobs/${user?.email}`);
      return response.data;
    },
    enabled: !!user?.email,
  });

  // Fetch statistics data
  const { data: stats, isLoading: isStatsLoading } = useQuery({
    queryKey: ["recruiterStats", user?.email, timeRange, selectedJob],
    queryFn: async () => {
      // In a real implementation, you would fetch actual statistics from your API
      // For this example, we'll generate mock data
      return generateMockStatistics(timeRange, selectedJob);
    },
    enabled: !!user?.email,
  });

  // Generate mock statistics data
  const generateMockStatistics = (period, jobId) => {
    // This would be replaced with actual API data in a real implementation
    const baseStats = {
      overview: {
        totalApplications: 87,
        totalHires: 5,
        totalInterviews: 23,
        averageTimeToHire: 18, // days
        applicationConversionRate: 26.4, // percentage
        offerAcceptanceRate: 85.7, // percentage
      },
      trends: {
        applications: generateTrendData(period, 2, 12),
        interviews: generateTrendData(period, 1, 5),
        hires: generateTrendData(period, 0, 2),
        timeToHire: generateTrendData(period, 15, 25),
      },
      sources: [
        { name: "LinkedIn", value: 42 },
        { name: "Company Website", value: 23 },
        { name: "Indeed", value: 15 },
        { name: "Referrals", value: 8 },
        { name: "Other", value: 12 },
      ],
      stages: [
        { name: "Applied", value: 100 },
        { name: "Screened", value: 68 },
        { name: "First Interview", value: 42 },
        { name: "Second Interview", value: 23 },
        { name: "Offer", value: 7 },
        { name: "Hired", value: 5 },
      ],
      jobPerformance: jobs.map((job) => ({
        id: job._id,
        title: job.jobTitle,
        applications: Math.floor(Math.random() * 30) + 5,
        interviews: Math.floor(Math.random() * 10) + 1,
        hires: Math.floor(Math.random() * 3),
        views: Math.floor(Math.random() * 200) + 50,
        conversionRate: Math.floor(Math.random() * 30) + 10,
      })),
      comparisonWithAverage: {
        timeToHire: {
          value: 18,
          average: 22,
          change: -18.2, // percentage
        },
        applicationToInterview: {
          value: 26.4,
          average: 20.1,
          change: 31.3, // percentage
        },
        interviewToOffer: {
          value: 30.4,
          average: 25.8,
          change: 17.8, // percentage
        },
        offerAcceptance: {
          value: 85.7,
          average: 76.2,
          change: 12.5, // percentage
        },
      },
    };

    // Filter job-specific data if a specific job is selected
    if (jobId !== "all") {
      const selectedJobData = baseStats.jobPerformance.find(
        (job) => job.id === jobId
      );
      if (selectedJobData) {
        baseStats.overview.totalApplications = selectedJobData.applications;
        baseStats.overview.totalInterviews = selectedJobData.interviews;
        baseStats.overview.totalHires = selectedJobData.hires;
        // Adjust other metrics accordingly
      }
    }

    return baseStats;
  };

  // Generate trend data based on time period
  const generateTrendData = (period, min, max) => {
    let days = 30;
    if (period === "last90days") days = 90;
    if (period === "last180days") days = 180;
    if (period === "lastYear") days = 365;

    // For monthly view, we'll generate monthly data points
    if (period === "lastYear") {
      const months = [
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "May",
        "Jun",
        "Jul",
        "Aug",
        "Sep",
        "Oct",
        "Nov",
        "Dec",
      ];
      return months.map((month) => ({
        name: month,
        value: Math.floor(Math.random() * (max - min + 1)) + min,
      }));
    }

    // For weekly view (30, 90, 180 days)
    const data = [];
    const intervals =
      period === "last30days" ? 4 : period === "last90days" ? 12 : 24;
    const daysPerInterval = days / intervals;

    for (let i = 0; i < intervals; i++) {
      const startDay = i * daysPerInterval + 1;
      const endDay = (i + 1) * daysPerInterval;
      data.push({
        name: `Day ${startDay}-${endDay}`,
        value: Math.floor(Math.random() * (max - min + 1)) + min,
      });
    }

    return data;
  };

  // Calculate changes from previous period
  const calculateChange = (current, previous) => {
    if (!previous) return 0;
    return ((current - previous) / previous) * 100;
  };

  // Colors for charts
  const COLORS = [
    "#0088FE",
    "#00C49F",
    "#FFBB28",
    "#FF8042",
    "#8884D8",
    "#FF6B6B",
  ];

  // Loading state
  if (isJobsLoading || isStatsLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh]">
        <div className="relative">
          <div className="w-16 h-16 border-4 border-orange-100 rounded-full animate-spin"></div>
          <div className="absolute top-0 left-0 w-16 h-16 border-t-4 border-orange-500 rounded-full animate-spin"></div>
          <div className="absolute top-1/2 left-1/2 w-3 h-3 bg-orange-500 rounded-full -translate-x-1/2 -translate-y-1/2"></div>
        </div>
        <p className="mt-4 text-orange-600 font-medium">
          Loading your recruitment statistics...
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
              <BarChart2 className="mr-2 text-orange-600" size={28} />
              Recruitment Analytics
            </h1>
            <p className="text-slate-500 mt-1">
              Track and analyze your recruitment performance and metrics
            </p>
          </div>

          <div className="mt-4 md:mt-0 flex flex-wrap gap-2">
            <div className="relative">
              <select
                value={timeRange}
                onChange={(e) => setTimeRange(e.target.value)}
                className="pl-4 pr-10 py-2 border border-slate-300 rounded-md appearance-none focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent bg-white"
              >
                <option value="last30days">Last 30 Days</option>
                <option value="last90days">Last 90 Days</option>
                <option value="last180days">Last 180 Days</option>
                <option value="lastYear">Last Year</option>
              </select>
              <ChevronDown className="absolute right-3 top-2.5 h-5 w-5 text-slate-400 pointer-events-none" />
            </div>

            <div className="relative">
              <select
                value={selectedJob}
                onChange={(e) => setSelectedJob(e.target.value)}
                className="pl-4 pr-10 py-2 border border-slate-300 rounded-md appearance-none focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent bg-white"
              >
                <option value="all">All Jobs</option>
                {jobs.map((job) => (
                  <option key={job._id} value={job._id}>
                    {job.jobTitle}
                  </option>
                ))}
              </select>
              <Filter className="absolute right-3 top-2.5 h-5 w-5 text-slate-400 pointer-events-none" />
            </div>
          </div>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
              <Users size={20} className="text-blue-600" />
            </div>
            <div className="flex items-center">
              <span
                className={`text-xs font-medium ${
                  calculateChange(
                    stats.overview.totalApplications,
                    stats.overview.totalApplications * 0.9
                  ) >= 0
                    ? "text-green-600"
                    : "text-red-600"
                } flex items-center`}
              >
                {calculateChange(
                  stats.overview.totalApplications,
                  stats.overview.totalApplications * 0.9
                ) >= 0 ? (
                  <ArrowUpRight size={12} className="mr-1" />
                ) : (
                  <ArrowDownRight size={12} className="mr-1" />
                )}
                {Math.abs(
                  calculateChange(
                    stats.overview.totalApplications,
                    stats.overview.totalApplications * 0.9
                  )
                ).toFixed(1)}
                %
              </span>
            </div>
          </div>
          <h3 className="text-2xl font-bold text-slate-800">
            {stats.overview.totalApplications}
          </h3>
          <p className="text-sm text-slate-500">Total Applications</p>
        </div>

        <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
              <Calendar size={20} className="text-green-600" />
            </div>
            <div className="flex items-center">
              <span
                className={`text-xs font-medium ${
                  calculateChange(
                    stats.overview.totalInterviews,
                    stats.overview.totalInterviews * 0.85
                  ) >= 0
                    ? "text-green-600"
                    : "text-red-600"
                } flex items-center`}
              >
                {calculateChange(
                  stats.overview.totalInterviews,
                  stats.overview.totalInterviews * 0.85
                ) >= 0 ? (
                  <ArrowUpRight size={12} className="mr-1" />
                ) : (
                  <ArrowDownRight size={12} className="mr-1" />
                )}
                {Math.abs(
                  calculateChange(
                    stats.overview.totalInterviews,
                    stats.overview.totalInterviews * 0.85
                  )
                ).toFixed(1)}
                %
              </span>
            </div>
          </div>
          <h3 className="text-2xl font-bold text-slate-800">
            {stats.overview.totalInterviews}
          </h3>
          <p className="text-sm text-slate-500">Interviews Conducted</p>
        </div>

        <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center">
              <UserCheck size={20} className="text-purple-600" />
            </div>
            <div className="flex items-center">
              <span
                className={`text-xs font-medium ${
                  calculateChange(
                    stats.overview.totalHires,
                    stats.overview.totalHires * 0.8
                  ) >= 0
                    ? "text-green-600"
                    : "text-red-600"
                } flex items-center`}
              >
                {calculateChange(
                  stats.overview.totalHires,
                  stats.overview.totalHires * 0.8
                ) >= 0 ? (
                  <ArrowUpRight size={12} className="mr-1" />
                ) : (
                  <ArrowDownRight size={12} className="mr-1" />
                )}
                {Math.abs(
                  calculateChange(
                    stats.overview.totalHires,
                    stats.overview.totalHires * 0.8
                  )
                ).toFixed(1)}
                %
              </span>
            </div>
          </div>
          <h3 className="text-2xl font-bold text-slate-800">
            {stats.overview.totalHires}
          </h3>
          <p className="text-sm text-slate-500">Total Hires</p>
        </div>

        <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center">
              <Clock size={20} className="text-amber-600" />
            </div>
            <div className="flex items-center">
              <span
                className={`text-xs font-medium ${
                  calculateChange(
                    stats.overview.averageTimeToHire,
                    stats.overview.averageTimeToHire * 1.1
                  ) <= 0
                    ? "text-green-600"
                    : "text-red-600"
                } flex items-center`}
              >
                {calculateChange(
                  stats.overview.averageTimeToHire,
                  stats.overview.averageTimeToHire * 1.1
                ) <= 0 ? (
                  <ArrowUpRight size={12} className="mr-1" />
                ) : (
                  <ArrowDownRight size={12} className="mr-1" />
                )}
                {Math.abs(
                  calculateChange(
                    stats.overview.averageTimeToHire,
                    stats.overview.averageTimeToHire * 1.1
                  )
                ).toFixed(1)}
                %
              </span>
            </div>
          </div>
          <h3 className="text-2xl font-bold text-slate-800">
            {stats.overview.averageTimeToHire}
          </h3>
          <p className="text-sm text-slate-500">Avg. Days to Hire</p>
        </div>
      </div>

      {/* Conversion Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-200">
            <h2 className="font-semibold text-slate-800">Conversion Rates</h2>
          </div>
          <div className="p-6">
            <div className="space-y-6">
              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm text-slate-600">
                    Application to Interview
                  </span>
                  <span className="text-sm font-medium text-slate-800">
                    {stats.overview.applicationConversionRate}%
                  </span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-2.5">
                  <div
                    className="bg-blue-500 h-2.5 rounded-full"
                    style={{
                      width: `${stats.overview.applicationConversionRate}%`,
                    }}
                  ></div>
                </div>
                <div className="flex justify-end mt-1">
                  <span
                    className={`text-xs ${
                      stats.comparisonWithAverage.applicationToInterview
                        .change >= 0
                        ? "text-green-600"
                        : "text-red-600"
                    } flex items-center`}
                  >
                    {stats.comparisonWithAverage.applicationToInterview
                      .change >= 0 ? (
                      <ArrowUpRight size={12} className="mr-1" />
                    ) : (
                      <ArrowDownRight size={12} className="mr-1" />
                    )}
                    {Math.abs(
                      stats.comparisonWithAverage.applicationToInterview.change
                    ).toFixed(1)}
                    % vs. industry avg
                  </span>
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm text-slate-600">
                    Interview to Offer
                  </span>
                  <span className="text-sm font-medium text-slate-800">
                    {stats.comparisonWithAverage.interviewToOffer.value}%
                  </span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-2.5">
                  <div
                    className="bg-green-500 h-2.5 rounded-full"
                    style={{
                      width: `${stats.comparisonWithAverage.interviewToOffer.value}%`,
                    }}
                  ></div>
                </div>
                <div className="flex justify-end mt-1">
                  <span
                    className={`text-xs ${
                      stats.comparisonWithAverage.interviewToOffer.change >= 0
                        ? "text-green-600"
                        : "text-red-600"
                    } flex items-center`}
                  >
                    {stats.comparisonWithAverage.interviewToOffer.change >=
                    0 ? (
                      <ArrowUpRight size={12} className="mr-1" />
                    ) : (
                      <ArrowDownRight size={12} className="mr-1" />
                    )}
                    {Math.abs(
                      stats.comparisonWithAverage.interviewToOffer.change
                    ).toFixed(1)}
                    % vs. industry avg
                  </span>
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm text-slate-600">
                    Offer Acceptance
                  </span>
                  <span className="text-sm font-medium text-slate-800">
                    {stats.comparisonWithAverage.offerAcceptance.value}%
                  </span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-2.5">
                  <div
                    className="bg-purple-500 h-2.5 rounded-full"
                    style={{
                      width: `${stats.comparisonWithAverage.offerAcceptance.value}%`,
                    }}
                  ></div>
                </div>
                <div className="flex justify-end mt-1">
                  <span
                    className={`text-xs ${
                      stats.comparisonWithAverage.offerAcceptance.change >= 0
                        ? "text-green-600"
                        : "text-red-600"
                    } flex items-center`}
                  >
                    {stats.comparisonWithAverage.offerAcceptance.change >= 0 ? (
                      <ArrowUpRight size={12} className="mr-1" />
                    ) : (
                      <ArrowDownRight size={12} className="mr-1" />
                    )}
                    {Math.abs(
                      stats.comparisonWithAverage.offerAcceptance.change
                    ).toFixed(1)}
                    % vs. industry avg
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-200">
            <h2 className="font-semibold text-slate-800">Recruitment Funnel</h2>
          </div>
          <div className="p-6">
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  layout="vertical"
                  data={stats.stages}
                  margin={{
                    top: 5,
                    right: 30,
                    left: 20,
                    bottom: 5,
                  }}
                >
                  <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                  <XAxis type="number" />
                  <YAxis dataKey="name" type="category" width={100} />
                  <Tooltip
                    formatter={(value, name, props) => [
                      `${value} candidates`,
                      props.payload.name,
                    ]}
                    labelFormatter={() => ""}
                  />
                  <RechartsBar
                    dataKey="value"
                    fill="#ff9800"
                    radius={[0, 4, 4, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>

      {/* Trend Charts */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden mb-6">
        <div className="px-6 py-4 border-b border-slate-200 flex justify-between items-center">
          <h2 className="font-semibold text-slate-800">Recruitment Trends</h2>
          <div className="flex space-x-2">
            <button
              onClick={() => setSelectedMetric("applications")}
              className={`px-3 py-1 text-sm rounded-md ${
                selectedMetric === "applications"
                  ? "bg-blue-100 text-blue-700 font-medium"
                  : "text-slate-600 hover:bg-slate-100"
              }`}
            >
              Applications
            </button>
            <button
              onClick={() => setSelectedMetric("interviews")}
              className={`px-3 py-1 text-sm rounded-md ${
                selectedMetric === "interviews"
                  ? "bg-green-100 text-green-700 font-medium"
                  : "text-slate-600 hover:bg-slate-100"
              }`}
            >
              Interviews
            </button>
            <button
              onClick={() => setSelectedMetric("hires")}
              className={`px-3 py-1 text-sm rounded-md ${
                selectedMetric === "hires"
                  ? "bg-purple-100 text-purple-700 font-medium"
                  : "text-slate-600 hover:bg-slate-100"
              }`}
            >
              Hires
            </button>
            <button
              onClick={() => setSelectedMetric("timeToHire")}
              className={`px-3 py-1 text-sm rounded-md ${
                selectedMetric === "timeToHire"
                  ? "bg-amber-100 text-amber-700 font-medium"
                  : "text-slate-600 hover:bg-slate-100"
              }`}
            >
              Time to Hire
            </button>
          </div>
        </div>
        <div className="p-6">
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              {selectedMetric === "timeToHire" ? (
                <LineChart
                  data={stats.trends[selectedMetric]}
                  margin={{
                    top: 5,
                    right: 30,
                    left: 20,
                    bottom: 5,
                  }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip
                    formatter={(value) => [`${value} days`, "Time to Hire"]}
                  />
                  <Legend />
                  <RechartsLine
                    type="monotone"
                    dataKey="value"
                    name="Time to Hire (days)"
                    stroke="#f59e0b"
                    activeDot={{ r: 8 }}
                    strokeWidth={2}
                  />
                </LineChart>
              ) : (
                <AreaChart
                  data={stats.trends[selectedMetric]}
                  margin={{
                    top: 10,
                    right: 30,
                    left: 0,
                    bottom: 0,
                  }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Area
                    type="monotone"
                    dataKey="value"
                    name={
                      selectedMetric === "applications"
                        ? "Applications"
                        : selectedMetric === "interviews"
                          ? "Interviews"
                          : "Hires"
                    }
                    stroke={
                      selectedMetric === "applications"
                        ? "#3b82f6"
                        : selectedMetric === "interviews"
                          ? "#10b981"
                          : "#8b5cf6"
                    }
                    fill={
                      selectedMetric === "applications"
                        ? "#dbeafe"
                        : selectedMetric === "interviews"
                          ? "#d1fae5"
                          : "#ede9fe"
                    }
                  />
                </AreaChart>
              )}
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Source Distribution & Job Performance */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-200">
            <h2 className="font-semibold text-slate-800">
              Application Sources
            </h2>
          </div>
          <div className="p-6">
            <div className="h-64 flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <RechartsPie
                    data={stats.sources}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    nameKey="name"
                    label={({ name, percent }) =>
                      `${name}: ${(percent * 100).toFixed(0)}%`
                    }
                  >
                    {stats.sources.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))}
                  </RechartsPie>
                  <Tooltip
                    formatter={(value, name) => [`${value} applications`, name]}
                  />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-200">
            <h2 className="font-semibold text-slate-800">Job Performance</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-200">
              <thead className="bg-slate-50">
                <tr>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider"
                  >
                    Job Title
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider"
                  >
                    Applications
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider"
                  >
                    Interviews
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider"
                  >
                    Conversion
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-slate-200">
                {stats.jobPerformance.slice(0, 5).map((job) => (
                  <tr key={job.id} className="hover:bg-slate-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-800">
                      {job.title.length > 30
                        ? job.title.substring(0, 30) + "..."
                        : job.title}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600">
                      {job.applications}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600">
                      {job.interviews}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600">
                      <span
                        className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          job.conversionRate > 25
                            ? "bg-green-100 text-green-800"
                            : job.conversionRate > 15
                              ? "bg-amber-100 text-amber-800"
                              : "bg-red-100 text-red-800"
                        }`}
                      >
                        {job.conversionRate}%
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {stats.jobPerformance.length > 5 && (
            <div className="px-6 py-3 bg-slate-50 border-t border-slate-200 text-center">
              <button className="text-sm text-orange-600 hover:text-orange-700 font-medium">
                View All Jobs ({stats.jobPerformance.length})
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Efficiency Metrics */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden mb-6">
        <div className="px-6 py-4 border-b border-slate-200">
          <h2 className="font-semibold text-slate-800">
            Recruitment Efficiency
          </h2>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-slate-50 rounded-lg p-4 border border-slate-200">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-medium text-slate-700">
                  Time to Hire
                </h3>
                <span
                  className={`px-2 py-1 text-xs font-medium rounded-full ${
                    stats.comparisonWithAverage.timeToHire.change <= 0
                      ? "bg-green-100 text-green-800"
                      : "bg-red-100 text-red-800"
                  }`}
                >
                  {stats.comparisonWithAverage.timeToHire.change <= 0 ? (
                    <span>
                      ↓{" "}
                      {Math.abs(
                        stats.comparisonWithAverage.timeToHire.change
                      ).toFixed(1)}
                      %
                    </span>
                  ) : (
                    <span>
                      ↑{" "}
                      {stats.comparisonWithAverage.timeToHire.change.toFixed(1)}
                      %
                    </span>
                  )}
                </span>
              </div>
              <div className="flex items-end space-x-2">
                <div className="text-2xl font-bold text-slate-800">
                  {stats.comparisonWithAverage.timeToHire.value}
                </div>
                <div className="text-sm text-slate-500 mb-1">days</div>
              </div>
              <div className="mt-2 text-xs text-slate-500">
                Industry average:{" "}
                {stats.comparisonWithAverage.timeToHire.average} days
              </div>
            </div>

            <div className="bg-slate-50 rounded-lg p-4 border border-slate-200">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-medium text-slate-700">
                  Application to Interview
                </h3>
                <span
                  className={`px-2 py-1 text-xs font-medium rounded-full ${
                    stats.comparisonWithAverage.applicationToInterview.change >=
                    0
                      ? "bg-green-100 text-green-800"
                      : "bg-red-100 text-red-800"
                  }`}
                >
                  {stats.comparisonWithAverage.applicationToInterview.change >=
                  0 ? (
                    <span>
                      ↑{" "}
                      {stats.comparisonWithAverage.applicationToInterview.change.toFixed(
                        1
                      )}
                      %
                    </span>
                  ) : (
                    <span>
                      ↓{" "}
                      {Math.abs(
                        stats.comparisonWithAverage.applicationToInterview
                          .change
                      ).toFixed(1)}
                      %
                    </span>
                  )}
                </span>
              </div>
              <div className="flex items-end space-x-2">
                <div className="text-2xl font-bold text-slate-800">
                  {stats.comparisonWithAverage.applicationToInterview.value}%
                </div>
                <div className="text-sm text-slate-500 mb-1">conversion</div>
              </div>
              <div className="mt-2 text-xs text-slate-500">
                Industry average:{" "}
                {stats.comparisonWithAverage.applicationToInterview.average}%
              </div>
            </div>

            <div className="bg-slate-50 rounded-lg p-4 border border-slate-200">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-medium text-slate-700">
                  Interview to Offer
                </h3>
                <span
                  className={`px-2 py-1 text-xs font-medium rounded-full ${
                    stats.comparisonWithAverage.interviewToOffer.change >= 0
                      ? "bg-green-100 text-green-800"
                      : "bg-red-100 text-red-800"
                  }`}
                >
                  {stats.comparisonWithAverage.interviewToOffer.change >= 0 ? (
                    <span>
                      ↑{" "}
                      {stats.comparisonWithAverage.interviewToOffer.change.toFixed(
                        1
                      )}
                      %
                    </span>
                  ) : (
                    <span>
                      ↓{" "}
                      {Math.abs(
                        stats.comparisonWithAverage.interviewToOffer.change
                      ).toFixed(1)}
                      %
                    </span>
                  )}
                </span>
              </div>
              <div className="flex items-end space-x-2">
                <div className="text-2xl font-bold text-slate-800">
                  {stats.comparisonWithAverage.interviewToOffer.value}%
                </div>
                <div className="text-sm text-slate-500 mb-1">conversion</div>
              </div>
              <div className="mt-2 text-xs text-slate-500">
                Industry average:{" "}
                {stats.comparisonWithAverage.interviewToOffer.average}%
              </div>
            </div>

            <div className="bg-slate-50 rounded-lg p-4 border border-slate-200">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-medium text-slate-700">
                  Offer Acceptance
                </h3>
                <span
                  className={`px-2 py-1 text-xs font-medium rounded-full ${
                    stats.comparisonWithAverage.offerAcceptance.change >= 0
                      ? "bg-green-100 text-green-800"
                      : "bg-red-100 text-red-800"
                  }`}
                >
                  {stats.comparisonWithAverage.offerAcceptance.change >= 0 ? (
                    <span>
                      ↑{" "}
                      {stats.comparisonWithAverage.offerAcceptance.change.toFixed(
                        1
                      )}
                      %
                    </span>
                  ) : (
                    <span>
                      ↓{" "}
                      {Math.abs(
                        stats.comparisonWithAverage.offerAcceptance.change
                      ).toFixed(1)}
                      %
                    </span>
                  )}
                </span>
              </div>
              <div className="flex items-end space-x-2">
                <div className="text-2xl font-bold text-slate-800">
                  {stats.comparisonWithAverage.offerAcceptance.value}%
                </div>
                <div className="text-sm text-slate-500 mb-1">rate</div>
              </div>
              <div className="mt-2 text-xs text-slate-500">
                Industry average:{" "}
                {stats.comparisonWithAverage.offerAcceptance.average}%
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Recommendations */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-200">
          <h2 className="font-semibold text-slate-800">Recommendations</h2>
        </div>
        <div className="p-6">
          <div className="space-y-4">
            <div className="flex items-start p-4 bg-blue-50 rounded-lg border border-blue-100">
              <AlertCircle className="h-5 w-5 text-blue-500 mt-0.5 mr-3 flex-shrink-0" />
              <div>
                <h3 className="font-medium text-blue-800">
                  Improve Application to Interview Rate
                </h3>
                <p className="text-sm text-blue-600 mt-1">
                  Your application to interview rate is{" "}
                  {stats.overview.applicationConversionRate}%, which is{" "}
                  {stats.comparisonWithAverage.applicationToInterview.change >=
                  0
                    ? "above"
                    : "below"}{" "}
                  industry average. Consider refining your job descriptions to
                  attract more qualified candidates.
                </p>
              </div>
            </div>

            <div className="flex items-start p-4 bg-green-50 rounded-lg border border-green-100">
              <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 mr-3 flex-shrink-0" />
              <div>
                <h3 className="font-medium text-green-800">
                  Strong Offer Acceptance Rate
                </h3>
                <p className="text-sm text-green-600 mt-1">
                  Your offer acceptance rate of{" "}
                  {stats.comparisonWithAverage.offerAcceptance.value}% is
                  excellent and{" "}
                  {stats.comparisonWithAverage.offerAcceptance.change.toFixed(
                    1
                  )}
                  % above industry average. Continue providing competitive
                  offers and a positive candidate experience.
                </p>
              </div>
            </div>

            <div className="flex items-start p-4 bg-amber-50 rounded-lg border border-amber-100">
              <Clock className="h-5 w-5 text-amber-500 mt-0.5 mr-3 flex-shrink-0" />
              <div>
                <h3 className="font-medium text-amber-800">
                  Time to Hire Optimization
                </h3>
                <p className="text-sm text-amber-600 mt-1">
                  Your average time to hire is{" "}
                  {stats.overview.averageTimeToHire} days. Consider streamlining
                  your interview process to reduce time between stages and
                  improve candidate experience.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RecruiterStatistics;
