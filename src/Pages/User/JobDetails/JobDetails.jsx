// src/components/JobDetails.js
import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import useAxiosBase from "../../../CustomHooks/useAxiosBase";

const JobDetails = () => {
    const { jobId } = useParams();
    const axiosBase = useAxiosBase();

    const { data: job = null, isLoading } = useQuery({
        queryKey: [`job${jobId}`],
        queryFn: async () => {
            const response = await axiosBase.get(`/jobs/job/${jobId}`);
            return response.data;
        }
    });

    if (isLoading) {
        return <div className="mt-36 text-center">Loading...</div>;
    }

    // console.log(job);

    const {
        jobTitle,
        jobDescription,
        jobRequirements,
        jobQualifications,
        jobCategory,
        jobType,
        jobLocation,
        salary,
        deadline,
        recruitmentImageUrl,
        companyInfo,
        onSitePlace,
        vacancy
    } = job;

    return (
        <div className="container mx-auto mt-28 mb-8 px-4 md:px-12">
            <div className="bg-white shadow-md rounded-lg p-6">
                <div className="flex mb-6">
                    <img src={recruitmentImageUrl} alt={jobTitle} className="w-24 h-24 rounded-lg shadow-md mr-6" />
                    <div>
                        <h1 className="text-3xl font-bold mb-2">{jobTitle}</h1>
                        <div className="text-gray-700 mb-4">
                            <span>{companyInfo?.companyName}</span> | <span>{jobLocation === "Remote" ? jobLocation : onSitePlace}</span>
                        </div>
                        <div className="text-green-500 font-semibold">
                        ৳{salary} / Month
                        </div>
                    </div>
                </div>

                <div className="mb-6">
                    <h2 className="text-2xl font-semibold mb-3">Job Description</h2>
                    <p className="text-gray-700 mb-4">
                        {jobDescription}
                    </p>
                </div>

                <div className="mb-6">
                    <h2 className="text-2xl font-semibold mb-3">Requirements</h2>
                    <p className="text-gray-700 mb-4">
                        {jobRequirements}
                    </p>
                </div>

                <div className="mb-6">
                    <h2 className="text-2xl font-semibold mb-3">Qualifications</h2>
                    <p className="text-gray-700 mb-4">
                        {jobQualifications}
                    </p>
                </div>

                <div className="mb-6">
                    <h2 className="text-2xl font-semibold mb-3">Job Details</h2>
                    <ul className="list-disc list-inside text-gray-700 mb-4">
                        <li>Category: {jobCategory}</li>
                        <li>Type: {jobType}</li>
                        <li>Location: {jobLocation === "Remote" ? jobLocation : onSitePlace}</li>
                        <li>Vacancy: {vacancy}</li>
                        <li>Application Deadline: {new Date(deadline).toLocaleDateString()}</li>
                    </ul>
                </div>

                <div className="flex justify-center mt-8">
                    <button className="bg-green-500 text-white font-semibold py-2 px-4 rounded-lg shadow-md hover:bg-green-600 transition duration-300">
                        Apply Now
                    </button>
                </div>
            </div>
        </div>
    );
};

export default JobDetails;
