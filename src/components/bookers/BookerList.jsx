import './BookerList.css';
import { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import BookerDetail from './BookerDetail';

export default function BookerList() {
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
    <div className='booker-list-page'>
      <div className={`booker-list-container ${selectedRow !== null ? 'with-panel' : ''}`}>
        <h2 className='booker-list-title'>예약자 관리</h2>

        {/* 테이블 */}
        <div className='booker-list-table'>
          {/* 테이블 헤더 */}
          <div className='booker-list-header'>
            <div className='booker-list-col-no'>번호</div>
            <div className='booker-list-col-code'>예약코드</div>
            <div className='booker-list-col-name'>이름</div>
            <div className='booker-list-col-email'>이메일</div>
            <div className='booker-list-col-phone'>연락처</div>
            <div className='booker-list-col-status'>상태</div>
            <div className='booker-list-col-actions'>관리</div>
          </div>

          {/* 테이블 바디 - 20개 행 */}
          {[...Array(20)].map((_, index) => (
            <div
              key={index}
              className={`booker-list-row ${selectedRow === index ? 'selected' : ''}`}
              onClick={() => handleRowClick(index)}
            >
              <div className='booker-list-col-no'>{index + 1}</div>
              <div className='booker-list-col-code'>예약코드</div>
              <div className='booker-list-col-name'>김철수</div>
              <div className='booker-list-col-email'>chulsoo{index}@gmail.com</div>
              <div className='booker-list-col-phone'>010-0000-0000</div>
              <div className='booker-list-col-status'>
                <span className={index % 5 === 0 ? 'status-blocked' : 'status-active'}>
                  {index % 5 === 0 ? '정지' : '정상'}
                </span>
              </div>
              <div className='booker-list-col-actions'>
                <button className='btn-edit' onClick={(e) => e.stopPropagation()}>관리</button>
              </div>
            </div>
          ))}
        </div>

        {/* 페이지네이션 */}
        <div className='booker-list-pagination'>
          <ChevronLeft className='pagination-btn' color="#6B7280" size={22}/>
          <span className='page-number'>1</span>
          <ChevronRight className='pagination-btn' color="#6B7280" size={22} />
        </div>
      </div>

      {/* 사이드 패널 */}
      <BookerDetail selectedRow={selectedRow} onClose={handleClosePanel} />
    </div>
  )
}
