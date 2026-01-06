import { createAsyncThunk } from "@reduxjs/toolkit";
import axiosIns from "../../api/axiosInstance.js";

const API_URL = '/api/admin/drivers';

export const driverIndexThunk = createAsyncThunk(
  'driver/driverIndexThunk',
  async (params, { rejectWithValue }) => {
    try {
      // params: { page, driverName, ... }
      const response = await axiosIns.get(API_URL, { params });
      return response.data.result; // { drivers: [], count: 0, page: 1 ... }
    } catch(error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const driverShowThunk = createAsyncThunk(
  'driver/driverShowThunk',
  async (id, { rejectWithValue }) => {
    try {
      const response = await axiosIns.get(`${API_URL}/${id}`);
      return response.data.result;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const driverStoreThunk = createAsyncThunk(
  'driver/driverStoreThunk',
  async (data, { rejectWithValue }) => {
    try {
      const response = await axiosIns.post(API_URL, data);
      return response.data.result;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const driverUpdateThunk = createAsyncThunk(
  'driver/driverUpdateThunk',
 async ({ id, data }, { rejectWithValue }) => {
    try {
      const response = await axiosIns.put(`${API_URL}/${id}`, data);
      return response.data.result;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const driverDestroyThunk = createAsyncThunk(
  'driver/driverDestroyThunk',
  async (id, { rejectWithValue }) => {
    try {
      await axiosIns.delete(`${API_URL}/${id}`);
      return id; // 삭제된 ID를 리턴하여 상태 업데이트에 활용
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);