import { apiSlice } from "../../Slice/BaseUrl";

export const purchaseApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
   
     cretaePurchase: builder.mutation({
      query: (data) => ({
        url: `/purchase/create-purchase`,
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Course", "Purchase"],
    }),

     getAllPurchase: builder.query({
  query: ({ studentId, courseId, course_type }) => {
    const query = new URLSearchParams();
    if (studentId) query.append('studentId', studentId);
    if (courseId) query.append('courseId', courseId);
    if (course_type) query.append('course_type', course_type);
    return `/purchase?${query.toString()}`;
  },
  providesTags: ["Course", "Purchase"],
}),


  }),
  overrideExisting: false,
});

export const {  useCretaePurchaseMutation , useGetAllPurchaseQuery} = purchaseApi;
