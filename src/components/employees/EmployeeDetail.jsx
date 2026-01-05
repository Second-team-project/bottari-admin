import { X } from 'lucide-react';
import './EmployeeDetail.css';

export default function EmployeeDetail({ selectedRow, onClose }) {
  if (selectedRow === null) return null;

  return (
    <div className='employee-detail-panel'>
      <div className='employee-detail-header'>
        <h3>직원 상세</h3>
        <button className='employee-detail-close' onClick={onClose}>
          <X size={20} />
        </button>
      </div>

      <div className='employee-detail-content'>
        <div className='employee-detail-row'>
          <span className='employee-detail-label'>번호</span>
          <span className='employee-detail-value'>{selectedRow + 1}</span>
        </div>
        <div className='employee-detail-row'>
          <span className='employee-detail-label'>이름</span>
          <span className='employee-detail-value'>홍길동</span>
        </div>
        <div className='employee-detail-row'>
          <span className='employee-detail-label'>아이디</span>
          <span className='employee-detail-value'>hong123</span>
        </div>
        <div className='employee-detail-row'>
          <span className='employee-detail-label'>연락처</span>
          <span className='employee-detail-value'>010-9876-5432</span>
        </div>
        <div className='employee-detail-row'>
          <span className='employee-detail-label'>이메일</span>
          <span className='employee-detail-value'>hong@bottari.com</span>
        </div>
        <div className='employee-detail-row'>
          <span className='employee-detail-label'>등록일</span>
          <span className='employee-detail-value'>2024.01.15</span>
        </div>
      </div>

      <div className='employee-detail-actions'>
        <button className='btn-edit'>수정</button>
        <button className='btn-delete'>삭제</button>
      </div>
    </div>
  );
}
