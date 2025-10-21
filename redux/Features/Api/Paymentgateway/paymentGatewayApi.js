import { apiSlice } from "../../Slice/BaseUrl";

export const paymentGatewayApi = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        createBkash: builder.mutation({
            query: (data) => ({
                url: `/payment-gateway/bkash`,
                method: "POST",
                body: data,
            }),
            invalidatesTags: ["PaymentGateway"],
        }),
        executeBkash: builder.mutation({
            query: (data) => ({
                url: `/payment-gateway/execute`,
                method: "POST",
                body: data,
            }),
        }),
    }),
    overrideExisting: false,
});

export const {
useCreateBkashMutation,
useExecuteBkashMutation
} = paymentGatewayApi;
