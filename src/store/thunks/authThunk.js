import { createAsyncThunk } from "@reduxjs/toolkit";
import axiosIns from "../../api/axiosInstance.js";

export const loginThunk = createAsyncThunk(
  'auth/loginThunk',
  async (args, {rejectWithValue}) => {
    try {
      const url = '/api/admin/auth/login';
      const { accountId, password } = args;
      
      const response = await axiosIns.post(url, { accountId, password });

      return response.data;
    } catch(error) {
      return rejectWithValue(error.response?.data);
    }
  }
);

// 토큰 재발급
export const reissueThunk = createAsyncThunk(
  'auth/reissueThunk',
  async (_, {rejectWithValue}) => {
    try {
      const url = '/api/admin/auth/reissue';

      const response = await axiosIns.post(url);

      return response.data;
    } catch(error) {
      return rejectWithValue(error.response?.data);
    }
  }
)

// 로그아웃
export const logoutThunk = createAsyncThunk(
  'auth/logoutThunk',
  async (_, {rejectWithValue}) => {
    try {
      const url = '/api/admin/auth/logout';

      const response = await axiosIns.post(url);

      return response.data;
    } catch(error) {
      return rejectWithValue(error.response?.data);
    }
  }
)