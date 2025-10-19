import { apiSlice } from "../../Slice/BaseUrl";

export const studentApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    studentProfile: builder.query({
      query: (data) => ({
        url: "/student/profile",
        method: "GET",
        body: data,
      }),
      providesTags: ["Student"],
    }),
    getAllStudent: builder.query({
      query: (data) => ({
        url: "/student",
        method: "GET",
        body: data,
      }),
      providesTags: ["Student"],
    }),
    studentUpdateProfile: builder.mutation({
      query: (data) => ({
        url: `/student/update-student`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: ["User", "Student"],
    }),
    createStudent: builder.mutation({
      query: (data) => ({
        url: `/user/create-student`,
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["User", "Student"],
    }),
    singleStudent: builder.query({
      query: ({ _id }) => ({
        url: `/student/profile/${_id}`,
        method: "GET",
      }),
    }),
  }),
  overrideExisting: false,
});

export const {
  useStudentProfileQuery,
  useStudentUpdateProfileMutation,
  useCreateStudentMutation,
  useGetAllStudentQuery
} = studentApi;
