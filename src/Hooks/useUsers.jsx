import { useQuery } from "react-query";
import { axiosPublic } from "./usePublic";


const useUsers = ( ) => {
  const { refetch, data: users = [] } = useQuery(
    ["users"],
    async () => {
      const response = await axiosPublic.get("/user"); 
      return response.data;
    }
  );
  return [users, refetch];

};

export default useUsers;