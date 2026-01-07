import { createAsyncThunk } from "@reduxjs/toolkit";
import axiosIns from "../../api/axiosInstance.js";

/**
 * 기본 요금 가져오기
 */
export const getPricingThunk = createAsyncThunk(
  'pricing/getPricingThunk',
  async ( _, {rejectWithValue}) => {
    try {
      const url = `/api/admin/pricing`;
      const response = await axiosIns.get(url)
      console.log('pricing-base: ', response.data.data)

      return response.data.data;

    } catch (error) {
      return rejectWithValue(error.response?.data);
    }
  }
)

/**
 * 구간별 추가 요금 가져오기
 */
export const getAdditionalPricingThunk = createAsyncThunk(
  'pricing/getAdditionalPricing',
  async (_, {rejectWithValue}) => {
    try {

      const url = `/api/admin/pricing/additional`;

      const response = await axiosIns.get(url)
      console.log('pricing-additional: ', response.data.data)

      return response.data.data;
      
    } catch (error) {
      return rejectWithValue(error.response?.data);
    }
  }
)

/**
 * 기본 요금 생성
 */
export const createPricingThunk = createAsyncThunk(
  'pricing/createPricingThunk',
  async (data, {rejectWithValue}) => {
    try {
      const url = `/api/admin/pricing`;
      const response = await axiosIns.post(url, data)
      console.log('createPricingThunk: ', response.data.data)

      return response.data.data;

    } catch (error) {
      return rejectWithValue(error.response?.data);
    }
  }
)

/**
 * 추가 요금 생성
 */
export const createAdditionalPricingThunk = createAsyncThunk(
  'pricing/createAdditionalPricingThunk',
  async (data, {rejectWithValue}) => {
    try {
      const url = `/api/admin/pricing/additional`;
      const response = await axiosIns.post(url, data)
      console.log('createAdditionalPricingThunk: ', response.data.data)

      return response.data.data;

    } catch (error) {
      return rejectWithValue(error.response?.data);
    }
  }
)

/**
 * 기본 요금 수정
 */
export const updatePricingThunk = createAsyncThunk(
  'pricing/updatePricingThunk',
  async (data, {rejectWithValue}) => {
    try {
      const url = `/api/admin/pricing/${data.id}`;
      const response = await axiosIns.put(url, data)
      console.log('updatePricingThunk: ', response.data.data)

      return response.data.data;

    } catch (error) {
      return rejectWithValue(error.response?.data);
    }
  }
)

/**
 * 추가 요금 수정
 */
export const updateAdditionalPricingThunk = createAsyncThunk(
  'pricing/updateAdditionalPricingThunk',
  async (data, {rejectWithValue}) => {
    try {
      const url = `/api/admin/pricing/additional/${data.id}`;
      const response = await axiosIns.put(url, data)
      console.log('updateAdditionalPricingThunk: ', response.data.data)

      return response.data.data;

    } catch (error) {
      return rejectWithValue(error.response?.data);
    }
  }
)

/**
 * 기본 요금 삭제
 */
export const deletePricingThunk = createAsyncThunk(
  'pricing/deletePricingThunk',
  async (id, {rejectWithValue}) => {
    try {
      const url = `/api/admin/pricing/${id}`;
      const response = await axiosIns.delete(url)
      console.log('deletePricingThunk: ', response.data.data)

      return response.data.data;

    } catch (error) {
      return rejectWithValue(error.response?.data);
    }
  }
)

/**
 * 추가 요금 삭제
 */
export const deleteAdditionalPricingThunk = createAsyncThunk(
  'pricing/deleteAdditionalPricingThunk',
  async (id, {rejectWithValue}) => {
    try {
      const url = `/api/admin/pricing/additional/${id}`;
      const response = await axiosIns.delete(url)
      console.log('deleteAdditionalPricingThunk: ', response.data.data)

      return response.data.data;

    } catch (error) {
      return rejectWithValue(error.response?.data);
    }
  }
)