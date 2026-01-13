import { createSlice } from "@reduxjs/toolkit";
import { reservationDestroyThunk, reservationIndexThunk, reservationShowThunk, reservationStoreThunk, reservationUpdateThunk } from "../thunks/reservationThunk";

const initialState = {
  reservations: [], // 예약 목록 데이터
  totalCount: 0,    // 전체 데이터 수(페이지네이션)
  currentPage: 1,
  selectedReservation: null, // 상세보기/수정 시 패널에 띄울 데이터

  loading: false,
  error: null,

  // 사이드 패널 제어
  panel: {
    isOpen: false, // 팝업창 제어
    mode: 'show', // 'show'(상세) | 'store'(등록) | 'update'(수정)
  }
};

const slice = createSlice({
  name: 'reservation',
  initialState,
  reducers: {
    // 패널 열기(어떤 모드로 열 건지, 어떤 데이터를 보여줄 건지)
    openPanel: (state, action) => {
      const { mode } = action.payload; // payload: { mode: 'edit', data: object }
      state.panel.isOpen = true;
      state.panel.mode = mode || 'show';

      state.selectedReservation = null;
    },
    // 패널 닫기(데이터 초기화)
    closePanel: (state) => {
      state.panel.isOpen = false;
      state.panel.mode = 'show';
      state.selectedReservation = null;
    },
    // 에러 초기화
    clearError: (state) => {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // --- 목록 조회 ---
      .addCase(reservationIndexThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.reservations = action.payload.reservations;
        state.totalCount = action.payload.count;
        state.currentPage = action.payload.page;
      })

      // --- 상세 조회 ---
      .addCase(reservationShowThunk.fulfilled, (state, action) => {
        state.selectedReservation = action.payload;
        state.loading = false;
      })

      // --- 등록 성공 ---
      .addCase(reservationStoreThunk.fulfilled, (state) => {
        state.loading = false;
        state.panel.isOpen = false; // 성공하면 패널 닫기
        // 목록 갱신은 컴포넌트에서 useEffect 의존성이나 unwrap().then()으로 처리
      })

      // --- 수정 성공 ---
      .addCase(reservationUpdateThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.panel.isOpen = false; // 성공하면 패널 닫기
        state.selectedReservation = null;
        
        // 목록 데이터도 최신 내용으로 바꿔치기(새로고침 없이 UI 반영)
        const index = state.reservations.findIndex(reservation => reservation.id === action.payload.id);
        if (index !== -1) {
          state.reservations[index] = action.payload;
        }
      })

      // --- 삭제 성공 ---
      .addCase(reservationDestroyThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.panel.isOpen = false;
        // 목록에서 삭제된 건 제거
        state.reservations = state.reservations.filter(reservation => reservation.id !== action.payload);
        state.totalCount -= 1;
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
  clearError
} = slice.actions;
export default slice.reducer;