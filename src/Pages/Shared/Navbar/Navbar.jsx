import { useContext, useState, useEffect, useRef } from "react";
import { Link, NavLink } from "react-router-dom";
import { AuthContext } from "../../../Providers/AuthProvider";
import { IoMdClose } from "react-icons/io";
import Swal from "sweetalert2";
import "./Navbar.css";
import useUserRole from "../../../CustomHooks/useUserRole";
import iconNotification from "../../../assets/Icons/iconNotification.svg";
import Notifications from "../Notification/Notifications";
import useAxiosBase, { baseUrl } from "../../../CustomHooks/useAxiosBase";
import { useQuery } from "@tanstack/react-query";
import { io } from "socket.io-client";
import { toast } from "react-toastify";

const socket = io(baseUrl);

const Navbar = () => {
  const { user, logOut } = useContext(AuthContext);
  const [leftDropdownOpen, setLeftDropdownOpen] = useState(false);
  const [rightDropdownOpen, setRightDropdownOpen] = useState(false);
  const leftDropdownRef = useRef(null);
  const rightDropdownRef = useRef(null);
  const { userRole } = useUserRole();
  const [isNotificationDropdownOpen, setIsNotificationDropdownOpen] =
    useState(false);
  const [unreadNotifications, setUnreadNotifications] = useState(0);

  const axiosBase = useAxiosBase();

  const { data: userInfo = null } = useQuery({
    queryKey: ["user", user?.email],
    queryFn: async () => {
      const response = await axiosBase.get(`/user-by-email/${user?.email}`);
      return response.data;
    },
  });

  useEffect(() => {
    // Register recruiter with their user ID
    if (userInfo?._id) {
      socket.emit("register", userInfo?._id);
    }

    // Listen for job application notifications
    socket.on("stageProgress", (data) => {
      toast.success(data.message);
      setUnreadNotifications(unreadNotifications + 1);
    });

    return () => {
      socket.off("stageProgress");
    };
  }, []);

  useEffect(() => {
    // Register recruiter with their user ID
    if (userInfo?._id) {
      socket.emit("register", userInfo._id);
    }

    // Listen for job application notifications
    socket.on("jobApplication", (data) => {
      toast.success(data.message);
      setUnreadNotifications(unreadNotifications + 1);
    });

    return () => {
      socket.off("jobApplication");
    };
  }, []);

  const loadUnreadNotifications = async (userId) => {
    const res = await axiosBase.get(`/notifications/unread/${userId}`);
    return res.data.notifications;
  };

  useEffect(() => {
    const fetchNotifications = async () => {
      if (userInfo?._id) {
        const loadedNotifications = await loadUnreadNotifications(userInfo._id);
        setUnreadNotifications(loadedNotifications.length);
      }
    };

    fetchNotifications();
  }, [userInfo]);

  const navLinks = (
    <>
      <li onClick={() => setLeftDropdownOpen(!leftDropdownOpen)}>
        <NavLink to="/">Home</NavLink>
      </li>
      <li onClick={() => setLeftDropdownOpen(!leftDropdownOpen)}>
        <NavLink to="/products">Jobs</NavLink>
      </li>
      <li onClick={() => setLeftDropdownOpen(!leftDropdownOpen)}>
        <NavLink to="/postJob">Post a Job</NavLink>
      </li>
    </>
  );
  const navLinksLgForUser = (
    <>
      <li>
        <NavLink className={"hover:bg-green-400 "} to="/">
          Home
        </NavLink>
      </li>
      <li>
        <NavLink className={"hover:bg-green-400 "} to="/jobs">
          Find Job
        </NavLink>
      </li>
      <li>
        <NavLink className={"hover:bg-green-400 "} to="/appliedJobs">
          Applied Jobs
        </NavLink>
      </li>
      <li>
        <NavLink
          className={"hover:bg-green-400 "}
          to={`/schedules/${userInfo?._id}`}
        >
          Schedules
        </NavLink>
      </li>
    </>
  );

  const navLinksLgForRecruiter = (
    <>
      <li>
        <NavLink className={"hover:bg-green-400 "} to="/">
          Home
        </NavLink>
      </li>
      <li>
        <NavLink className={"hover:bg-green-400 "} to="/myPostedJobs">
          My Jobs
        </NavLink>
      </li>
      <li>
        <NavLink className={"hover:bg-green-400 "} to="/postJob">
          Post A Job
        </NavLink>
      </li>
      <li>
        <NavLink
          className={"hover:bg-green-400 "}
          to={`/schedules/${userInfo?._id}`}
        >
          Schedules
        </NavLink>
      </li>
    </>
  );

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        leftDropdownRef.current &&
        !leftDropdownRef.current.contains(event.target) &&
        rightDropdownRef.current &&
        !rightDropdownRef.current.contains(event.target)
      ) {
        setLeftDropdownOpen(false);
        setRightDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const toggleLeftDropdown = () => {
    setLeftDropdownOpen(!leftDropdownOpen);
    if (rightDropdownOpen) {
      setRightDropdownOpen(false);
    }
  };

  const toggleRightDropdown = () => {
    setRightDropdownOpen(!rightDropdownOpen);
    if (leftDropdownOpen) {
      setLeftDropdownOpen(false);
    }
  };

  const handleLogout = () => {
    setRightDropdownOpen(!rightDropdownOpen);
    socket.disconnect();
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
    <div className="navbar bg-gray-800 text-white fixed z-50">
      <div className="navbar-start lg:hidden">
        <div className="dropdown" ref={leftDropdownRef}>
          <div
            tabIndex={0}
            role="button"
            className="btn btn-ghost btn-circle"
            onClick={toggleLeftDropdown}
          >
            {leftDropdownOpen ? (
              <p className="text-2xl">
                <IoMdClose />
              </p>
            ) : (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 6h16M4 12h16M4 18h7"
                />
              </svg>
            )}
          </div>
          {leftDropdownOpen && (
            <ul
              id="navBarActive2"
              className="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-base-100 rounded-box w-52 text-black"
            >
              {navLinks}
            </ul>
          )}
        </div>
      </div>

      <div className="lg:navbar-center navbar-start">
        <a className="btn btn-ghost text-4xl text-green-500 roboto">
          Next <span className="text-white">Career</span>
        </a>
      </div>
      <div className="navbar-end lg:mr-5">
        <ul
          id="navBarActive1"
          className="menu menu-horizontal px-1 hidden lg:flex mr-10 space-x-3"
        >
          {userRole === "recruiter"
            ? navLinksLgForRecruiter
            : navLinksLgForUser}
        </ul>
        {user ? (
          <div>
            <div className="flex gap-8 items-center">
              <div className="relative">
                <div
                  onClick={() =>
                    setIsNotificationDropdownOpen(!isNotificationDropdownOpen)
                  }
                  className="flex items-center cursor-pointer"
                >
                  <img
                    className="w-7 h-7 text-white"
                    style={{ filter: "invert(1)" }}
                    src={iconNotification}
                    alt="notifications"
                  />
                  <p className="text-green-500 text-2xl font-light">
                    ({unreadNotifications})
                  </p>
                </div>
                {isNotificationDropdownOpen && (
                  //<div className="">
                  <Notifications setUnreadNotifications={setUnreadNotifications} />
                  //</div>
                )}
              </div>
              <div className="relative" ref={rightDropdownRef}>
                <button onClick={toggleRightDropdown}>
                  <img
                    loading="lazy"
                    src={`${baseUrl}/profileImage/${userInfo?._id}`}
                    className="w-14 h-14 rounded-full"
                    alt={`${user?.displayName} pic`}
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = "/placeholder.svg";
                    }}
                  />
                </button>
                {rightDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-2 z-20">
                    <div className="px-4 py-2 text-xl font-bold text-black border-y-2">
                      {user?.displayName}
                    </div>
                    <Link
                      to={`/dashboard`}
                      className="block px-4 py-2 text-gray-700 hover:bg-green-600 hover:text-white"
                      onClick={() => setRightDropdownOpen(false)}
                    >
                      <button
                        onClick={() => setRightDropdownOpen(!rightDropdownOpen)}
                      >
                        Dashboard
                      </button>
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-green-600 hover:text-white"
                    >
                      Logout
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        ) : (
          <button className="px-4 py-2 rounded-lg border border-white hover:border-none hover:bg-green-500">
            <Link to="/login">Login</Link>
          </button>
        )}
      </div>
    </div>
  );
};

export default Navbar;
