import PropTypes from "prop-types";
import { FaRegCalendarAlt, FaRegMoneyBillAlt } from "react-icons/fa";
import { IoLocationOutline } from "react-icons/io5";
import { PiOfficeChairLight } from "react-icons/pi";
import { Link } from "react-router-dom";
import useAxiosBase, { baseUrl } from "../../../CustomHooks/useAxiosBase";
import { MdGroups, MdMan } from "react-icons/md";
import { useEffect, useState } from "react";
import { io } from "socket.io-client";

const socket = io(baseUrl);

const JobCard = ({ job }) => {
  const {
    _id,
    jobTitle,
    salary,
    deadline,
    companyInfo,
    jobLocation,
    onSitePlace,
    vacancy,
    view,
  } = job;
  const { companyName, companyLogo } = companyInfo;
  const axiosBase = useAxiosBase();

  const [totalApplicants, setTotalApplicants] = useState(0);
  console.log({ totalApplicants });

  const [viewCount, setViewCount] = useState(view || 0);

  useEffect(() => {
    // Listen for updates
    socket.on("jobViewIncremented", (data) => {
      if (data.jobId === _id) {
        // Update only if it's this job's ID
        setViewCount(data.newViewCount);
      }
    });

    // Cleanup listener on unmount
    return () => {
      socket.off("jobViewIncremented");
    };
  }, []);

  useEffect(() => {
    const loadTotalApplicants = async () => {
      const response = await axiosBase.get(`/jobs/totalApplicants/${_id}`);
      setTotalApplicants(response.data.totalApplicants);
    };
    loadTotalApplicants();
  }, [axiosBase, _id]);

  const handleViewCount = async (jobId) => {
    try {
      await axiosBase.patch(`/jobs/incrementView/${jobId}`);
      // console.log("View count incremented successfully");
    } catch (error) {
      console.error("Failed to increment view count", error);
    }
  };

  return (
    <div className="p-4 mx-5 my-5 transition-transform duration-500 transform border-t shadow-xl hover:scale-105 hover:shadow-2xl rounded-xl">
      {/* <img className='w-32 h-full rounded-lg' src={recruitmentImageUrl} alt="" /> */}
      <div className="flex flex-col justify-between w-full">
        <div>
          <div className="flex items-center justify-between">
            <div className="flex justify-between w-full">
              <h3 className="text-2xl font-bold">{jobTitle}</h3>
              <div className="flex items-center gap-3 ml-5">
                <p>at</p>
                <img
                  className="w-5 h-5 rounded-full"
                  src={companyLogo}
                  alt=""
                />
                <h4 className="text-lg text-gray-600">{companyName}</h4>
              </div>
            </div>
          </div>
          {/* <div className='flex justify-between mt-2'>
                        <p className='flex items-center gap-2'><span className='text-lg text-green-600'><IoLocationOutline /></span> <span>{jobLocation === "Remote" ? jobLocation : onSitePlace}</span></p>

                        <p className='flex items-center gap-2 mt-2'><span className='text-lg text-green-600'><PiOfficeChairLight /></span><span>Vacancy: {vacancy}</span></p>

                        <p className='flex items-center gap-2'><span className='text-lg text-green-600'><FaRegMoneyBillAlt /></span><span>৳ {salary}</span></p>
                        
                    </div>

                    <div className='flex justify-between mt-2'>
                        <p className='flex items-center gap-2'><span className='text-lg text-green-600'><MdGroups /></span><span>Visitors: {view}</span></p>
                        
                        <p className='flex items-center gap-2'><span className='text-lg text-green-600'><MdMan /></span><span>Applied: {appliedUsers ? appliedUsers.length : '0'}</span></p>
                        
                        <p className='flex items-center gap-2 mt-2'><span className='text-lg text-green-600'><FaRegCalendarAlt /></span><span>Deadline: {deadline}</span></p>
                    </div> */}
          <div className="grid grid-cols-3 mt-2 gap-x-6 gap-y-2">
            {/* 1. Location */}
            <p className="flex items-center gap-2">
              <IoLocationOutline className="text-lg text-green-600" />
              <span>
                {jobLocation === "Remote" ? jobLocation : onSitePlace}
              </span>
            </p>

            {/* 2. Vacancy */}
            <p className="flex items-center gap-2">
              <PiOfficeChairLight className="text-lg text-green-600" />
              <span>Vacancy: {vacancy}</span>
            </p>

            {/* 3. Salary */}
            <p className="flex items-center gap-2">
              <FaRegMoneyBillAlt className="text-lg text-green-600" />
              <span>৳ {salary}</span>
            </p>

            {/* 4. Visitors */}
            <p className="flex items-center gap-2">
              <MdGroups className="text-lg text-green-600" />
              <span>Visitors: {viewCount}</span>
            </p>

            {/* 5. Applied */}
            <p className="flex items-center gap-2">
              <MdMan className="text-lg text-green-600" />
              <span>Applied: {totalApplicants}</span>
            </p>

            {/* 6. Deadline */}
            <p className="flex items-center gap-2">
              <FaRegCalendarAlt className="text-lg text-green-600" />
              <span>Deadline: {deadline}</span>
            </p>
          </div>
        </div>
        <div className="mt-3">
          <Link to={`/jobDetails/${_id}`}>
            <button
              className="w-full px-5 py-2 text-white bg-green-500 rounded-md hover:bg-green-900"
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
  job: PropTypes.object.isRequired,
};
