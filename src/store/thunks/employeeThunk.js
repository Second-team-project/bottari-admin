import { createAsyncThunk } from "@reduxjs/toolkit";
import axiosIns from "../../api/axiosInstance.js";

const API_URL = '/api/admin/store-emps';

export const employeeIndexThunk = createAsyncThunk(
  "employee/employeeIndexThunk",
  async (params, { rejectWithValue }) => {
    try {
      const response = await axiosIns.get(API_URL, { params });
      
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const employeeShowThunk = createAsyncThunk(
  "employee/employeeShowThunk",
  async (id, { rejectWithValue }) => {
    try {
      const response = await axiosIns.get(`${API_URL}/${id}`);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const employeeStoreThunk = createAsyncThunk(
  "employee/employeeStoreThunk",
  async (data, { rejectWithValue }) => {
    try {
      const response = await axiosIns.post(API_URL, data);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const employeeUpdateThunk = createAsyncThunk(
  "employee/employeeUpdateThunk",
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const response = await axiosIns.put(`${API_URL}/${id}`, data);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const employeeDestroyThunk = createAsyncThunk(
  "employee/employeeDestroyThunk",
  async (id, { rejectWithValue }) => {
    try {
      await axiosIns.delete(`${API_URL}/${id}`);
      return id; // 삭제된 ID를 리턴하여 상태 업데이트에 활용
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);