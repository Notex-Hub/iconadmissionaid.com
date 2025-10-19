import { apiSlice } from "../../Slice/BaseUrl";

export const liveApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getAllLiveClass: builder.query({
      query: (params) => ({
        url: "/live-class",
        method: "GET",
        params, 
      }),
    }),
  }),
  overrideExisting: false,
});

export const { useGetAllLiveClassQuery } = liveApi;
