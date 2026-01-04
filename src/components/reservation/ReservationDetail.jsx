import { X } from 'lucide-react';
import './ReservationDetail.css';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect, useState } from 'react';
import { reservationDestroyThunk, reservationStoreThunk, reservationUpdateThunk } from '../../store/thunks/reservationThunk';

export default function ReservationDetail({ selectedRow, onClose }) {
  const dispatch = useDispatch();
  const { panel, selectedReservation } = useSelector((state) => state.reservation);
  const { mode } = panel; // 'show' | 'store' | 'update'
  const [formData, setFormData] = useState({
    userName: '',
    phone: '',
    price: 0,
    notes: '',
    state: 'PENDING_PAYMENT',
  });
  if (selectedRow === null) return null;

  // 입력 핸들러
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // 저장/등록 핸들러
  const handleSubmit = async () => {
    if (mode === 'store') {
      const payload = {
        price: Number(formData.price),
        notes: formData.notes,
        type: 'STORAGE',
        bookerInfo: {
          userName: formData.userName,
          phone: formData.phone,
          email: '' 
        },
        items: [] 
      };
      await dispatch(reservationStoreThunk(payload));
    } else if (mode === 'update') {
      const payload = {
        id: selectedReservation.id,
        data: {
          state: formData.state,
          price: Number(formData.price),
          notes: formData.notes,
        }
      };
      await dispatch(reservationUpdateThunk(payload));
    }
  };

  // 삭제 핸들러
  const handleDelete = async () => {
    if (window.confirm('정말 삭제하시겠습니까?')) {
      await dispatch(reservationDestroyThunk(selectedReservation.id));
    }
  };

  // 타이틀 헬퍼
  const getTitle = () => {
    if (mode === 'store') return '새 예약 등록';
    if (mode === 'update') return '예약 수정';
    return '예약 상세';
  };

  // 현재 편집 모드인지 확인(등록 or 수정)
  const isEditMode = mode === 'store' || mode === 'update';

  // 패널 열릴 때 데이터 초기화
  useEffect(() => {
    if (mode === 'store') {
      // 등록 모드: 빈 값
      setFormData({
        userName: '', phone: '', price: 0, notes: '', state: 'PENDING_PAYMENT'
      });
    } else if (selectedReservation) {
      // 상세/수정 모드: 기존 데이터 채우기
      setFormData({
        userName: selectedReservation.reservationUser?.userName || selectedReservation.bookerInfo?.userName || '',
        phone: selectedReservation.reservationUser?.phone || selectedReservation.bookerInfo?.phone || '',
        price: selectedReservation.price || 0,
        notes: selectedReservation.notes || '',
        state: selectedReservation.state || 'PENDING_PAYMENT',
      });
    }
  }, [mode, selectedReservation]);

  return (
    <div className='reservation-detail-panel'>
      <div className='reservation-detail-header'>
        <h3>예약 상세</h3>
        <button className='reservation-detail-close' onClick={() => dispatch(closePanel())}>
          <X size={20} />
        </button>
      </div>

      <div className='reservation-detail-content'>
        {/* 예약 번호(상세/수정 때만 표시) */}
        {mode !== 'store' && selectedReservation && (
        <div className='reservation-detail-row'>
          <span className='reservation-detail-label'>번호</span>
          <span className='reservation-detail-value'>{selectedReservation.code}</span>
        </div>
        )}

        {/* 예약자명 */}
        <div className='reservation-detail-row'>
          <span className='reservation-detail-label'>구분</span>
          <span className='reservation-detail-value'>구분</span>
        </div>
        <div className='reservation-detail-row'>
          <span className='reservation-detail-label'>예약자명</span>
          <span className='reservation-detail-value'>
            {isEditMode ? (
              <input 
                className='detail-input'
                type="text" name="userName" value={formData.userName} onChange={handleChange} 
                placeholder="이름 입력"
                // 수정 모드일 때 기존 회원이면 이름 변경 불가(readOnly) 처리 가능
                readOnly={mode === 'update' && selectedReservation?.reservationUser} 
              />
            ) : (
              formData.userName
            )}
          </span>
        </div>

        {/* 연락처 */}
        <div className='reservation-detail-row'>
          <span className='reservation-detail-label'>연락처</span>
          <span className='reservation-detail-value'>
            {isEditMode ? (
              <input 
                className='detail-input'
                type="text" name="phone" value={formData.phone} onChange={handleChange} 
                placeholder="연락처 입력"
              />
            ) : (
              formData.phone
            )}
          </span>
        </div>
        <div className='reservation-detail-row'>
          <span className='reservation-detail-label'>이메일</span>
          <span className='reservation-detail-value'>이메일</span>
        </div>

        {/* 신청 날짜 (읽기 전용) */}
        {mode !== 'store' && (
          <div className='reservation-detail-row'>
            <span className='reservation-detail-label'>신청날짜</span>
            <span className='reservation-detail-value'>
              {selectedReservation?.createdAt?.substring(0, 10)}
            </span>
          </div>
        )}

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
        {/* 결제 금액 */}
        <div className='reservation-detail-row'>
          <span className='reservation-detail-label'>결제금액</span>
          <span className='reservation-detail-value'>
            {isEditMode ? (
              <input 
                className='detail-input'
                type="number" name="price" value={formData.price} onChange={handleChange} 
              />
            ) : (
              `${Number(formData.price).toLocaleString()}원`
            )}
          </span>
        </div>
        <div className='reservation-detail-row'>
          <span className='reservation-detail-label'>담당기사</span>
          <span className='reservation-detail-value'>담당기사</span>
        </div>

        {/* 처리 현황 */}
        {mode !== 'store' && (
          <div className='reservation-detail-row'>
            <span className='reservation-detail-label'>처리현황</span>
            <span className='reservation-detail-value'>
              {isEditMode ? (
                  <select className='detail-input' name="state" value={formData.state} onChange={handleChange}>
                    <option value="PENDING_PAYMENT">결제대기</option>
                    <option value="RESERVED">예약완료</option>
                    <option value="CANCELLED">취소됨</option>
                  </select>
                ) : (
                  <span className={`status-badge ${formData.state}`}>
                    {formData.state === 'PENDING_PAYMENT' && '결제대기'}
                    {formData.state === 'RESERVED' && '예약완료'}
                    {formData.state === 'CANCELLED' && '취소'}
                  </span>
                )}
            </span>
          </div>
        )}
      </div>

      <div className='reservation-detail-actions'>
        {mode === 'show' ? (
          <>
            <button className='btn-edit' onClick={() => dispatch(openPanel({ mode: 'update', data: selectedReservation }))}>수정</button>
            <button className='btn-delete' onClick={handleDelete}>삭제</button>
          </>
        ) : (
          <>
            {/* 등록 또는 수정 모드일 때 */}
            <button 
              className='btn-edit' 
              style={{backgroundColor: '#28a745'}} // 저장 버튼은 초록색
              onClick={handleSubmit}
            >
              {mode === 'store' ? '등록 완료' : '변경사항 저장'}
            </button>
            <button 
              className='btn-delete' 
              onClick={() => {
                if(mode === 'update') dispatch(openPanel({ mode: 'show', data: selectedReservation }));
                else dispatch(closePanel());
              }}
              >
              취소
            </button>
          </>
        )}
      </div>
    </div>
  );
}
