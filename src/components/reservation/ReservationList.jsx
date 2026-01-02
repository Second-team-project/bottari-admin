import { ChevronDown } from 'lucide-react';
import './ReservationList.css';

export default function ReservationList() {
  return(
    <>
      <div className='reservation-list-container'>
        <h2 className='reservation-list-title'>예약 관리</h2>
        {/* 검색창 */}
        <div className='reservation-search-container'>
          <div className='reservation-search-filter'>
            <button>
              전체
              <ChevronDown size={15} />
            </button>
          </div>

          <ul>
            <li>이름</li>
            <li>전화번호</li>
            <li></li>
          </ul>
        </div>

        {/* 리스트 */}
        <div>
          <div className='reservation-list-table-top'>

          </div>
          <div className='reservation-list-table-middle'>
            
          </div>
        </div>
      </div>
    </>
  )
}