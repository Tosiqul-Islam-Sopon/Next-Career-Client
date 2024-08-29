import { useState } from 'react';
import { useQuery } from "@tanstack/react-query";
import useAxiosBase from "../../../../CustomHooks/useAxiosBase";
import JobCard from "../../../Shared/JobCard/JobCard";

const NewestJobs = () => {
    const [page, setPage] = useState(1);  // State to track current page
    const axiosBase = useAxiosBase();

    // Fetch newest jobs from the backend
    const { data, isLoading } = useQuery({
        queryKey: ['newestJobs', page],
        queryFn: async () => {
            const response = await axiosBase.get(`/jobs/newestJobs?page=${page}&limit=10`);
            return response.data;
        },
        keepPreviousData: true,  // Retains previous data until new data is fetched
    });

    const jobs = data?.jobs || [];
    const totalPages = data?.totalPages || 1;

    const handleNextPage = () => {
        if (page < totalPages) {
            setPage((prevPage) => prevPage + 1);
        }
    };

    const handlePreviousPage = () => {
        if (page > 1) {
            setPage((prevPage) => prevPage - 1);
        }
    };

    if (isLoading) {
        return <div className='mt-32 text-center text-5xl text-green-400'>Loading...</div>;
    }

    return (
        <div className="my-16">
            <h1 className="text-4xl mb-5 text-center">Newest Jobs</h1>

            <div className="grid grid-cols-2">
                {jobs.map((job) => (
                    <JobCard key={job._id} job={job} />
                ))}
            </div>

            <div className="mx-auto w-fit mt-5 flex justify-center gap-4">
                <button
                    className={`text-white border-none bg-green-500 hover:bg-green-800 px-4 py-2 rounded uppercase transform transition-transform duration-500 hover:scale-105 ${page === 1 ? 'opacity-50 cursor-not-allowed' : ''}`}
                    onClick={handlePreviousPage}
                    disabled={page === 1}
                >
                    Previous
                </button>

                <button
                    className={`text-white border-none bg-green-500 hover:bg-green-800 px-4 py-2 rounded uppercase transform transition-transform duration-500 hover:scale-105 ${page === totalPages ? 'opacity-50 cursor-not-allowed' : ''}`}
                    onClick={handleNextPage}
                    disabled={page === totalPages}
                >
                    Next
                </button>
            </div>
        </div>
    );
};

export default NewestJobs;
