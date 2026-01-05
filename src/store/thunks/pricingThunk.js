import { createAsyncThunk } from "@reduxjs/toolkit";
import axiosIns from "../../api/axiosInstance.js";

export const getPricingThunk = createAsyncThunk(
  'pricing/getPricingThunk',
  async ( page, {rejectWithValue}) => {
    try {
      const url = ``;
      const response = await axiosIns.get(url)
      return response.data;

    } catch (error) {
      return rejectWithValue(error.response?.data);
      
    }
  }
)