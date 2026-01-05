import { useState } from 'react';
import { ChevronDown, ChevronLeft, ChevronRight, X } from 'lucide-react';
import './ReservationList.css';
import ReservationDetail from './ReservationDetail';

export default function ReservationList() {
  const [selectedRow, setSelectedRow] = useState(null);

  // 행 클릭 시 사이드 패널 열기
  function handleRowClick(rowIndex) {
    setSelectedRow(rowIndex);
  }

  // 사이드 패널 닫기
  function handleClosePanel() {
    setSelectedRow(null);
  }

  return(
    <div className='reservation-list-page'>
      <div className={`reservation-list-container ${selectedRow !== null ? 'with-panel' : ''}`}>
        <h2 className='page-title'>예약 관리</h2>

        {/* 테이블 */}
        <div className='reservation-list-table'>
          {/* 테이블 헤더 */}
          <div className='reservation-list-header'>
            <div className='reservation-list-col-no'>번호</div>
            <div className='reservation-list-col-type'>구분</div>
            <div className='reservation-list-col-name'>예약자명</div>
            <div className='reservation-list-col-phone'>연락처</div>
            <div className='reservation-list-col-date'>신청날짜</div>
            <div className='reservation-list-col-status'>처리현황</div>
            <div className='reservation-list-col-actions'>관리</div>
          </div>

          {/* 테이블 바디 - 20개 행 */}
          {[...Array(20)].map((_, index) => (
            <div
              key={index}
              className={`reservation-list-row ${selectedRow === index ? 'selected' : ''}`}
              onClick={() => handleRowClick(index)}
            >
              <div className='reservation-list-col-no'>{index + 1}</div>
              <div className='reservation-list-col-type'>구분</div>
              <div className='reservation-list-col-name'>예약자명</div>
              <div className='reservation-list-col-phone'>연락처</div>
              <div className='reservation-list-col-date'>신청날짜</div>
              <div className='reservation-list-col-status'>처리현황</div>
              <div className='reservation-list-col-actions'>
                <button className='btn-edit' onClick={(e) => e.stopPropagation()}>수정</button>
                <button className='btn-delete' onClick={(e) => e.stopPropagation()}>삭제</button>
              </div>
            </div>
          ))}
        </div>

        {/* 페이지네이션 */}
        <div className='reservation-list-pagination'>
          <ChevronLeft className='pagination-btn' color="#6B7280" size={22}/>
          <span className='page-number'>1</span>
          <ChevronRight className='pagination-btn' color="#6B7280" size={22} />
        </div>
      </div>

      {/* 사이드 패널 */}
      <ReservationDetail selectedRow={selectedRow} onClose={handleClosePanel} />
    </div>
  )
}