import { useQuery } from "react-query";
import { axiosPublic } from "./usePublic";


const useBus = ( ) => {
  const { refetch, data: bus = [] } = useQuery(
    ["bus"],
    async () => {
      const response = await axiosPublic.get("/bus"); 
      return response.data;
    }
  );
  return [bus, refetch];

};

export default useBus;