import { useState } from 'react';
import { ChevronLeft, ChevronRight, Plus } from 'lucide-react';
import './NoticeList.css';
import NoticeModal from './NoticeModal';

export default function NoticeList() {
  const [selectedItem, setSelectedItem] = useState(null);

  // 공지사항 클릭 시 모달 열기
  function handleRowClick(item) {
    setSelectedItem(item);
  }

  // 모달 닫기
  function handleCloseModal() {
    setSelectedItem(null);
  }

  return(
    <div className='notice-list-page'>
      <div className='notice-list-top'>
        <h2 className='page-title'>공지사항 관리</h2>
        <button className='btn-add-notice'>
          <Plus size={18} />
          공지사항 등록
        </button>
      </div>

      {/* 테이블 */}
      <div className='notice-list-table'>
        {/* 테이블 헤더 */}
        <div className='notice-list-header'>
          <div>번호</div>
          <div>제목</div>
          <div>작성자</div>
          <div>작성일</div>
          <div>관리</div>
        </div>

        {/* 테이블 바디 - 더미 데이터 10개 */}
        {[...Array(10)].map((_, index) => (
          <div
            key={index}
            className='notice-list-row'
            onClick={() => handleRowClick({ id: index + 1 })}
          >
            <div className='notice-list-col-no'>{index + 1}</div>
            <div className='notice-list-col-title'>[안내] 서비스 이용 약관 개정 안내 (2024년 2월 적용)</div>
            <div className='notice-list-col-writer'>관리자</div>
            <div className='notice-list-col-date'>2024.01.05</div>
            <div className='notice-list-col-actions'>
              <button className='btn-edit' onClick={(e) => e.stopPropagation()}>수정</button>
              <button className='btn-delete' onClick={(e) => e.stopPropagation()}>삭제</button>
            </div>
          </div>
        ))}
      </div>

      {/* 페이지네이션 */}
      <div className='notice-list-pagination'>
        <ChevronLeft className='pagination-btn' size={22}/>
        <span className='page-number'>1</span>
        <ChevronRight className='pagination-btn' size={22} />
      </div>

      {/* 중앙 상세 모달 */}
      <NoticeModal selectedItem={selectedItem} onClose={handleCloseModal} />
    </div>
  )
}
