import { X } from 'lucide-react';
import './NoticeModal.css';

export default function NoticeModal({ selectedItem, onClose }) {
  if (!selectedItem) return null;

  return (
    <div className='notice-modal-overlay' onClick={onClose}>
      <div className='notice-modal-container' onClick={(e) => e.stopPropagation()}>
        <div className='notice-modal-header'>
          <h3>공지사항 상세</h3>
          <button className='notice-modal-close' onClick={onClose}>
            <X size={22} />
          </button>
        </div>

        <div className='notice-modal-content'>
          {/* 상단 정보 (작성자, 작성일) */}
          <div className='notice-modal-info-row'>
            <div className='notice-modal-info-item'>
              <span className='notice-modal-info-label'>작성자</span>
              <span className='notice-modal-info-value'>관리자(Admin)</span>
            </div>
            <div className='notice-modal-info-item'>
              <span className='notice-modal-info-label'>작성일</span>
              <span className='notice-modal-info-value'>2024.01.05</span>
            </div>
          </div>

          {/* 제목 */}
          <div className='notice-modal-form-group'>
            <span className='notice-modal-label'>제목</span>
            <div className='notice-modal-value-title'>
              서비스 이용 약관 개정 안내
            </div>
          </div>

          {/* 내용 */}
          <div className='notice-modal-form-group'>
            <span className='notice-modal-label'>내용</span>
            <div className='notice-modal-value-content'>
              안녕하세요. 보따리 서비스입니다.<br/><br/>
              더 나은 서비스 제공을 위해 이용 약관이 다음과 같이 개정될 예정입니다.<br/>
              주요 개정 내용은 결제 시스템 보안 강화 및 환불 규정 명확화입니다.<br/><br/>
              적용 일자: 2024년 2월 1일<br/>
              감사합니다.
            </div>
          </div>
        </div>

        <div className='notice-modal-footer'>
          <button className='btn-edit'>수정하기</button>
          <button className='btn-delete'>삭제</button>
        </div>
      </div>
    </div>
  );
}
