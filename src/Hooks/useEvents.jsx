import { useQuery } from "react-query";
import { axiosPublic } from "./usePublic";


const useEvents = ( ) => {
  const { refetch, data: events = [] } = useQuery(
    ["events"],
    async () => {
      const response = await axiosPublic.get("/events"); 
      return response.data;
    }
  );
  return [events, refetch];

};

export default useEvents;