import { apiSlice } from "../../Slice/BaseUrl";

export const subjectApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getAllSubject: builder.query({
      query: (params) => ({
        url: "/model-test-subject",
        method: "GET",
        params,
      }),
      providesTags: ["Subject"],
    }),


    
  }),

  overrideExisting: false,
});


export const { useGetAllSubjectQuery} = subjectApi;
