import { apiSlice } from "../../Slice/BaseUrl";

export const reviewApi = apiSlice.injectEndpoints({
    endpoints: (builder) => ({


        createReview: builder.mutation({
            query: (data) => ({
                url: `/course-reveiw/create-course-review`,
                method: "POST",
                body: data,
            }),
            invalidatesTags: ["Review"],
        }),


        getAllReview: builder.query({
            query: ({ limit }) => ({
                url: `/course-reveiw?limit=${limit || 0}`,
                method: "GET",
            }),
            providesTags: ["Review"],
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

export const { useGetAllReviewQuery, useCreateReviewMutation } = reviewApi;
