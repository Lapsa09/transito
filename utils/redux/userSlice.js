import { createSlice } from "@reduxjs/toolkit";
import jwt_decode from "jwt-decode";

export const userSlice = createSlice({
  name: "user",
  initialState: {
    user: null,
  },
  reducers: {
    login: (state, action) => {
      localStorage.setItem("token", action.payload);
      state.user = jwt_decode(localStorage.getItem("token"));
    },
    logout: (state) => {
      localStorage.removeItem("token");
      state.user = null;
    },
  },
});

export const { login, logout } = userSlice.actions;

export const selectUser = (state) => state.user;

export default userSlice.reducer;
