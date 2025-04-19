import { useContext } from "react";
import {
  FaChartBar,
  FaBuilding,
  FaTags,
  FaUserShield,
  FaBriefcase,
  FaSignOutAlt,
} from "react-icons/fa";
import { AuthContext } from "../../Providers/AuthProvider";

const AdminHome = () => {
  const { setCustomUser } = useContext(AuthContext);

  const handleLogout = async () => {
    try {
      localStorage.removeItem("adminUser");
      setCustomUser(null);
      window.location.href = "/login";
    } catch (err) {
      console.error("Logout error:", err);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 pt-20 px-4 md:px-8 lg:px-16 relative">
      {/* Logout Button */}
      <div className="absolute top-6 right-6">
        <button
          onClick={handleLogout}
          className="flex items-center gap-2 text-red-600 border border-red-600 px-4 py-2 rounded hover:bg-red-600 hover:text-white transition"
        >
          <FaSignOutAlt />
          Logout
        </button>
      </div>

      {/* Header */}
      <div className="mb-10 text-center">
        <h1 className="text-4xl font-bold text-gray-800 mb-2">
          Admin Dashboard
        </h1>
        <p className="text-gray-600">
          Manage & Monitor the Next Career platform
        </p>
      </div>

      {/* Cards Grid */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {/* Category-Wise Report */}
        <div className="bg-white p-6 rounded-lg shadow hover:shadow-md transition">
          <div className="flex items-center mb-4 text-blue-600">
            <FaTags className="text-3xl mr-4" />
            <h2 className="text-xl font-semibold">Category-wise Report</h2>
          </div>
          <p className="text-gray-600">
            View reports and analytics for job categories and distribution.
          </p>
          <button className="mt-4 text-sm text-blue-600 font-medium hover:underline">
            View Report
          </button>
        </div>

        {/* Top Recruiting Companies */}
        <div className="bg-white p-6 rounded-lg shadow hover:shadow-md transition">
          <div className="flex items-center mb-4 text-green-600">
            <FaBuilding className="text-3xl mr-4" />
            <h2 className="text-xl font-semibold">
              Top 5 Recruiting Companies
            </h2>
          </div>
          <p className="text-gray-600">
            Analyze which companies are leading in recruitment.
          </p>
          <button className="mt-4 text-sm text-green-600 font-medium hover:underline">
            View Top Companies
          </button>
        </div>

        {/* Top Recruiting Sectors */}
        <div className="bg-white p-6 rounded-lg shadow hover:shadow-md transition">
          <div className="flex items-center mb-4 text-purple-600">
            <FaChartBar className="text-3xl mr-4" />
            <h2 className="text-xl font-semibold">Top 5 Recruiting Sectors</h2>
          </div>
          <p className="text-gray-600">
            Find out which job sectors are booming right now.
          </p>
          <button className="mt-4 text-sm text-purple-600 font-medium hover:underline">
            View Top Sectors
          </button>
        </div>

        {/* Manage Users */}
        <div className="bg-white p-6 rounded-lg shadow hover:shadow-md transition">
          <div className="flex items-center mb-4 text-red-600">
            <FaUserShield className="text-3xl mr-4" />
            <h2 className="text-xl font-semibold">Manage Users</h2>
          </div>
          <p className="text-gray-600">
            Approve, remove or monitor users in the system.
          </p>
          <button className="mt-4 text-sm text-red-600 font-medium hover:underline">
            Go to User Panel
          </button>
        </div>

        {/* Manage Jobs */}
        <div className="bg-white p-6 rounded-lg shadow hover:shadow-md transition">
          <div className="flex items-center mb-4 text-yellow-600">
            <FaBriefcase className="text-3xl mr-4" />
            <h2 className="text-xl font-semibold">Manage Job Posts</h2>
          </div>
          <p className="text-gray-600">
            View, approve or delete job posts across all recruiters.
          </p>
          <button className="mt-4 text-sm text-yellow-600 font-medium hover:underline">
            Go to Job Manager
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminHome;
