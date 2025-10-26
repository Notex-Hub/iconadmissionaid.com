import { apiSlice } from "../../Slice/BaseUrl";

export const paymentGatewayApi = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        createPaymentMethod: builder.mutation({
            query: (data) => ({
                url: `/payment-gateway/${data.path}`,
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
useCreatePaymentMethodMutation,
useExecuteBkashMutation
} = paymentGatewayApi;
