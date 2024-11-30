// src/components/JobDetails.js
import { useQuery } from "@tanstack/react-query";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import useAxiosBase from "../../../CustomHooks/useAxiosBase";
import { useContext } from "react";
import { AuthContext } from "../../../Providers/AuthProvider";
import Swal from "sweetalert2";

const JobDetails = () => {
    const { jobId } = useParams();
    const { user } = useContext(AuthContext);
    const axiosBase = useAxiosBase();
    const navigate = useNavigate();
    const location = useLocation();

    const { data: job = null, isLoading } = useQuery({
        queryKey: [`job${jobId}`],
        queryFn: async () => {
            const response = await axiosBase.get(`/jobs/job/${jobId}`);
            return response.data;
        }
    });

    const { data: userInfo = null, isLoading: userLoading } = useQuery({
        queryKey: ['user', user?.email],
        queryFn: async () => {
            const response = await axiosBase.get(`/user-by-email/${user?.email}`);
            return response.data;
        }
    })

    const { data: isApplied = null, isLoading: applicationCheckLoading, refetch: refetchApplicationStatus } = useQuery({
        queryKey: ['job', jobId, userInfo],
        queryFn: async () => {
            const response = await axiosBase.get(`/jobs/checkApplication`, {
                params: {
                    jobId: jobId,
                    userId: userInfo?._id
                }
            });
            return response.data;
        },
        refetchOnWindowFocus: false,
        enabled: !!jobId && !!userInfo?._id,  // Only run the query if jobId and userId are present
    });
    
    
    if (isLoading || userLoading || applicationCheckLoading) {
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

    const handleApplyNow = async () => {
        if (user) {
            try {
                // Check if the user has a resume uploaded
                const response = await axiosBase.get(`/user/${userInfo._id}/hasResume`);
                const hasResume = response.data.hasResume;

                // Check if the user has completed their profile
                if (hasResume && userInfo.personalInfo && userInfo.education) {
                    // Send a request to apply for the job
                    const applyResponse = await axiosBase.post(`/jobs/apply`, {
                        userId: userInfo._id,
                        jobId: job._id,
                    });

                    if (applyResponse.status === 200) {
                        Swal.fire({
                            title: 'Success',
                            text: 'You have successfully applied for the job!',
                            icon: 'success',
                            confirmButtonText: 'OK'
                        });
                        refetchApplicationStatus();
                    } else {
                        Swal.fire({
                            title: 'Error',
                            text: 'Failed to apply for the job',
                            icon: 'error',
                            confirmButtonText: 'OK'
                        });
                    }
                } else {
                    Swal.fire({
                        title: 'Incomplete Profile',
                        text: 'Please upload your resume and complete your profile before applying.',
                        icon: 'warning',
                        confirmButtonText: 'OK'
                    });
                }
            } catch (error) {
                console.error('Error applying for job:', error);
                Swal.fire({
                    title: 'Error',
                    text: 'Failed to apply for the job',
                    icon: 'error',
                    confirmButtonText: 'OK'
                });
            }
        }
        else{
            Swal.fire({
                title: 'Login Required',
                text: 'You need to login to apply for a job.',
                icon: 'info',
                confirmButtonText: 'Login',
                showCancelButton: true,
                cancelButtonText: 'Cancel',
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                allowOutsideClick: false,
                allowEscapeKey: false,
                preConfirm: () => {
                    navigate('/login', {
                        state: { from: location }
                    });
                }
            });
        }
    };


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
                    {
                        !isApplied ? (
                            <button
                                onClick={handleApplyNow}
                                className="bg-green-500 text-white font-semibold py-2 px-4 rounded-lg shadow-md hover:bg-green-600 transition duration-300">
                                Apply Now
                            </button>
                        ) : (
                            <button
                                className="bg-gray-500 text-white font-semibold py-2 px-4 rounded-lg shadow-md hover:bg-gray-600 transition duration-300 cursor-not-allowed"
                                disabled>
                                You already applied in this job
                            </button>
                        )
                    }
                </div>

            </div>
        </div>
    );
};

export default JobDetails;
