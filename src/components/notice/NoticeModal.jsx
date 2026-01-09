import { Upload, X } from 'lucide-react';
import './NoticeModal.css';
import { useRef } from 'react';

export default function NoticeModal({ selectedItem, onClose }) {
  if (!selectedItem) return null;

  const updateNoticeInputRef = useRef();

  const handleNoticeImgUploadClick = () => {
    updateNoticeInputRef.current?.click();
  };

  return (
    <div className='notice-modal-overlay' onClick={onClose}>
      <div className='notice-modal-container' onClick={(e) => e.stopPropagation()}>
        <div className='notice-modal-header'>
          <h3>공지사항 수정</h3>
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
            <label htmlFor='update-notice-title' className='notice-modal-label'>제목</label>
            <input id='update-notice-title' type="text" className='update-notice-title-input' defaultValue={selectedItem.title} />
          </div>
          
          {/* 이미지 */}
          <div className='notice-modal-form-group'>
            <label htmlFor='update-notice-img' className='notice-modal-label'>이미지</label>
            <div className="notice-single-image-upload-area" onClick={handleNoticeImgUploadClick}>
              <div className='notice-modal-value-img'>
                {selectedItem.img ? (
                    <img src={selectedItem.img} alt="현재 이미지" className="notice-single-image-preview" />
                  ) : (
                    <div className="notice-single-image-placeholder">
                      <Upload size={32} />
                      <span>클릭하여 이미지 업로드</span>
                    </div>
                  )}
              </div>
              <input type="file"
                id='update-notice-img'
                ref={updateNoticeInputRef}
                // onChange={}
                accept="image/*"
                style={{ display: 'none' }}
              />
            </div>
          </div>

          {/* 내용 */}
          <div className='notice-modal-form-group'>
            <label htmlFor='update-notice-content' className='notice-modal-label'>내용</label>
            <textarea className='update-notice-content-textarea' id="update-notice-content" defaultValue={selectedItem.content}></textarea>
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
