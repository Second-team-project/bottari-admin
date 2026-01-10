import axiosIns from "../api/axiosInstance.js";

/**
 * 가이드 이미지 가져오기
 */
export const getGuideImg = async () => {
  const url = `/api/admin/guide-img`;
  const response = await axiosIns.get(url);
  console.log('getGuideImg: ', response.data.data);

  return response.data.data;
};

/**
 * 가이드 이미지 생성
 */
export const createGuideImg = async (data) => {
  const url = `/api/admin/guide-img`;
  const response = await axiosIns.post(url, data, {
    headers: { 'Content-Type': 'multipart/form-data' }
  });
  console.log('createGuideImg: ', response.data.data);

  return response.data.data;
};

/**
 * 가이드 이미지 수정 : 이미지 포함 - formData
 */
export const updateGuideImg = async ({ id, formData }) => {
  const url = `/api/admin/guide-img/${id}`;
  const response = await axiosIns.put(url, formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  });
  console.log('updateGuideImg: ', response.data.data);

  return response.data.data;
};

/**
 * 가이드 이미지 수정 : 이미지 미포함 - JSON
 */
export const updateGuideImgOrder = async ({ id, sortOrder }) => {
  const url = `/api/admin/guide-img/${id}`;
  const response = await axiosIns.put(url, { sortOrder });
  console.log('updateGuideImgOrder: ', response.data.data);

  return response.data.data;
};

/**
 * 가이드 이미지 삭제
 */
export const deleteGuideImg = async (id) => {
  const url = `/api/admin/guide-img/${id}`;
  const response = await axiosIns.delete(url);
  console.log('deleteGuideImg: ', response.data.data);

  return response.data.data;
};
