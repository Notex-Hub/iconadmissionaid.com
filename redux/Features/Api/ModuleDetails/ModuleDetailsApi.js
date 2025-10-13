import { apiSlice } from "../../Slice/BaseUrl";

export const moduleDetailsApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getAllModuleDetails: builder.query({
      query: (params) => ({
        url: "/moduleDetails",
        method: "GET",
        params,  
      }),
      providesTags: ["moduleDetails"],
    }),
  }),
  overrideExisting: false,
});

export const { useGetAllModuleDetailsQuery } = moduleDetailsApi;
