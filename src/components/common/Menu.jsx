import BottariLogo2 from '../logo/BottariLogo2';
import './Menu.css';

export default function Menu() {
  return (
    <>
      <div className="menu-container">
        <BottariLogo2 className='bottari-logo' width={130} height={80} />
        <div className='redirect-menu-container'>
          <p className="redirect-menu">통합 모니터링</p>
          <p className="redirect-menu">예약 관리</p>
          <p className="redirect-menu">기사 관리</p>
          <p className="redirect-menu">직원 관리</p>
          <p className="redirect-menu">공지사항 관리</p>
          <p className="redirect-menu">팝업 관리</p>
          <p className="redirect-menu">1:1 문의</p>
        </div>
      </div>
    </>
  )
}