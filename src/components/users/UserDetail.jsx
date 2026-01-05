import { X } from 'lucide-react';
import './UserDetail.css';

export default function UserDetail({ selectedRow, onClose }) {
  if (selectedRow === null) return null;

  return (
    <div className='user-detail-panel'>
      <div className='user-detail-header'>
        <h3>회원 상세</h3>
        <button className='user-detail-close' onClick={onClose}>
          <X size={20} />
        </button>
      </div>

      <div className='user-detail-content'>
        <div className='user-detail-row'>
          <span className='user-detail-label'>번호</span>
          <span className='user-detail-value'>{selectedRow + 1}</span>
        </div>
        <div className='user-detail-row'>
          <span className='user-detail-label'>이름(닉네임)</span>
          <span className='user-detail-value'>김철수</span>
        </div>
        <div className='user-detail-row'>
          <span className='user-detail-label'>이메일</span>
          <span className='user-detail-value'>chulsoo@gmail.com</span>
        </div>
        <div className='user-detail-row'>
          <span className='user-detail-label'>연락처</span>
          <span className='user-detail-value'>010-0000-0000</span>
        </div>
        <div className='user-detail-row'>
          <span className='user-detail-label'>가입일</span>
          <span className='user-detail-value'>2024.01.05</span>
        </div>
        <div className='user-detail-row'>
          <span className='user-detail-label'>회원 상태</span>
          <span className='user-detail-value' style={{ color: 'green', fontWeight: 'bold' }}>정상</span>
        </div>
        
        {/* 관리자 메모 */}
        <div className='user-detail-memo'>
          <span className='user-detail-label'>관리자 메모</span>
          <div className='user-detail-value'>
            특이사항 없음.
          </div>
        </div>
      </div>

      <div className='user-detail-actions'>
        {/* 회원은 수정보다는 '차단'이나 '메모 수정'이 주 기능 */}
        <button className='btn-edit'>메모 수정</button>
        <button className='btn-delete'>회원 차단</button>
      </div>
    </div>
  );
}
