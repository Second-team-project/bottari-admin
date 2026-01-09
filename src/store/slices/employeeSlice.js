import { createSlice } from "@reduxjs/toolkit";
import { employeeDestroyThunk, employeeIndexThunk, employeeStoreThunk, employeeUpdateThunk } from "../thunks/employeeThunk.js";

const initialState = {
  employees: [],      // 직원 목록
  totalCount: 0,      // 전체 데이터 수 (페이지네이션용)
  currentPage: 1,     // 현재 페이지
  
  // 패널 상태 관리
  panel: {
    isOpen: false,    // 패널 열림 여부
    mode: 'store',    // 'store'(등록) 또는 'update'(수정)
  },
  
  selectedData: null, // 패널에 띄울 상세 데이터 (수정 시 사용)
  
  loading: false,
  error: null,
};

const slice = createSlice({
  name: 'employee',
  initialState,
  reducers: {
    // 패널 열기
    openPanel: (state, action) => {
      const { mode, data } = action.payload;
      state.panel.isOpen = true;
      state.panel.mode = mode;
      state.selectedData = data || null; // 등록일 땐 null, 수정일 땐 해당 행 데이터
    },
    
    // 패널 닫기
    closePanel: (state) => {
      state.panel.isOpen = false;
      state.panel.mode = 'store';
      state.selectedData = null;
    },

    // 페이지 변경
    setPage: (state, action) => {
      state.currentPage = action.payload;
    }
  },
  extraReducers: (builder) => {
    // 목록 조회
    builder
      .addCase(employeeIndexThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.employees = action.payload.admins;
        state.totalCount = action.payload.count;
      })

    // 등록
      .addCase(employeeStoreThunk.fulfilled, (state) => {
        state.loading = false;
        state.panel.isOpen = false; // 등록 성공 시 패널 닫기
      })

    // 수정
      .addCase(employeeUpdateThunk.fulfilled, (state) => {
        state.loading = false;
        state.panel.isOpen = false; // 수정 성공 시 패널 닫기
      })

    // 삭제
      .addCase(employeeDestroyThunk.fulfilled, (state, action) => {
        // 목록에서 즉시 제거
        state.employees = state.employees.filter((emp) => emp.id !== action.payload);
        state.totalCount -= 1; 
      })
    // 공통 처리
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

export const { openPanel, closePanel, setPage } = slice.actions;
export default slice.reducer;