import { apiSlice } from "../../Slice/BaseUrl";

export const moduleApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getAllModule: builder.query({
      query: (params) => ({
        url: "/module",
        method: "GET",
        params, 
      }),
      // providesTags: ["Module"],
    }),
  }),
  overrideExisting: false,
});

export const { useGetAllModuleQuery } = moduleApi;
