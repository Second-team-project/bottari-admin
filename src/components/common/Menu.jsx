import BottariLogo2 from '../logo/BottariLogo2';
import './Menu.css';

export default function Menu() {
  return (
    <>
      <div className="menu-container">
        <BottariLogo2 />
        <div className="menu-redirect-div">통합 모니터링</div>
        <div className="menu-redirect-div">예약 관리</div>
        <div className="menu-redirect-div">기사 관리</div>
        <div className="menu-redirect-div">직원 관리</div>
        <div className="menu-redirect-div">공지사항 관리</div>
        <div className="menu-redirect-div">팝업 관리</div>
        <div className="menu-redirect-div">1:1 문의</div>
      </div>
    </>
  )
}