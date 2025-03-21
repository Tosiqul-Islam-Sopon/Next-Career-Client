import { useContext } from "react";
import { useForm } from "react-hook-form";
import { AuthContext } from "../../../Providers/AuthProvider";
import { useQuery } from "@tanstack/react-query";
import useAxiosBase from "../../../CustomHooks/useAxiosBase";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";

// const image_hosting_key = import.meta.env.VITE_IMAGE_UPLOAD_KEY_IMAGEBB;
// const image_hosting_api = `https://api.imgbb.com/1/upload?key=${image_hosting_key}`;

const JobPostForm = () => {
  const { user } = useContext(AuthContext);
  const axiosBase = useAxiosBase();
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();
  const navigate = useNavigate();

  const { data: userInfo = null, isLoading } = useQuery({
    queryKey: ["user", user?.email],
    queryFn: async () => {
      const response = await axiosBase.get(`/user-by-email/${user?.email}`);
      return response.data;
    },
  });

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
      // const file = data.recruitmentImage[0];
      // console.log('Selected file:', file);
      // if (!file) {
      //   throw new Error("No file selected");
      // }

      // const formData = new FormData();
      // formData.append("image", file);

      // const imgbbResponse = await fetch(image_hosting_api, {
      //   method: "POST",
      //   body: formData,
      // });

      // if (!imgbbResponse.ok) {
      //   const errorText = await imgbbResponse.text();
      //   console.error("Error response:", errorText);
      //   throw new Error("Failed to upload image");
      // }

      // const imgbbResult = await imgbbResponse.json();
      // const imageUrl = imgbbResult.data.url;

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
        // recruitmentImageUrl: imageUrl,
        postedBy: jobPosterId,
        companyInfo,
        userInfo,
        date: new Date().toISOString(),
        view: 0,
      };

      // delete jobData.recruitmentImage;

      axiosBase
        .post("/jobs", jobData)
        .then((res) => {
          if (res.data.insertedId) {
            reset();
            Swal.fire({
              position: "center",
              icon: "success",
              title: "Job Posted Successfully",
              showConfirmButton: false,
              timer: 1500,
            });
            navigate("/");
          }
        })
        .catch(() => {
          Swal.fire({
            position: "center",
            icon: "error",
            title: "Sorry!!! Something went wrong",
            showConfirmButton: false,
            timer: 1500,
          });
        });
    } catch (error) {
      console.error("Error uploading image:", error);
    }
  };

  return (
    <div className="mt-24 mb-8">
      <form
        className="max-w-xl p-8 mx-auto bg-white border border-gray-300 rounded-lg shadow-md"
        onSubmit={handleSubmit(onSubmit)}
      >
        <h2 className="mb-6 text-2xl font-bold text-center">Post a Job</h2>

        <div className="mb-4 text-center">
          <img
            src={companyLogo}
            alt="Company Logo"
            className="w-24 h-24 mx-auto rounded-full"
          />
          <h3 className="mt-2 text-xl font-semibold">{companyName}</h3>
        </div>

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

        {/* <div className="mb-6">
          <label className="block mb-2 font-bold text-gray-700">
            Recruitment Image*
          </label>
          <input
            type="file"
            {...register("recruitmentImage", { required: true })}
            className="w-full file-input file-input-bordered file-input-primary"
          />
          {errors.recruitmentImage && (
            <span className="text-red-500">This field is required</span>
          )}
        </div> */}

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

        <div className="mb-4">
          <label className="block mb-2 font-bold text-gray-700">Location</label>
          <input
            type="text"
            {...register("onSitePlace")}
            className="w-full p-2 border border-gray-300 rounded-md"
          />
        </div>

        <div className="mb-4">
          <label className="block mb-2 font-bold text-gray-700">Salary*</label>
          <input
            type="number"
            {...register("salary", { required: true })}
            className="w-full p-2 border border-gray-300 rounded-md"
          />
          {errors.salaryRange && (
            <span className="text-red-500">This field is required</span>
          )}
        </div>

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

        <div className="mb-4">
          <label className="block mb-2 font-bold text-gray-700">
            Deadline*
          </label>
          <input
            type="date"
            {...register("deadline", { required: true })}
            className="w-full p-2 border border-gray-300 rounded-md"
          />
          {errors.deadline && (
            <span className="text-red-500">This field is required</span>
          )}
        </div>

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
