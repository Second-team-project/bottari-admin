import { X } from 'lucide-react';
import './DriverDetail.css';

export default function DriverDetail({ selectedRow, onClose }) {
  if (selectedRow === null) return null;

  return (
    <div className='driver-detail-panel'>
      <div className='driver-detail-header'>
        <h3>기사 상세</h3>
        <button className='driver-detail-close' onClick={onClose}>
          <X size={20} />
        </button>
      </div>

      <div className='driver-detail-content'>
        <div className='driver-detail-row'>
          <span className='driver-detail-label'>번호</span>
          <span className='driver-detail-value'>{selectedRow + 1}</span>
        </div>
        <div className='driver-detail-row'>
          <span className='driver-detail-label'>이름</span>
          <span className='driver-detail-value'>김기사</span>
        </div>
        <div className='driver-detail-row'>
          <span className='driver-detail-label'>연락처</span>
          <span className='driver-detail-value'>010-1234-5678</span>
        </div>
        <div className='driver-detail-row'>
          <span className='driver-detail-label'>이메일</span>
          <span className='driver-detail-value'>driver@bottari.com</span>
        </div>
        <div className='driver-detail-row'>
          <span className='driver-detail-label'>차량번호</span>
          <span className='driver-detail-value'>12가 3456</span>
        </div>
        <div className='driver-detail-row'>
          <span className='driver-detail-label'>배송 건수</span>
          <span className='driver-detail-value'>150건</span>
        </div>
        <div className='driver-detail-row'>
          <span className='driver-detail-label'>등록일</span>
          <span className='driver-detail-value'>2024.01.01</span>
        </div>
        
        {/* 특이사항 (메모) */}
        <div className='driver-detail-memo'>
          <span className='driver-detail-label'>특이사항</span>
          <div className='driver-detail-value'>
            서울 강남 지역 전문 기사님.<br/>
            오전 시간대 선호하심.
          </div>
        </div>
      </div>

      <div className='driver-detail-actions'>
        <button className='btn-edit'>수정</button>
        <button className='btn-delete'>삭제</button>
      </div>
    </div>
  );
}
