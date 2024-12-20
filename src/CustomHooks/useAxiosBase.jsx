import axios from "axios";

export const baseUrl = 'http://localhost:5000';

const axiosBase = axios.create({
    baseURL: baseUrl,
})

const useAxiosBase = () => {
    
    return axiosBase;
};

export default useAxiosBase;