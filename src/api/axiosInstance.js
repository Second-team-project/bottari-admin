import axios from 'axios';
import dayjs from 'dayjs';
import { jwtDecode } from 'jwt-decode';
import { reissueThunk } from '../store/thunks/authThunk.js';
import { clearAuth } from '../store/slices/authSlice.js';

// TODO: 인증용 로직 추가 필요

// store 저장용 변수
let store = null;

// store 주입용 함수
export function injectStoreInAxios(_store) {
  store = _store;
}

// axios 인스턴스 생성         ↱ axios 인스턴스 생성
const axiosIns = axios.create({
  baseURL: import.meta.env.VITE_APP_URL,  // 기본 URL (axios 호출 시 가장 앞에 자동으로 연결하여 동작)
  headers: {
    'Content-Type': 'application/json',
  },
  // 크로스 도메인    ↱ default : false
  // 서로 다른 도메인에 요청 보낼 때, credential 정보를 담아 보낼지 여부
  // credential 정보 : 1. 쿠키, 2. 헤더 Authorization 항목
  withCredentials: true,
});

axiosIns.interceptors.request.use(async config => { // config: 원래 보내려 했던 request 객체의 option(body X)
  const noRetry = /^\/api\/admin\/auth\/reissue$/; // <= 리트라이 제외 URL 설정
  let { accessToken } = store.getState().auth; // <= state에 접근해서 auth state 획득

  try {
    // 엑세스 토큰 있음 && 리트라이 제외 URL 아님
    if(accessToken && !noRetry.test(config.url)) {
      // 엑세스 토큰 만료 확인
      const claims = jwtDecode(accessToken); // <= 토큰을 json 형태로 디코딩한 뒤 다시 객체로 파싱하는 처리를 jwtDecode로 해결
      const now = dayjs().unix();
      const expTime = dayjs.unix(claims.exp).add(-5, 'minute').unix();
      
      if(now >= expTime) {
        // 만료된 패턴
        const response = await store.dispatch(reissueThunk()).unwrap();
        accessToken = response.data.accessToken;
      }
      config.headers["Authorization"] = `Bearer ${accessToken}`; // <= 여기서 세팅을 안 하면 Thunk마다 세팅을 해줘야 함
    }
  
    return config;
  } catch(error) {
    console.log('토큰 재발급 실패: ', error);
    store.dispatch(clearAuth()); // <-- 무한 요청 끊기
    window.location.href = '/login'; // <-- 로그인 페이지로 쫓아내기
    return Promise.reject(error); // <= Thunk에서 에러쪽으로 빠짐
  }
});

export default axiosIns;