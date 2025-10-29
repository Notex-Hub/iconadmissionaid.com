/* eslint-disable no-unused-vars */
import { createSlice } from "@reduxjs/toolkit";

const savedAuth = (() => {
  try {
    return JSON.parse(localStorage.getItem("auth"));
  } catch (e) {
    return null;
  }
})();

const initialState = {
  isLoading: false,
  userInfo: savedAuth?.userInfo ?? null,
  token: savedAuth?.token ?? localStorage.getItem("accessToken") ?? null,
};

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    userloading: (state) => {
      state.isLoading = false;
    },
    userLoggedIn: (state, action) => {
      state.userInfo = action.payload.user;
      state.token = action.payload.token;
      localStorage.setItem(
        "auth",
        JSON.stringify({ userInfo: state.userInfo, token: state.token })
      );
      localStorage.setItem("accessToken", action.payload.token);
    },
    userLoggedOut: (state) => {
      state.userInfo = null;
      state.token = null;
      localStorage.clear();
    },
  },
});

export const { userLoggedIn, userLoggedOut, userloading } = authSlice.actions;
export default authSlice.reducer;
