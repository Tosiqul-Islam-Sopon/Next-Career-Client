import { useState, useContext } from "react";
import { useForm } from "react-hook-form";
import { AuthContext } from "../../../Providers/AuthProvider";
import useAxiosBase, { baseUrl } from "../../../CustomHooks/useAxiosBase";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

const RecruiterProfileEdit = () => {
  const { user, setNameAndPhoto } = useContext(AuthContext);
  const axiosBase = useAxiosBase();
  const navigate = useNavigate();

  // Fetch recruiter data
  const { data: recruiter = {} } = useQuery({
    queryKey: ["recruiter", user.email],
    queryFn: async () => {
      const response = await axiosBase.get(`/user-by-email/${user?.email}`);
      return response.data;
    },
  });

  const [profileImage, setProfileImage] = useState(user.photoURL || null);
  const [previewProfileImage, setPreviewProfileImage] = useState(
    user.photoURL || null
  );
  const [companyLogo, setCompanyLogo] = useState(recruiter.companyLogo || null);
  const [previewCompanyLogo, setPreviewCompanyLogo] = useState(
    recruiter.companyLogo || null
  );
  const [loading, setLoading] = useState(false);

  // React Hook Form setup
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      name: recruiter.name || "",
    },
  });

  // Handle profile image preview
  const handleProfileImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfileImage(file);
      const previewUrl = URL.createObjectURL(file);
      setPreviewProfileImage(previewUrl);
    }
  };

  // Handle company logo preview
  const handleCompanyLogoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setCompanyLogo(file);
      const previewUrl = URL.createObjectURL(file);
      setPreviewCompanyLogo(previewUrl);
    }
  };

  // Handle form submission
  const onSubmit = async (data) => {
    setLoading(true); // Indicate loading state

    try {
      // 1. Upload profile image if provided
      if (profileImage) {
        const profileImageFormData = new FormData();
        profileImageFormData.append("file", profileImage);

        try {
          await axiosBase.post(
            `/uploadProfileImage/${recruiter._id}`,
            profileImageFormData,
            {
              headers: { "Content-Type": "multipart/form-data" },
            }
          );
        } catch (error) {
          console.error("Error uploading profile image:", error);
          throw new Error("Failed to upload profile image.");
        }
      }

      // 2. Upload company logo if provided
      if (companyLogo) {
        const companyLogoFormData = new FormData();
        companyLogoFormData.append("file", companyLogo);

        try {
          await axiosBase.post(
            `/uploadCompanyLogo/${recruiter._id}`,
            companyLogoFormData,
            {
              headers: { "Content-Type": "multipart/form-data" },
            }
          );
        } catch (error) {
          console.error("Error uploading company logo:", error);
          throw new Error("Failed to upload company logo.");
        }
      }

      // 3. Construct URLs for profile image and company logo
      const profileImageLink = `${baseUrl}/profileImage/${recruiter._id}`;
      const companyLogoLink = `${baseUrl}/companyLogo/${recruiter._id}`;

      // 4. Create an updated recruiter object
      const { _id, ...recruiterWithoutId } = recruiter; // Destructure and exclude _id

      const updatedRecruiter = {
        ...recruiterWithoutId, // Spread the recruiter properties without _id
        name: data.name, // Update name
        companyLogo: companyLogoLink, // Update company logo URL
      };

      // 5. Update recruiter details on Firebase
      try {
        await setNameAndPhoto(data.name, profileImageLink);
      } catch (error) {
        console.error("Error updating name and photo in Firebase:", error);
        throw new Error("Failed to update name and photo in Firebase.");
      }

      // 6. Update recruiter details in the database
      try {
        await axiosBase.patch(`/recruiter/${recruiter._id}`, updatedRecruiter, {
          headers: { "Content-Type": "application/json" },
        });
      } catch (error) {
        console.error("Error updating recruiter in database:", error);
        throw new Error("Failed to update recruiter in the database.");
      }

      navigate("/dashboard/recruiterProfile");
      Swal.fire({
        position: "center",
        icon: "success",
        title: "Registration Successful",
        showConfirmButton: false,
        timer: 1500,
      });
    } catch (error) {
      // Handle overall errors
      console.error("Error updating profile:", error);
      Swal.fire({
        position: "center",
        icon: "error",
        title: "Sorry!!! Profile update failed",
        showConfirmButton: false,
        timer: 1500,
      });
    } finally {
      setLoading(false); // End loading state
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
      <form
        className="w-full max-w-3xl bg-white rounded-lg shadow-lg p-8"
        onSubmit={handleSubmit(onSubmit)}
      >
        <h2 className="text-3xl font-semibold text-gray-800 text-center mb-8">
          Edit Profile
        </h2>

        {/* Profile Image and Company Logo Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          {/* User Profile Image */}
          <div className="flex flex-col items-center">
            <img
              src={previewProfileImage}
              alt="User Profile"
              className="w-32 h-32 object-cover rounded-full shadow-md mb-4"
            />
            <label className="cursor-pointer bg-blue-500 text-white px-4 py-2 rounded-md shadow hover:bg-blue-600">
              Upload Profile Image
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleProfileImageChange}
              />
            </label>
          </div>

          {/* Company Logo */}
          <div className="flex flex-col items-center">
            <img
              src={previewCompanyLogo}
              alt="Company Logo"
              className="w-32 h-32 object-cover rounded-full shadow-md mb-4"
            />
            <label className="cursor-pointer bg-green-500 text-white px-4 py-2 rounded-md shadow hover:bg-green-600">
              Upload Company Logo
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleCompanyLogoChange}
              />
            </label>
          </div>
        </div>

        {/* Form Fields */}
        <div className="space-y-6">
          {/* Name */}
          <div>
            <label className="block text-gray-700 font-medium mb-2">
              Full Name
            </label>
            <input
              type="text"
              {...register("name", { required: "Name is required" })}
              className="w-full px-4 py-2 border border-gray-300 rounded-md text-gray-800 focus:ring-2 focus:ring-blue-500 focus:outline-none"
              placeholder="Enter your full name"
            />
            {errors.name && (
              <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>
            )}
          </div>

          {/* Disabled Fields */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Email */}
            <div>
              <label className="block text-gray-700 font-medium mb-2">
                Email
              </label>
              <input
                type="email"
                value={recruiter.email || ""}
                disabled
                className="w-full px-4 py-2 border border-gray-300 rounded-md bg-gray-100 text-gray-500 cursor-not-allowed"
              />
            </div>

            {/* Company Name */}
            <div>
              <label className="block text-gray-700 font-medium mb-2">
                Company Name
              </label>
              <input
                type="text"
                value={recruiter.companyName || ""}
                disabled
                className="w-full px-4 py-2 border border-gray-300 rounded-md bg-gray-100 text-gray-500 cursor-not-allowed"
              />
            </div>

            {/* Position */}
            <div>
              <label className="block text-gray-700 font-medium mb-2">
                Position
              </label>
              <input
                type="text"
                value={recruiter.position || ""}
                disabled
                className="w-full px-4 py-2 border border-gray-300 rounded-md bg-gray-100 text-gray-500 cursor-not-allowed"
              />
            </div>

            {/* Website */}
            <div>
              <label className="block text-gray-700 font-medium mb-2">
                Website
              </label>
              <input
                type="text"
                value={recruiter.website || ""}
                disabled
                className="w-full px-4 py-2 border border-gray-300 rounded-md bg-gray-100 text-gray-500 cursor-not-allowed"
              />
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className={`w-full mt-8 bg-blue-500 text-white py-3 rounded-md shadow hover:bg-blue-600 ${
            loading && "opacity-50 cursor-not-allowed"
          }`}
          disabled={loading}
        >
          {loading ? "Saving..." : "Save Changes"}
        </button>
      </form>
    </div>
  );
};

export default RecruiterProfileEdit;
