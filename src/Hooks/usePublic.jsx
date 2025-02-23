import axios from "axios";

export const axiosPublic = axios.create({
  baseURL:'http://localhost:3000/api'
  // baseURL: "http://localhost:5000/",
});
const usePublic = () => {
  return axiosPublic;
};

export default usePublic;