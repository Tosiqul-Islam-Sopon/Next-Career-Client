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
import Resume from "../Pages/User/Profile/Resume/Resume";

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
            {
                path: "/postJob",
                element: <PrivateRoute><JobPostForm></JobPostForm></PrivateRoute>
            },
            {
                path: "/jobDetails/:jobId",
                element: <JobDetails></JobDetails>
            },
            {
                path: "jobs",
                element: <Jobs></Jobs>
            }
        ],
    },
    {
        path: "/dashboard",
        element: <Dashboard></Dashboard>,
        children: [
            {
                path: "personalInfo",
                element: <PersonalInfo></PersonalInfo>
            },
            {
                path: "editPersonalInfo",
                element: <EditPersonalInfo></EditPersonalInfo>
            },
            {
                path: "education",
                element: <Education></Education>
            },
            {
                path: "experience",
                element: <Experience></Experience>
            },
            {
                path: "resume",
                element: <Resume></Resume>
            }
        ]   
    }
]);

export default router;