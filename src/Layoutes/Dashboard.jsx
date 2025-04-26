"use client";

import { useContext, useState } from "react";
import { NavLink, Outlet, useLocation } from "react-router-dom";
import {
  User,
  GraduationCap,
  Briefcase,
  Menu,
  X,
  ChevronRight,
  Building,
  Calendar,
  BarChart3,
  Home,
  LogOut,
} from "lucide-react";
import useUserRole from "../CustomHooks/useUserRole";
import Swal from "sweetalert2";
import { AuthContext } from "../Providers/AuthProvider";

export default function Dashboard() {
  const { user } = useContext(AuthContext);
  const { userRole } = useUserRole();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const location = useLocation();
  const { logOut } = useContext(AuthContext);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  // Function to get page title based on current route
  const getPageTitle = () => {
    const path = location.pathname.split("/").pop();

    switch (path) {
      case "personalInfo":
        return "Personal Information";
      case "education":
        return "Education History";
      case "experience":
        return "Work Experience";
      case "recruiterProfile":
        return "Recruiter Profile";
      default:
        return "Dashboard";
    }
  };

  const handleLogout = () => {
    setIsSidebarOpen(false);
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

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="flex">
        {/* Mobile sidebar toggle */}
        <button
          className="fixed bottom-6 right-6 z-50 md:hidden bg-orange-500 text-white p-3 rounded-full shadow-lg"
          onClick={toggleSidebar}
        >
          {isSidebarOpen ? <X size={24} /> : <Menu size={24} />}
        </button>

        {/* Sidebar */}
        <div
          className={`fixed inset-y-0 left-0 transform ${
            isSidebarOpen ? "translate-x-0" : "-translate-x-full"
          } md:translate-x-0 z-40 transition-transform duration-300 ease-in-out md:relative md:w-64 pt-5 bg-white border-r border-slate-200 shadow-sm`}
        >
          <div className="p-4 border-b border-slate-200">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center">
                <User size={20} className="text-orange-600" />
              </div>
              <div>
                <h3 className="font-medium text-slate-800">Welcome</h3>
                <p className="text-sm text-slate-500">
                  {user?.displayName}
                </p>
              </div>
            </div>
          </div>

          <div className="p-4">
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">
              Main Menu
            </p>
            <ul className="space-y-2">
              {userRole === "user" ? (
                <>
                  <li>
                    <NavLink
                      to="/dashboard/personalInfo"
                      className={({ isActive }) =>
                        `flex items-center px-4 py-3 rounded-lg transition-all duration-200 ${
                          isActive
                            ? "bg-orange-500 text-white shadow-sm"
                            : "text-slate-600 hover:bg-orange-50 hover:text-orange-600"
                        }`
                      }
                      onClick={() => setIsSidebarOpen(false)}
                    >
                      <User size={18} className="mr-3" />
                      <span>Personal Info</span>
                      {location.pathname === "/dashboard/personalInfo" && (
                        <ChevronRight size={16} className="ml-auto" />
                      )}
                    </NavLink>
                  </li>
                  <li>
                    <NavLink
                      to="/dashboard/education"
                      className={({ isActive }) =>
                        `flex items-center px-4 py-3 rounded-lg transition-all duration-200 ${
                          isActive
                            ? "bg-orange-500 text-white shadow-sm"
                            : "text-slate-600 hover:bg-orange-50 hover:text-orange-600"
                        }`
                      }
                      onClick={() => setIsSidebarOpen(false)}
                    >
                      <GraduationCap size={18} className="mr-3" />
                      <span>Education</span>
                      {location.pathname === "/dashboard/education" && (
                        <ChevronRight size={16} className="ml-auto" />
                      )}
                    </NavLink>
                  </li>
                  <li>
                    <NavLink
                      to="/dashboard/experience"
                      className={({ isActive }) =>
                        `flex items-center px-4 py-3 rounded-lg transition-all duration-200 ${
                          isActive
                            ? "bg-orange-500 text-white shadow-sm"
                            : "text-slate-600 hover:bg-orange-50 hover:text-orange-600"
                        }`
                      }
                      onClick={() => setIsSidebarOpen(false)}
                    >
                      <Briefcase size={18} className="mr-3" />
                      <span>Experience</span>
                      {location.pathname === "/dashboard/experience" && (
                        <ChevronRight size={16} className="ml-auto" />
                      )}
                    </NavLink>
                  </li>
                </>
              ) : (
                <>
                  <li>
                    <NavLink
                      to="/dashboard/recruiterProfile"
                      className={({ isActive }) =>
                        `flex items-center px-4 py-3 rounded-lg transition-all duration-200 ${
                          isActive
                            ? "bg-orange-500 text-white shadow-sm"
                            : "text-slate-600 hover:bg-orange-50 hover:text-orange-600"
                        }`
                      }
                      onClick={() => setIsSidebarOpen(false)}
                    >
                      <User size={18} className="mr-3" />
                      <span>Profile</span>
                      {location.pathname === "/dashboard/recruiterProfile" && (
                        <ChevronRight size={16} className="ml-auto" />
                      )}
                    </NavLink>
                  </li>
                  <li>
                    <NavLink
                      to="/dashboard/postedJobs"
                      className={({ isActive }) =>
                        `flex items-center px-4 py-3 rounded-lg transition-all duration-200 ${
                          isActive
                            ? "bg-orange-500 text-white shadow-sm"
                            : "text-slate-600 hover:bg-orange-50 hover:text-orange-600"
                        }`
                      }
                      onClick={() => setIsSidebarOpen(false)}
                    >
                      <Building size={18} className="mr-3" />
                      <span>Posted Jobs</span>
                      {location.pathname === "/dashboard/postedJobs" && (
                        <ChevronRight size={16} className="ml-auto" />
                      )}
                    </NavLink>
                  </li>
                  <li>
                    <NavLink
                      to="/dashboard/interviews"
                      className={({ isActive }) =>
                        `flex items-center px-4 py-3 rounded-lg transition-all duration-200 ${
                          isActive
                            ? "bg-orange-500 text-white shadow-sm"
                            : "text-slate-600 hover:bg-orange-50 hover:text-orange-600"
                        }`
                      }
                      onClick={() => setIsSidebarOpen(false)}
                    >
                      <Calendar size={18} className="mr-3" />
                      <span>Interview Schedules</span>
                      {location.pathname === "/dashboard/interviews" && (
                        <ChevronRight size={16} className="ml-auto" />
                      )}
                    </NavLink>
                  </li>
                  <li>
                    <NavLink
                      to="/dashboard/statistics"
                      className={({ isActive }) =>
                        `flex items-center px-4 py-3 rounded-lg transition-all duration-200 ${
                          isActive
                            ? "bg-orange-500 text-white shadow-sm"
                            : "text-slate-600 hover:bg-orange-50 hover:text-orange-600"
                        }`
                      }
                      onClick={() => setIsSidebarOpen(false)}
                    >
                      <BarChart3 size={18} className="mr-3" />
                      <span>Statistics</span>
                      {location.pathname === "/dashboard/statistics" && (
                        <ChevronRight size={16} className="ml-auto" />
                      )}
                    </NavLink>
                  </li>
                </>
              )}
            </ul>

            <div className="mt-8 pt-6 border-t border-slate-200">
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">
                Quick Links
              </p>
              <ul className="space-y-2">
                <li>
                  <NavLink
                    to="/"
                    className="flex items-center px-4 py-3 rounded-lg text-slate-600 hover:bg-orange-50 hover:text-orange-600 transition-all duration-200"
                    onClick={() => setIsSidebarOpen(false)}
                  >
                    <Home size={18} className="mr-3" />
                    <span>Home</span>
                  </NavLink>
                </li>
                <li>
                  <button
                    className="flex items-center w-full px-4 py-3 rounded-lg text-slate-600 hover:bg-orange-50 hover:text-orange-600 transition-all duration-200"
                    onClick={handleLogout}
                  >
                    <LogOut size={18} className="mr-3" />
                    <span>Logout</span>
                  </button>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Main content */}
        <div className="flex-1 pt-5 pb-10 px-4 md:px-8">
          <div className="mb-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between">
              <div>
                <h1 className="text-2xl font-bold text-slate-800">
                  {getPageTitle()}
                </h1>
                <p className="text-slate-500 mt-1">
                  Manage your professional profile and career information
                </p>
              </div>

              <div className="mt-4 md:mt-0 flex items-center">
                <nav className="flex" aria-label="Breadcrumb">
                  <ol className="inline-flex items-center space-x-1 md:space-x-3">
                    <li className="inline-flex items-center">
                      <NavLink
                        to="/"
                        className="text-sm text-slate-500 hover:text-orange-600"
                      >
                        Home
                      </NavLink>
                    </li>
                    <li>
                      <div className="flex items-center">
                        <ChevronRight size={14} className="text-slate-400" />
                        <NavLink
                          to="/dashboard"
                          className="ml-1 text-sm text-slate-500 hover:text-orange-600"
                        >
                          Dashboard
                        </NavLink>
                      </div>
                    </li>
                    <li aria-current="page">
                      <div className="flex items-center">
                        <ChevronRight size={14} className="text-slate-400" />
                        <span className="ml-1 text-sm font-medium text-orange-600">
                          {getPageTitle()}
                        </span>
                      </div>
                    </li>
                  </ol>
                </nav>
              </div>
            </div>
          </div>

          {/* Dashboard content */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
            <Outlet />
          </div>
        </div>
      </div>

      {/* Overlay for mobile sidebar */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-30 md:hidden"
          onClick={() => setIsSidebarOpen(false)}
        ></div>
      )}
    </div>
  );
}
