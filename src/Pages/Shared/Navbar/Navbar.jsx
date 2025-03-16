import { useContext, useState, useEffect, useRef } from "react";
import { Link, NavLink } from "react-router-dom";
import { AuthContext } from "../../../Providers/AuthProvider";
import { IoMdClose } from "react-icons/io";
import Swal from "sweetalert2";
import "./Navbar.css";
import useUserRole from "../../../CustomHooks/useUserRole";
import iconNotification from "../../../assets/Icons/iconNotification.svg";

const Navbar = () => {
  const { user, logOut } = useContext(AuthContext);
  const [leftDropdownOpen, setLeftDropdownOpen] = useState(false);
  const [rightDropdownOpen, setRightDropdownOpen] = useState(false);
  const leftDropdownRef = useRef(null);
  const rightDropdownRef = useRef(null);
  const { userRole } = useUserRole();

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
    <div className="navbar bg-gray-800 text-white fixed z-10">
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
          <div className="flex gap-8 items-center">
            <div className="flex items-center cursor-pointer">
              <img
                className="w-7 h-7 text-white"
                style={{ filter: "invert(1)" }}
                src={iconNotification}
                alt="notifications"
              />
              <p className="text-green-500 text-2xl font-light">(3)</p>
            </div>
            <div className="relative" ref={rightDropdownRef}>
              <button onClick={toggleRightDropdown}>
                <img
                  src={user?.photoURL}
                  className="w-14 h-14 rounded-full"
                  alt={`${user?.displayName} pic`}
                />
              </button>
              {rightDropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-2 z-20">
                  <div className="px-4 py-2 text-xl font-bold text-black border-y-2">
                    {user?.displayName}
                  </div>
                  <Link
                    to={`/dashboard/${userRole === "recruiter" ? "recruiterProfile" : "personalInfo"}`}
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
