import { createAsyncThunk } from "@reduxjs/toolkit";
import axiosIns from "../../api/axiosInstance.js";

// 공지사항 출력
export const noticeIndexThunk = createAsyncThunk(
  'notice/noticeIndexThunk',
  async (page = 1, { rejectWithValue }) => {
    try {
      const url = `/api/admin/notices/?page=${page}`;

      const response = await axiosIns.get(url);

      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data || error.message);
    }
  }
);

// 이미지 업로드
export const noticeImageUploadThunk = createAsyncThunk(
  'notice/noticeImageUploadThunk',
  async (file, { rejectWithValue }) => {
    try {
      const url = '/api/common/files/notices';

      const headers = {
        'Content-Type': 'multipart/form-data'
      };

      // 폼데이터 생성
      const formData = new FormData();
      formData.append('image', file);

      const response = await axiosIns.post(url, formData, { headers });

      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data || error.message);
    }
  }
);

// 게시글 등록
export const noticeCreateThunk = createAsyncThunk(
  'notice/noticeCreateThunk',
  async (data, { rejectWithValue }) => {
    try {
      const url = '/api/admin/notices/';

      const response = await axiosIns.post(url, data);

      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data || error.message);
    }
  }
);

// 게시글 수정
export const noticeUpdateThunk = createAsyncThunk(
  'notice/noticeUpdateThunk',
  async (id, { rejectWithValue }) => {
    try {
      const url = `/api/admin/notices/${id}`;

      const response = await axiosIns.put(url);

      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data || error.message);
    }
  }
);

// 게시글 삭제
export const noticeDeleteThunk = createAsyncThunk(
  'notice/noticeDeleteThunk',
  async (id, { rejectWithValue }) => {
    try {
      const url = `/api/admin/notices/${id}`;

      const response = await axiosIns.delete(url);

      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data || error.message);
    }
  }
);