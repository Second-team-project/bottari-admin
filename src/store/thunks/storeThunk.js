import { createAsyncThunk } from "@reduxjs/toolkit";
import axiosIns from "../../api/axiosInstance.js";

/**
 * 보관소 가져오기
 */
export const getStoreThunk = createAsyncThunk(
  'store/getStoreThunk',
  async ( _, {rejectWithValue}) => {
    try {
      const url = `/api/admin/store`;
      const response = await axiosIns.get(url)
      console.log('getStoreThunk: ', response.data.data)

      return response.data.data;

    } catch (error) {
      return rejectWithValue(error.response?.data);
    }
  }
)

/**
 * 보관소 생성
 */
export const createStoreThunk = createAsyncThunk(
  'store/createStoreThunk',
  async (data, {rejectWithValue}) => {
    try {
      const url = `/api/admin/store`;
      const response = await axiosIns.post(url, data)
      console.log('createStoreThunk: ', response.data.data)

      return response.data.data;

    } catch (error) {
      return rejectWithValue(error.response?.data);
    }
  }
)

/**
 * 보관소 수정
 */
export const updateStoreThunk = createAsyncThunk(
  'store/updateStoreThunk',
  async (data, {rejectWithValue}) => {
    try {
      const url = `/api/admin/store/${data.id}`;
      const response = await axiosIns.put(url, data)
      console.log('updateStoreThunk: ', response.data.data)

      return response.data.data;

    } catch (error) {
      return rejectWithValue(error.response?.data);
    }
  }
)

/**
 * 보관소 삭제
 */
export const deleteStoreThunk = createAsyncThunk(
  'store/deleteStoreThunk',
  async (id, {rejectWithValue}) => {
    try {
      const url = `/api/admin/store/${id}`;
      const response = await axiosIns.delete(url)
      console.log('deletePricingThunk: ', response.data.data)

      return response.data.data;

    } catch (error) {
      return rejectWithValue(error.response?.data);
    }
  }
)