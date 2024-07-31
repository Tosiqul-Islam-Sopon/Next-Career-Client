import { useContext } from "react";
import { AuthContext } from "../../../../Providers/AuthProvider";
import { Link } from "react-router-dom";
import useAxiosBase from "../../../../CustomHooks/useAxiosBase";
import { useQuery } from "@tanstack/react-query";

const PersonalInfo = () => {
    const { user } = useContext(AuthContext);
    const axiosBase = useAxiosBase();

    const { data: userInfo = null, isLoading } = useQuery({
        queryKey: ['user', user?.email],
        queryFn: async () => {
            const response = await axiosBase.get(`/user/${user?.email}`);
            return response.data;
        }
    });

    if (isLoading) {
        return <div className='mt-32 text-center text-5xl text-green-400'>Loading...</div>;
    }

    const { name, email, personalInfo } = userInfo;
    const {dateOfBirth, ContactNo, bio, gender, github, linkedIn, nationality, permanentAddress, personalWebsite, presentAddress} = personalInfo;

    return (
        <div className="max-w-3xl mx-auto p-8 border rounded-lg shadow-lg bg-white">
            <div className="relative mb-6">
                <div className="absolute top-3 right-5">
                    <Link to={"/dashboard/editPersonalInfo"}>
                        <button className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-900">Edit</button>
                    </Link>
                </div>
                <div className="flex flex-col items-center gap-5">
                    <img className="rounded-full h-28 w-28 border-2 border-orange-500 shadow-2xl" src={user?.photoURL} alt="Profile" />
                    <h1 className="text-3xl font-bold">{name}</h1>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <h2 className="text-xl font-semibold mb-2">Contact Information</h2>
                    <p className="text-gray-700"><strong>Email:</strong> {email}</p>
                    <p className="text-gray-700"><strong>Contact No:</strong> {ContactNo}</p>
                    <p className="text-gray-700"><strong>Date of Birth:</strong> {dateOfBirth}</p>
                    <p className="text-gray-700"><strong>Gender:</strong> {gender}</p>
                    <p className="text-gray-700"><strong>Nationality:</strong> {nationality}</p>
                </div>

                <div>
                    <h2 className="text-xl font-semibold mb-2">Addresses</h2>
                    <p className="text-gray-700"><strong>Present Address:</strong> {presentAddress}</p>
                    <p className="text-gray-700"><strong>Permanent Address:</strong> {permanentAddress}</p>
                </div>

                <div>
                    <h2 className="text-xl font-semibold mb-2">Online Profiles</h2>
                    <p className="text-gray-700"><strong>GitHub:</strong> <a href={github} target="_blank" rel="noopener noreferrer" className="text-blue-500 underline">{github}</a></p>
                    <p className="text-gray-700"><strong>LinkedIn:</strong> <a href={linkedIn} target="_blank" rel="noopener noreferrer" className="text-blue-500 underline">{linkedIn}</a></p>
                    <p className="text-gray-700"><strong>Personal Website:</strong> <a href={personalWebsite} target="_blank" rel="noopener noreferrer" className="text-blue-500 underline">{personalWebsite}</a></p>
                </div>

                <div>
                    <h2 className="text-xl font-semibold mb-2">Bio</h2>
                    <p className="text-gray-700">{bio}</p>
                </div>
            </div>
        </div>
    );
};

export default PersonalInfo;
