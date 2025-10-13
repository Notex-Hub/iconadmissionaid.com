import { apiSlice } from "../../Slice/BaseUrl";

export const courseApi = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        myCourse: builder.query({
            query: (params) => ({
                url: "/course/my-course",
                method: "GET",
                params,
            }),
            providesTags: ["Course", "Purchase"],
        }),

           getAllCourse: builder.query({
            query: (params) => ({
                url: "/course",
                method: "GET",
                params
            }),
            providesTags: ["Course"],

            
        }),

            getAllCourseCategory: builder.query({
            query: (params) => ({
                url: "/courseCategory",
                method: "GET",
                params
            }),
        }),

            getAllCourseDetails: builder.query({
            query: (params) => ({
                url: "/course-details",
                method: "GET",
                params
            }),
        }),


    }),
    overrideExisting: false,
});

export const { useMyCourseQuery, useGetAllCourseQuery, useGetAllCourseCategoryQuery, useGetAllCourseDetailsQuery} = courseApi;
