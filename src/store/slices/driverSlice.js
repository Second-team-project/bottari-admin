import { createSlice } from "@reduxjs/toolkit";
import { driverDestroyThunk, driverIndexAllThunk, driverIndexThunk, driverShowThunk, driverStoreThunk, driverUpdateThunk } from "../thunks/driverThunk.js";

const initialState = {
  drivers: [],      // 목록 데이터
  totalCount: 0,    // 전체 데이터 수
  currentPage: 1,   // 현재 페이지
  
  // 패널 상태 관리
  panel: {
    isOpen: false,
    mode: 'store', // 'show' | 'store' | 'update'
  },
  selectedData: null, // 상세 패널에 표시할 데이터
  
  loading: false,
  error: null,
};

const slice = createSlice({
  name: 'driver',
  initialState,
  reducers: {
    // 패널 열기(모드와 데이터 설정)
    openPanel: (state, action) => {
      const { mode, data } = action.payload;
      state.panel.isOpen = true;
      state.panel.mode = mode;
      state.selectedData = data || null; // store 모드일 땐 null
    },
    // 패널 닫기
    closePanel: (state) => {
      state.panel.isOpen = false;
      state.selectedData = null;
    },
    // 페이지 변경
    setPage: (state, action) => {
        state.currentPage = action.payload;
    },
    // 에러 초기화
    clearError: (state) => {
        state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // 목록 조회
      .addCase(driverIndexThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.drivers = action.payload.drivers;
        state.totalCount = action.payload.count;
      })
      
      /* 상세 조회 */
      .addCase(driverShowThunk.fulfilled, (state, action) => {
        state.selectedData = action.payload;
      })

      /* 등록 */
      .addCase(driverStoreThunk.fulfilled, (state) => {
        state.loading = false;
        // 등록 후 목록 갱신은 컴포넌트에서 dispatch(fetchDrivers())를 호출하거나,
        // 여기서 drivers 배열에 unshift로 추가할 수도 있음.
      })

      /* 수정 */
      .addCase(driverUpdateThunk.fulfilled, (state, action) => {
        state.loading = false;
        // 목록에 있는 데이터도 최신화 (선택 사항)
        const index = state.drivers.findIndex(d => d.id === action.payload.id);
        if (index !== -1) {
          state.drivers[index] = action.payload;
        }
        // 현재 보고 있는 상세 데이터도 최신화
        state.selectedData = action.payload;
      })

      /* 삭제 */
      .addCase(driverDestroyThunk.fulfilled, (state, action) => {
        state.loading = false;
        // 목록에서 즉시 제거
        state.drivers = state.drivers.filter(driver => driver.id !== action.payload);
      })

      /* 기사 리스트 리미트 X */
      .addCase(driverIndexAllThunk.fulfilled, (state, action) => {
        state.loading = false;
        
        state.drivers = action.payload.drivers;
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

export const {
  openPanel,
  closePanel,
  setPage,
  clearError,
} = slice.actions;
export default slice.reducer;