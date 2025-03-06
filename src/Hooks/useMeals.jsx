import { useQuery } from "react-query";
import { axiosPublic } from "./usePublic";


const useMeals = ( ) => {
  const { refetch, data: meals = [] } = useQuery(
    ["meals"],
    async () => {
      const response = await axiosPublic.get("/meal"); 
      return response.data;
    }
  );
  return [meals, refetch];

};

export default useMeals;