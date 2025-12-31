import './AnnouncementList.css';

export default function AnnouncementList() { 
  return(
    <>
     <div className="AnnouncementList-container">
      <div className="AnnouncementList">
          <div className="recentlyAnnouncement">
            <h3>최근 공개 내용 A</h3>
            <div className="Announcement-button">
              <div className="editorButton">수정</div>
              <div className="deleteButton">삭제</div>
            </div>
          </div>

          <div className="recentlyAnnouncement">
            <h3>최근 공개 내용 B</h3>
            <div className="Announcement-button">
              <div className="editorButton">수정</div>
              <div className="deleteButton">삭제</div>
            </div>
          </div>

          <div className="recentlyAnnouncement">
            <h3>최근 공개 내용 C</h3>
            <div className="Announcement-button">
              <div className="editorButton">수정</div>
              <div className="deleteButton">삭제</div>
            </div>
          </div>

          <div className="recentlyAnnouncement">
            <h3>최근 공개 내용 D</h3>
            <div className="Announcement-button">
              <div className="editorButton">수정</div>
              <div className="deleteButton">삭제</div>
            </div>
          </div>

          <div className="recentlyAnnouncement">
            <h3>최근 공개 내용 E</h3>
            <div className="Announcement-button">
              <div className="editorButton">수정</div>
              <div className="deleteButton">삭제</div>
            </div>
          </div>

          <div className="recentlyAnnouncement">
            <h3>최근 공개 내용 F</h3>
            <div className="Announcement-button">
              <div className="editorButton">수정</div>
              <div className="deleteButton">삭제</div>
            </div>
          </div>
      </div>
      <hr className='Announcement-hr'/>
     </div>
    </>
  )
}