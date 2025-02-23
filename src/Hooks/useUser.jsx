import { useQuery } from "react-query";
import { axiosPublic } from "./usePublic";

const useUser = () => {
  const { data: profile = {}, refetch, isLoading, isError } = useQuery({
    queryKey: ["profile"],
    queryFn: async () => {
      const token = localStorage.getItem("token");
      const res = await axiosPublic.get(`/user/profile`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return res.data.data; // Adjust based on your backend response structure
    },
  });

  return { profile, refetch, isLoading, isError };
};

export default useUser;
