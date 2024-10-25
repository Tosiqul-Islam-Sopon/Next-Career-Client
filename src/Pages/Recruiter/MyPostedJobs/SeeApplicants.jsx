import useAxiosBase from "../../../CustomHooks/useAxiosBase";
import { Link, useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";

const SeeApplicants = () => {
    const { jobId } = useParams();
    const axiosBase = useAxiosBase();

    const {data: applicants = null, isLoading} = useQuery({
        queryKey: ['applicants', jobId],
        queryFn: async () => {
            const response = await axiosBase.get(`/jobs/applicants/${jobId}`);
            return response.data;
        }
    })

    const {data: job = null, isLoading: jobLoading} = useQuery({
        queryKey: ['job', jobId],
        queryFn: async () => {
            const response = await axiosBase.get(`/jobs/job/${jobId}`)
            return response.data;
        }
    })

    if (isLoading || jobLoading){
        return <div className="mt-36 text-center">Loading...</div>;
    }

    return (
        <div className="container mt-24">
            <h1 className="text-3xl font-bold text-center mb-8">Applicants for {job?.jobTitle}</h1>
            
            {applicants.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full">
                    {applicants.map((applicant, index) => (
                    <Link key={index} to={`/profile/${applicant._id}`} className="bg-white shadow-md rounded-lg p-6 hover:shadow-lg transition-shadow">
                        <div className="h-44 w-44 rounded-full flex items-center justify-center bg-gray-200 text-gray-700 text-center mx-auto">
                        {applicant?.profilePic ? (
                            <img
                            className="h-full w-full rounded-full object-cover"
                            src={applicant.profilePic}
                            alt={`${applicant.name} img`}
                            />
                        ) : (
                            <span>{applicant.name}</span>
                        )}
                        </div>
                        <h2 className="text-2xl font-semibold text-center mt-4">{applicant.name}</h2>
                    </Link>
                    ))}
                </div>
                ) : (
                <p className="text-center text-gray-500">No applicants have applied yet.</p>
            )}
        </div>
    );
};

export default SeeApplicants;
