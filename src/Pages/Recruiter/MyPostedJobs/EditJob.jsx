import { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import useAxiosBase from "../../../CustomHooks/useAxiosBase";

const EditJob = () => {
  const { jobId } = useParams();
  const axiosBase = useAxiosBase();
  const navigate = useNavigate();
  
  const { register, handleSubmit, reset, formState: { errors } } = useForm();

  useEffect(() => {
    const fetchJobData = async () => {
      const response = await axiosBase.get(`/jobs/job/${jobId}`);
      reset(response.data); // Set previous data as default
    };
    fetchJobData();
  }, [axiosBase, jobId, reset]);

  const onSubmit = async (data) => {
    await axiosBase.put(`/jobs/job/${jobId}`, data);
    navigate(`/job-details/${jobId}`);
  };

  const handleCancel = () => {
    navigate(`/job-details/${jobId}`);
  };

  return (
    <div className="mt-24 mb-8">
      <form className="max-w-xl mx-auto p-8 border border-gray-300 rounded-lg bg-white shadow-md" onSubmit={handleSubmit(onSubmit)}>
        <h2 className="text-2xl font-bold mb-6 text-center">Edit Job</h2>
        
        {/* Company Logo */}
        {/* <div className="text-center mb-4">
          <img src={companyLogo} alt="Company Logo" className="mx-auto h-24 w-24 rounded-full" />
          <h3 className="text-xl font-semibold mt-2">{companyName}</h3>
        </div> */}

        {/* Fields start */}
        <div className="mb-4">
          <label className="block text-gray-700 font-bold mb-2">Company Website</label>
          <input
            type="text"
            className="w-full p-2 border bg-gray-200 opacity-70 border-gray-300 rounded-md"
            // value={website}
            disabled
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 font-bold mb-2">Job Title*</label>
          <input
            type="text"
            {...register('jobTitle', { required: true })}
            className="w-full p-2 border border-gray-300 rounded-md"
          />
          {errors.jobTitle && <span className="text-red-500">This field is required</span>}
        </div>

        <div className="mb-6">
          <label className="block text-gray-700 font-bold mb-2">Recruitment Image*</label>
          <input
            type="file"
            {...register('recruitmentImage', { required: true })}
            className="file-input file-input-bordered file-input-primary w-full"
          />
          {errors.recruitmentImage && <span className="text-red-500">This field is required</span>}
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 font-bold mb-2">Job Description*</label>
          <textarea
            {...register('jobDescription', { required: true })}
            className="w-full p-2 border border-gray-300 rounded-md"
          ></textarea>
          {errors.jobDescription && <span className="text-red-500">This field is required</span>}
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 font-bold mb-2">Requirements*</label>
          <textarea
            {...register('jobRequirements', { required: true })}
            className="w-full p-2 border border-gray-300 rounded-md"
          ></textarea>
          {errors.jobRequirements && <span className="text-red-500">This field is required</span>}
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 font-bold mb-2">Qualifications*</label>
          <textarea
            {...register('jobQualifications', { required: true })}
            className="w-full p-2 border border-gray-300 rounded-md"
          ></textarea>
          {errors.jobQualifications && <span className="text-red-500">This field is required</span>}
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 font-bold mb-2">Category*</label>
          <select
            {...register('jobCategory', { required: true })}
            className="w-full p-2 border border-gray-300 rounded-md"
          >
            <option value="Marketing">Marketing</option>
            <option value="Development">Development</option>
            <option value="Design">Design</option>
            <option value="SoftwareEngineer">Software Engineer</option>
          </select>
          {errors.jobCategory && <span className="text-red-500">This field is required</span>}
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 font-bold mb-2">Job Type*</label>
          <select
            {...register('jobType', { required: true })}
            className="w-full p-2 border border-gray-300 rounded-md"
          >
            <option value="Full Time">Full Time</option>
            <option value="Part Time">Part Time</option>
            <option value="Contract">Contract</option>
            <option value="Intern">Intern</option>
          </select>
          {errors.jobType && <span className="text-red-500">This field is required</span>}
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 font-bold mb-2">Job Location*</label>
          <select
            {...register('jobLocation', { required: true })}
            className="w-full p-2 border border-gray-300 rounded-md"
          >
            <option value="On Site">On Site</option>
            <option value="Remote">Remote</option>
            <option value="Hybrid">Hybrid</option>
          </select>
          {errors.jobLocation && <span className="text-red-500">This field is required</span>}
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 font-bold mb-2">Location</label>
          <input
            type="text"
            {...register('onSitePlace')}
            className="w-full p-2 border border-gray-300 rounded-md"
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 font-bold mb-2">Salary*</label>
          <input
            type="number"
            {...register('salary', { required: true })}
            className="w-full p-2 border border-gray-300 rounded-md"
          />
          {errors.salary && <span className="text-red-500">This field is required</span>}
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 font-bold mb-2">Vacancy*</label>
          <input
            type="number"
            {...register('vacancy', { required: true })}
            className="w-full p-2 border border-gray-300 rounded-md"
          />
          {errors.vacancy && <span className="text-red-500">This field is required</span>}
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 font-bold mb-2">Deadline*</label>
          <input
            type="date"
            {...register('deadline', { required: true })}
            className="w-full p-2 border border-gray-300 rounded-md"
          />
          {errors.deadline && <span className="text-red-500">This field is required</span>}
        </div>

        {/* Buttons */}
        <div className="flex justify-between mt-6">
          <button type="button" onClick={handleCancel} className="px-4 py-2 bg-gray-500 text-white font-bold rounded-md hover:bg-gray-600">
            Cancel
          </button>
          <button type="submit" className="px-4 py-2 bg-green-500 text-white font-bold rounded-md hover:bg-green-600">
            Save
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditJob;
