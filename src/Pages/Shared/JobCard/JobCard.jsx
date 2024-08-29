import PropTypes from 'prop-types';
import { FaRegCalendarAlt, FaRegMoneyBillAlt } from 'react-icons/fa';
import { IoLocationOutline } from 'react-icons/io5';
import { PiOfficeChairLight } from 'react-icons/pi';
import { Link } from 'react-router-dom';
import useAxiosBase from '../../../CustomHooks/useAxiosBase';
import { MdGroups } from 'react-icons/md';

const JobCard = ({ job }) => {
    const { _id, jobTitle, salary, deadline, recruitmentImageUrl, companyInfo, jobLocation, onSitePlace, vacancy, view } = job;
    const { companyName, companyLogo } = companyInfo;
    const axiosBase = useAxiosBase();

    const handleViewCount = async (jobId) => {
        try {
            await axiosBase.patch(`/jobs/incrementView/${jobId}`);
            // console.log("View count incremented successfully");
        } catch (error) {
            console.error("Failed to increment view count", error);
        }
    };

    return (
        <div className="mx-5 my-5 p-4 shadow-xl flex gap-7 transform transition-transform duration-500 hover:scale-105 hover:shadow-2xl rounded-xl border-t">
            <img className='w-32 h-full rounded-lg' src={recruitmentImageUrl} alt="" />
            <div className='w-full flex flex-col justify-between'>
                <div>
                    <div className='flex justify-between items-center'>
                        <div>
                            <h3 className="text-2xl font-bold">{jobTitle}</h3>
                            <div className='flex gap-3 items-center ml-5'>
                                <p>at</p>
                                <img className='w-5 h-5 rounded-full' src={companyLogo} alt="" />
                                <h4 className='text-lg text-gray-600'>{companyName}</h4>
                            </div>
                        </div>
                    </div>
                    <div className='flex justify-between mt-2'>
                        <p className='flex items-center gap-2'><span className='text-green-600 text-lg'><IoLocationOutline /></span> <span>{jobLocation === "Remote" ? jobLocation : onSitePlace}</span></p>

                        <p className='flex items-center gap-2'><span className='text-green-600 text-lg'><FaRegMoneyBillAlt /></span><span>৳ {salary}</span></p>
                        
                    </div>

                    <div className='flex justify-between mt-2'>
                        <p className='flex items-center gap-2'><span className='text-green-600 text-lg'><MdGroups /></span><span>Visitors {view}</span></p>

                        <p className='flex items-center gap-2 mt-2'><span className='text-green-600 text-lg'><PiOfficeChairLight /></span><span>Vacancy: {vacancy}</span></p>
                    </div>
                    
                    <p className='flex items-center gap-2 mt-2'><span className='text-green-600 text-lg'><FaRegCalendarAlt /></span><span>Deadline: {deadline}</span></p>
                </div>
                <div className='mt-3'>
                    <Link to={`/jobDetails/${_id}`}>
                        <button
                            className='bg-green-500 px-5 py-2 rounded-md text-white hover:bg-green-900 w-full'
                            onClick={() => handleViewCount(_id)}
                        >
                            View Details
                        </button>
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default JobCard;

JobCard.propTypes = {
    job: PropTypes.object.isRequired
}
