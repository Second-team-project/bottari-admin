import { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import './EmployeeList.css';
import EmployeeDetail from './EmployeeDetail';

export default function EmployeeList() {
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
    <div className='employee-list-page'>
      <div className={`employee-list-container ${selectedRow !== null ? 'with-panel' : ''}`}>
        <h2 className='page-title'>직원 관리</h2>

        {/* 테이블 */}
        <div className='employee-list-table'>
          {/* 테이블 헤더 */}
          <div className='employee-list-header'>
            <div className='employee-list-col-no'>번호</div>
            <div className='employee-list-col-name'>이름</div>
            <div className='employee-list-col-id'>아이디</div>
            <div className='employee-list-col-phone'>연락처</div>
            <div className='employee-list-col-date'>등록일</div>
            <div className='employee-list-col-actions'>관리</div>
          </div>

          {/* 테이블 바디 - 20개 행 */}
          {[...Array(20)].map((_, index) => (
            <div
              key={index}
              className={`employee-list-row ${selectedRow === index ? 'selected' : ''}`}
              onClick={() => handleRowClick(index)}
            >
              <div className='employee-list-col-no'>{index + 1}</div>
              <div className='employee-list-col-name'>홍길동</div>
              <div className='employee-list-col-id'>hong123</div>
              <div className='employee-list-col-phone'>010-9876-5432</div>
              <div className='employee-list-col-date'>2024.01.15</div>
              <div className='employee-list-col-actions'>
                <button className='btn-edit' onClick={(e) => e.stopPropagation()}>수정</button>
                <button className='btn-delete' onClick={(e) => e.stopPropagation()}>삭제</button>
              </div>
            </div>
          ))}
        </div>

        {/* 페이지네이션 */}
        <div className='employee-list-pagination'>
          <ChevronLeft className='pagination-btn' color="#6B7280" size={22}/>
          <span className='page-number'>1</span>
          <ChevronRight className='pagination-btn' color="#6B7280" size={22} />
        </div>
      </div>

      {/* 사이드 패널 */}
      <EmployeeDetail selectedRow={selectedRow} onClose={handleClosePanel} />
    </div>
  )
}
