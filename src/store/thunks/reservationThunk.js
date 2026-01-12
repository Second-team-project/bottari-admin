import { createAsyncThunk } from "@reduxjs/toolkit";
import axiosIns from '../../api/axiosInstance.js';

export const reservationIndexThunk = createAsyncThunk(
  'reservation/reservationIndexThunk',
  async (params, { rejectWithValue }) => {
    try {
      // params = { page, state, searchType, keyword, startDate, endDate... }
      console.log(params);
      const response = await axiosIns.get('/api/admin/reservations', { params: params });
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || '예약 목록 로딩 실패');
    }
  }
);

export const reservationShowThunk = createAsyncThunk(
  'reservation/reservationShowThunk',
  async (id, { rejectWithValue }) => {
    try {
      const response = await axiosIns.get(`/api/admin/reservations/${id}`);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || '상세 조회 실패');
    }
  }
);

export const reservationStoreThunk = createAsyncThunk(
  'reservation/reservationStoreThunk',
  async (data, { rejectWithValue }) => {
    try {
      const response = await axiosIns.post('/api/admin/reservations', data);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || '등록 실패');
    }
  }
);

export const reservationUpdateThunk = createAsyncThunk(
  'reservation/reservationUpdateThunk',
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const response = await axiosIns.patch(`/api/admin/reservations/${id}`, data);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || '수정 실패');
    }
  }
);

export const reservationDestroyThunk = createAsyncThunk(
  'reservation/reservationDestroyThunk',
  async (id, { rejectWithValue }) => {
    try {
      await axiosIns.delete(`/api/admin/reservations/${id}`);
      return id; // 삭제된 ID 반환
    } catch (error) {
      return rejectWithValue(error.response?.data || '삭제 실패');
    }
  }
);