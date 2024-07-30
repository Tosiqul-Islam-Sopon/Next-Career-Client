import PropTypes from 'prop-types';
import { FaRegCalendarAlt, FaRegMoneyBillAlt } from 'react-icons/fa';
import { IoMdTime } from 'react-icons/io';
import { IoLocationOutline } from 'react-icons/io5';
import { MdGroups } from 'react-icons/md';
import { PiOfficeChairLight } from 'react-icons/pi';
import { Link } from 'react-router-dom';

const JobCard = ({ job }) => {
    const { _id, jobTitle, jobType, salary, deadline, recruitmentImageUrl, companyInfo, jobLocation, onSitePlace, view, vacancy } = job;
    const { companyName, companyLogo } = companyInfo;
    return (
        <div className="mx-10 my-5 p-7 shadow-xl flex gap-10 transform transition-transform duration-500 hover:scale-105 hover:shadow-2xl rounded-xl border-t">
            <img className='w-24 h-full' src={recruitmentImageUrl} alt="" />
            <div className='w-full'>
                <div className='flex justify-between items-center'>
                    <div>
                        <h3 className="text-2xl font-bold">{jobTitle}</h3>
                        <div className='mt-1 mb-3 ml-8'>
                            <div className='flex gap-3 items-center'>
                                <p>at</p>
                                <img className='w-5 h-5 rounded-full' src={companyLogo} alt="" />
                                <h4 className='text-lg text-gray-600'>{companyName}</h4>
                            </div>
                        </div>
                    </div>
                    <div>
                        <Link to={`/jobDetails/${_id}`}>
                            <button className='bg-green-500 px-5 py-2 rounded-md text-white hover:bg-green-900'>View</button>
                        </Link>
                    </div>
                </div>
                <div className='flex justify-between mt-5'>
                    <p className='flex items-center gap-2'><span className='text-green-600 text-lg'><IoLocationOutline /></span> <span>{jobLocation === "Remote" ? jobLocation : onSitePlace}</span></p>
                    <p className='flex items-center gap-2'><span className='text-green-600 text-lg'><IoMdTime /></span><span>{jobType}</span></p>
                    <p className='flex items-center gap-2'><span className='text-green-600 text-lg'><FaRegMoneyBillAlt /></span><span>৳ {salary}</span></p>
                    <p className='flex items-center gap-2'><span className='text-green-600 text-lg'><PiOfficeChairLight /></span><span>Vacancy: {vacancy}</span></p>
                    <p className='flex items-center gap-2'><span className='text-green-600 text-lg'><MdGroups /></span><span>Visitors {view}</span></p>
                    <p className='flex items-center gap-2'><span className='text-green-600 text-lg'><FaRegCalendarAlt /></span><span>Deadline: {deadline}</span></p>
                </div>
            </div>
        </div>
    );
};

export default JobCard;

JobCard.propTypes = {
    job: PropTypes.object.isRequired
}