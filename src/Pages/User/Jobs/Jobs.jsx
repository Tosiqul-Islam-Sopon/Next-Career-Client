import { useEffect, useState } from 'react';
import useAxiosBase from "../../../CustomHooks/useAxiosBase";
import JobCard from "../../Shared/JobCard/JobCard";

const Jobs = () => {
    const axiosBase = useAxiosBase();

    const [jobs, setJobs] = useState([]);
    const [searchTitle, setSearchTitle] = useState('');
    const [searchCompany, setSearchCompany] = useState('');
    const [category, setCategory] = useState('');
    const [sortCriteria, setSortCriteria] = useState('');
    const [jobType, setJobType] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);

    useEffect(() => {
        const loadJobs = async () => {
            try {
                setIsLoading(true);
                const response = await axiosBase.get('/jobs', {
                    params: {
                        searchTitle,
                        searchCompany,
                        category,
                        sortCriteria,
                        jobType,
                        page,
                        limit: 15
                    }
                });
                setJobs(response.data.jobs);
                setPage(response.data.currentPage);
                setTotalPages(response.data.totalPages);
            } catch (error) {
                console.error("Error fetching jobs:", error);
            } finally {
                setIsLoading(false);
            }
        };

        loadJobs();
    }, [searchTitle, searchCompany, category, sortCriteria, jobType, page, axiosBase]);

    const handlePageChange = (newPage) => {
        setPage(newPage);
    };

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
                    <option value="Marketing">Marketing</option>
                    <option value="Customer Service">Customer Service</option>
                    <option value="Human Resource">Human Resource</option>
                    <option value="Project Management">Project Management</option>
                    <option value="Business Development">Business Development</option>
                    <option value="Sales & Communication">Sales & Communication</option>
                    <option value="Teaching & Education">Teaching & Education</option>
                    <option value="Design & Creative">Design & Creative</option>
                    <option value="Finance & Accounting">Finance & Accounting</option>
                    <option value="Engineering">Engineering</option>
                    <option value="Software Development">Software Development</option>
                    <option value="Information Technology">Information Technology</option>
                    <option value="Operations & Logistics">Operations & Logistics</option>
                    <option value="Healthcare">Healthcare</option>
                    <option value="Legal">Legal</option>
                    <option value="Data Science">Data Science</option>
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
                    <option value="On Site">On Site</option>
                    <option value="Full Time">Full Time</option>
                    <option value="Part Time">Part Time</option>
                </select>
            </div>

            <div className="grid grid-cols-1 gap-4">
                {jobs.map((job) => (
                    <JobCard key={job._id} job={job} />
                ))}
            </div>

            <div className="flex justify-center mt-6">
                <button
                    onClick={() => handlePageChange(page - 1)}
                    disabled={page === 1}
                    className="px-4 py-2 mr-2 bg-gray-300 rounded-md"
                >
                    Previous
                </button>
                <span className="px-4 py-2">{page} of {totalPages}</span>
                <button
                    onClick={() => handlePageChange(page + 1)}
                    disabled={page === totalPages}
                    className="px-4 py-2 ml-2 bg-gray-300 rounded-md"
                >
                    Next
                </button>
            </div>
        </div>
    );
};

export default Jobs;
