// import { useContext } from "react";
// import { AuthContext } from "../../../../Providers/AuthProvider";
// import { Link } from "react-router-dom";
// import useAxiosBase from "../../../../CustomHooks/useAxiosBase";
// import { useQuery } from "@tanstack/react-query";

// const PersonalInfo = () => {
// const { user } = useContext(AuthContext);
// const axiosBase = useAxiosBase();

// const { data: userInfo = null, isLoading } = useQuery({
//     queryKey: ['user', user?.email],
//     queryFn: async () => {
//         const response = await axiosBase.get(`/user-by-email/${user?.email}`);
//         return response.data;
//     }
// });

// if (isLoading) {
//     return <div className='mt-32 text-center text-5xl text-green-400'>Loading...</div>;
// }

// const { name, email, personalInfo = {} } = userInfo;
// const {dateOfBirth, ContactNo, bio, gender, github, linkedIn, nationality, permanentAddress, personalWebsite, presentAddress} = personalInfo;

//     return (
//         <div className="max-w-3xl mx-auto p-8 border rounded-lg shadow-lg bg-white">
//             <div className="relative mb-6">
//                 <div className="absolute top-3 right-5">
//                     <Link to={"/dashboard/editPersonalInfo"}>
//                         <button className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-900">Edit</button>
//                     </Link>
//                 </div>
//                 <div className="flex flex-col items-center gap-5">
//                     <img className="rounded-full h-28 w-28 border-2 border-orange-500 shadow-2xl" src={user?.photoURL} alt="Profile" />
//                     <h1 className="text-3xl font-bold">{name}</h1>
//                 </div>
//             </div>

//             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                 <div>
//                     <h2 className="text-xl font-semibold mb-2">Contact Information</h2>
//                     <p className="text-gray-700"><strong>Email:</strong> {email}</p>
//                     <p className="text-gray-700"><strong>Contact No:</strong> {ContactNo}</p>
//                     <p className="text-gray-700"><strong>Date of Birth:</strong> {dateOfBirth}</p>
//                     <p className="text-gray-700"><strong>Gender:</strong> {gender}</p>
//                     <p className="text-gray-700"><strong>Nationality:</strong> {nationality}</p>
//                 </div>

//                 <div>
//                     <h2 className="text-xl font-semibold mb-2">Addresses</h2>
//                     <p className="text-gray-700"><strong>Present Address:</strong> {presentAddress}</p>
//                     <p className="text-gray-700"><strong>Permanent Address:</strong> {permanentAddress}</p>
//                 </div>

//                 <div>
//                     <h2 className="text-xl font-semibold mb-2">Online Profiles</h2>
//                     <p className="text-gray-700"><strong>GitHub:</strong> <a href={github} target="_blank" rel="noopener noreferrer" className="text-blue-500 underline">{github}</a></p>
//                     <p className="text-gray-700"><strong>LinkedIn:</strong> <a href={linkedIn} target="_blank" rel="noopener noreferrer" className="text-blue-500 underline">{linkedIn}</a></p>
//                     <p className="text-gray-700"><strong>Personal Website:</strong> <a href={personalWebsite} target="_blank" rel="noopener noreferrer" className="text-blue-500 underline">{personalWebsite}</a></p>
//                 </div>

//                 <div>
//                     <h2 className="text-xl font-semibold mb-2">Bio</h2>
//                     <p className="text-gray-700">{bio}</p>
//                 </div>
//             </div>
//         </div>
//     );
// };

// export default PersonalInfo;

import {
  User,
  Mail,
  Phone,
  Calendar,
  MapPin,
  Globe,
  Github,
  Linkedin,
  Edit2,
  Flag,
  UserCircle,
} from "lucide-react";
import { useContext } from "react";
import { AuthContext } from "../../../../Providers/AuthProvider";
import useAxiosBase from "../../../../CustomHooks/useAxiosBase";
import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import SkeletonLoader from "../../../Shared/Loaders/SkeletonLoader";

export default function PersonalInfo() {
  const { user } = useContext(AuthContext);
  const axiosBase = useAxiosBase();

  const { data: userInfo = null, isLoading } = useQuery({
    queryKey: ["user", user?.email],
    queryFn: async () => {
      const response = await axiosBase.get(`/user-by-email/${user?.email}`);
      return response.data;
    },
  });

  if (isLoading) {
    return (
      <SkeletonLoader />
    );
  }

  const { name, email, personalInfo = {} } = userInfo;
  const {
    dateOfBirth,
    ContactNo,
    bio,
    gender,
    github,
    linkedIn,
    nationality,
    permanentAddress,
    personalWebsite,
    presentAddress,
  } = personalInfo;

  return (
    <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-md overflow-hidden transition-all duration-300 hover:shadow-lg">
      {/* Header with profile image and name */}
      <div className="relative bg-gradient-to-r from-slate-100 to-slate-200 p-8">
        <div className="absolute top-4 right-4">
          <Link to="/dashboard/editPersonalInfo">
            <button className="group flex items-center gap-1.5 rounded-full bg-white px-3 py-1.5 text-sm font-medium text-slate-700 shadow-sm transition-all hover:bg-slate-50 hover:text-slate-900 hover:shadow">
              <Edit2
                size={14}
                className="text-slate-500 group-hover:text-slate-700"
              />
              <span>Edit</span>
            </button>
          </Link>
        </div>

        <div className="flex flex-col items-center sm:flex-row sm:items-start sm:space-x-6">
          <div className="relative">
            {user?.photoURL ? (
              <img
                src={user.photoURL || "/placeholder.svg"}
                alt={name}
                className="h-24 w-24 rounded-full border-4 border-white shadow-md object-cover"
              />
            ) : (
              <div className="h-24 w-24 rounded-full bg-slate-200 flex items-center justify-center border-4 border-white shadow-md">
                <UserCircle size={60} className="text-slate-400" />
              </div>
            )}
          </div>

          <div className="mt-4 sm:mt-0 text-center sm:text-left">
            <h1 className="text-2xl font-bold text-slate-800">{name}</h1>
            <p className="text-slate-500 flex items-center justify-center sm:justify-start mt-1">
              <Mail size={16} className="mr-1.5" />
              {email}
            </p>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="p-6">
        {/* Bio section */}
        <div className="mb-8">
          <h2 className="text-lg font-semibold text-slate-800 border-b border-slate-200 pb-2 mb-3">
            About
          </h2>
          <p className="text-slate-600 leading-relaxed">
            {bio || "No bio provided"}
          </p>
        </div>

        {/* Information grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
          {/* Personal Information */}
          <div>
            <h2 className="text-lg font-semibold text-slate-800 border-b border-slate-200 pb-2 mb-4">
              Personal Information
            </h2>

            <div className="space-y-4">
              <div className="flex items-start">
                <Phone className="w-5 h-5 text-slate-500 mt-0.5 mr-3 flex-shrink-0" />
                <div>
                  <p className="text-xs text-slate-500 mb-1">Phone</p>
                  <p className="text-slate-700">
                    {ContactNo || "Not provided"}
                  </p>
                </div>
              </div>

              <div className="flex items-start">
                <Calendar className="w-5 h-5 text-slate-500 mt-0.5 mr-3 flex-shrink-0" />
                <div>
                  <p className="text-xs text-slate-500 mb-1">Date of Birth</p>
                  <p className="text-slate-700">
                    {dateOfBirth || "Not provided"}
                  </p>
                </div>
              </div>

              <div className="flex items-start">
                <User className="w-5 h-5 text-slate-500 mt-0.5 mr-3 flex-shrink-0" />
                <div>
                  <p className="text-xs text-slate-500 mb-1">Gender</p>
                  <p className="text-slate-700">{gender || "Not provided"}</p>
                </div>
              </div>

              <div className="flex items-start">
                <Flag className="w-5 h-5 text-slate-500 mt-0.5 mr-3 flex-shrink-0" />
                <div>
                  <p className="text-xs text-slate-500 mb-1">Nationality</p>
                  <p className="text-slate-700">
                    {nationality || "Not provided"}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Addresses */}
          <div>
            <h2 className="text-lg font-semibold text-slate-800 border-b border-slate-200 pb-2 mb-4">
              Addresses
            </h2>

            <div className="space-y-4">
              <div className="flex items-start">
                <MapPin className="w-5 h-5 text-slate-500 mt-0.5 mr-3 flex-shrink-0" />
                <div>
                  <p className="text-xs text-slate-500 mb-1">Present Address</p>
                  <p className="text-slate-700">
                    {presentAddress || "Not provided"}
                  </p>
                </div>
              </div>

              <div className="flex items-start">
                <MapPin className="w-5 h-5 text-slate-500 mt-0.5 mr-3 flex-shrink-0" />
                <div>
                  <p className="text-xs text-slate-500 mb-1">
                    Permanent Address
                  </p>
                  <p className="text-slate-700">
                    {permanentAddress || "Not provided"}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Online Profiles */}
          <div className="md:col-span-2">
            <h2 className="text-lg font-semibold text-slate-800 border-b border-slate-200 pb-2 mb-4">
              Online Profiles
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {github && (
                <a
                  href={github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center p-3 rounded-lg border border-slate-200 hover:bg-slate-50 transition-colors"
                >
                  <Github className="w-5 h-5 text-slate-700 mr-2" />
                  <span className="text-slate-700 text-sm truncate">
                    GitHub Profile
                  </span>
                </a>
              )}

              {linkedIn && (
                <a
                  href={linkedIn}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center p-3 rounded-lg border border-slate-200 hover:bg-slate-50 transition-colors"
                >
                  <Linkedin className="w-5 h-5 text-slate-700 mr-2" />
                  <span className="text-slate-700 text-sm truncate">
                    LinkedIn Profile
                  </span>
                </a>
              )}

              {personalWebsite && (
                <a
                  href={personalWebsite}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center p-3 rounded-lg border border-slate-200 hover:bg-slate-50 transition-colors"
                >
                  <Globe className="w-5 h-5 text-slate-700 mr-2" />
                  <span className="text-slate-700 text-sm truncate">
                    Personal Website
                  </span>
                </a>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
