import axiosIns from "./axiosInstance";

/**
 * 기본 요금 가져오기
 */
export const getPricing = async (_) => {
  const url = `/api/admin/pricing`;
  const response = await axiosIns.get(url)
  console.log('getPricing: ', response.data.data)

  return response.data.data;
}


/**
 * 구간별 추가 요금 가져오기
 */
export const getAdditionalPricing = async (_) => {
  const url = `/api/admin/pricing/additional`;

  const response = await axiosIns.get(url)
  console.log('getAdditionalPricing: ', response.data.data)

  return response.data.data;
}


/**
 * 기본 요금 생성
 */
export const createPricing = async (data) => {
  const url = `/api/admin/pricing`;
  const response = await axiosIns.post(url, data)
  console.log('createPricing: ', response.data.data)

  return response.data.data;
}


/**
 * 추가 요금 생성
 */
export const createAdditionalPricing = async (data) => {
  const url = `/api/admin/pricing/additional`;
  const response = await axiosIns.post(url, data)
  console.log('createAdditionalPricing: ', response.data.data)

  return response.data.data;
}


/**
 * 기본 요금 수정
 */
export const updatePricing = async (data) => {
  const url = `/api/admin/pricing/${data.id}`;
  const response = await axiosIns.put(url, data)
  console.log('updatePricing: ', response.data.data)

  return response.data.data;
}

/**
 * 추가 요금 수정
 */
export const updateAdditionalPricing = async (data) => {
  const url = `/api/admin/pricing/additional/${data.id}`;
  const response = await axiosIns.put(url, data)
  console.log('updateAdditionalPricing: ', response.data.data)

  return response.data.data;
}

/**
 * 기본 요금 삭제
 */
export const deletePricing = async (id) => {
  const url = `/api/admin/pricing/${id}`;
  const response = await axiosIns.delete(url)
  console.log('deletePricing: ', response.data.data)

  return response.data.data;
}

/**
 * 추가 요금 삭제
 */
export const deleteAdditionalPricing = async (id) => {
  const url = `/api/admin/pricing/additional/${id}`;
  const response = await axiosIns.delete(url)
  console.log('deleteAdditionalPricing: ', response.data.data)

  return response.data.data;
}