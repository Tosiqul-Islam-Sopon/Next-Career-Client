import { useQuery } from "@tanstack/react-query";
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../../Providers/AuthProvider";
import useAxiosBase from "../../../CustomHooks/useAxiosBase";

const AppliedJobs = () => {
    const { user } = useContext(AuthContext);
    const axiosBase = useAxiosBase();
    const [appliedJobs, setAppliedJobs] = useState([]);

    const { data: userInfo = null, isLoading } = useQuery({
        queryKey: ['user', user?.email],
        queryFn: async () => {
            const response = await axiosBase.get(`/user/${user?.email}`);
            return response.data;
        },
    });

    useEffect(() => {
        const loadAppliedJobs = async () => {
            if (userInfo) {
                const response = await axiosBase.get(`/jobs/appliedJobs/${userInfo._id}`);
                setAppliedJobs(response.data);
            }
        }
        loadAppliedJobs();
    }, [axiosBase, userInfo]);

    if (isLoading) {
        return <div className="mt-36 text-center">Loading...</div>;
    }

    return (
        <div className="container mx-auto mt-28 mb-8 px-4 md:px-12">
            <h2 className="text-2xl font-bold mb-6">Jobs You&apos;ve Applied For</h2>
            {appliedJobs.length > 0 ? (
                appliedJobs.map(job => {
                    // Find the applied date for the current user
                    const appliedUser = job.appliedUsers.find(user => user.userId === userInfo._id);
                    const appliedDate = appliedUser ? new Date(appliedUser.appliedOn).toLocaleDateString() : 'N/A';
                    
                    return (
                        <div key={job._id} className="bg-white shadow-md rounded-lg p-6 mb-4">
                            <h3 className="text-xl font-semibold">{job.jobTitle}</h3>
                            <p className="text-gray-700">{job.jobDescription}</p>
                            <div className="text-gray-500 text-sm">
                                <p>Application Date: {appliedDate}</p>
                                <p>Deadline: {new Date(job.deadline).toLocaleDateString()}</p>
                            </div>
                        </div>
                    );
                })
            ) : (
                <div className="text-center">You have not applied for any jobs yet.</div>
            )}
        </div>
    );
};

export default AppliedJobs;
