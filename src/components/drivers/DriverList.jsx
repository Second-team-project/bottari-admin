import { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import './DriverList.css';
import DriverDetail from './DriverDetail';

export default function DriverList() {
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
    <div className='driver-list-page'>
      <div className={`driver-list-container ${selectedRow !== null ? 'with-panel' : ''}`}>
        <h2 className='page-title'>기사 관리</h2>

        {/* 테이블 */}
        <div className='driver-list-table'>
          {/* 테이블 헤더 */}
          <div className='driver-list-header'>
            <div className='driver-list-col-no'>번호</div>
            <div className='driver-list-col-name'>이름</div>
            <div className='driver-list-col-phone'>연락처</div>
            <div className='driver-list-col-car'>차량번호</div>
            <div className='driver-list-col-count'>배송건수</div>
            <div className='driver-list-col-date'>등록일</div>
            <div className='driver-list-col-actions'>관리</div>
          </div>

          {/* 테이블 바디 - 20개 행 */}
          {[...Array(20)].map((_, index) => (
            <div
              key={index}
              className={`driver-list-row ${selectedRow === index ? 'selected' : ''}`}
              onClick={() => handleRowClick(index)}
            >
              <div className='driver-list-col-no'>{index + 1}</div>
              <div className='driver-list-col-name'>김기사</div>
              <div className='driver-list-col-phone'>010-1234-5678</div>
              <div className='driver-list-col-car'>12가 3456</div>
              <div className='driver-list-col-count'>150건</div>
              <div className='driver-list-col-date'>2024.01.01</div>
              <div className='driver-list-col-actions'>
                <button className='btn-edit' onClick={(e) => e.stopPropagation()}>수정</button>
                <button className='btn-delete' onClick={(e) => e.stopPropagation()}>삭제</button>
              </div>
            </div>
          ))}
        </div>

        {/* 페이지네이션 */}
        <div className='driver-list-pagination'>
          <ChevronLeft className='pagination-btn' color="#6B7280" size={22}/>
          <span className='page-number'>1</span>
          <ChevronRight className='pagination-btn' color="#6B7280" size={22} />
        </div>
      </div>

      {/* 사이드 패널 */}
      <DriverDetail selectedRow={selectedRow} onClose={handleClosePanel} />
    </div>
  )
}
