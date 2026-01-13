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
              <Link className="redirect-menu" to="/reservations">예약 관리</Link>
              <Link className="redirect-menu" to="/drivers">기사 관리</Link>
              {/* <Link className="redirect-menu" to="/employees">직원 관리</Link> */}
              <Link className="redirect-menu" to="/users">회원 관리</Link>
              {/* 예약 관리에서 모두 관리할 수 있을 경우 삭제 */}
              {/* <Link className="redirect-menu" to="/bookers">예약자 관리</Link> */}
              <Link className="redirect-menu" to="/notice">공지사항 관리</Link>
              <Link className="redirect-menu" to="/faq">FAQ 관리</Link>
              <Link className="redirect-menu" to="/chat">1:1 상담</Link>
              <Link className="redirect-menu" to="/image">배너 관리</Link>
              <Link className="redirect-menu" to="/pricing">요금 관리</Link>  
              <Link className="redirect-menu" to="/store">보관소 관리</Link>  
              {/* <Link className="redirect-menu" to="/reservation">팝업 관리</Link> */}
            </nav>
          </div>
        )
      }
    </>
  )
}