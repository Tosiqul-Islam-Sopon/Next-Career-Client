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
            }
        ],
    },
]);

export default router;