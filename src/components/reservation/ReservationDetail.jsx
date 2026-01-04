import { X } from 'lucide-react';
import './ReservationDetail.css';

export default function ReservationDetail({ selectedRow, onClose }) {
  if (selectedRow === null) return null;

  return (
    <div className='reservation-detail-panel'>
      <div className='reservation-detail-header'>
        <h3>예약 상세</h3>
        <button className='reservation-detail-close' onClick={onClose}>
          <X size={20} />
        </button>
      </div>

      <div className='reservation-detail-content'>
        <div className='reservation-detail-row'>
          <span className='reservation-detail-label'>번호</span>
          <span className='reservation-detail-value'>{selectedRow + 1}</span>
        </div>
        <div className='reservation-detail-row'>
          <span className='reservation-detail-label'>구분</span>
          <span className='reservation-detail-value'>구분</span>
        </div>
        <div className='reservation-detail-row'>
          <span className='reservation-detail-label'>예약자명</span>
          <span className='reservation-detail-value'>예약자명</span>
        </div>
        <div className='reservation-detail-row'>
          <span className='reservation-detail-label'>연락처</span>
          <span className='reservation-detail-value'>연락처</span>
        </div>
        <div className='reservation-detail-row'>
          <span className='reservation-detail-label'>이메일</span>
          <span className='reservation-detail-value'>이메일</span>
        </div>
        <div className='reservation-detail-row'>
          <span className='reservation-detail-label'>신청날짜</span>
          <span className='reservation-detail-value'>신청날짜</span>
        </div>
        <div className='reservation-detail-row'>
          <span className='reservation-detail-label'>예약기간</span>
          <span className='reservation-detail-value'>예약기간</span>
        </div>
        <div className='reservation-detail-row'>
          <span className='reservation-detail-label'>장소</span>
          <span className='reservation-detail-value'>장소</span>
        </div>
        <div className='reservation-detail-row'>
          <span className='reservation-detail-label'>맡긴 짐 정보</span>
          <span className='reservation-detail-value'>짐 정보</span>
        </div>
        <div className='reservation-detail-row'>
          <span className='reservation-detail-label'>결제금액</span>
          <span className='reservation-detail-value'>결제금액</span>
        </div>
        <div className='reservation-detail-row'>
          <span className='reservation-detail-label'>담당기사</span>
          <span className='reservation-detail-value'>담당기사</span>
        </div>
        <div className='reservation-detail-row'>
          <span className='reservation-detail-label'>처리현황</span>
          <span className='reservation-detail-value'>처리현황</span>
        </div>
      </div>

      <div className='reservation-detail-actions'>
        <button className='btn-edit'>수정</button>
        <button className='btn-delete'>삭제</button>
      </div>
    </div>
  );
}
