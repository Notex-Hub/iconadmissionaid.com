import { apiSlice } from "../../Slice/BaseUrl";

export const subscriptiontApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getAllSunscription: builder.query({
      query: (params) => ({
        url: "/subscription",
        method: "GET",
        params,
      }),
      providesTags: ["Sunscription"],
    }),


    
  }),

  overrideExisting: false,
});


export const { useGetAllSunscriptionQuery} = subscriptiontApi;
