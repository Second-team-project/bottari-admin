import { useState } from 'react';
import './AnnouncementList.css';
import AnnouncementModal from './AnnouncementModal.jsx';
export default function AnnouncementList() { 
  const [IsOpenModal, setIsOpenModal] = useState(false);

  // 모달 오픈
  function openModal() {
    setIsOpenModal(true);
  }
  
  return(
    <>
      <div className="announcementAdmin-container">
        <h1 className="announcementAdmin-title">공지사항</h1>

        <div className="announcementAdmin-add-section">
          <div className='announcementAdmin-btn' onClick={openModal}>[+]추가</div>
        </div>

        <div className="announcementAdmin-list-section">
          <div className="announcementAdmin-item">
            <h3 className='announcementAdmin-item-title'>최근 공개 내용 A</h3>
            <div className="announcementAdmin-item-btn-box">
              <div className="announcementAdmin-btn" onClick={openModal}>수정</div>
              <div className="announcementAdmin-btn">삭제</div>
            </div>
          </div>
          <div className="announcementAdmin-item">
            <h3 className='announcementAdmin-item-title'>최근 공개 내용 B</h3>
            <div className="announcementAdmin-item-btn-box">
              <div className="announcementAdmin-btn" onClick={openModal}>수정</div>
              <div className="announcementAdmin-btn">삭제</div>
            </div>
          </div>
          <div className="announcementAdmin-item">
            <h3 className='announcementAdmin-item-title'>최근 공개 내용 C</h3>
            <div className="announcementAdmin-item-btn-box">
              <div className="announcementAdmin-btn" onClick={openModal}>수정</div>
              <div className="announcementAdmin-btn">삭제</div>
            </div>
          </div>
          <div className="announcementAdmin-item">
            <h3 className='announcementAdmin-item-title'>최근 공개 내용 D</h3>
            <div className="announcementAdmin-item-btn-box">
              <div className="announcementAdmin-btn" onClick={openModal}>수정</div>
              <div className="announcementAdmin-btn">삭제</div>
            </div>
          </div>
          <div className="announcementAdmin-item">
            <h3 className='announcementAdmin-item-title'>최근 공개 내용 E</h3>
            <div className="announcementAdmin-item-btn-box">
              <div className="announcementAdmin-btn" onClick={openModal}>수정</div>
              <div className="announcementAdmin-btn">삭제</div>
            </div>
          </div>
        </div>

        { IsOpenModal && <AnnouncementModal closeModal={() => setIsOpenModal(false)} /> }
      </div>
    </>
  )
}