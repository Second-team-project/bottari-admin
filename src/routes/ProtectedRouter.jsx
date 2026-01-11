import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux"
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { reissueThunk } from "../store/thunks/authThunk.js";
import { clearAuth } from "../store/slices/authSlice.js";

// 유저 권한
const TYPE = {
  ADMIN: 'ADMIN',
}
const { ADMIN } = TYPE;

// 인증 및 인가가 필요한 라우트만 정의
const AUTH_REQUIRED_ROUTES = [
  { path: /^\/monitoring$/, types: [ADMIN] },
  { path: /^\/reservations$/, types: [ADMIN] },
  { path: /^\/drivers$/, types: [ADMIN] },
  { path: /^\/employees$/, types: [ADMIN] },
  { path: /^\/users$/, types: [ADMIN] },
  { path: /^\/notice$/, types: [ADMIN] },
  { path: /^\/faq$/, types: [ADMIN] },
  { path: /^\/image$/, types: [ADMIN] },
  { path: /^\/pricing$/, types: [ADMIN] },
  { path: /^\/store$/, types: [ADMIN] },
  { path: /^\/chat$/, types: [ADMIN] },
];

// 비로그인만 접근 허용하는 라우트 정의
const GUEST_ONLY_ROUTES = [
  /^\/login$/, 
];

// 유저 인증 및 인가 처리 담당
export default function ProtectedRouter() {
  const { isLoggedIn, admin } = useSelector(state => state.auth);
  const location = useLocation();
  const dispatch = useDispatch();
  const [isAuthChecked, setIsAuthChecked] = useState(false);

  // Access 토큰이 없을 경우, 토큰 재발급 시도(브라우저의 새로고침 같은 메모리 초기화 대응)
  useEffect(() => {
    async function checkAuth() {
      if(!isLoggedIn) {
        try {
          await dispatch(reissueThunk()).unwrap();
        } catch(error) {
          console.error('프로텍트라우터 재발급 실패: ', error);
          dispatch(clearAuth());
        }
      }
      setIsAuthChecked(true);
    }

    checkAuth();
  }, [])

  // ProtectedRouter 재발급 처리 여부 체크
  if(!isAuthChecked) {
    return <></>;
  }

  console.log('현재 로그인 정보:', isLoggedIn, admin);

  // 게스트 라우트 확인
  const isGuestRoute = GUEST_ONLY_ROUTES.some(regx => regx.test(location.pathname));

  if(isGuestRoute) {
    if(isLoggedIn) {
      return <Navigate to="/monitoring" replace />
    }
  } else {
    // 요청에 맞는 권한 규칙 조회 
    // const matchRole = AUTH_REQUIRED_ROUTES.find(item => item.path.test(location.pathname)); // item = path 하나하나
    // -> 관리자 페이지라서 로그인 페이지 외엔 몽땅 권한 체크함

    // 일치하는 규칙이 있을 시 인증 및 권한 체크 
    // if(matchRole) {
    // -> 규칙 상관 없이 몽땅 체크

      // 인증 체크
      if(isLoggedIn) {
        // 권한 체크
        // if(matchRole.types.includes(admin.type)) {
        // auth에 있는 admin의 타입이 위에 선언된 타입인지 체크
        // -> 현재 admin의 타입을 나누지 않을 것이고, DB에서서도 타입을 정의하지 않으니 타입 체크 패스
          return <Outlet />

        // } else {
        //   alert('권한이 부족하여 사용할 수 없습니다.');
        //   dispatch(clearAuth());
        //   return <Navigate to="/login" replace />
        // }
        // -> admin 타입체크 X 이므로 주석처리
      } else {
        alert('로그인이 필요한 서비스입니다.');
        return <Navigate to="/login" replace />
      }
    // }
  }

  return <Outlet />
}