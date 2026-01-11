import axiosIns from "./axiosInstance.js";

/**
 * 채팅방 목록 조회
 * @param {Object} params - { page, searchType, keyword }
 */
export const getChatRooms = async ({ page, searchType, keyword }) => {
  const url = `/api/chat/rooms`;
  const params = { page, searchType, keyword };

  const response = await axiosIns.get(url, { params });
  console.log('getChatRooms: ', response.data);

  return response.data.data;
};

/**
 * 채팅 메시지 목록 조회
 * @param {number|string} roomId
 */
export const getChatMessages = async (roomId) => {
  const url = `/api/chat/rooms/${roomId}/messages`;
  const response = await axiosIns.get(url);
  console.log('getChatMessages: ', response.data);

  return response.data.data;
};

/**
 * 채팅방 차단/해제
 * @param {number|string} roomId
 * @param {boolean} isBlocked
 */
export const blockChatRoom = async (roomId, isBlocked) => {
  const url = `/api/chat/rooms/${roomId}/block`;
  const response = await axiosIns.patch(url, { isBlocked });
  console.log('blockChatRoom: ', response.data);

  return response.data.data;
};
