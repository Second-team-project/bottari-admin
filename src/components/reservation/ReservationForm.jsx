import { ArrowDown, X } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { closePanel, openPanel } from '../../store/slices/reservationSlice.js';
import { reservationStoreThunk, reservationUpdateThunk } from '../../store/thunks/reservationThunk';
import LuggageEditor from './components/LuggageEditor';
import './ReservationDetail.css';
import { PatternFormat } from 'react-number-format';
import dayjs from 'dayjs';

const INITIAL_FORM_DATA = {
  type: '',
  userName: '',
  phone: '',
  email: '',
  address: '',
  startDate: '',
  endDate: '',
  price: 0,
  notes: '',
  state: 'PENDING_PAYMENT',
  items: [],
  driver: '',
  password: '',
};

export default function ReservationForm({ mode }) {
  const dispatch = useDispatch();
  const { selectedReservation } = useSelector((state) => state.reservation);
  
  const isCreate = mode === 'store';
  const isUpdate = mode === 'update';
  
  // 보관일 경우
  const isStorage = !isCreate && selectedReservation?.code?.startsWith('S');

  // 초기 상태 계산
  const getInitialState = () => {
    if (isCreate || !selectedReservation) {
      return { ...INITIAL_FORM_DATA };
    }
    
    // 주소 계산
    let address = '';
    if (isStorage) {
      const storageInfo = selectedReservation?.reservIdStorages?.[0];
      const storeInfo = storageInfo?.storageStore;
      address = storeInfo?.storeName || storeInfo?.addr || '';
    } else {
      const pickup = selectedReservation.startedAddr || '';
      const dropoff = selectedReservation.endedAddr || '';
      if (pickup && dropoff) {
        address = `${pickup} ➡️ ${dropoff}`;
      } else {
        address = pickup || dropoff || '';
      }
    }

    // 기간 계산
    let startDate = '';
    let endDate = '';
    if (isStorage) {
      const storage = selectedReservation.reservIdStorages?.[0];
      startDate = storage?.startedAt || selectedReservation.createdAt;
      endDate = storage?.endedAt || '';
    } else {
      const delivery = selectedReservation.reservIdDeliveries?.[0];
      startDate = delivery?.startedAt || selectedReservation.createdAt;
    }

    // 기사 정보
    const driverName = selectedReservation.reservationsDrivers?.[0]?.driverName || '';

    // 예약자 정보
    const booker = selectedReservation.reservIdBookers?.[0];

    return {
      type: isStorage ? 'STORAGE' : 'DELIVERY',
      userName: selectedReservation.reservationUser?.userName || booker?.userName || '',
      phone: selectedReservation.reservationUser?.phone || booker?.phone || '',
      email: selectedReservation.reservationUser?.email || booker?.email || '',
      address,
      startDate,
      endDate,
      price: selectedReservation.price || 0,
      notes: selectedReservation.notes || '',
      state: selectedReservation.state || 'PENDING_PAYMENT',
      items: selectedReservation.reservIdLuggages || [],
      driver: driverName,
      password: '',
    };
  };

  const [formData, setFormData] = useState(getInitialState);

  // mode나 selectedReservation이 변경되면 폼 데이터 재설정
  useEffect(() => {
    setFormData(getInitialState());
  }, [mode, selectedReservation?.id]);

  // 입력 핸들러
  const handleChange = (e) => {
    const { name, value } = e.target;

    // 시작날짜가 변경된 경우
    if (name === 'startDate_Date') {
      const currentTime = dayjs(formData.startDate).format('HH:mm'); // 기존 시간 보존
      const newDateTime = `${value} ${currentTime}`; // 선택한 날짜 + 기존 시간
      setFormData((prev) => ({ ...prev, startDate: newDateTime }));
    } 
    // 시작시간이 변경된 경우
    else if (name === 'startDate_Time') {
      const currentDate = dayjs(formData.startDate).format('YYYY-MM-DD'); // 기존 날짜 보존
      const newDateTime = `${currentDate} ${value}`; // 기존 날짜 + 선택한 시간
      setFormData((prev) => ({ ...prev, startDate: newDateTime }));
    }
    else if (name === 'endDate_Date') {
      const currentTime = dayjs(formData.endDate).format('HH:mm'); // 기존 시간 보존
      const newDateTime = `${value} ${currentTime}`; // 선택한 날짜 + 기존 시간
      setFormData((prev) => ({ ...prev, endDate: newDateTime }));
    }
    else if (name === 'endDate_Time') {
      const currentDate = dayjs(formData.endDate).format('YYYY-MM-DD'); // 기존 날짜 보존
      const newDateTime = `${currentDate} ${value}`; // 기존 날짜 + 선택한 시간
      setFormData((prev) => ({ ...prev, endDate: newDateTime }));
    }
    // 그 외 일반 입력들
    else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  // 짐 정보 변경 핸들러
  const handleItemsChange = (newItems) => {
    setFormData((prev) => ({ ...prev, items: newItems }));
  };

  // 저장/등록 핸들러
  const handleSubmit = async () => {
    if (isCreate) {
      const payload = {
        type: formData.type,
        price: Number(formData.price),
        notes: formData.notes,
        address: formData.address,
        period: formData.period,
        driver: formData.driver,
        bookerInfo: {
          userName: formData.userName,
          phone: formData.phone,
          email: '',
        },
        items: formData.items,
      };
      await dispatch(reservationStoreThunk(payload));
    } else if (isUpdate) {
      const payload = {
        id: selectedReservation.id,
        data: {
          state: formData.state,
          price: Number(formData.price),
          notes: formData.notes,
          type: formData.type,
          address: formData.address,
          period: formData.period,
          driver: formData.driver,
          bookerInfo: {
            userName: formData.userName,
            phone: formData.phone,
            email: formData.email,
            password: formData.password || undefined,
          },
        },
      };
      await dispatch(reservationUpdateThunk(payload));
    }
  };

  // 취소 핸들러
  const handleCancel = () => {
    if (isUpdate) {
      dispatch(openPanel({ mode: 'show', data: selectedReservation }));
    } else {
      dispatch(closePanel());
    }
  };

  const isRegisteredUser = isUpdate && selectedReservation?.reservationUser;

  return (
    <div className="reservation-detail-panel">
      <div className="reservation-detail-header">
        <h3>{isCreate ? '새 예약 등록' : '예약 수정'}</h3>
        <button className="reservation-detail-close" onClick={() => dispatch(closePanel())}>
          <X size={20} />
        </button>
      </div>

      <div className="reservation-detail-content">
        {/* 예약 번호 (수정 시에만) */}
        {isUpdate && selectedReservation && (
          <div className="reservation-detail-row">
            <span className="reservation-detail-label">번호</span>
            <span className="reservation-detail-value">{selectedReservation.code}</span>
          </div>
        )}

        {/* 구분 */}
        <div className="reservation-detail-row">
          <span className="reservation-detail-label">구분</span>
          <span className="reservation-detail-value">
            <select className="detail-input" name="type" value={formData.type} onChange={handleChange}>
              <option value="STORAGE">보관</option>
              <option value="DELIVERY">운송</option>
            </select>
          </span>
        </div>

        {/* 예약자명 */}
        <div className="reservation-detail-row">
          <span className="reservation-detail-label">예약자명</span>
          <span className="reservation-detail-value">
            <input
              className="detail-input"
              type="text"
              name="userName"
              value={formData.userName}
              onChange={handleChange}
              placeholder="이름 입력"
              readOnly={isRegisteredUser}
            />
          </span>
        </div>

        {/* 연락처 */}
        <div className="reservation-detail-row">
          <span className="reservation-detail-label">연락처</span>
          <span className="reservation-detail-value">
            <PatternFormat
              name="phone"
              className='detail-input'
              value={formData.phone}
              onChange={handleChange}
              format="###-####-####"
              placeholder="연락처 입력"
            />
          </span>
        </div>

        {/* 이메일 */}
        <div className="reservation-detail-row">
          <span className="reservation-detail-label">이메일</span>
          <span className="reservation-detail-value">
            <input
              className="detail-input"
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="이메일 입력"
            />
          </span>
        </div>

        {/* 비회원 비밀번호 변경 (수정 & 비회원일 때만) */}
        {isUpdate && !selectedReservation?.reservationUser && (
          <div className="reservation-detail-row">
            <span className="reservation-detail-label">비밀번호 변경</span>
            <span className="reservation-detail-value">
              <input
                className="detail-input"
                type="text"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="변경 시에만 입력"
              />
            </span>
          </div>
        )}

        {/* 신청 날짜 (수정 시에만) */}
        {isUpdate && (
          <div className="reservation-detail-row">
            <span className="reservation-detail-label">신청날짜</span>
            <span className="reservation-detail-value">{selectedReservation?.createdAt}</span>
          </div>
        )}

        {/* 보관 관련 필드 */}
        {isStorage && (
          <>
            <div className="reservation-detail-row">
              <span className="reservation-detail-label">보관 장소</span>
              <span className="reservation-detail-value">
                <input
                  className="detail-input"
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  placeholder="보관소 이름 또는 주소"
                />
              </span>
            </div>
            <div className="reservation-detail-row">
              <span className="reservation-detail-label">보관 기간</span>
              <div>
                <div>
                  <span className="reservation-edit-detail-value">
                    <input
                      type="date"
                      className="detail-input"
                      name="startDate_Date"
                      value={dayjs(formData.startDate).format('YYYY-MM-DD')}
                      onChange={handleChange}
                      />
                    <input
                      type="time"
                      className="detail-input"
                      name="startDate_Time"
                      value={dayjs(formData.startDate).format('HH:mm')}
                      onChange={handleChange}
                    />
                  </span>
                </div>
                <ArrowDown className='reservation-edit-detail-value-arrow' size={18} color='#6B7280' />
                <div>
                  <span className="reservation-edit-detail-value">
                    <input
                      type="date"
                      className="detail-input"
                      name="endDate_Date"
                      value={dayjs(formData.endDate).format('YYYY-MM-DD')}
                      onChange={handleChange}
                      />
                    <input
                      type="time"
                      className="detail-input"
                      name="endDate_Time"
                      value={dayjs(formData.endDate).format('HH:mm')}
                      onChange={handleChange}
                    />
                  </span>
                </div>
              </div>
            </div>
          </>
        )}

        {/* 배송 관련 필드 */}
        {!isStorage && (
          <>
            <div className="reservation-detail-row">
              <span className="reservation-detail-label">배송 경로</span>
              <span className="reservation-detail-value">
                <input
                  className="detail-input"
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  placeholder="출발지 -> 도착지"
                />
              </span>
            </div>
            <div className="reservation-detail-row">
              <span className="reservation-detail-label">픽업 요청일</span>
              <div>
                <span className="reservation-edit-detail-value">
                  <input
                    type="date"
                    className="detail-input"
                    name="startDate_Date"
                    value={dayjs(formData.startDate).format('YYYY-MM-DD')}
                    onChange={handleChange}
                    />
                  <input
                    type="time"
                    className="detail-input"
                    name="startDate_Time"
                    value={dayjs(formData.startDate).format('HH:mm')}
                    onChange={handleChange}
                  />
                </span>
              </div>
            </div>
          </>
        )}

        {/* 짐 정보 */}
        <div className="reservation-detail-row" style={{ alignItems: 'flex-start' }}>
          <span className="reservation-detail-label">맡긴 짐 정보</span>
          <span className="reservation-detail-value" style={{ width: '100%' }}>
            <LuggageEditor items={formData.items} onChange={handleItemsChange} />
          </span>
        </div>

        {/* 결제 금액 */}
        <div className="reservation-detail-row">
          <span className="reservation-detail-label">결제금액</span>
          <span className="reservation-detail-value">
            <input
              className="detail-input"
              type="number"
              name="price"
              value={formData.price}
              onChange={handleChange}
            />
          </span>
        </div>

        {/* 담당 기사 */}
        {
          !isStorage && (
            <div className="reservation-detail-row">
              <span className="reservation-detail-label">담당기사</span>
              <span className="reservation-detail-value">
                <input
                  className="detail-input"
                  type="text"
                  name="driver"
                  value={formData.driver}
                  onChange={handleChange}
                  placeholder="기사 배정"
                />
              </span>
            </div>
          )
        }

        {/* 요청사항 */}
        <div className="reservation-detail-row" style={{ flexDirection: 'column', gap: '8px' }}>
          <span className="reservation-detail-label">요청사항</span>
          <div className="reservation-detail-value" style={{ width: '100%', maxWidth: '100%' }}>
            <textarea
              className="detail-textarea"
              name="notes"
              rows="3"
              value={formData.notes}
              onChange={handleChange}
            />
          </div>
        </div>

        {/* 처리 현황 (수정 시에만) */}
        {isUpdate && (
          <div className="reservation-detail-row">
            <span className="reservation-detail-label">처리현황</span>
            <span className="reservation-detail-value">
              <select className="detail-input" name="state" value={formData.state} onChange={handleChange}>
                <option value="PENDING_PAYMENT">결제대기</option>
                <option value="RESERVED">예약완료</option>
                <option value="IN_PROGRESS">진행중(이동/보관)</option>
                <option value="COMPLETED">완료</option>
                <option value="CANCELLED">취소됨</option>
              </select>
            </span>
          </div>
        )}
      </div>

      <div className="reservation-detail-actions">
        <button
          className="btn-edit"
          style={{ backgroundColor: '#28a745' }}
          onClick={handleSubmit}
        >
          {isCreate ? '등록 완료' : '변경사항 저장'}
        </button>
        <button className="btn-delete" onClick={handleCancel}>
          취소
        </button>
      </div>
    </div>
  );
}
