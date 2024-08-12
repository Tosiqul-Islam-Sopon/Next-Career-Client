import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import useAxiosBase from '../../../../CustomHooks/useAxiosBase';
import JobCard from '../../../Shared/JobCard/JobCard';

const JobsByCategory = () => {
    const { category } = useParams();
    const [jobs, setJobs] = useState([]);
    const axiosBase = useAxiosBase();

    useEffect(() => {
        const fetchJobs = async () => {
            try {
                const response = await axiosBase.get(`/jobs/category/${category}`);
                setJobs(response.data);
            } catch (error) {
                console.error("Error fetching jobs by category:", error);
            }
        };

        fetchJobs();
    }, [category, axiosBase]);

    return (
        <div className="container mx-auto px-4 py-8">
            <h2 className="text-3xl font-bold text-center mb-8">{category} Jobs</h2>
            <div className="grid grid-cols-1">
                {jobs.map((job) => (
                    <JobCard key={job._id} job={job} />
                ))}
            </div>
        </div>
    );
};

export default JobsByCategory;
