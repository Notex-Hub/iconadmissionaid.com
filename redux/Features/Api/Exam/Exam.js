import { apiSlice } from "../../Slice/BaseUrl";

export const examApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getAllModule: builder.query({
      query: (params) => ({
        url: "/module",
        method: "GET",
        params, 
      }),
     
    }),
  }),
  overrideExisting: false,
});

export const { useGetAllModuleQuery } = examApi;
