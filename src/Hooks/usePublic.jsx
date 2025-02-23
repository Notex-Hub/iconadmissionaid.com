import axios from "axios";

export const axiosPublic = axios.create({
    baseURL: 'http://localhost:3000/api', // Set base URL
    headers: {
      'Content-Type': 'application/json',
    },
});
const usePublic = () => {
  return axiosPublic;
};

export default usePublic;