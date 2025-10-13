import { apiSlice } from "../../Slice/BaseUrl";

export const cqApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getAllCq: builder.query({
      query: (params) => ({
        url: "/cq-question",
        method: "GET",
        params, 
      }),
         providesTags: ["CQ"],
     
    }),
     cqAttemp: builder.mutation({
      query: (data) => ({
        url: `/cq-attemp/create-cqattemp`,
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["CQAttemp"],
    }),

getAllCqAttemp: builder.query({
      query: (params) => ({
        url: "/cq-attemp",
        method: "GET",
        params, 
      }),
      providesTags: ["CQAttemp"],
    }),

    getAllCqAttempMarking: builder.query({
      query: (params) => ({
        url: "/cq-marking",
        method: "GET",
        params, 
      }),
      providesTags: ["CQMarking"],
    }),

    


  }),
  overrideExisting: false,
});

export const { useGetAllCqQuery, useCqAttempMutation, useGetAllCqAttempQuery, useGetAllCqAttempMarkingQuery } = cqApi;
