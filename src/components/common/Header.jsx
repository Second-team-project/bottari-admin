import { LogOut } from 'lucide-react';
import './Header.css';
import { useLocation, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { logoutThunk } from '../../store/thunks/authThunk.js';
import { clearAuth } from '../../store/slices/authSlice.js';

export default function Header() {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // nav를 숨기고 싶은 경로들 모음 배열
  const hiddenPatterns = [
    /^\/login$/,
  ]

  // 현재 경로가 hiddenPatterns에 포함되는지 체크
  const hideNav = hiddenPatterns.some(pattern => pattern.test(location.pathname));

  async function handleLogout() {
    if (!window.confirm('로그아웃 하시겠습니까?')) return;

    try {
      // 백엔드 로그아웃 요청(쿠키 삭제)
      await dispatch(logoutThunk()).unwrap(); 
      
      // 로그인 페이지로 이동
      navigate('/login', { replace: true });
      
    } catch (error) {
      console.error("로그아웃 실패:", error);
      // 백엔드 오류가 나더라도 프론트에서는 로그아웃 처리해야 함
      dispatch(clearAuth()); 
      navigate('/login', { replace: true });
    }
  };

  return(
    <>
      {
        !hideNav && (
          <div className='header-container'>
            <div className='logout-icon-container' onClick={handleLogout} title="로그아웃">
              <LogOut color='#fff' size={21} />
            </div>
          </div>
        )
      }
    </>
  )
}