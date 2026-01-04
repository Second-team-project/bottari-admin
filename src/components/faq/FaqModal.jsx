import { X } from 'lucide-react';
import './FaqModal.css';

export default function FaqModal({ selectedItem, onClose }) {
  if (!selectedItem) return null;

  return (
    <div className='faq-modal-overlay' onClick={onClose}>
      <div className='faq-modal-container' onClick={(e) => e.stopPropagation()}>
        <div className='faq-modal-header'>
          <h3>FAQ 상세</h3>
          <button className='faq-modal-close' onClick={onClose}>
            <X size={22} />
          </button>
        </div>

        <div className='faq-modal-content'>
          {/* 상단 정보 (카테고리, 작성일) */}
          <div className='faq-modal-info-row'>
            <div className='faq-modal-info-item'>
              <span className='faq-modal-info-label'>카테고리</span>
              <span className='faq-category-badge'>예약/결제</span>
            </div>
            <div className='faq-modal-info-item'>
              <span className='faq-modal-info-label'>작성일</span>
              <span className='faq-modal-info-value'>2024.01.05</span>
            </div>
          </div>

          {/* 질문 (Q) */}
          <div className='faq-modal-form-group'>
            <span className='faq-modal-label'>질문 (Question)</span>
            <div className='faq-question-box'>
              Q. 예약을 취소하면 환불은 언제 되나요?
            </div>
          </div>

          {/* 답변 (A) */}
          <div className='faq-modal-form-group'>
            <span className='faq-modal-label'>답변 (Answer)</span>
            <div className='faq-answer-box'>
              취소 시 환불 규정은 다음과 같습니다.<br/><br/>
              1. 이용 3일 전 취소: 100% 환불<br/>
              2. 이용 1일 전 취소: 50% 환불<br/>
              3. 당일 취소: 환불 불가<br/><br/>
              환불 처리는 카드사 영업일 기준 3~5일 소요됩니다.
            </div>
          </div>
        </div>

        <div className='faq-modal-footer'>
          <button className='btn-edit'>수정하기</button>
          <button className='btn-delete'>삭제</button>
        </div>
      </div>
    </div>
  );
}
