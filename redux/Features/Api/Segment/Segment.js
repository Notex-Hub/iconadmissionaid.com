import { apiSlice } from "../../Slice/BaseUrl";

export const segmentApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getAllSegment: builder.query({
      query: (params) => ({
        url: "/segment",
        method: "GET",
        params,
      }),
      providesTags: ["Segment"],
    }),


    
  }),

  overrideExisting: false,
});


export const { useGetAllSegmentQuery} = segmentApi;
