import { useContext, useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { AuthContext } from '../../../../Providers/AuthProvider';
import useAxiosBase from '../../../../CustomHooks/useAxiosBase';
import Swal from 'sweetalert2';

const Resume = () => {
    const { user } = useContext(AuthContext);
    const axiosBase = useAxiosBase();
    const [file, setFile] = useState(null);
    const [hasResume, setHasResume] = useState(false);

    const { data: userInfo = null, isLoading, refetch } = useQuery({
        queryKey: ['user', user?.email],
        queryFn: async () => {
            const response = await axiosBase.get(`/user/${user?.email}`);
            return response.data;
        },
    });

    useEffect(() => {
        const checkResume = async () => {
            if (userInfo) {
                console.log('checking........  ');
                const response = await axiosBase.get(`/user/${userInfo._id}/has-resume`);
                setHasResume(response.data.hasResume);
            }
        };
        checkResume();
    }, [userInfo, axiosBase]);

    if (isLoading) {
        return <div className='mt-32 text-center text-5xl text-green-400'>Loading...</div>;
    }

    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];
        if (selectedFile && selectedFile.type === 'application/pdf') {
            setFile(selectedFile);
        } else {
            Swal.fire({
                title: 'Error',
                text: 'Please select a PDF file',
                icon: 'error',
                confirmButtonText: 'OK',
            });
            setFile(null);
        }
    };

    const handleUpload = async () => {
        if (!file) return;

        const formData = new FormData();
        formData.append('resume', file);

        try {
            const response = await axiosBase.post(`/user/${userInfo._id}/resume`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            if (response.status === 200) {
                Swal.fire({
                    title: 'Success',
                    text: 'Resume uploaded successfully',
                    icon: 'success',
                    confirmButtonText: 'OK',
                });
                setFile(null);
                refetch();
                setHasResume(true);
            }
        } catch (error) {
            console.error('Error uploading resume:', error);
            Swal.fire({
                title: 'Error',
                text: 'Failed to upload resume',
                icon: 'error',
                confirmButtonText: 'OK',
            });
        }
    };

    const handleDelete = async () => {
        Swal.fire({
            title: "Are you sure?",
            text: "You won't be able to revert this!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes, delete it!"
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    const response = await axiosBase.delete(`/user/${userInfo._id}/resume`);

                    if (response.status === 200) {
                        Swal.fire({
                            title: 'Success',
                            text: 'Resume deleted successfully',
                            icon: 'success',
                            confirmButtonText: 'OK',
                        });
                        refetch();
                        setHasResume(false);
                    }
                } catch (error) {
                    console.error('Error deleting resume:', error);
                    Swal.fire({
                        title: 'Error',
                        text: 'Failed to delete resume',
                        icon: 'error',
                        confirmButtonText: 'OK',
                    });
                }
            }
        });

    };

    return (
        <div className='mb-8'>
            <h2 className="text-2xl font-bold mb-4">Resume</h2>
            {hasResume ? (
                <div className="mb-4 p-4 border border-gray-300 rounded-lg bg-white shadow-md">
                    <p><strong>Uploaded Resume:</strong></p>
                    <a href={`http://localhost:5000/user/${userInfo._id}/resume`} target="_blank" rel="noopener noreferrer" className="text-blue-500 underline">
                        View Resume
                    </a>
                    <button
                        type="button"
                        className="ml-4 py-2 px-4 bg-red-500 text-white font-bold rounded-md hover:bg-red-600"
                        onClick={handleDelete}
                    >
                        Delete
                    </button>
                </div>
            ) : (
                <div className="mb-4">
                    <input type="file" accept="application/pdf" onChange={handleFileChange} />
                    <button
                        type="button"
                        className="ml-4 py-2 px-4 bg-blue-500 text-white font-bold rounded-md hover:bg-blue-600"
                        onClick={handleUpload}
                    >
                        Upload Resume
                    </button>
                </div>
            )}
        </div>
    );
};

export default Resume;
