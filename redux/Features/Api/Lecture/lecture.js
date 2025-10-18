import { apiSlice } from "../../Slice/BaseUrl";

export const lectureApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getAllLecture: builder.query({
      query: (params) => ({
        url: "/lecture",
        method: "GET",
        params, 
      }),
    }),
  }),
  overrideExisting: false,
});

export const { useGetAllLectureQuery } = lectureApi;
