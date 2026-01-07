import { createSlice } from '@reduxjs/toolkit';
import { getDailyStatsThunk, getMonthlyStatsThunk } from '../thunks/statsThunk.js';

const initialState = {
  dailyStats: null,   // 일별 통계 데이터
  monthlyStats: [],   // 월별 통계 데이터
  loading: false,     // 로딩 상태
  error: null,        // 에러 메시지
};

const slice = createSlice({
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
      .addCase(getDailyStatsThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.dailyStats = action.payload.data?.stats;
      })

      // 월별 통계 (Monthly) 처리 ==========================
      .addCase(getMonthlyStatsThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.monthlyStats = action.payload.data?.stats || [];
      })
      
      .addMatcher(
        (action) => action.type.endsWith('/pending'),
        (state) => {
          state.loading = true;
          state.error = null;
        }
      )
      .addMatcher(
        (action) => action.type.endsWith('/rejected'),
        (state, action) => {
          state.loading = false;
          state.error = action.payload;
        }
      );
  },
});

export const { clearStats } = slice.actions;
export default slice.reducer;