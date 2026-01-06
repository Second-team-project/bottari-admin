import { createAsyncThunk } from "@reduxjs/toolkit";
import axiosIns from "../../api/axiosInstance.js";

export const noticeIndexThunk = createAsyncThunk(
  'notice/noticeIndexThunk',
  async (_, { rejectWithValue }) => {
    try {
      const url = '/api/admin/notices/';

      const response = await axiosIns.get(url);

      return response.data;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);