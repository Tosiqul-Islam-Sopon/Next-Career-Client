import { useState } from 'react';
import { useQuery } from "@tanstack/react-query";
import useAxiosBase from "../../../CustomHooks/useAxiosBase";
import JobCard from "../../Shared/JobCard/JobCard";

const Jobs = () => {
    const axiosBase = useAxiosBase();

    const { data: jobs = [], isLoading } = useQuery({
        queryKey: ['all jobs'],
        queryFn: async () => {
            const response = await axiosBase.get('/jobs');
            return response.data;
        }
    });

    const [searchTitle, setSearchTitle] = useState('');
    const [searchCompany, setSearchCompany] = useState('');
    const [category, setCategory] = useState('');
    const [sortCriteria, setSortCriteria] = useState('');
    const [jobType, setJobType] = useState('');

    const filteredJobs = jobs
        .filter(job =>
            job.jobTitle.toLowerCase().includes(searchTitle.toLowerCase()) &&
            job.companyInfo.companyName.toLowerCase().includes(searchCompany.toLowerCase())
        )
        .filter(job => category ? job.jobCategory === category : true)
        .filter(job => jobType ? job.jobType === jobType : true)
        .sort((a, b) => {
            switch (sortCriteria) {
                case 'Salary':
                    return b.salary - a.salary;
                case 'Vacancy':
                    return b.vacancy - a.vacancy;
                case 'Visitors':
                    return b.view - a.view;
                case 'Deadline':
                    return new Date(a.deadline) - new Date(b.deadline);
                default:
                    return 0;
            }
        });

    if (isLoading) {
        return <div className='mt-32 text-center text-5xl text-green-400'>Loading...</div>;
    }

    return (
        <div className="mt-24 mb-8">
            <div className="flex justify-between items-center mb-4 px-10">
                <input
                    type="text"
                    placeholder="Search by Job Title"
                    value={searchTitle}
                    onChange={(e) => setSearchTitle(e.target.value)}
                    className="border border-gray-300 rounded-md p-2 mr-2 w-full"
                />
                <input
                    type="text"
                    placeholder="Search by Company"
                    value={searchCompany}
                    onChange={(e) => setSearchCompany(e.target.value)}
                    className="border border-gray-300 rounded-md p-2 mr-2 w-full"
                />
            </div>
            <div className='flex justify-between items-center mb-4 px-10'>
                <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="border border-gray-300 rounded-md p-2 mr-2 w-full"
                >
                    <option value="">Filter by Category</option>
                    <option value="Development">Development</option>
                    <option value="Marketing">Marketing</option>
                    <option value="Design">Design</option>
                    {/* Add more categories as needed */}
                </select>
                <select
                    value={sortCriteria}
                    onChange={(e) => setSortCriteria(e.target.value)}
                    className="border border-gray-300 rounded-md p-2 mr-2 w-full"
                >
                    <option value="">Sort by</option>
                    <option value="Salary">Salary</option>
                    <option value="Vacancy">Vacancy</option>
                    <option value="Visitors">Visitors</option>
                    <option value="Deadline">Deadline</option>
                </select>
                <select
                    value={jobType}
                    onChange={(e) => setJobType(e.target.value)}
                    className="border border-gray-300 rounded-md p-2 w-full"
                >
                    <option value="">Filter by Job Type</option>
                    <option value="Remote">Remote</option>
                    <option value="Onsite">Onsite</option>
                    <option value="Full Time">Full Time</option>
                    <option value="Part Time">Part Time</option>
                </select>
            </div>

            <div className="grid grid-cols-1 gap-4">
                {filteredJobs.map((job) => (
                    <JobCard key={job._id} job={job} />
                ))}
            </div>
        </div>
    );
};

export default Jobs;
