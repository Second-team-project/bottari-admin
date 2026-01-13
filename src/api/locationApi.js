import axiosInstance from "../../api/axiosInstance";

export const searchLocation = async({keyword, page}) => {
  const url = '/api/user/search/location';
  const response = await axiosInstance.get(
    '/api/user/search/location', 
    {
      params: { 
        keyword: keyword,
        page: page
      }
    }
  )
  return response.data.data;
}