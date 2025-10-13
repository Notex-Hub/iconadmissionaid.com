import { apiSlice } from "../../Slice/BaseUrl";

export const orderApi = apiSlice.injectEndpoints({
    endpoints: (builder) => ({

        createOrder: builder.mutation({
            query: (data) => ({
                url: `/order/create-order`,
                method: "POST",
                body: data,
            }),
            invalidatesTags: ["Book", "Order"],
        }),

        getAllOrder: builder.query({
            query: ({ studentId, courseId, course_type }) => {
                const query = new URLSearchParams();
                if (studentId) query.append('studentId', studentId);
                if (courseId) query.append('courseId', courseId);
                if (course_type) query.append('course_type', course_type);
                return `/order?${query.toString()}`;
            },
            providesTags: ["Book", "Order"],
        }),

        getOrder: builder.query({
            query: (params) => ({
                url: `/order`,
                method: "GET",
                params
            }),
            providesTags: ["Order"],


        }),


    }),
    overrideExisting: false,
});

export const {

    useCreateOrderMutation,
    useGetOrderQuery,
    useGetAllOrderQuery

} = orderApi;
