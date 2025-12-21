import { apiSlice } from "../../Slice/BaseUrl";

export const bannerApi = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
     

           getAllBanner: builder.query({
            query: (params) => ({
                url: "/banner",
                method: "GET",
                params
            }),
            providesTags: ["Banner"],

            
        }),

        
        


    }),
    overrideExisting: false,
});

export const {useGetAllBannerQuery } = bannerApi;
