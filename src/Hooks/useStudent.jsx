import { useQuery } from "react-query";
import { axiosPublic } from "./usePublic";


const useStudent = ( ) => {
  const { refetch, data: student = [] } = useQuery(
    ["student"],
    async () => {
      const response = await axiosPublic.get("/student"); 
      return response.data;
    }
  );
  return [student, refetch];

};

export default useStudent;