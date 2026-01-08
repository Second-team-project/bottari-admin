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
              <span className='notice-modal-info-value'>{selectedItem.noticeAdmin.adminName}</span>
            </div>
            <div className='notice-modal-info-item'>
              <span className='notice-modal-info-label'>작성일</span>
              <span className='notice-modal-info-value'>{selectedItem.createdAt}</span>
            </div>
            {
              selectedItem.createdAt !== selectedItem.updatedAt && (
                <div className='notice-modal-info-item'>
                  <span className='notice-modal-info-label'>수정일</span>
                  <span className='notice-modal-info-value'>{selectedItem.updatedAt}</span>
                </div>
              )
            }
          </div>

          {/* 제목 */}
          <div className='notice-modal-form-group'>
            <span className='notice-modal-label'>제목</span>
            <div className='notice-modal-value-title'>
              {selectedItem.title}
            </div>
          </div>

          {/* 내용 */}
          <div className='notice-modal-form-group'>
            <span className='notice-modal-label'>내용</span>
            <div className='notice-modal-value-content'>
              {selectedItem.content}
            </div>
            <div className='notice-modal-value-img'>{selectedItem.img !== null}</div>
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
