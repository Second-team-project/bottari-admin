import { createAsyncThunk } from "@reduxjs/toolkit";
import axiosIns from "../../api/axiosInstance.js";

// 일별 통계
export const getDailyStats = createAsyncThunk(
  'stats/getDailyStats',
  async (_, { rejectWithValue }) => {
    try {
      // 주소: /api/admin/stats/daily
      const response = await axiosIns.get('/api/admin/stats/daily');
      return response.data; // 성공 시 데이터 반환
    } catch (error) {
      console.error('일별 통계 조회 실패:', error);
      return rejectWithValue(error.response?.data || '일별 통계 조회 실패');
    }
  }
);

// 월별 통계
export const getMonthlyStats = createAsyncThunk(
  'stats/getMonthlyStats',
  async (year, { rejectWithValue }) => {
    try {
      // 주소: /api/admin/stats/monthly?year=2024
      const response = await axiosIns.get('/api/admin/stats/monthly', {
        params: { year }, // year 파라미터 전달
      });
      return response.data; // 성공 시 데이터 반환
    } catch (error) {
      console.error('월별 통계 조회 실패:', error);
      return rejectWithValue(error.response?.data || '월별 통계 조회 실패');
    }
  }
);