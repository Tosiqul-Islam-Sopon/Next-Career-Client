import { FaBriefcase, FaGraduationCap, FaHome, FaLocationArrow } from "react-icons/fa";
import { NavLink, Outlet } from "react-router-dom";
import { RiFileListFill } from "react-icons/ri";
import '../Pages/Shared/Navbar/Navbar.css'

import { IoAddCircle, IoPersonCircle } from "react-icons/io5";
import { MdSell } from "react-icons/md";
import Navbar from "../Pages/Shared/Navbar/Navbar";
import { BsInfoCircle } from "react-icons/bs";

const Dashboard = () => {

    const userRole = "user"

    return (
        <div>
            {/* <Helmet>
                <title>NextHome | Dashboard</title>
            </Helmet> */}
            {/* <NavBar></NavBar> */}
            <Navbar></Navbar>
            <div id="dashboard" className="flex gap-2 md:gap-5 flex-col md:flex-row pt-24 ">
                {/* Dashboard Sidebar */}
                <div className="md:w-64 md:min-h-screen w-[80%] mx-auto mt-5">
                    <ul className="menu w-full p-2 space-y-2">
                        {
                            userRole === "user" ?
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
                                        <NavLink to="/dashboard/wishList"
                                            className="border-2 border-orange-500 rounded-2xl hover:bg-orange-500 hover:text-white w-full">
                                            <FaGraduationCap />
                                            Education
                                        </NavLink>
                                    </li>
                                    <li >
                                        <NavLink to="/dashboard/propertyBought"
                                            className="border-2 border-orange-500 rounded-2xl hover:bg-orange-500 hover:text-white w-full"
                                        >
                                            <FaBriefcase   />
                                            Experience
                                        </NavLink>
                                    </li>
                                    <li >
                                        <NavLink to="/dashboard/myReviews"
                                            className="border-2 border-orange-500 rounded-2xl hover:bg-orange-500 hover:text-white w-full"
                                        >
                                            <RiFileListFill />
                                            Resume
                                        </NavLink>
                                    </li>
                                </>
                                :
                                <>
                                    {
                                        userRole === "admin" ?
                                            <>
                                                <li>
                                                    <NavLink
                                                        to="/dashboard/myProfile"
                                                        className="border-2 border-orange-500 rounded-2xl hover:bg-orange-500 hover:text-white w-full"
                                                    >
                                                        <FaHome />
                                                        Admin Profile
                                                    </NavLink>
                                                </li>
                                                <li>
                                                    <NavLink
                                                        to="/dashboard/manageProperties"
                                                        className="border-2 border-orange-500 rounded-2xl hover:bg-orange-500 hover:text-white w-full"
                                                    >
                                                        <FaHome />
                                                        Manage Properties
                                                    </NavLink>
                                                </li>
                                                <li>
                                                    <NavLink
                                                        to="/dashboard/manageUsers"
                                                        className="border-2 border-orange-500 rounded-2xl hover:bg-orange-500 hover:text-white w-full"
                                                    >
                                                        <FaHome />
                                                        Manage Users
                                                    </NavLink>
                                                </li>
                                                <li>
                                                    <NavLink
                                                        to="/dashboard/manageReviews"
                                                        className="border-2 border-orange-500 rounded-2xl hover:bg-orange-500 hover:text-white w-full"
                                                    >
                                                        <FaHome />
                                                        Manage Reviews
                                                    </NavLink>
                                                </li>
                                                <li>
                                                    <NavLink
                                                        to="/dashboard/advertiseProperty"
                                                        className="border-2 border-orange-500 rounded-2xl hover:bg-orange-500 hover:text-white w-full"
                                                    >
                                                        <FaHome />
                                                        Advertise Property
                                                    </NavLink>
                                                </li>
                                            </>
                                            :
                                            <>
                                                <li>
                                                    <NavLink
                                                        to="/dashboard/myProfile"
                                                        className="border-2 border-orange-500 rounded-2xl hover:bg-orange-500 hover:text-white w-full"
                                                    >
                                                        <IoPersonCircle />
                                                        Agent Profile
                                                    </NavLink>
                                                </li>
                                                <li>
                                                    <NavLink
                                                        to="/dashboard/addProperty"
                                                        className="border-2 border-orange-500 rounded-2xl hover:bg-orange-500 hover:text-white w-full"
                                                    >
                                                        <IoAddCircle />
                                                        Add Property
                                                    </NavLink>
                                                </li>
                                                <li>
                                                    <NavLink
                                                        to="/dashboard/myAddedProperties"
                                                        className="border-2 border-orange-500 rounded-2xl hover:bg-orange-500 hover:text-white w-full"
                                                    >
                                                        <FaHome />
                                                        My added properties
                                                    </NavLink>
                                                </li>
                                                <li>
                                                    <NavLink
                                                        to="/dashboard/mySoldProperties"
                                                        className="border-2 border-orange-500 rounded-2xl hover:bg-orange-500 hover:text-white w-full"
                                                    >
                                                        <MdSell/>
                                                        My sold properties
                                                    </NavLink>
                                                </li>
                                                <li>
                                                    <NavLink
                                                        to="/dashboard/requestedProperties"
                                                        className="border-2 border-orange-500 rounded-2xl hover:bg-orange-500 hover:text-white w-full"
                                                    >
                                                        <FaLocationArrow />
                                                        Requested properties
                                                    </NavLink>
                                                </li>
                                            </>
                                    }
                                </>
                        }

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