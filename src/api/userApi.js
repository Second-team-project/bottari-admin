import axiosIns from "./axiosInstance.js";

/**
 * 유저 목록 조회 (페이지네이션, 검색, 필터)
 * @param {Object} params - { page, status, searchType, keyword }
 */
export const getUsers = async ({ page, status, searchType, keyword }) => {
  const url = `/api/admin/users`;
  const params = { page, status, searchType, keyword };

  const response = await axiosIns.get(url, { params });
  console.log('getUsers: ', response.data);

  return response.data.data;
};

/**
 * 유저 상세 조회 (통계 및 최근 예약 포함)
 * @param {number|string} id 
 */
export const getUserDetail = async (id) => {
  const url = `/api/admin/users/${id}`;
  const response = await axiosIns.get(url);
  console.log('getUserDetail: ', response.data);

  return response.data.data;
};

/**
 * 유저 정보 수정 (상태 변경, 관리자 메모)
 * @param {number|string} id 
 * @param {Object} data - { status, adminMemo }
 */
export const updateUser = async (id, data) => {
  const url = `/api/admin/users/${id}`;
  const response = await axiosIns.put(url, data);
  console.log('updateUser: ', response.data);

  return response.data.data;
};

/**
 * 유저 삭제 (Soft Delete)
 * @param {number|string} id 
 */
export const deleteUser = async (id) => {
  const url = `/api/admin/users/${id}`;
  const response = await axiosIns.delete(url);
  console.log('updateUser: ', response.data);

  return response.data.data;
};
