import { apiSlice } from "../../Slice/BaseUrl";

export const universityApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getUniversity: builder.query({
      query: ({ limit } = {}) => ({
        url: limit ? `/university?limit=${limit}` : `/university`,
        method: "GET",
      }),
      providesTags: ["University"],
    }),

    // studentUpdateProfile: builder.mutation({
    //     query: (data) => ({
    //         url: `/student/update-student/${data?.sId}`,
    //         method: "PATCH",
    //         body: data,
    //     }),
    //     invalidatesTags: ["User", "Teacher"],
    // }),
  }),
  overrideExisting: false,
});

export const { useGetUniversityQuery } = universityApi;
