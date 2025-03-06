import { useQuery } from "react-query";
import { axiosPublic } from "./usePublic";


const useAllClasses = ( ) => {
  const { refetch, data: classes = [] } = useQuery(
    ["classes"],
    async () => {
      const response = await axiosPublic.get("/classschedule"); 
      return response.data;
    }
  );
  return [classes, refetch];

};

export default useAllClasses;