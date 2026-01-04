import { useState } from 'react';
import { ChevronLeft, ChevronRight, Plus } from 'lucide-react';
import './FaqList.css';
import FaqModal from './FaqModal';

export default function FaqList() {
  const [selectedItem, setSelectedItem] = useState(null);

  // 클릭 시 모달 열기
  function handleRowClick(item) {
    setSelectedItem(item);
  }

  // 모달 닫기
  function handleCloseModal() {
    setSelectedItem(null);
  }

  return(
    <div className='faq-list-page'>
      <div className='faq-list-top'>
        <h2 className='page-title'>FAQ 관리</h2>
        <button className='btn-add-faq'>
          <Plus size={18} />
          FAQ 등록
        </button>
      </div>

      {/* 테이블 */}
      <div className='faq-list-table'>
        {/* 테이블 헤더 */}
        <div className='faq-list-header'>
          <div>번호</div>
          <div>카테고리</div>
          <div>질문</div>
          <div>작성일</div>
          <div>관리</div>
        </div>

        {/* 테이블 바디 - 더미 데이터 10개 */}
        {[...Array(10)].map((_, index) => (
          <div
            key={index}
            className='faq-list-row'
            onClick={() => handleRowClick({ id: index + 1 })}
          >
            <div className='faq-list-col-no'>{index + 1}</div>
            <div className='faq-list-col-category'>
              <span>예약/결제</span>
            </div>
            <div className='faq-list-col-question'>예약을 취소하면 환불은 언제 되나요?</div>
            <div className='faq-list-col-date'>2024.01.05</div>
            <div className='faq-list-col-actions'>
              <button className='btn-edit' onClick={(e) => e.stopPropagation()}>수정</button>
              <button className='btn-delete' onClick={(e) => e.stopPropagation()}>삭제</button>
            </div>
          </div>
        ))}
      </div>

      {/* 페이지네이션 */}
      <div className='faq-list-pagination'>
        <ChevronLeft className='pagination-btn' color="#6B7280" size={22}/>
        <span className='page-number'>1</span>
        <ChevronRight className='pagination-btn' color="#6B7280" size={22} />
      </div>

      {/* 중앙 상세 모달 */}
      <FaqModal selectedItem={selectedItem} onClose={handleCloseModal} />
    </div>
  )
}
