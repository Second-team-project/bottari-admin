import { X } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { closePanel, openPanel } from '../../store/slices/driverSlice.js';
import dayjs from 'dayjs';

import './DriverDetail.css';

export default function DriverView() {
  const dispatch = useDispatch();
  const { selectedData } = useSelector((state) => state.driver);

  if (!selectedData) return null;

  return (
    <div className="driver-detail-panel">
      {/* 헤더 */}
      <div className="driver-detail-header">
        <h3 className="detail-title">기사 상세 정보</h3>
        <button className="btn-close" onClick={() => dispatch(closePanel())}>
          <X size={24} />
        </button>
      </div>

      <div className="driver-detail-content">
        {/* 아이디 */}
        <div className="driver-detail-row">
          <span className="driver-detail-label">아이디</span>
          <span className="driver-detail-text">{selectedData.accountId}</span>
        </div>

        {/* 이름 */}
        <div className="driver-detail-row">
          <span className="driver-detail-label">이름</span>
          <span className="driver-detail-text">{selectedData.driverName}</span>
        </div>

        {/* 연락처 */}
        <div className="driver-detail-row">
          <span className="driver-detail-label">연락처</span>
          <span className="driver-detail-text">{selectedData.phone}</span>
        </div>

        {/* 이메일 */}
        <div className="driver-detail-row">
          <span className="driver-detail-label">이메일</span>
          <span className="driver-detail-text">{selectedData.email || '-'}</span>
        </div>

        {/* 차량번호 */}
        <div className="driver-detail-row">
          <span className="driver-detail-label">차량번호</span>
          <span className="driver-detail-text">{selectedData.carNumber || '-'}</span>
        </div>

        {/* 배송 건수 */}
        <div className="driver-detail-row">
          <span className="driver-detail-label">배송 건수</span>
          <span className="driver-detail-text">{selectedData.deliveryCount || 0}건</span>
        </div>

        {/* 등록일 */}
        <div className="driver-detail-row">
          <span className="driver-detail-label">등록일</span>
          <span className="driver-detail-text">
            {selectedData.createdAt ? dayjs(selectedData.createdAt).format('YYYY-MM-DD HH:mm:ss') : '-'}
          </span>
        </div>

        {/* 특이사항(메모) */}
        <div className="driver-detail-notes">
          <span className="driver-detail-label">특이사항</span>
          <div className="driver-detail-text" style={{ whiteSpace: 'pre-wrap' }}>
            {selectedData.notes || '-'}
          </div>
        </div>
      </div>
    </div>
  );
}