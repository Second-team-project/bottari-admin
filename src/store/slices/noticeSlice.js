import { createSlice } from "@reduxjs/toolkit";
import { noticeCreateThunk, noticeDeleteThunk, noticeIndexThunk } from "../thunks/noticeThunk.js";

const initialState = {
  notices: [],
  page: 0,
  limit: 0,
  count: 0,
  
  loading: false,
  error: null,
};

const slice = createSlice({
  name: 'notice',
  initialState,
  reducers: {
    
  },
  extraReducers: (builder) => {
    builder
      // 목록 조회
      .addCase(noticeIndexThunk.fulfilled, (state, action) => {
        state.loading = false;

        const { notices, page, limit, count } = action.payload.data;

        state.notices = notices;
        state.page = page;
        state.limit = limit;
        state.count = count;
      })
      .addCase(noticeCreateThunk.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(noticeDeleteThunk.fulfilled, (state) => {
        state.loading = false;
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

} = slice.actions;

export default slice.reducer;