import './AnnouncementStaticstic.css';

export default function AnnouncementStaticstic() {
  return(
    <>
      <div className="AnnouncementStaticstic-container">
        <h1 className="AnnouncementStaticstic-title">공지사항</h1>
          <div className="AnnouncementStaticstic-block">
            <hr className='AnnouncementStaticstic-hr'/>
              <div className="AnnouncementStaticstic-wrap">
                <div className='AnnouncementStaticstic-add'>[+]추가</div>
              </div>
            <hr className='AnnouncementStaticstic-hr'/>
          </div>
        </div>
    </>
  )
}