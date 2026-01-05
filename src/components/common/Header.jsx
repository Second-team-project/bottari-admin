import { LogOut } from 'lucide-react';
import './Header.css';
import { useLocation } from 'react-router-dom';

export default function Header() {
  const location = useLocation();

  // nav를 숨기고 싶은 경로들 모음 배열
  const hiddenPatterns = [
    /^\/login$/,
  ]

  // 현재 경로가 hiddenPatterns에 포함되는지 체크
  const hideNav = hiddenPatterns.some(pattern => pattern.test(location.pathname));

  return(
    <>
      {
        !hideNav && (
          <div className='header-container'>
            <LogOut color='#fff' size={21} />
          </div>
        )
      }
    </>
  )
}