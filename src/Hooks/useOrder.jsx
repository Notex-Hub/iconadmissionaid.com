import { useQuery } from "react-query";
import { axiosPublic } from "./usePublic";


const useOrder = ( ) => {
  const { refetch, data: orders = [] } = useQuery(
    ["orders"],
    async () => {
      const response = await axiosPublic.get("/preOrder"); 
      return response.data;
    }
  );
  return [orders, refetch];

};

export default useOrder;