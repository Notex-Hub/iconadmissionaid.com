// import { configureStore } from "@reduxjs/toolkit";
// import { apiSlice } from "./Features/Slice/BaseUrl";
// import { authSlice } from "./Features/Api/Auth/AuthSlice";

import { configureStore } from "@reduxjs/toolkit";
import { apiSlice } from "./Features/Slice/BaseUrl";
import { authSlice } from "./Features/Api/Auth/AuthSlice";

export const store = configureStore({
  reducer: {
    [apiSlice.reducerPath]: apiSlice.reducer,
    [authSlice.reducerPath]: authSlice.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(apiSlice.middleware),
});
