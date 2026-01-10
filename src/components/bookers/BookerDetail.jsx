import { X } from 'lucide-react';
import './BookerDetail.css';

export default function BookerDetail({ selectedRow, onClose }) {
  if (selectedRow === null) return null;

  return (
    <div className='booker-detail-panel'>
      <div className='booker-detail-header'>
        <h3>회원 상세</h3>
        <button className='booker-detail-close' onClick={onClose}>
          <X size={20} />
        </button>
      </div>

      <div className='booker-detail-content'>
        <div className='booker-detail-row'>
          <span className='booker-detail-label'>번호</span>
          <span className='booker-detail-value'>{selectedRow + 1}</span>
        </div>
        <div className='booker-detail-row'>
          <span className='booker-detail-label'>예약코드</span>
          <span className='booker-detail-value'>123456</span>
        </div>
        <div className='booker-detail-row'>
          <span className='booker-detail-label'>이름(닉네임)</span>
          <span className='booker-detail-value'>김철수</span>
        </div>
        <div className='booker-detail-row'>
          <span className='booker-detail-label'>이메일</span>
          <span className='booker-detail-value'>chulsoo@gmail.com</span>
        </div>
        <div className='booker-detail-row'>
          <span className='booker-detail-label'>연락처</span>
          <span className='booker-detail-value'>010-0000-0000</span>
        </div>
        <div className='booker-detail-row'>
          <span className='booker-detail-label'>예약일</span>
          <span className='booker-detail-value'>2024.01.05</span>
        </div>
        <div className='booker-detail-row'>
          <span className='booker-detail-label'>예약 상태</span>
          <span className='booker-detail-value' style={{ color: 'green', fontWeight: 'bold' }}>정상</span>
        </div>
        
        {/* 관리자 메모 */}
        <div className='booker-detail-memo'>
          <span className='booker-detail-label'>관리자 메모</span>
          <div className='booker-detail-value'>
            특이사항 없음.
          </div>
        </div>
      </div>

      <div className='booker-detail-actions'>
        {/* 회원은 수정보다는 '차단'이나 '메모 수정'이 주 기능 */}
        <button className='btn-edit'>메모 수정</button>
        <button className='btn-delete'>예약 취소</button>
      </div>
    </div>
  );
}
