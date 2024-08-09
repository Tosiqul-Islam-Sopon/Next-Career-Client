import { useContext, useState } from 'react';
import { useForm } from 'react-hook-form';
import { AuthContext } from '../../../../Providers/AuthProvider';
import { useQuery } from '@tanstack/react-query';
import useAxiosBase from '../../../../CustomHooks/useAxiosBase';
import Swal from 'sweetalert2';

const Experience = () => {
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
        console.log(data);
        try {
            const response = await axiosBase.patch(`/user/${userInfo._id}/experience`, data);

            if (response.status === 200) {
                Swal.fire({
                    title: 'Success',
                    text: 'Experience data added successfully',
                    icon: 'success',
                    confirmButtonText: 'OK'
                });
                setIsFormVisible(false);
                reset();
                refetch();
            }
        } catch (error) {
            console.error('Error adding experience data:', error);
            Swal.fire({
                title: 'Error',
                text: 'Failed to add experience data',
                icon: 'error',
                confirmButtonText: 'OK'
            });
        }
    };

    const handleAddExperienceClick = () => {
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
                <h2 className="text-2xl font-bold mb-4">Experience</h2>
                {userInfo.experience && userInfo.experience.length > 0 ? (
                    userInfo.experience.map((exp) => (
                        <div key={exp._id} className="mb-4 p-4 border border-gray-300 rounded-lg bg-white shadow-md">
                            <h3 className="text-xl font-bold">{exp.position}</h3>
                            <p><strong>Company:</strong> {exp.company}</p>
                            <p><strong>Location:</strong> {exp.location}</p>
                            <p><strong>Start Date:</strong> {exp.startDate}</p>
                            <p><strong>End Date:</strong> {exp.endDate === "" ? "Currently Working" : exp.endDate}</p>
                            <p><strong>Responsibilities:</strong> {exp.responsibilities}</p>
                        </div>
                    ))
                ) : (
                    <p>No experience data available.</p>
                )}
            </div>

            {!isFormVisible && (
                <button
                    type="button"
                    className="mb-4 py-2 px-4 bg-blue-500 text-white font-bold rounded-md hover:bg-blue-600"
                    onClick={handleAddExperienceClick}
                >
                    Add Experience
                </button>
            )}

            {isFormVisible && (
                <form className="max-w-xl mx-auto p-8 border border-gray-300 rounded-lg bg-white shadow-md" onSubmit={handleSubmit(onSubmit)}>
                    <h2 className="text-2xl font-bold mb-6 text-center">Experience</h2>

                    <div className="mb-4 border-b pb-4">
                        <div className="mb-4">
                            <label className="block text-gray-700 font-bold mb-2">Position*</label>
                            <input
                                type="text"
                                {...register('position', { required: true })}
                                className="w-full p-2 border border-gray-300 rounded-md"
                            />
                            {errors.position && <span className="text-red-500">This field is required</span>}
                        </div>

                        <div className="mb-4">
                            <label className="block text-gray-700 font-bold mb-2">Company Name*</label>
                            <input
                                type="text"
                                {...register('company', { required: true })}
                                className="w-full p-2 border border-gray-300 rounded-md"
                            />
                            {errors.company && <span className="text-red-500">This field is required</span>}
                        </div>

                        <div className="mb-4">
                            <label className="block text-gray-700 font-bold mb-2">Location*</label>
                            <input
                                type="text"
                                {...register('location', { required: true })}
                                className="w-full p-2 border border-gray-300 rounded-md"
                            />
                            {errors.location && <span className="text-red-500">This field is required</span>}
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
                            <label className="block text-gray-700 font-bold mb-2">Responsibilities*</label>
                            <textarea
                                {...register('responsibilities', {required: true})}
                                className="w-full p-2 border border-gray-300 rounded-md"
                            ></textarea>
                            {errors.responsibilities && <span className="text-red-500">This field is required</span>}
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

export default Experience;
