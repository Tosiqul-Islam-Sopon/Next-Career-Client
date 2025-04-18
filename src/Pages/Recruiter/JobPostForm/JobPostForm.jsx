import { useContext, useState } from "react";
import { useForm } from "react-hook-form";
import { AuthContext } from "../../../Providers/AuthProvider";
import { useQuery } from "@tanstack/react-query";
import useAxiosBase from "../../../CustomHooks/useAxiosBase";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";

const JobPostForm = () => {
  const { user } = useContext(AuthContext);
  const axiosBase = useAxiosBase();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();

  const { data: userInfo = null, isLoading } = useQuery({
    queryKey: ["user", user?.email],
    queryFn: async () => {
      const response = await axiosBase.get(`/user-by-email/${user?.email}`);
      return response.data;
    },
  });

  // ✅ Fixed stages
  const fixedFirstStage = "CV Screening";
  const fixedLastStage = "Hire";

  // ✅ Editable stages
  const predefinedEditableStages = [
    "Initial Interview",
    "Technical Test",
    "Technical Interview",
    "HR Interview",
  ];

  const [selectedEditableStages, setSelectedEditableStages] = useState([]);

  if (isLoading) {
    return (
      <div className="mt-32 text-5xl text-center text-green-400">
        Loading...
      </div>
    );
  }

  const { _id: jobPosterId, companyName, companyLogo, website } = userInfo;

  const onSubmit = async (data) => {
    try {
      // ✅ Validate at least one middle stage selected
      if (!selectedEditableStages.length) {
        Swal.fire({
          icon: "error",
          title: "Please select at least one middle recruitment stage.",
        });
        return;
      }

      // ✅ Combine stages: first + selected + last
      const combinedStages = [
        fixedFirstStage,
        ...selectedEditableStages,
        fixedLastStage,
      ];

      const companyInfo = {
        companyName,
        companyLogo,
        website,
      };

      const userInfo = {
        name: user.displayName,
        email: user.email,
        photo: user.photoURL,
      };

      const jobData = {
        ...data,
        postedBy: jobPosterId,
        companyInfo,
        userInfo,
        date: new Date().toISOString(),
        view: 0,
        recruitmentStages: combinedStages,
      };

      await axiosBase.post("/jobs", jobData);
      reset();
      setSelectedEditableStages([]); // Reset stages after submit
      Swal.fire({
        position: "center",
        icon: "success",
        title: "Job Posted Successfully",
        showConfirmButton: false,
        timer: 1500,
      });
      navigate("/");
    } catch (error) {
      console.error("Error posting job:", error);
      Swal.fire({
        position: "center",
        icon: "error",
        title: "Sorry! Something went wrong",
        showConfirmButton: false,
        timer: 1500,
      });
    }
  };

  return (
    <div className="mt-24 mb-8">
      <form
        className="max-w-xl p-8 mx-auto bg-white border border-gray-300 rounded-lg shadow-md"
        onSubmit={handleSubmit(onSubmit)}
      >
        <h2 className="mb-6 text-2xl font-bold text-center">Post a Job</h2>

        {/* Company Info */}
        <div className="mb-4 text-center">
          <img
            src={companyLogo}
            alt="Company Logo"
            className="w-24 h-24 mx-auto rounded-full"
          />
          <h3 className="mt-2 text-xl font-semibold">{companyName}</h3>
        </div>

        {/* Company Website */}
        <div className="mb-4">
          <label className="block mb-2 font-bold text-gray-700">
            Company Website
          </label>
          <input
            type="text"
            className="w-full p-2 bg-gray-200 border border-gray-300 rounded-md opacity-70"
            value={website}
            disabled
          />
        </div>

        {/* Job Title */}
        <div className="mb-4">
          <label className="block mb-2 font-bold text-gray-700">
            Job Title*
          </label>
          <input
            type="text"
            {...register("jobTitle", { required: true })}
            className="w-full p-2 border border-gray-300 rounded-md"
          />
          {errors.jobTitle && (
            <span className="text-red-500">This field is required</span>
          )}
        </div>

        {/* Job Description */}
        <div className="mb-4">
          <label className="block mb-2 font-bold text-gray-700">
            Job Description*
          </label>
          <textarea
            {...register("jobDescription", { required: true })}
            className="w-full p-2 border border-gray-300 rounded-md"
          ></textarea>
          {errors.jobDescription && (
            <span className="text-red-500">This field is required</span>
          )}
        </div>

        {/* Requirements */}
        <div className="mb-4">
          <label className="block mb-2 font-bold text-gray-700">
            Requirements*
          </label>
          <textarea
            {...register("jobRequirements", { required: true })}
            className="w-full p-2 border border-gray-300 rounded-md"
          ></textarea>
          {errors.jobRequirements && (
            <span className="text-red-500">This field is required</span>
          )}
        </div>

        {/* Qualifications */}
        <div className="mb-4">
          <label className="block mb-2 font-bold text-gray-700">
            Qualifications*
          </label>
          <textarea
            {...register("jobQualifications", { required: true })}
            className="w-full p-2 border border-gray-300 rounded-md"
          ></textarea>
          {errors.jobQualifications && (
            <span className="text-red-500">This field is required</span>
          )}
        </div>

        {/* Category */}
        <div className="mb-4">
          <label className="block mb-2 font-bold text-gray-700">
            Category*
          </label>
          <select
            {...register("jobCategory", { required: true })}
            className="w-full p-2 border border-gray-300 rounded-md"
          >
            <option value="Marketing">Marketing</option>
            <option value="Development">Development</option>
            <option value="Design">Design</option>
            <option value="SoftwareEngineer">Software Engineer</option>
          </select>
          {errors.jobCategory && (
            <span className="text-red-500">This field is required</span>
          )}
        </div>

        {/* Job Type */}
        <div className="mb-4">
          <label className="block mb-2 font-bold text-gray-700">
            Job Type*
          </label>
          <select
            {...register("jobType", { required: true })}
            className="w-full p-2 border border-gray-300 rounded-md"
          >
            <option value="Full Time">Full Time</option>
            <option value="Part Time">Part Time</option>
            <option value="Contract">Contract</option>
            <option value="Intern">Intern</option>
          </select>
          {errors.jobType && (
            <span className="text-red-500">This field is required</span>
          )}
        </div>

        {/* Job Location */}
        <div className="mb-4">
          <label className="block mb-2 font-bold text-gray-700">
            Job Location*
          </label>
          <select
            {...register("jobLocation", { required: true })}
            className="w-full p-2 border border-gray-300 rounded-md"
          >
            <option value="On Site">On Site</option>
            <option value="Remote">Remote</option>
            <option value="Hybrid">Hybrid</option>
          </select>
          {errors.jobLocation && (
            <span className="text-red-500">This field is required</span>
          )}
        </div>

        {/* Location Details */}
        <div className="mb-4">
          <label className="block mb-2 font-bold text-gray-700">Location</label>
          <input
            type="text"
            {...register("onSitePlace")}
            className="w-full p-2 border border-gray-300 rounded-md"
          />
        </div>

        {/* Salary */}
        <div className="mb-4">
          <label className="block mb-2 font-bold text-gray-700">Salary*</label>
          <input
            type="number"
            {...register("salary", { required: true })}
            className="w-full p-2 border border-gray-300 rounded-md"
          />
          {errors.salary && (
            <span className="text-red-500">This field is required</span>
          )}
        </div>

        {/* Vacancy */}
        <div className="mb-4">
          <label className="block mb-2 font-bold text-gray-700">Vacancy*</label>
          <input
            type="number"
            {...register("vacancy", { required: true })}
            className="w-full p-2 border border-gray-300 rounded-md"
          />
          {errors.vacancy && (
            <span className="text-red-500">This field is required</span>
          )}
        </div>

        {/* Deadline */}
        <div className="mb-4">
          <label className="block mb-2 font-bold text-gray-700">Deadline*</label>
          <input
            type="date"
            {...register("deadline", { required: true })}
            className="w-full p-2 border border-gray-300 rounded-md"
          />
          {errors.deadline && (
            <span className="text-red-500">This field is required</span>
          )}
        </div>

        {/* Stages Selection */}
        <div className="mb-4">
          <label className="block mb-2 font-bold text-gray-700">
            Recruitment Stages* (Select and arrange middle stages)
          </label>

          <div className="mb-2 text-green-700 font-semibold">
            ✅ Fixed First Stage: {fixedFirstStage}
          </div>

          {/* Editable stages */}
          <div className="space-y-2">
            {predefinedEditableStages.map((stage) => (
              <div key={stage} className="flex items-center">
                <input
                  type="checkbox"
                  id={`stage-${stage}`}
                  value={stage}
                  checked={selectedEditableStages.includes(stage)}
                  onChange={(e) => {
                    const value = e.target.value;
                    const isChecked = e.target.checked;
                    if (isChecked) {
                      setSelectedEditableStages((prev) => [...prev, value]);
                    } else {
                      setSelectedEditableStages((prev) =>
                        prev.filter((s) => s !== value)
                      );
                    }
                  }}
                  className="mr-2"
                />
                <label htmlFor={`stage-${stage}`} className="text-gray-700">
                  {stage}
                </label>
              </div>
            ))}
          </div>

          {/* Stage order controls */}
          {selectedEditableStages.length > 0 && (
            <ul className="mt-4 space-y-2">
              {selectedEditableStages.map((stage, index) => (
                <li
                  key={stage}
                  className="flex items-center justify-between bg-gray-100 p-2 rounded"
                >
                  <span>
                    {index + 1}. {stage}
                  </span>
                  <div className="space-x-2">
                    <button
                      type="button"
                      disabled={index === 0}
                      onClick={() => {
                        const newStages = [...selectedEditableStages];
                        [newStages[index - 1], newStages[index]] = [
                          newStages[index],
                          newStages[index - 1],
                        ];
                        setSelectedEditableStages(newStages);
                      }}
                      className="px-2 py-1 text-sm bg-blue-500 text-white rounded disabled:opacity-50"
                    >
                      Up
                    </button>
                    <button
                      type="button"
                      disabled={index === selectedEditableStages.length - 1}
                      onClick={() => {
                        const newStages = [...selectedEditableStages];
                        [newStages[index], newStages[index + 1]] = [
                          newStages[index + 1],
                          newStages[index],
                        ];
                        setSelectedEditableStages(newStages);
                      }}
                      className="px-2 py-1 text-sm bg-blue-500 text-white rounded disabled:opacity-50"
                    >
                      Down
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}

          <div className="mt-4 text-green-700 font-semibold">
            ✅ Fixed Last Stage: {fixedLastStage}
          </div>
        </div>

        {/* Submit */}
        <button
          type="submit"
          className="w-full py-2 font-bold text-white bg-green-500 rounded-md hover:bg-green-600"
        >
          Submit
        </button>
      </form>
    </div>
  );
};

export default JobPostForm;
