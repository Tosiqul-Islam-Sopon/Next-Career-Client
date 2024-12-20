import {
  FaBriefcase,
  FaGraduationCap,
  FaHome,
  FaLocationArrow,
} from "react-icons/fa";
import { NavLink, Outlet } from "react-router-dom";
// import { RiFileListFill } from "react-icons/ri";
import "../Pages/Shared/Navbar/Navbar.css";

import { IoAddCircle, IoPersonCircle } from "react-icons/io5";
import { MdSell } from "react-icons/md";
import Navbar from "../Pages/Shared/Navbar/Navbar";
import { BsInfoCircle } from "react-icons/bs";
import useUserRole from "../CustomHooks/useUserRole";

const Dashboard = () => {
  const { userRole } = useUserRole();

  return (
    <div>
      {/* <Helmet>
                <title>NextHome | Dashboard</title>
            </Helmet> */}
      {/* <NavBar></NavBar> */}
      <Navbar></Navbar>
      <div
        id="dashboard"
        className="flex gap-2 md:gap-5 flex-col md:flex-row pt-24 "
      >
        {/* Dashboard Sidebar */}
        <div className="md:w-64 md:min-h-screen w-[80%] mx-auto mt-5">
          <ul className="menu w-full p-2 space-y-2">
            {userRole === "user" ? (
              <>
                <li>
                  <NavLink
                    to="/dashboard/personalInfo"
                    className="border-2 border-orange-500 rounded-2xl hover:bg-orange-500 hover:text-white w-full"
                  >
                    <BsInfoCircle />
                    Personal Info
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to="/dashboard/education"
                    className="border-2 border-orange-500 rounded-2xl hover:bg-orange-500 hover:text-white w-full"
                  >
                    <FaGraduationCap />
                    Education
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to="/dashboard/experience"
                    className="border-2 border-orange-500 rounded-2xl hover:bg-orange-500 hover:text-white w-full"
                  >
                    <FaBriefcase />
                    Experience
                  </NavLink>
                </li>
                {/* <li >
                                        <NavLink to="/dashboard/resume"
                                            className="border-2 border-orange-500 rounded-2xl hover:bg-orange-500 hover:text-white w-full"
                                        >
                                            <RiFileListFill />
                                            Resume
                                        </NavLink>
                                    </li> */}
              </>
            ) : (
              <>
                <li>
                  <NavLink
                    to="/dashboard/recruiterProfile"
                    className="border-2 border-orange-500 rounded-2xl hover:bg-orange-500 hover:text-white w-full"
                  >
                    <FaHome />
                    Profile
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to=""
                    className="border-2 border-orange-500 rounded-2xl hover:bg-orange-500 hover:text-white w-full"
                  >
                    <FaHome />
                    Posted Jobs
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to=""
                    className="border-2 border-orange-500 rounded-2xl hover:bg-orange-500 hover:text-white w-full"
                  >
                    <FaHome />
                    Interview Schedules
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to=""
                    className="border-2 border-orange-500 rounded-2xl hover:bg-orange-500 hover:text-white w-full"
                  >
                    <FaHome />
                    Statistics
                  </NavLink>
                </li>
              </>
            )}
          </ul>
        </div>

        {/* Dashboard Content */}
        <div className="flex-1 p-2">
          <Outlet></Outlet>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
