import { apiSlice } from "../../Slice/BaseUrl";

export const contentApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getAllLecture: builder.query({
      query: (params) => ({
        url: "/lecture",
        method: "GET",
        params, // filter/option গুলো এখানে পাঠাও
      }),
      // providesTags: ["Course"],
    }),

    getAllNotes: builder.query({
      query: (params) => ({
        url: "/notes",
        method: "GET",
        params,
      }),
      // providesTags: ["Course"],
    }),

    getAllExam: builder.query({
      query: (params) => ({
        url: "/exam",
        method: "GET",
        params,
      }),
      invalidatesTags: ["Exam"],
    }),
  }),
  overrideExisting: false,
});

export const { useGetAllLectureQuery, useGetAllNotesQuery, useGetAllExamQuery } = contentApi;
