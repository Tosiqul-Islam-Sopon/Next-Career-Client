import { useQuery } from "@tanstack/react-query";
import { useContext } from "react";
import { AuthContext } from "../../../Providers/AuthProvider";
import useAxiosBase from "../../../CustomHooks/useAxiosBase";
import { Link } from "react-router-dom";

const RecruiterProfile = () => {
  const { user } = useContext(AuthContext);
  const axiosBase = useAxiosBase();
  const { data: recruiter = null, isLoading } = useQuery({
    queryKey: ["recruiter", user.email],
    queryFn: async () => {
      const response = await axiosBase.get(`/user-by-email/${user?.email}`);
      return response.data;
    },
  });

  if (isLoading) {
    return (
      <div className="mt-32 text-center text-5xl text-green-400">
        Loading...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-6">
        {/* Company Logo */}
        <div className="flex justify-center">
          <img
            src={user.photoURL}
            alt={`${user.displayName} Logo`}
            className="w-24 h-24 object-cover rounded-full shadow-md"
          />
        </div>

        {/* Recruiter Info */}
        <div className="text-center mt-4">
          <h1 className="text-2xl font-bold text-gray-800">{recruiter.name}</h1>
          <p className="text-gray-600">{recruiter.position}</p>
          <p className="text-gray-600">{recruiter.companyName}</p>
        </div>

        {/* Contact Info */}
        <div className="mt-6">
          <div className="flex items-center justify-between text-gray-800">
            <span className="font-medium">Email:</span>
            <a
              href={`mailto:${recruiter.email}`}
              className="text-blue-600 hover:underline"
            >
              {recruiter.email}
            </a>
          </div>
          <div className="flex items-center justify-between text-gray-800 mt-2">
            <span className="font-medium">Website:</span>
            <a
              href={recruiter.website}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline"
            >
              {recruiter.website}
            </a>
          </div>
          <div className="flex items-center justify-between text-gray-800 mt-2">
            <span className="font-medium">Role:</span>
            <p>{recruiter.role}</p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-6 flex justify-center space-x-4">
          <Link to={"/dashboard/recruiterProfileEdit"}>
            <button className="bg-blue-500 text-white px-4 py-2 rounded-lg shadow hover:bg-blue-600">
              Edit Profile
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default RecruiterProfile;
