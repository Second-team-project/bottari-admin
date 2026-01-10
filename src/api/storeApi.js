import axiosIns from "../api/axiosInstance.js";

/**
 * 보관소 가져오기
 */
export const getStore = async () => {
  const url = `/api/admin/store`;
  const response = await axiosIns.get(url);
  console.log('getStore: ', response.data.data);

  return response.data.data;
};

/**
 * 보관소 생성
 */
export const createStore = async (data) => {
  const url = `/api/admin/store`;
  const response = await axiosIns.post(url, data);
  console.log('createStore: ', response.data.data);

  return response.data.data;
};

/**
 * 보관소 수정
 */
export const updateStore = async (data) => {
  const url = `/api/admin/store/${data.id}`;
  const response = await axiosIns.put(url, data);
  console.log('updateStore: ', response.data.data);

  return response.data.data;
};

/**
 * 보관소 삭제
 */
export const deleteStore = async (id) => {
  const url = `/api/admin/store/${id}`;
  const response = await axiosIns.delete(url);
  console.log('deleteStore: ', response.data.data);

  return response.data.data;
};
