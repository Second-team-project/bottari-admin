import { createAsyncThunk } from "@reduxjs/toolkit";
import axiosIns from "../../api/axiosInstance.js";

/**
 * 가이드 이미지 가져오기
 */
export const getGuideImgThunk = createAsyncThunk(
  'guideImg/getGuideImgThunk',
  async ( _, {rejectWithValue}) => {
    try {
      const url = `/api/admin/guide-img`;
      const response = await axiosIns.get(url)
      console.log('getGuideImgThunk: ', response.data.data)

      return response.data.data;

    } catch (error) {
      return rejectWithValue(error.response?.data);
    }
  }
)

/**
 * 가이드 이미지 생성
 */
export const createGuideImgThunk = createAsyncThunk(
  'guideImg/createGuideImgThunk',
  async (data, {rejectWithValue}) => {
    try {
      const url = `/api/admin/guide-img`;
      const response = await axiosIns.post(url, data, {
        headers: {'Content-Type': 'multipart/form-data'}
      })
      console.log('createGuideImgThunk: ', response.data.data)

      return response.data.data;

    } catch (error) {
      return rejectWithValue(error.response?.data);
    }
  }
)

/**
 * 가이드 이미지 수정 : 이미지 포함 - formData
 */
export const updateGuideImgThunk = createAsyncThunk(
  'guideImg/updateGuideImgThunk',
  async ({id, formData}, {rejectWithValue}) => {
    try {
      const url = `/api/admin/guide-img/${id}`;

      const response = await axiosIns.put(url, formData, {
        headers: {'Content-Type': 'multipart/form-data'}
      })
      console.log('updateGuideImgThunk: ', response.data.data)

      return response.data.data;

    } catch (error) {
      return rejectWithValue(error.response?.data);
    }
  }
)

/**
 * 가이드 이미지 수정 : 이미지 미포함 - JSON
 */
export const updateGuideImgOrderThunk = createAsyncThunk(
  'guideImg/updateGuideImgOrderThunk',
  async ({id, sortOrder}, {rejectWithValue}) => {
    try {
      const url = `/api/admin/guide-img/${id}`;

      const response = await axiosIns.put(url, { sortOrder })
      console.log('updateGuideImgThunk: ', response.data.data)

      return response.data.data;

    } catch (error) {
      return rejectWithValue(error.response?.data);
    }
  }
)

/**
 * 가이드 이미지 삭제
 */
export const deleteGuideImgThunk = createAsyncThunk(
  'guideImg/deleteGuideImgThunk',
  async (id, {rejectWithValue}) => {
    try {
      const url = `/api/admin/guide-img/${id}`;
      const response = await axiosIns.delete(url)
      console.log('deleteGuideImgThunk: ', response.data.data)

      return response.data.data;

    } catch (error) {
      return rejectWithValue(error.response?.data);
    }
  }
)