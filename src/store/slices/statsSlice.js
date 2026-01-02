import { createSlice } from '@reduxjs/toolkit';
import { getDailyStats, getMonthlyStats } from '../thunks/statsThunk.js';

const initialState = {
  dailyStats: null,   // 일별 통계 데이터
  monthlyStats: [],   // 월별 통계 데이터
  loading: false,     // 로딩 상태
  error: null,        // 에러 메시지
};

const statsSlice = createSlice({
  name: 'stats',
  initialState,
  reducers: {
    clearStats: (state) => {
      state.dailyStats = null;
      state.monthlyStats = [];
    }
  },
  extraReducers: (builder) => {
    builder
      // 일별 통계 (Daily) 처리 ==========================
      .addCase(getDailyStats.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getDailyStats.fulfilled, (state, action) => {
        state.loading = false;
        // 서버 응답 구조에 따라 데이터 위치가 다를 수 있어 안전하게 처리
        // 보통 result 안에 stats가 들어오는 구조일 것으로 예상됨
        state.dailyStats = action.payload.result?.stats || action.payload.stats || action.payload;
      })
      .addCase(getDailyStats.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload; // 에러 저장
      })

      // 월별 통계 (Monthly) 처리 ==========================
      .addCase(getMonthlyStats.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getMonthlyStats.fulfilled, (state, action) => {
        state.loading = false;
        state.monthlyStats = action.payload.result?.stats || action.payload.stats || [];
      })
      .addCase(getMonthlyStats.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearStats } = statsSlice.actions;
export default statsSlice.reducer;