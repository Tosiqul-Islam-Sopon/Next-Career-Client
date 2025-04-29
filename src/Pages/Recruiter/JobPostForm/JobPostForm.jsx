"use client";

import { useContext, useState } from "react";
import { useForm } from "react-hook-form";
import { AuthContext } from "../../../Providers/AuthProvider";
import { useQuery } from "@tanstack/react-query";
import useAxiosBase from "../../../CustomHooks/useAxiosBase";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import {
  MdBusinessCenter,
  MdDescription,
  MdAssignment,
  MdSchool,
  MdCategory,
  MdWorkOutline,
  MdLocationOn,
  MdAttachMoney,
  MdPeople,
  MdDateRange,
  MdTimeline,
  MdCheck,
  MdArrowUpward,
  MdArrowDownward,
  MdInfo,
} from "react-icons/md";

const JobPostForm = () => {
  const { user } = useContext(AuthContext);
  const axiosBase = useAxiosBase();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
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
  const jobLocation = watch("jobLocation");

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="flex flex-col items-center">
          <div className="w-16 h-16 border-4 border-gray-200 border-t-blue-600 rounded-full animate-spin mb-4"></div>
          <p className="text-gray-600 font-medium">Loading form...</p>
        </div>
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
        date: new Date(),
        deadline: new Date(data.deadline),
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
    <div className="bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-10 text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Post a New Job
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Fill out the form below to create a new job listing. Fields marked
            with an asterisk (*) are required.
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          {/* Company Header */}
          <div className="bg-blue-600 text-white p-6">
            <div className="flex items-center space-x-4">
              <div className="flex-shrink-0">
                {companyLogo ? (
                  <img
                    src={companyLogo || "/placeholder.svg"}
                    alt={companyName}
                    className="h-16 w-16 rounded-full bg-white p-1 object-cover"
                  />
                ) : (
                  <div className="h-16 w-16 rounded-full bg-white flex items-center justify-center">
                    <span className="text-blue-600 text-xl font-bold">
                      {companyName.charAt(0)}
                    </span>
                  </div>
                )}
              </div>
              <div>
                <h2 className="text-xl font-bold">{companyName}</h2>
                {website && (
                  <a
                    href={website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-100 hover:text-white text-sm"
                  >
                    {website}
                  </a>
                )}
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Job Title */}
              <div className="col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Job Title <span className="text-red-500">*</span>
                </label>
                <div className="relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <MdBusinessCenter className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    {...register("jobTitle", {
                      required: "Job title is required",
                    })}
                    className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    placeholder="e.g. Senior Software Engineer"
                  />
                </div>
                {errors.jobTitle && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.jobTitle.message}
                  </p>
                )}
              </div>

              {/* Job Position */}
              <div className="col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Job Position <span className="text-red-500">*</span>
                </label>
                <div className="relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <MdWorkOutline className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    {...register("jobPosition", {
                      required: "Job position is required",
                    })}
                    className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    placeholder="e.g. Junior, Mid-level, Senior"
                  />
                </div>
                {errors.jobPosition && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.jobPosition.message}
                  </p>
                )}
              </div>

              {/* Job Description */}
              <div className="col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Job Description <span className="text-red-500">*</span>
                </label>
                <div className="relative rounded-md shadow-sm">
                  <div className="absolute top-3 left-3 flex items-center pointer-events-none">
                    <MdDescription className="h-5 w-5 text-gray-400" />
                  </div>
                  <textarea
                    {...register("jobDescription", {
                      required: "Job description is required",
                    })}
                    rows={5}
                    className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Describe the role, responsibilities, and what the candidate will be doing"
                  ></textarea>
                </div>
                {errors.jobDescription && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.jobDescription.message}
                  </p>
                )}
              </div>

              {/* Requirements */}
              <div className="col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Requirements <span className="text-red-500">*</span>
                </label>
                <div className="relative rounded-md shadow-sm">
                  <div className="absolute top-3 left-3 flex items-center pointer-events-none">
                    <MdAssignment className="h-5 w-5 text-gray-400" />
                  </div>
                  <textarea
                    {...register("jobRequirements", {
                      required: "Job requirements are required",
                    })}
                    rows={4}
                    className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    placeholder="List the skills, experience, and qualifications required for this role"
                  ></textarea>
                </div>
                {errors.jobRequirements && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.jobRequirements.message}
                  </p>
                )}
              </div>

              {/* Qualifications */}
              <div className="col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Qualifications <span className="text-red-500">*</span>
                </label>
                <div className="relative rounded-md shadow-sm">
                  <div className="absolute top-3 left-3 flex items-center pointer-events-none">
                    <MdSchool className="h-5 w-5 text-gray-400" />
                  </div>
                  <textarea
                    {...register("jobQualifications", {
                      required: "Job qualifications are required",
                    })}
                    rows={4}
                    className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Specify education, certifications, or other qualifications needed"
                  ></textarea>
                </div>
                {errors.jobQualifications && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.jobQualifications.message}
                  </p>
                )}
              </div>

              {/* Category */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Category <span className="text-red-500">*</span>
                </label>
                <div className="relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <MdCategory className="h-5 w-5 text-gray-400" />
                  </div>
                  <select
                    {...register("jobCategory", {
                      required: "Job category is required",
                    })}
                    className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 appearance-none bg-none"
                  >
                    <option value="">Select a category</option>
                    <option value="Marketing">Marketing</option>
                    <option value="Development">Development</option>
                    <option value="Design">Design</option>
                    <option value="SoftwareEngineer">Software Engineer</option>
                    <option value="Data Science">Data Science</option>
                    <option value="Product Management">
                      Product Management
                    </option>
                    <option value="Customer Service">Customer Service</option>
                    <option value="Sales">Sales</option>
                    <option value="Finance">Finance</option>
                    <option value="Human Resources">Human Resources</option>
                  </select>
                </div>
                {errors.jobCategory && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.jobCategory.message}
                  </p>
                )}
              </div>

              {/* Job Type */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Job Type <span className="text-red-500">*</span>
                </label>
                <div className="relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <MdWorkOutline className="h-5 w-5 text-gray-400" />
                  </div>
                  <select
                    {...register("jobType", {
                      required: "Job type is required",
                    })}
                    className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 appearance-none bg-none"
                  >
                    <option value="">Select job type</option>
                    <option value="Full Time">Full Time</option>
                    <option value="Part Time">Part Time</option>
                    <option value="Contract">Contract</option>
                    <option value="Intern">Intern</option>
                    <option value="Temporary">Temporary</option>
                    <option value="Freelance">Freelance</option>
                  </select>
                </div>
                {errors.jobType && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.jobType.message}
                  </p>
                )}
              </div>

              {/* Job Location */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Job Location <span className="text-red-500">*</span>
                </label>
                <div className="relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <MdLocationOn className="h-5 w-5 text-gray-400" />
                  </div>
                  <select
                    {...register("jobLocation", {
                      required: "Job location is required",
                    })}
                    className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 appearance-none bg-none"
                  >
                    <option value="">Select location type</option>
                    <option value="On Site">On Site</option>
                    <option value="Remote">Remote</option>
                    <option value="Hybrid">Hybrid</option>
                  </select>
                </div>
                {errors.jobLocation && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.jobLocation.message}
                  </p>
                )}
              </div>

              {/* Location Details - Only show if not Remote */}
              {jobLocation && jobLocation !== "Remote" && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Location Details <span className="text-red-500">*</span>
                  </label>
                  <div className="relative rounded-md shadow-sm">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <MdLocationOn className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="text"
                      {...register("onSitePlace", {
                        required:
                          jobLocation !== "Remote"
                            ? "Location details are required"
                            : false,
                      })}
                      className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      placeholder="e.g. New York, NY or London, UK"
                    />
                  </div>
                  {errors.onSitePlace && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.onSitePlace.message}
                    </p>
                  )}
                </div>
              )}

              {/* Salary */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Salary <span className="text-red-500">*</span>
                </label>
                <div className="relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <MdAttachMoney className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="number"
                    {...register("salary", {
                      required: "Salary is required",
                      min: {
                        value: 0,
                        message: "Salary must be a positive number",
                      },
                    })}
                    className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    placeholder="e.g. 75000"
                  />
                </div>
                {errors.salary && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.salary.message}
                  </p>
                )}
              </div>

              {/* Vacancy */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Vacancy <span className="text-red-500">*</span>
                </label>
                <div className="relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <MdPeople className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="number"
                    {...register("vacancy", {
                      required: "Number of vacancies is required",
                      min: {
                        value: 1,
                        message: "At least 1 vacancy is required",
                      },
                    })}
                    className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    placeholder="e.g. 2"
                  />
                </div>
                {errors.vacancy && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.vacancy.message}
                  </p>
                )}
              </div>

              {/* Deadline */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Deadline <span className="text-red-500">*</span>
                </label>
                <div className="relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <MdDateRange className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="date"
                    {...register("deadline", {
                      required: "Application deadline is required",
                      validate: (value) => {
                        const selectedDate = new Date(value);
                        const today = new Date();
                        today.setHours(0, 0, 0, 0);
                        return (
                          selectedDate >= today ||
                          "Deadline must be today or in the future"
                        );
                      },
                    })}
                    className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                {errors.deadline && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.deadline.message}
                  </p>
                )}
              </div>
            </div>

            {/* Recruitment Stages Section */}
            <div className="pt-4 border-t border-gray-200">
              <div className="flex items-center mb-4">
                <MdTimeline className="h-5 w-5 text-blue-600 mr-2" />
                <h3 className="text-lg font-medium text-gray-900">
                  Recruitment Process
                </h3>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg mb-4">
                <div className="flex items-center mb-2">
                  <MdInfo className="h-5 w-5 text-blue-600 mr-2" />
                  <p className="text-sm text-gray-700">
                    Select and arrange the stages of your recruitment process.
                    The first and last stages are fixed.
                  </p>
                </div>

                <div className="flex items-center bg-blue-50 p-3 rounded-md mb-4">
                  <MdCheck className="h-5 w-5 text-blue-600 mr-2" />
                  <span className="text-sm font-medium text-blue-800">
                    Fixed First Stage: {fixedFirstStage}
                  </span>
                </div>

                {/* Editable stages */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
                  {predefinedEditableStages.map((stage) => (
                    <div
                      key={stage}
                      className="flex items-center bg-white p-3 rounded-md border border-gray-200"
                    >
                      <input
                        type="checkbox"
                        id={`stage-${stage}`}
                        value={stage}
                        checked={selectedEditableStages.includes(stage)}
                        onChange={(e) => {
                          const value = e.target.value;
                          const isChecked = e.target.checked;
                          if (isChecked) {
                            setSelectedEditableStages((prev) => [
                              ...prev,
                              value,
                            ]);
                          } else {
                            setSelectedEditableStages((prev) =>
                              prev.filter((s) => s !== value)
                            );
                          }
                        }}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                      <label
                        htmlFor={`stage-${stage}`}
                        className="ml-2 block text-sm text-gray-700"
                      >
                        {stage}
                      </label>
                    </div>
                  ))}
                </div>

                {/* Selected stages order */}
                {selectedEditableStages.length > 0 && (
                  <div className="bg-white p-4 rounded-md border border-gray-200">
                    <h4 className="text-sm font-medium text-gray-700 mb-2">
                      Selected Stages Order:
                    </h4>
                    <ul className="space-y-2">
                      {selectedEditableStages.map((stage, index) => (
                        <li
                          key={stage}
                          className="flex items-center justify-between bg-gray-50 p-2 rounded-md border border-gray-100"
                        >
                          <span className="text-sm text-gray-700">
                            <span className="font-medium text-blue-600">
                              {index + 1}.
                            </span>{" "}
                            {stage}
                          </span>
                          <div className="flex space-x-1">
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
                              className="p-1 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-gray-500"
                            >
                              <MdArrowUpward className="h-5 w-5" />
                            </button>
                            <button
                              type="button"
                              disabled={
                                index === selectedEditableStages.length - 1
                              }
                              onClick={() => {
                                const newStages = [...selectedEditableStages];
                                [newStages[index], newStages[index + 1]] = [
                                  newStages[index + 1],
                                  newStages[index],
                                ];
                                setSelectedEditableStages(newStages);
                              }}
                              className="p-1 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-gray-500"
                            >
                              <MdArrowDownward className="h-5 w-5" />
                            </button>
                          </div>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                <div className="flex items-center bg-blue-50 p-3 rounded-md mt-4">
                  <MdCheck className="h-5 w-5 text-blue-600 mr-2" />
                  <span className="text-sm font-medium text-blue-800">
                    Fixed Last Stage: {fixedLastStage}
                  </span>
                </div>
              </div>

              {selectedEditableStages.length === 0 && (
                <p className="text-sm text-red-600 mb-4">
                  Please select at least one recruitment stage.
                </p>
              )}
            </div>

            {/* Submit Button */}
            <div className="pt-5">
              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={() => navigate(-1)}
                  className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 mr-3"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Post Job
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default JobPostForm;
