import { Link, useLocation } from 'react-router-dom';
import BottariLogo2 from '../logo/BottariLogo2';
import './Menu.css';

export default function Menu() {
  const location = useLocation();

  // nav를 숨기고 싶은 경로들 모음 배열
  const hiddenPatterns = [
    /^\/login$/,
  ]

  // 현재 경로가 hiddenLinkatterns에 포함되는지 체크
  const hideNav = hiddenPatterns.some(pattern => pattern.test(location.pathname));

  return (
    <>
      {
        !hideNav && (
          <div className="menu-container">
            <BottariLogo2 className='bottari-logo' width={130} height={80} />
            <nav className='redirect-menu-container'>
              <Link className="redirect-menu" to="/monitoring">통합 모니터링</Link>
              <Link className="redirect-menu" to="/ReservationList">예약 관리</Link>
              <Link className="redirect-menu">기사 관리</Link>
              <Link className="redirect-menu">직원 관리</Link>
              <Link className="redirect-menu">공지사항 관리</Link>
              <Link className="redirect-menu">팝업 관리</Link>
              <Link className="redirect-menu">요금 관리</Link>  
              <Link className="redirect-menu">FAQ 관리</Link>
            </nav>
          </div>
        )
      }
    </>
  )
}