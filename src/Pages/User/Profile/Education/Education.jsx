import { useContext, useState } from 'react';
import { useForm } from 'react-hook-form';
import { AuthContext } from '../../../../Providers/AuthProvider';
import { useQuery } from '@tanstack/react-query';
import useAxiosBase from '../../../../CustomHooks/useAxiosBase';
import Swal from 'sweetalert2';

const Education = () => {
    const { register, handleSubmit, formState: { errors }, reset } = useForm();
    const [isFormVisible, setIsFormVisible] = useState(false);
    const { user } = useContext(AuthContext);
    const axiosBase = useAxiosBase();

    const { data: userInfo = null, isLoading, refetch } = useQuery({
        queryKey: ['user', user?.email],
        queryFn: async () => {
            const response = await axiosBase.get(`/user/${user?.email}`);
            return response.data;
        }
    });

    if (isLoading) {
        return <div className='mt-32 text-center text-5xl text-green-400'>Loading...</div>;
    }

    const onSubmit = async (data) => {
        try {
            const response = await axiosBase.patch(`/user/${userInfo._id}/education`, data);

            if (response.status === 200) {
                Swal.fire({
                    title: 'Success',
                    text: 'Education data added successfully',
                    icon: 'success',
                    confirmButtonText: 'OK'
                });
                setIsFormVisible(false);
                reset();
                refetch();
            }
        } catch (error) {
            console.error('Error adding education data:', error);
            Swal.fire({
                title: 'Error',
                text: 'Failed to add education data',
                icon: 'error',
                confirmButtonText: 'OK'
            });
        }
    };

    const handleAddEducationClick = () => {
        setIsFormVisible(true);
        reset();
    };

    const handleCancelClick = () => {
        setIsFormVisible(false);
        reset();
    };

    return (
        <div className='mb-8'>
            <div className='mb-4'>
                <h2 className="text-2xl font-bold mb-4">Education</h2>
                {userInfo.education && userInfo.education.length > 0 ? (
                    userInfo.education.map((edu) => (
                        <div key={edu._id} className="mb-4 p-4 border border-gray-300 rounded-lg bg-white shadow-md">
                            <h3 className="text-xl font-bold">{edu.degree}</h3>
                            <p><strong>Institution:</strong> {edu.institution}</p>
                            <p><strong>Field of Study:</strong> {edu.subject}</p>
                            <p><strong>Start Date:</strong> {edu.startDate}</p>
                            <p><strong>End Date:</strong> {edu.endDate}</p>
                            <p><strong>Grade:</strong> {edu.grade}</p>
                            <p><strong>Activities:</strong> {edu.activities}</p>
                            <p><strong>Description:</strong> {edu.description}</p>
                        </div>
                    ))
                ) : (
                    <p>No education data available.</p>
                )}
            </div>

            {!isFormVisible && (
                <button
                    type="button"
                    className="mb-4 py-2 px-4 bg-blue-500 text-white font-bold rounded-md hover:bg-blue-600"
                    onClick={handleAddEducationClick}
                >
                    Add Education
                </button>
            )}

            {isFormVisible && (
                <form className="max-w-xl mx-auto p-8 border border-gray-300 rounded-lg bg-white shadow-md" onSubmit={handleSubmit(onSubmit)}>
                    <h2 className="text-2xl font-bold mb-6 text-center">Education</h2>

                    <div className="mb-4 border-b pb-4">
                        <div className="mb-4">
                            <label className="block text-gray-700 font-bold mb-2">Degree/Qualification*</label>
                            <input
                                type="text"
                                {...register('degree', { required: true })}
                                className="w-full p-2 border border-gray-300 rounded-md"
                            />
                            {errors.degree && <span className="text-red-500">This field is required</span>}
                        </div>

                        <div className="mb-4">
                            <label className="block text-gray-700 font-bold mb-2">Institution Name*</label>
                            <input
                                type="text"
                                {...register('institution', { required: true })}
                                className="w-full p-2 border border-gray-300 rounded-md"
                            />
                            {errors.institution && <span className="text-red-500">This field is required</span>}
                        </div>

                        <div className="mb-4">
                            <label className="block text-gray-700 font-bold mb-2">Field of Study / Subject*</label>
                            <input
                                type="text"
                                {...register('subject', { required: true })}
                                className="w-full p-2 border border-gray-300 rounded-md"
                            />
                            {errors.subject && <span className="text-red-500">This field is required</span>}
                        </div>

                        <div className="mb-4">
                            <label className="block text-gray-700 font-bold mb-2">Start Date*</label>
                            <input
                                type="date"
                                {...register('startDate', { required: true })}
                                className="w-full p-2 border border-gray-300 rounded-md"
                            />
                            {errors.startDate && <span className="text-red-500">This field is required</span>}
                        </div>

                        <div className="mb-4">
                            <label className="block text-gray-700 font-bold mb-2">End Date</label>
                            <input
                                type="date"
                                {...register('endDate')}
                                className="w-full p-2 border border-gray-300 rounded-md"
                            />
                        </div>

                        <div className="mb-4">
                            <label className="block text-gray-700 font-bold mb-2">Grade</label>
                            <input
                                type="text"
                                {...register('grade')}
                                className="w-full p-2 border border-gray-300 rounded-md"
                            />
                        </div>

                        <div className="mb-4">
                            <label className="block text-gray-700 font-bold mb-2">Activities and Societies</label>
                            <input
                                type="text"
                                {...register('activities')}
                                className="w-full p-2 border border-gray-300 rounded-md"
                            />
                        </div>

                        <div className="mb-4">
                            <label className="block text-gray-700 font-bold mb-2">Description</label>
                            <textarea
                                {...register('description')}
                                className="w-full p-2 border border-gray-300 rounded-md"
                            ></textarea>
                        </div>

                        <div className="flex gap-4">
                            <button
                                type="submit"
                                className="py-2 px-4 bg-green-500 text-white font-bold rounded-md hover:bg-green-600"
                            >
                                Add
                            </button>
                            <button
                                type="button"
                                className="py-2 px-4 bg-gray-500 text-white font-bold rounded-md hover:bg-gray-600"
                                onClick={handleCancelClick}
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </form>
            )}
        </div>
    );
};

export default Education;
