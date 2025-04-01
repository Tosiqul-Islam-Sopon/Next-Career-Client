import { useQuery } from "@tanstack/react-query";
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../../Providers/AuthProvider";
import useAxiosBase from "../../../CustomHooks/useAxiosBase";

const AppliedJobs = () => {
  const { user } = useContext(AuthContext);
  const axiosBase = useAxiosBase();
  const [applications, setApplications] = useState([]);
  const [appliedJobs, setAppliedJobs] = useState([]);

  const { data: userInfo = null, isLoading } = useQuery({
    queryKey: ["user", user?.email],
    queryFn: async () => {
      const response = await axiosBase.get(`/user-by-email/${user?.email}`);
      return response.data;
    },
  });

  useEffect(() => {
    const loadAppliedJobs = async () => {
      if (!userInfo?._id) return; // Ensure userInfo exists before making requests

      try {
        // Fetch applied jobs
        const response = await axiosBase.get(`/jobs/appliedJobs/${userInfo._id}`);
        setApplications(response.data);

        // Extract jobIds
        const jobIds = response.data.map(job => job.jobId);
        if (jobIds.length === 0) return; // Avoid unnecessary API calls if there are no jobIds

        // Fetch job details
        const jobsResponse = await axiosBase.get("/jobs/byIds", {
          params: { jobIds: jobIds.join(",") }, // Send jobIds as a comma-separated string
        });

        setAppliedJobs(jobsResponse.data.jobs);
      } catch (error) {
        console.error("Error loading applied jobs:", error.response?.data || error.message);
      }
    };

    loadAppliedJobs();
  }, [userInfo, axiosBase]);

  if (isLoading) {
    return <div className="mt-36 text-center">Loading...</div>;
  }

  return (
    <div className="container mx-auto mt-28 mb-8 px-4 md:px-12">
      <h2 className="text-2xl font-bold mb-6">Jobs You've Applied For</h2>
      {applications.length > 0 ? (
        applications.map((application) => {
          // Find the full job details from appliedJobs using jobId
          const job = appliedJobs.find((j) => j._id === application.jobId);
  
          if (!job) return null; // Skip if job details are missing
  
          // Find the applied date for the current user
          const appliedUser = application.appliedUsers.find(
            (user) => user.userId === userInfo._id
          );
          const appliedDate = appliedUser
            ? new Date(appliedUser.appliedOn).toLocaleDateString()
            : "N/A";
  
          return (
            <div key={application._id} className="bg-white shadow-md rounded-lg p-6 mb-4">
              <h3 className="text-xl font-semibold">{job.jobTitle}</h3>
              <p className="text-gray-700">{job.jobType}</p>
              <p className="text-gray-700 font-semibold">Salary: ৳ {job.salary}</p>
              <p className="text-gray-700">Company: {job.companyInfo?.companyName}</p>
              <div className="text-gray-500 text-sm">
                <p>Application Date: {appliedDate}</p>
              </div>
            </div>
          );
        })
      ) : (
        <div className="text-center">
          You have not applied for any jobs yet.
        </div>
      )}
    </div>
  );
  
};

export default AppliedJobs;
