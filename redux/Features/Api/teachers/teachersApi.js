import { apiSlice } from "../../Slice/BaseUrl";

export const teacherApi = apiSlice.injectEndpoints({
    endpoints: (builder) => ({

        getTeacher: builder.query({
            query: ({ limit }) => ({
                url: `/faculty?limit=${limit || 0}`,
                method: "GET",
            }),
            providesTags: ["Teacher"],
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

export const { useGetTeacherQuery } = teacherApi;
