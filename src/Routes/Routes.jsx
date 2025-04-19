import {
    createBrowserRouter,
} from "react-router-dom";
import ErrorPage from "../Pages/ErrorPage/ErrorPage";
import Root from "../Layoutes/Root";
import Login from "../Pages/Shared/Authentication/Login";
import Registration from "../Pages/Shared/Authentication/Register";
import JobPostForm from "../Pages/Recruiter/JobPostForm/JobPostForm";
import Home from "../Pages/Shared/Home/Home";
import PrivateRoute from "../PrivateRoutes/PrivateRoute";
import RecruiterRegistration from "../Pages/Shared/Authentication/RecruiterRegistration";
import JobDetails from "../Pages/User/JobDetails/JobDetails";
import Jobs from "../Pages/User/Jobs/Jobs";
import Dashboard from "../Layoutes/Dashboard";
import PersonalInfo from "../Pages/User/Profile/PersonalInfo/PersonalInfo";
import EditPersonalInfo from "../Pages/User/Profile/PersonalInfo/EditPersonalInfo";
import Education from "../Pages/User/Profile/Education/Education";
import Experience from "../Pages/User/Profile/Experience/Experience";
// import Resume from "../Pages/User/Profile/Resume/Resume";
import AppliedJobs from "../Pages/User/AppliedJobs/AppliedJobs";
import JobsByCategory from "../Pages/User/Home/Categories/JobsByCategory ";
import UserPrivateRoute from "../PrivateRoutes/UserPrivateRoute";
import MyPostedJobs from "../Pages/Recruiter/MyPostedJobs/MyPostedJobs";
import SeeApplicants from "../Pages/Recruiter/MyPostedJobs/SeeApplicants";
import Profile from "../Pages/Shared/Profile/Profile";
import JobDetailsAndEdit from "../Pages/Recruiter/MyPostedJobs/JobDetailsAndEdit";
import EditJob from "../Pages/Recruiter/MyPostedJobs/EditJob";
import RecruiterProfile from "../Pages/Recruiter/Profile/RecruiterProfile";
import RecruiterProfileEdit from "../Pages/Recruiter/Profile/RecruiterProfileEdit";
import AdminHome from "../Pages/Admin/Home";

const router = createBrowserRouter([
    {
        path: "/",
        errorElement: <ErrorPage></ErrorPage>,
        element: <Root></Root>,
        children: [
            {
                path: "/",
                element: <Home></Home>
            },
            {
                path: "/adminHome",
                element: <AdminHome></AdminHome>
            },

            // Authentication Routes
            {
                path: "/login",
                element: <Login></Login>
            },
            {
                path: "/register",
                element: <Registration></Registration>
            },
            {
                path: "/recruiterRegistration",
                element: <RecruiterRegistration></RecruiterRegistration>
            },

            // User Routes
            {
                path: "/jobDetails/:jobId",
                element: <JobDetails></JobDetails>
            },
            {
                path: "/jobs",
                element: <Jobs></Jobs>
            },
            {
                path: "/appliedJobs",
                element: <PrivateRoute><AppliedJobs></AppliedJobs></PrivateRoute>
            },
            {
                path: "/jobs/:category",
                element: <JobsByCategory></JobsByCategory>
            },
            {
                path: "/profile/:userId",
                element: <Profile></Profile>
            },

            // Recruiter Routes
            {
                path: "/postJob",
                element: <PrivateRoute><JobPostForm></JobPostForm></PrivateRoute>
            },
            {
                path: "/myPostedJobs",
                element: <PrivateRoute><MyPostedJobs></MyPostedJobs></PrivateRoute>
            },
            {
                path: "/seeApplicants/:jobId",
                element: <PrivateRoute><SeeApplicants></SeeApplicants></PrivateRoute>
            },
            {
                path: '/jobDetailsAndEdit/:jobId',
                element: <PrivateRoute><JobDetailsAndEdit></JobDetailsAndEdit></PrivateRoute>
            },
            {
                path: "/editJob/:jobId",
                element: <PrivateRoute><EditJob></EditJob></PrivateRoute>
            }
            
        ],
    },
    {
        path: "/dashboard",
        element: <PrivateRoute><Dashboard></Dashboard></PrivateRoute>,
        children: [
            {
                path: "personalInfo",
                element: <UserPrivateRoute><PersonalInfo></PersonalInfo></UserPrivateRoute>
            },
            {
                path: "editPersonalInfo",
                element: <UserPrivateRoute><EditPersonalInfo></EditPersonalInfo></UserPrivateRoute>
            },
            {
                path: "education",
                element: <UserPrivateRoute><Education></Education></UserPrivateRoute>
            },
            {
                path: "experience",
                element: <UserPrivateRoute><Experience></Experience></UserPrivateRoute>
            },
            
            // Recruiter Profile
            {
                path: "recruiterProfile",
                element: <RecruiterProfile></RecruiterProfile>
            },
            {
                path: "recruiterProfileEdit",
                element: <RecruiterProfileEdit></RecruiterProfileEdit>
            },
        ]   
    }
]);

export default router;