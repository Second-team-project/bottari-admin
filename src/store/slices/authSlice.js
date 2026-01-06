import { createSlice } from '@reduxjs/toolkit';
import { loginThunk, logoutThunk, reissueThunk } from '../thunks/authThunk.js';

const initialState = {
  accessToken: null,
  admin: null,
  isLoggedIn: false,
}

const slice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    clearAuth(state) {
      state.accessToken = null;
      state.admin = null;
      state.isLoggedIn = false;
    }
  },
  extraReducers: builder => {
    builder
      .addCase(loginThunk.fulfilled, (state, action) => {
        const { accessToken, admin } = action.payload.data;
        state.accessToken = accessToken;
        state.admin = admin;
        state.isLoggedIn = true;
      })
      .addCase(reissueThunk.fulfilled, (state, action) => {
        const { accessToken, admin } = action.payload.data;
        state.accessToken = accessToken;
        state.admin = admin;
        state.isLoggedIn = true;
      })
      .addCase(logoutThunk.fulfilled, (state) => {
        state.accessToken = null;
        state.admin = null;
        state.isLoggedIn = false;
      })
  }
});

export const {
  clearAuth,
} = slice.actions;

export default slice.reducer;