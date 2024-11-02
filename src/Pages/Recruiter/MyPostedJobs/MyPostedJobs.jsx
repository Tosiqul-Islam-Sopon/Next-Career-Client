import { useContext } from "react";
import { AuthContext } from "../../../Providers/AuthProvider";
import { useQuery } from "@tanstack/react-query";
import useAxiosBase from "../../../CustomHooks/useAxiosBase";
import { Link } from "react-router-dom";

const MyPostedJobs = () => {
  const { user } = useContext(AuthContext);
  const axiosBase = useAxiosBase();

  // Fetch the posted jobs using the user's email
  const {
    data: jobs = [],
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["myPostedJobs", user?.email],
    queryFn: async () => {
      const response = await axiosBase.get(`/jobs/myPostedJobs/${user?.email}`);
      return response.data;
    },
    enabled: !!user?.email, // Ensures the query runs only if the email exists
  });

  if (isLoading) {
    return <div className="mt-24 text-center">Loading...</div>;
  }

  if (isError) {
    return (
      <div className="mt-24 text-center">
        Failed to load jobs. Please try again later.
      </div>
    );
  }

  if (jobs.length === 0) {
    return <div className="mt-24 text-center">No jobs posted by you.</div>;
  }

  return (
    <div className="mt-24 text-center">
      <h1 className="text-5xl font-bold mb-8">My Posted Jobs</h1>
      <div className="grid gap-6 lg:grid-cols-2 xl:grid-cols-3">
        {jobs.map((job) => (
          <div key={job._id} className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-2xl font-bold mb-2">{job.jobTitle}</h2>
            <p className="text-gray-700 mb-4">{job.jobDescription}</p>
            <p className="text-green-500 font-semibold mb-2">
              ৳{job.salary} / Month
            </p>
            <p className="text-gray-600">Location: {job.jobLocation}</p>
            <p className="text-gray-600">Vacancy: {job.vacancy}</p>
            <p className="text-gray-600">
              Deadline: {new Date(job.deadline).toLocaleDateString()}
            </p>
            <div className="space-x-10">
              <Link to={`/seeApplicants/${job._id}`}>
                <button className="mt-4 px-4 py-2 bg-blue-700 text-white font-semibold rounded-lg hover:bg-blue-900 transition duration-300">
                  See applicants
                </button>
              </Link>
              <Link to={`/jobDetailsAndEdit/${job._id}`}>
                <button className="mt-4 px-4 py-2 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-900 transition duration-300">
                  Details
                </button>
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MyPostedJobs;
