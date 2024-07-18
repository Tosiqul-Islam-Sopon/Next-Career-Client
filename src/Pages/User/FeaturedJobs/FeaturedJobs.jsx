import { useQuery } from "@tanstack/react-query";
import useAxiosBase from "../../../CustomHooks/useAxiosBase";
import JobCard from "../../Shared/JobCard/JobCard";

const FeaturedJobs = () => {
    const axiosBase = useAxiosBase();

    const { data: jobs = null, isLoading } = useQuery({
        queryKey: ['featuredJobs'],
        queryFn: async () => {
            const response = await axiosBase.get('/jobs/featuredJobs');
            return response.data;
        }
    })

    if (isLoading) {
        return <div className='mt-32 text-center text-5xl text-green-400'>Loading...</div>;
    }

    return (
        <div className="my-10">
            <h1 className="text-4xl mb-5 text-center">Featured Jobs</h1>

            <div className="grid grid-cols-1">
                {jobs.map((job) => (
                    <JobCard key={job._id} job={job} />
                ))}
            </div>

            <div className="mx-auto w-fit mt-5">
                <button className="text-white border-none bg-green-500 hover:bg-green-800 px-4 py-2 rouded uppercase transform transition-transform duration-500 hover:scale-105">View all jobs</button>
            </div>
        </div>
    );
};

export default FeaturedJobs;