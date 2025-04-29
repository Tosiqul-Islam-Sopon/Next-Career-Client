"use client";

import { useContext, useEffect, useState } from "react";
import {
  FaChartBar,
  FaBuilding,
  FaTags,
  FaSignOutAlt,
  FaUserTie,
} from "react-icons/fa";
import { AuthContext } from "../../Providers/AuthProvider";
import { Link } from "react-router-dom";
import useAxiosBase from "../../CustomHooks/useAxiosBase";
import Swal from "sweetalert2";
import FullScreenLoader from "../Shared/Loaders/FullScreenLoader";

const AdminHome = () => {
  const { logOut } = useContext(AuthContext);
  const [stats, setStats] = useState({
    totalJobs: 0,
    activeRecruiters: 0,
    jobSeekers: 0,
    placements: 0,
  });
  const axiosBase = useAxiosBase();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        const response = await axiosBase.get("/admin/dashboardStats");
        setStats(response.data);
        setLoading(false);
      } catch (error) {
        setLoading(false);
        console.error("Error fetching stats:", error);
      }
    };

    fetchStats();
  }, []);

  const handleLogout = async () => {
    logOut()
      .then(() => {
        window.location.reload();
        Swal.fire({
          position: "center",
          icon: "success",
          title: "Log Out Successful",
          showConfirmButton: false,
          timer: 1500,
        });
      })
      .catch((error) => {
        Swal.fire({
          title: "OPPS!!!",
          text: `${error.message}`,
          icon: "error",
        });
      });
  };

  if (loading) {
    return <FullScreenLoader />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Navigation Bar */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <span className="text-2xl font-bold text-blue-700">
                NextCareer
              </span>
            </div>
            <div className="flex items-center space-x-4">
              {/* <div className="relative">
                <input
                  type="text"
                  placeholder="Search..."
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <FaSearch className="absolute left-3 top-2.5 text-gray-400" />
              </div>
              <button className="p-2 rounded-full text-gray-500 hover:bg-gray-100">
                <FaBell className="text-lg" />
              </button> */}
              {/* <button className="p-2 rounded-full text-gray-500 hover:bg-gray-100">
                <FaCog className="text-lg" />
              </button> */}
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white">
                  <FaUserTie />
                </div>
                <span className="text-sm font-medium text-gray-700">Admin</span>
              </div>
              <button
                onClick={handleLogout}
                className="ml-4 px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
              >
                <span className="flex items-center">
                  <FaSignOutAlt className="mr-2" />
                  Logout
                </span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Dashboard Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
          <p className="mt-1 text-sm text-gray-600">
            Welcome back! Here&apos;s an overview of your platform&apos;s
            performance.
          </p>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-5 mb-8">
          {[
            {
              label: "Total Jobs",
              value: stats.totalJobs,
              change: "+12%",
              color: "bg-blue-500",
            },
            {
              label: "Active Recruiters",
              value: stats.activeRecruiters,
              change: "+5%",
              color: "bg-green-500",
            },
            {
              label: "Job Seekers",
              value: stats.jobSeekers,
              change: "+18%",
              color: "bg-purple-500",
            },
            {
              label: "Placements",
              value: stats.placements,
              change: "+7%",
              color: "bg-amber-500",
            },
          ].map((stat, index) => (
            <div
              key={index}
              className="bg-white rounded-lg shadow-sm border border-gray-100 p-6"
            >
              <div className="flex items-center">
                <div
                  className={`w-12 h-12 rounded-lg ${stat.color} bg-opacity-15 flex items-center justify-center mr-4`}
                >
                  <div className={`w-3 h-3 rounded-full ${stat.color}`}></div>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">
                    {stat.label}
                  </p>
                  <div className="flex items-baseline">
                    <p className="text-2xl font-semibold text-gray-900">
                      {stat.value}
                    </p>
                    {/* <span className="ml-2 text-xs font-medium text-green-600">{stat.change}</span> */}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Main Cards Grid */}
        <div className="grid gap-6 md:grid-cols-3">
          {/* Category-Wise Report */}
          <Link to="/admin/categoryWiseReport" className="group">
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 transition duration-300 group-hover:shadow-md group-hover:border-blue-100">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center">
                  <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center mr-3">
                    <FaTags className="text-blue-600" />
                  </div>
                  <h2 className="text-lg font-semibold text-gray-900">
                    Category-wise Report
                  </h2>
                </div>
                <span className="text-xs font-medium text-blue-600 bg-blue-50 px-2 py-1 rounded-full">
                  Analytics
                </span>
              </div>
              <p className="text-sm text-gray-600 mb-4">
                Comprehensive breakdown of job categories and their performance
                metrics across the platform.
              </p>
              <div className="mt-2 flex justify-between items-center">
                <span className="text-sm font-medium text-blue-600 group-hover:underline">
                  View Report
                </span>
                <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center group-hover:bg-blue-100 transition-colors">
                  <svg
                    className="w-4 h-4 text-blue-600"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </div>
              </div>
            </div>
          </Link>

          {/* Top Recruiting Companies */}
          <Link to="/admin/topCompanies" className="group">
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 transition duration-300 group-hover:shadow-md group-hover:border-green-100">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center">
                  <div className="w-10 h-10 rounded-lg bg-green-50 flex items-center justify-center mr-3">
                    <FaBuilding className="text-green-600" />
                  </div>
                  <h2 className="text-lg font-semibold text-gray-900">
                    Top 5 Hiring Companies
                  </h2>
                </div>
                <span className="text-xs font-medium text-green-600 bg-green-50 px-2 py-1 rounded-full">
                  Companies
                </span>
              </div>
              <p className="text-sm text-gray-600 mb-4">
                Identify the most active companies on the platform and their
                recruitment patterns.
              </p>
              <div className="mt-2 flex justify-between items-center">
                <span className="text-sm font-medium text-green-600 group-hover:underline">
                  View Top Companies
                </span>
                <div className="w-8 h-8 rounded-full bg-green-50 flex items-center justify-center group-hover:bg-green-100 transition-colors">
                  <svg
                    className="w-4 h-4 text-green-600"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </div>
              </div>
            </div>
          </Link>

          {/* Top Recruiting Sectors */}
          <Link to="/admin/topSectors" className="group">
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 transition duration-300 group-hover:shadow-md group-hover:border-purple-100">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center">
                  <div className="w-10 h-10 rounded-lg bg-purple-50 flex items-center justify-center mr-3">
                    <FaChartBar className="text-purple-600" />
                  </div>
                  <h2 className="text-lg font-semibold text-gray-900">
                    Top 5 Recruiting Sectors
                  </h2>
                </div>
                <span className="text-xs font-medium text-purple-600 bg-purple-50 px-2 py-1 rounded-full">
                  Sectors
                </span>
              </div>
              <p className="text-sm text-gray-600 mb-4">
                Analyze trending industry sectors and their hiring volumes
                across the platform.
              </p>
              <div className="mt-2 flex justify-between items-center">
                <span className="text-sm font-medium text-purple-600 group-hover:underline">
                  View Top Sectors
                </span>
                <div className="w-8 h-8 rounded-full bg-purple-50 flex items-center justify-center group-hover:bg-purple-100 transition-colors">
                  <svg
                    className="w-4 h-4 text-purple-600"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </div>
              </div>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default AdminHome;
