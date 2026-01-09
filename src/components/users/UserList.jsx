import { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import './UserList.css';
import UserDetail from './UserDetail';

export default function UserList() {
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
    <div className='user-list-page'>
      <div className={`user-list-container ${selectedRow !== null ? 'with-panel' : ''}`}>
        <h2 className='user-list-title'>회원 관리</h2>

        {/* 테이블 */}
        <div className='user-list-table'>
          {/* 테이블 헤더 */}
          <div className='user-list-header'>
            <div className='user-list-col-no'>번호</div>
            <div className='user-list-col-name'>이름</div>
            <div className='user-list-col-email'>이메일</div>
            <div className='user-list-col-date'>가입일</div>
            <div className='user-list-col-status'>상태</div>
            <div className='user-list-col-actions'>관리</div>
          </div>

          {/* 테이블 바디 - 20개 행 */}
          {[...Array(20)].map((_, index) => (
            <div
              key={index}
              className={`user-list-row ${selectedRow === index ? 'selected' : ''}`}
              onClick={() => handleRowClick(index)}
            >
              <div className='user-list-col-no'>{index + 1}</div>
              <div className='user-list-col-name'>김철수</div>
              <div className='user-list-col-email'>chulsoo{index}@gmail.com</div>
              <div className='user-list-col-date'>2024.01.05</div>
              <div className='user-list-col-status'>
                <span className={index % 5 === 0 ? 'status-blocked' : 'status-active'}>
                  {index % 5 === 0 ? '정지' : '정상'}
                </span>
              </div>
              <div className='user-list-col-actions'>
                <button className='btn-edit' onClick={(e) => e.stopPropagation()}>관리</button>
              </div>
            </div>
          ))}
        </div>

        {/* 페이지네이션 */}
        <div className='user-list-pagination'>
          <ChevronLeft className='pagination-btn' size={22}/>
          <span className='page-number'>1</span>
          <ChevronRight className='pagination-btn' size={22} />
        </div>
      </div>

      {/* 사이드 패널 */}
      <UserDetail selectedRow={selectedRow} onClose={handleClosePanel} />
    </div>
  )
}
