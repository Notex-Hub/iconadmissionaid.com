import { apiSlice } from "../../Slice/BaseUrl";

export const examApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getAllExam: builder.query({
      query: (params) => ({
        url: "/exam",
        method: "GET",
        params,
      }),
    }),
  }),
  overrideExisting: false,
});

export const { useGetAllExamQuery } = examApi;
