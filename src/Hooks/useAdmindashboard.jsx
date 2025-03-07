import { useQuery } from "react-query";
import { axiosPublic } from "./usePublic";


const useDashboardOverview = ( ) => {
  const { refetch, data: overview = [] } = useQuery(
    ["overview "],
    async () => {
      const response = await axiosPublic.get("/dashboard/Overview"); 
      return response.data;
    }
  );
  return [overview, refetch];

};

export default useDashboardOverview;