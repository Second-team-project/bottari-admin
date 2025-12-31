import AnnouncementList from "./AnnouncementList";
import AnnouncementStaticstic from "./AnnouncementStaticstic";
import './AnnouncementAdmin.css';

export default function AnnouncementAdmin(){
  return(
    <>
      <div className="AnnouncementAdmin-container">
        <AnnouncementStaticstic />
        <AnnouncementList />
      </div>
    </>
  )
}