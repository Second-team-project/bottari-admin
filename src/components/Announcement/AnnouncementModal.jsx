import './AnnouncementModal.css';
export default function AnnouncementModal({ closeModal }) {
  return(
    <>
      <div className="announcementModal-container" onClick={closeModal}>
        <div className="announcementModal-main" onClick={e => e.stopPropagation()}>
          <div className="announcementModal-clossingButton" onClick={closeModal}>×</div>
          <div className="announcementModal-header">
            <h3>공지 사항 추가 / 수정</h3>
          </div>
          <hr className='announcementModal-underline'/>
          <div className="announcementModal-title">
            <h3>제목</h3>
            <p>공지 제목을 입력해 주세요</p>
          </div>
          <div className="announcementModal-content">
            <h3>내용</h3>
            <p>공지 내용을 입력해 주세요</p>
          </div>
          <div className="announcementModal-footer">
            <div className="announcementModal-saveButton">저장하기</div>
            <div className="announcementModal-uploadButton">올리기</div>
          </div>
        </div>
      </div>
    </>
  )
}