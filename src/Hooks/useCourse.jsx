import { useQuery } from "react-query";
import { axiosPublic } from "./usePublic";


const useCourse = ( ) => {
  const { refetch, data: course = [] } = useQuery(
    ["course"],
    async () => {
      const response = await axiosPublic.get("/course"); 
      return response.data;
    }
  );
  return [course, refetch];

};

export default useCourse;