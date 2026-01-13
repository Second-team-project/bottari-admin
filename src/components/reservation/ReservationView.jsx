import { X } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { closePanel, openPanel } from '../../store/slices/reservationSlice.js';
import { reservationDestroyThunk } from '../../store/thunks/reservationThunk';
import LuggageEditor from './components/LuggageEditor';
import './ReservationDetail.css';

export default function ReservationView() {
  const dispatch = useDispatch();
  const { selectedReservation } = useSelector((state) => state.reservation);

  if (!selectedReservation) return null;

  // 주소 계산
  const getAddress = () => {
    if (selectedReservation.type === 'STORAGE') {
      const storageInfo = selectedReservation.reservIdStorages?.[0];
      const storeInfo = storageInfo?.storageStore;
      return storeInfo?.storeName || storeInfo?.addr || '';
    } else {
      const pickup = selectedReservation.startedAddr || '';
      const dropoff = selectedReservation.endedAddr || '';
      if (pickup && dropoff) return `${pickup} ➡️ ${dropoff}`;
      return pickup || dropoff || '';
    }
  };

  // 기간 계산
  const getPeriod = () => {
    let startDate = '';
    let endDate = '';

    if (selectedReservation.type === 'STORAGE') {
      const storage = selectedReservation.reservIdStorages?.[0];
      startDate = storage?.startedAt || selectedReservation.createdAt;
      endDate = storage?.endedAt || '';
    } else {
      const delivery = selectedReservation.reservIdDeliveries?.[0];
      startDate = delivery?.startedAt || selectedReservation.createdAt;
    }

    if (startDate && endDate) {
      return `${startDate.substring(0, 10)} ~ ${endDate.substring(0, 10)}`;
    } else if (startDate) {
      return startDate.substring(0, 10);
    }
    return '-';
  };

  // 기사 정보
  const getDriverName = () => {
    const driver = selectedReservation.reservationsDrivers?.[0];
    return driver?.driverName || '미배정';
  };

  // 예약자 정보
  const booker = selectedReservation.reservIdBookers?.[0];
  const userName = selectedReservation.reservationUser?.userName || booker?.userName || '';
  const phone = selectedReservation.reservationUser?.phone || booker?.phone || '';
  const email = selectedReservation.reservationUser?.email || booker?.email || '';

  // 상태 라벨
  const getStateLabel = (state) => {
    const labels = {
      PENDING_PAYMENT: '결제대기',
      RESERVED: '예약완료',
      IN_PROGRESS: '진행중',
      COMPLETED: '완료',
      CANCELLED: '취소',
    };
    return labels[state] || state;
  };

  // 삭제 핸들러
  const handleDelete = async () => {
    if (window.confirm('정말 삭제하시겠습니까?')) {
      await dispatch(reservationDestroyThunk(selectedReservation.id));
    }
  };

  const isStorage = selectedReservation.type === 'STORAGE';

  return (
    <div className="reservation-detail-panel">
      <div className="reservation-detail-header">
        <h3>예약 상세 정보</h3>
        <button className="reservation-detail-close" onClick={() => dispatch(closePanel())}>
          <X size={20} />
        </button>
      </div>

      <div className="reservation-detail-content">
        {/* 예약 번호 */}
        <div className="reservation-detail-row">
          <span className="reservation-detail-label">번호</span>
          <span className="reservation-detail-value">{selectedReservation.code}</span>
        </div>

        {/* 구분 */}
        <div className="reservation-detail-row">
          <span className="reservation-detail-label">구분</span>
          <span className="reservation-detail-value">
            <span style={{ fontWeight: 'bold' }}>{isStorage ? '보관' : '운송'}</span>
          </span>
        </div>

        {/* 예약자명 */}
        <div className="reservation-detail-row">
          <span className="reservation-detail-label">예약자명</span>
          <span className="reservation-detail-value">{userName}</span>
        </div>

        {/* 연락처 */}
        <div className="reservation-detail-row">
          <span className="reservation-detail-label">연락처</span>
          <span className="reservation-detail-value">{phone}</span>
        </div>

        {/* 이메일 */}
        <div className="reservation-detail-row">
          <span className="reservation-detail-label">이메일</span>
          <span className="reservation-detail-value">{email || '-'}</span>
        </div>

        {/* 신청 날짜 */}
        <div className="reservation-detail-row">
          <span className="reservation-detail-label">신청날짜</span>
          <span className="reservation-detail-value">{selectedReservation.createdAt}</span>
        </div>

        {/* 장소/경로 */}
        <div className="reservation-detail-row">
          <span className="reservation-detail-label">{isStorage ? '보관 장소' : '배송 경로'}</span>
          <span className="reservation-detail-value">{getAddress() || (isStorage ? '보관소 정보 없음' : '경로 정보 없음')}</span>
        </div>

        {/* 기간/픽업일 */}
        <div className="reservation-detail-row">
          <span className="reservation-detail-label">{isStorage ? '보관 기간' : '픽업 요청일'}</span>
          <span className="reservation-detail-value">
            {isStorage ? getPeriod() : getPeriod().split('~')[0]}
          </span>
        </div>

        {/* 짐 정보 */}
        <div className="reservation-detail-row" style={{ alignItems: 'flex-start' }}>
          <span className="reservation-detail-label">맡긴 짐 정보</span>
          <span className="reservation-detail-value" style={{ width: '100%' }}>
            <LuggageEditor items={selectedReservation.reservIdLuggages || []} readOnly />
          </span>
        </div>

        {/* 결제 금액 */}
        <div className="reservation-detail-row">
          <span className="reservation-detail-label">결제금액</span>
          <span className="reservation-detail-value">
            {Number(selectedReservation.price || 0).toLocaleString()}원
          </span>
        </div>

        {/* 담당 기사 */}
        <div className="reservation-detail-row">
          <span className="reservation-detail-label">담당기사</span>
          <span className="reservation-detail-value">{getDriverName()}</span>
        </div>

        {/* 요청사항 */}
        <div className="reservation-detail-row" style={{ flexDirection: 'column', gap: '8px', borderBottom: 'none' }}>
          <span className="reservation-detail-label">요청사항</span>
          <div className="reservation-detail-value" style={{ width: '100%', maxWidth: '100%' }}>
            <p style={{ margin: 0, whiteSpace: 'pre-wrap', textAlign: 'left' }}>
              {selectedReservation.notes || '-'}
            </p>
          </div>
        </div>

        {/* 처리 현황 */}
        <div className="reservation-detail-row">
          <span className="reservation-detail-label">처리현황</span>
          <span className="reservation-detail-value">
            <span className={`status-badge ${selectedReservation.state}`}>
              {getStateLabel(selectedReservation.state)}
            </span>
          </span>
        </div>
      </div>

      <div className="reservation-detail-actions">
        <button
          className="btn-edit"
          onClick={() => dispatch(openPanel({ mode: 'update', data: selectedReservation }))}
        >
          수정
        </button>
        <button className="btn-delete" onClick={handleDelete}>
          삭제
        </button>
      </div>
    </div>
  );
}
