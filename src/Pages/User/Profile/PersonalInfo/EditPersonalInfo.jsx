import { useContext, useState } from "react";
import { AuthContext } from "../../../../Providers/AuthProvider";
import { useForm } from "react-hook-form";
import useAxiosBase from "../../../../CustomHooks/useAxiosBase";
import { useQuery } from "@tanstack/react-query";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";

const image_hosting_key = import.meta.env.VITE_IMAGE_UPLOAD_KEY_IMAGEBB;
const image_hosting_api = `https://api.imgbb.com/1/upload?key=${image_hosting_key}`;

const EditPersonalInfo = () => {
    const { user, loading, setNameAndPhoto } = useContext(AuthContext);
    const [photoURL, setPhotoURL] = useState(user?.photoURL);
    const [selectedFile, setSelectedFile] = useState(null);
    const axiosBase = useAxiosBase();
    const navigate = useNavigate();

    const { data: userInfo = null, isLoading } = useQuery({
        queryKey: ['user', user?.email],
        queryFn: async () => {
            const response = await axiosBase.get(`/user/${user?.email}`);
            return response.data;
        }
    });

    const { register, handleSubmit, formState: { errors } } = useForm();

    if (isLoading || loading) {
        return <div className='mt-32 text-center text-5xl text-green-400'>Loading...</div>;
    }

    const handleImageClick = () => {
        Swal.fire({
            title: "Do you want to change your profile picture?",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes!",
            cancelButtonText: "No!"
        }).then((result) => {
            if (result.isConfirmed) {
                document.getElementById("fileInput").click();
            }
        });
    };

    const handleFileChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            setSelectedFile(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setPhotoURL(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const onSubmit = async (data) => {
        
        data.email = userInfo.email;
        console.log(data);

        const updateUser = async () => {
            try {
                const updateResponse = await axiosBase.patch(`/user/${userInfo._id}`, data);

                if (updateResponse.status === 200) {
                    Swal.fire({
                        position: "center",
                        icon: "success",
                        title: "Personal info updated successfully!",
                        showConfirmButton: false,
                        timer: 1500
                    });
                    navigate("/dashboard/personalInfo");
                } else {
                    throw new Error("Failed to update personal info");
                }
            } catch (error) {
                Swal.fire({
                    position: "center",
                    icon: "error",
                    title: "Failed to update personal info",
                    showConfirmButton: false,
                    timer: 1500
                });
            }
        };

        if (selectedFile) {
            const formData = new FormData();
            formData.append('image', selectedFile);

            try {
                const response = await fetch(image_hosting_api, {
                    method: 'POST',
                    body: formData
                });
                const result = await response.json();

                if (result.success) {
                    data.photoURL = result.data.url; // Update form data with new image URL

                    await setNameAndPhoto(data.name, data.photoURL);
                    await updateUser();
                } else {
                    throw new Error("Image upload failed");
                }
            } catch (error) {
                Swal.fire({
                    position: "center",
                    icon: "error",
                    title: "Failed to update personal info",
                    showConfirmButton: false,
                    timer: 1500
                });
            }
        } else if (data.name !== user.displayName) {
            try {
                await setNameAndPhoto(data.name, user.photoURL);
                await updateUser();
            } catch {
                Swal.fire({
                    position: "center",
                    icon: "error",
                    title: "Failed to update personal info",
                    showConfirmButton: false,
                    timer: 1500
                });
            }
        } else {
            await updateUser();
        }
    };
    

    return (
        <div className='mb-8'>
            <form className="max-w-xl mx-auto p-8 border border-gray-300 rounded-lg bg-white shadow-md" onSubmit={handleSubmit(onSubmit)}>
                <h2 className="text-2xl font-bold mb-6 text-center">Personal Info</h2>

                <div className="mx-auto w-fit">
                    <img
                        className="h-48 w-48 rounded-full cursor-pointer"
                        src={photoURL}
                        alt="profile image"
                        onClick={handleImageClick}
                    />
                    <input
                        id="fileInput"
                        type="file"
                        style={{ display: 'none' }}
                        accept="image/*"
                        onChange={handleFileChange}
                    />
                </div>

                <div className="mb-4">
                    <label className="block text-gray-700 font-bold mb-2">Name*</label>
                    <input
                        type="text"
                        {...register('name', { required: true })}
                        defaultValue={userInfo?.name}
                        className="w-full p-2 border border-gray-300 rounded-md"
                    />
                    {errors.name && <span className="text-red-500">This field is required</span>}
                </div>

                <div className="mb-4">
                    <label className="block text-gray-700 font-bold mb-2">Email</label>
                    <input
                        type="email"
                        {...register('email')}
                        value={userInfo?.email}
                        className="w-full p-2 border border-gray-300 bg-gray-200 cursor-not-allowed rounded-md"
                        disabled
                    />
                </div>

                <div className="mb-4">
                    <label className="block text-gray-700 font-bold mb-2">Contact No*</label>
                    <input
                        type="tel"
                        {...register('contactNo', { required: true })}
                        defaultValue={userInfo?.personalInfo?.contactNo}
                        className="w-full p-2 border border-gray-300 rounded-md"
                    />
                    {errors.ContactNo && <span className="text-red-500">This field is required</span>}
                </div>

                <div className="mb-4">
                    <label className="block text-gray-700 font-bold mb-2">Present Address*</label>
                    <input
                        type="text"
                        {...register('presentAddress', { required: true })}
                        defaultValue={userInfo?.personalInfo?.presentAddress}
                        className="w-full p-2 border border-gray-300 rounded-md"
                    />
                    {errors.presentAddress && <span className="text-red-500">This field is required</span>}
                </div>

                <div className="mb-4">
                    <label className="block text-gray-700 font-bold mb-2">Permanent Address*</label>
                    <input
                        type="text"
                        {...register('permanentAddress', { required: true })}
                        defaultValue={userInfo?.personalInfo?.permanentAddress}
                        className="w-full p-2 border border-gray-300 rounded-md"
                    />
                    {errors.permanentAddress && <span className="text-red-500">This field is required</span>}
                </div>

                <div className="mb-4">
                    <label className="block text-gray-700 font-bold mb-2">Date of Birth*</label>
                    <input
                        type="date"
                        {...register('dateOfBirth', { required: true })}
                        defaultValue={userInfo?.personalInfo?.dateOfBirth}
                        className="w-full p-2 border border-gray-300 rounded-md"
                    />
                    {errors.dateOfBirth && <span className="text-red-500">This field is required</span>}
                </div>

                <div className="mb-4">
                    <label className="block text-gray-700 font-bold mb-2">Nationality*</label>
                    <input
                        type="text"
                        {...register('nationality', { required: true })}
                        defaultValue={userInfo?.personalInfo?.nationality}
                        className="w-full p-2 border border-gray-300 rounded-md"
                    />
                    {errors.nationality && <span className="text-red-500">This field is required</span>}
                </div>

                <div className="mb-4">
                    <label className="block text-gray-700 font-bold mb-2">Gender*</label>
                    <select
                        {...register('gender', { required: true })}
                        defaultValue={userInfo?.personalInfo?.gender ? userInfo.personalInfo.gender : ""}
                        className="w-full p-2 border border-gray-300 rounded-md"
                    >
                        <option disabled value="">Select Gender</option>
                        <option value="male">Male</option>
                        <option value="female">Female</option>
                        <option value="other">Other</option>
                    </select>
                    {errors.gender && <span className="text-red-500">This field is required</span>}
                </div>

                <div className="mb-4">
                    <label className="block text-gray-700 font-bold mb-2">LinkedIn Profile URL</label>
                    <input
                        type="url"
                        {...register('linkedIn')}
                        defaultValue={userInfo?.personalInfo?.linkedIn}
                        className="w-full p-2 border border-gray-300 rounded-md"
                    />
                </div>

                <div className="mb-4">
                    <label className="block text-gray-700 font-bold mb-2">GitHub Profile URL</label>
                    <input
                        type="url"
                        {...register('github')}
                        defaultValue={userInfo?.personalInfo?.github}
                        className="w-full p-2 border border-gray-300 rounded-md"
                    />
                </div>

                <div className="mb-4">
                    <label className="block text-gray-700 font-bold mb-2">Personal Website URL</label>
                    <input
                        type="url"
                        {...register('personalWebsite')}
                        defaultValue={userInfo?.personalInfo?.personalWebsite}
                        className="w-full p-2 border border-gray-300 rounded-md"
                    />
                </div>

                <div className="mb-4">
                    <label className="block text-gray-700 font-bold mb-2">Summary/Bio</label>
                    <textarea
                        {...register('bio')}
                        defaultValue={userInfo?.personalInfo?.bio}
                        className="w-full p-2 border border-gray-300 rounded-md"
                    ></textarea>
                </div>

                <button type="submit" className="w-full py-2 bg-green-500 text-white font-bold rounded-md hover:bg-green-600">
                    Submit
                </button>
            </form>
        </div>
    );
};

export default EditPersonalInfo;
