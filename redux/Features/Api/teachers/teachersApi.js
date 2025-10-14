import { apiSlice } from "../../Slice/BaseUrl";

export const teacherApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getTeacher: builder.query({
      query: ({ limit } = {}) => ({
        url: limit ? `/faculty?limit=${limit}` : `/faculty`,
        method: "GET",
      }),
      providesTags: ["Teacher"],
    }),
  }),
  overrideExisting: false,
});

export const { useGetTeacherQuery } = teacherApi;
