import { createAsyncThunk } from "@reduxjs/toolkit";
import axiosIns from "../../api/axiosInstance.js";

/**
 * FAQ 가져오기
 */
export const getFAQImgThunk = createAsyncThunk(
  'faq/getFAQImgThunk',
  async ( _, {rejectWithValue}) => {
    try {
      const url = `/api/admin/faq`;
      const response = await axiosIns.get(url)
      console.log('getFAQImgThunk: ', response.data.data)

      return response.data.data;

    } catch (error) {
      return rejectWithValue(error.response?.data);
    }
  }
)

/**
 * FAQ 생성
 */
export const createFAQImgThunk = createAsyncThunk(
  'faq/createFAQImgThunk',
  async (data, {rejectWithValue}) => {
    try {
      const url = `/api/admin/faq`;
      const response = await axiosIns.post(url, data, {
        headers: {'Content-Type': 'multipart/form-data'}
      })
      console.log('createFAQImgThunk: ', response.data.data)

      return response.data.data;

    } catch (error) {
      return rejectWithValue(error.response?.data);
    }
  }
)

/**
 * FAQ 수정
 */
export const updateFAQImgThunk = createAsyncThunk(
  'faq/updateFAQImgThunk',
  async ({id, formData}, {rejectWithValue}) => {
    try {
      const url = `/api/admin/faq/${id}`;

      const response = await axiosIns.put(url, formData, {
        headers: {'Content-Type': 'multipart/form-data'}
      })
      console.log('updateFAQImgThunk: ', response.data.data)

      return response.data.data;

    } catch (error) {
      return rejectWithValue(error.response?.data);
    }
  }
)

/**
 * FAQ 삭제
 */
export const deleteFAQImgThunk = createAsyncThunk(
  'faq/deleteFAQImgThunk',
  async (id, {rejectWithValue}) => {
    try {
      const url = `/api/admin/faq/${id}`;
      const response = await axiosIns.delete(url)
      console.log('deleteFAQImgThunk: ', response.data.data)

      return response.data.data;

    } catch (error) {
      return rejectWithValue(error.response?.data);
    }
  }
)