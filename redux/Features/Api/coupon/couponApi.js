import { apiSlice } from "../../Slice/BaseUrl";

export const couponApi = apiSlice.injectEndpoints({
    endpoints: (builder) => ({

        getCoupon: builder.query({
            query: () => ({
                url: `/coupon`,
                method: "GET",
            }),
            providesTags: ["Order"],
        }),
    }),
    overrideExisting: false,
});

export const {
    useGetCouponQuery
} = couponApi;
