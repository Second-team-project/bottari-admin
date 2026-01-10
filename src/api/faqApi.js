import axiosIns from "../api/axiosInstance.js";

/**
 * FAQ 가져오기
 */
export const getFAQ = async ({ page = 1, category }) => {
  const url = `/api/admin/faq`;
  const params = { page, category };
  const response = await axiosIns.get(url, { params });
  console.log('getFAQ: ', response.data.data);

  return response.data.data;
};

/**
 * FAQ 생성
 */
export const createFAQ = async (data) => {
  const url = `/api/admin/faq`;
  const response = await axiosIns.post(url, data, {
    headers: { 'Content-Type': 'multipart/form-data' }
  });
  console.log('createFAQ: ', response.data.data);

  return response.data.data;
};

/**
 * FAQ 수정
 */
export const updateFAQ = async ({ id, formData }) => {
  const url = `/api/admin/faq/${id}`;
  const response = await axiosIns.put(url, formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  });
  console.log('updateFAQ: ', response.data.data);

  return response.data.data;
};

/**
 * FAQ 삭제
 */
export const deleteFAQ = async (id) => {
  const url = `/api/admin/faq/${id}`;
  const response = await axiosIns.delete(url);
  console.log('deleteFAQ: ', response.data.data);

  return response.data.data;
};
