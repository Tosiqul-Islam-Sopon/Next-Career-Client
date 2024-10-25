import useAxiosBase from "../../../CustomHooks/useAxiosBase";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router-dom";

const UserProfile = () => {
  const { userId } = useParams();
  const axiosBase = useAxiosBase();

  const { data: userInfo = null, isLoading } = useQuery({
    queryKey: ["user", userId],
    queryFn: async () => {
      const response = await axiosBase.get(`/user/${userId}`);
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
    <div className="max-w-4xl mx-auto bg-white shadow-md rounded-lg p-8 mt-20">
      {/* Profile Header */}
      <div className="flex flex-col items-center mb-8">
        <div className="h-52 w-52 rounded-full bg-gray-200 overflow-hidden flex items-center justify-center mb-4">
          {userInfo?.profilePic ? (
            <img
              src={userInfo?.profilePic}
              alt={`${userInfo?.name}'s profile`}
              className="h-full w-full object-cover"
            />
          ) : (
            <span className="text-gray-500">No Image</span>
          )}
        </div>
        <h1 className="text-3xl font-semibold">{userInfo?.name}</h1>
        <p className="text-gray-500">{userInfo?.email}</p>
        <p className="text-sm text-gray-600">
          {userInfo?.personalInfo?.bio || "No bio available"}
        </p>
      </div>

      {/* Personal Information */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8">
        <div>
          <h2 className="text-lg font-semibold">Contact Information</h2>
          <p>
            <strong>Phone:</strong> {userInfo?.personalInfo?.contactNo}
          </p>
          <p>
            <strong>Present Address:</strong>{" "}
            {userInfo?.personalInfo?.presentAddress}
          </p>
          <p>
            <strong>Permanent Address:</strong>{" "}
            {userInfo?.personalInfo?.permanentAddress}
          </p>
        </div>
        <div>
          <h2 className="text-lg font-semibold">Details</h2>
          <p>
            <strong>Nationality:</strong> {userInfo?.personalInfo?.nationality}
          </p>
          <p>
            <strong>Gender:</strong> {userInfo?.personalInfo?.gender}
          </p>
          <p>
            <strong>Date of Birth:</strong>{" "}
            {userInfo?.personalInfo?.dateOfBirth}
          </p>
        </div>
      </div>

      {/* Education and Experience Side-by-Side with Divider */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 relative">
        {/* Education Section */}
        <div className="pr-4">
          <h2 className="text-2xl font-semibold mb-4">Education</h2>
          {userInfo?.education &&
            userInfo?.education.map((edu, index) => (
              <div key={index} className="mb-4 p-4 border rounded-lg shadow-sm">
                <h3 className="text-lg font-semibold">{edu?.degree}</h3>
                <p>
                  <strong>Institution:</strong> {edu?.institution}
                </p>
                <p>
                  <strong>Subject:</strong> {edu?.subject}
                </p>
                <p>
                  <strong>Duration:</strong> {edu?.startDate} -{" "}
                  {edu.endDate || "Present"}
                </p>
                {edu.grade && (
                  <p>
                    <strong>Grade:</strong> {edu.grade}
                  </p>
                )}
                {edu.activities && (
                  <p>
                    <strong>Activities:</strong> {edu.activities}
                  </p>
                )}
                {edu.description && (
                  <p>
                    <strong>Description:</strong> {edu.description}
                  </p>
                )}
              </div>
            ))}
        </div>

        {/* Vertical Divider */}
        <div className="absolute left-1/2 top-0 h-full w-px bg-gray-300"></div>

        {/* Experience Section */}
        <div className="pl-4">
          <h2 className="text-2xl font-semibold mb-4">Experience</h2>
          {userInfo?.experience && userInfo?.experience.length > 0 ? (
            userInfo?.experience.map((exp, index) => (
              <div key={index} className="mb-4 p-4 border rounded-lg shadow-sm">
                <h3 className="text-lg font-semibold">{exp.title}</h3>
                <p>
                  <strong>Company:</strong> {exp?.company}
                </p>
                <p>
                  <strong>Duration:</strong> {exp?.startDate} -{" "}
                  {exp.endDate || "Present"}
                </p>
                {exp.description && <p>{exp.description}</p>}
              </div>
            ))
          ) : (
            <p className="text-gray-500">No experience added yet.</p>
          )}
        </div>
      </div>

      <button className="bg-green-700 text-white py-2 w-full rounded-lg mt-5 font-medium hover:bg-green-900">Select For Next Step</button>
    </div>
  );
};

export default UserProfile;
