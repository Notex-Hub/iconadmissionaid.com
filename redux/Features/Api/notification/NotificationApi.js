import { apiSlice } from "../../Slice/BaseUrl";

export const NotificationApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getNotification: builder.query({
      query: (params) => ({
        url: `/notification/user`,
        method: "GET",
        params,
      }),
      providesTags: ["Notificatio"],
    }),
  }),
});

export const { useGetNotificationQuery } = NotificationApi;
