import { X } from 'lucide-react';
import './ReservationDetail.css';
import { useDispatch, useSelector } from 'react-redux';
import { useState } from 'react';
import { reservationDestroyThunk, reservationStoreThunk, reservationUpdateThunk } from '../../store/thunks/reservationThunk';
import { closePanel, openPanel } from '../../store/slices/reservationSlice.js';

export default function ReservationDetail() {
  const dispatch = useDispatch();
  const { panel, selectedReservation } = useSelector((state) => state.reservation);
  const { mode } = panel; // 'show' | 'store' | 'update'
  
  const getInitialState = () => {
    if(mode === 'store') {
      // 등록 모드일 때 초기화
      return {
        type: 'STORAGE', userName: '', phone: '', email: '', address: '',
        period: '', price: 0, notes: '', state: 'PENDING_PAYMENT', items: [], driver: ''
      };
    } else if(selectedReservation) {
      // 상세/수정 모드일 때 선택된 데이터 반환
      // 주소 로직: 보관소 이름 또는 배송 경로 조합
      let address = '';
      if (selectedReservation.type === 'STORAGE') {
        // 보관: Store 정보가 있으면 이름, 없으면 주소
        address = selectedReservation.store?.name || selectedReservation.store?.address || '';
      } else {
        // 운송: 출발지 -> 도착지
        const pickup = selectedReservation.pickupAddress || '';
        const dropoff = selectedReservation.dropoffAddress || '';
        if(pickup && dropoff) {
          return address = `${pickup} ➡️ ${dropoff}`;
        }
          
        else address = pickup || dropoff || '';
      }

      // 기간 로직
      const startDate = selectedReservation.startDate || ''; 
      const endDate = selectedReservation.endDate || '';
      
      let period = '';
      if (startDate && endDate) {
        period = `${startDate.substring(0, 10)} ~ ${endDate.substring(0, 10)}`;
      } else if (startDate) {
        period = startDate.substring(0, 10);
      }
      return {
        type: selectedReservation.type || 'STORAGE',
        // 예약자 정보(회원 or 비회원)
        userName: selectedReservation.reservationUser?.userName || selectedReservation.bookerInfo?.userName || '',
        phone: selectedReservation.reservationUser?.phone || selectedReservation.bookerInfo?.phone || '',
        email: selectedReservation.reservationUser?.email || selectedReservation.bookerInfo?.email || '',
        
        // 위에서 계산한 값 적용
        address: address,
        period: period,
        
        // 나머지 필드
        price: selectedReservation.price || 0,
        notes: selectedReservation.notes || '', // 요청사항
        state: selectedReservation.state || 'PENDING_PAYMENT',
        items: selectedReservation.reservIdLuggages || [], // 짐 정보
        driver: selectedReservation.driver?.name || '', // 담당 기사 이름
      };
    }
    // 기본값
    return {
      type: 'STORAGE', userName: '', phone: '', email: '', address: '',
      period: '', price: 0, notes: '', state: 'PENDING_PAYMENT', items: [], driver: ''
    };
  };

  const [formData, setFormData] = useState(getInitialState());

  // 입력 핸들러
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // 저장/등록 핸들러
  const handleSubmit = async () => {
    if(mode === 'store') {
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
          email: '' 
        },
        items: [] // 짐 등록 로직은 별도 UI 필요 (일단 빈 배열)
      };
      await dispatch(reservationStoreThunk(payload));
    } else if(mode === 'update') {
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
            email: formData.email
          }
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

  // -------------짐 정보 수정 핸들러---------------
  // 짐 항목 내용 변경 (Type, Size, Count)
  const handleItemChange = (index, field, value) => {
    const newItems = [...formData.items];
    newItems[index] = { ...newItems[index], [field]: value };
    setFormData((prev) => ({ ...prev, items: newItems }));
  };

  // 짐 항목 추가(빈 줄 생성)
  const handleAddItem = () => {
    setFormData((prev) => ({
      ...prev,
      items: [...prev.items, { itemType: 'BAG', itemSize: 'S', count: 1 }] // 기본값
    }));
  };

  // 짐 항목 삭제
  const handleRemoveItem = (index) => {
    const newItems = formData.items.filter((_, i) => i !== index);
    setFormData((prev) => ({ ...prev, items: newItems }));
  };
  // ----------------------------------------------

  // 타이틀 헬퍼
  const getTitle = () => {
    if (mode === 'store') return '새 예약 등록';
    if (mode === 'update') return '예약 수정';
    return '예약 상세';
  };

  // 현재 편집 모드인지 확인(등록 or 수정)
  const isEditMode = mode === 'store' || mode === 'update';


  return (
    <div className='reservation-detail-panel'>
      <div className='reservation-detail-header'>
        <h3>{getTitle()}</h3>
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

        {/* 구분(Type) */}
        <div className='reservation-detail-row'>
          <span className='reservation-detail-label'>구분</span>
          <span className='reservation-detail-value'>
            {isEditMode ? (
              <select className='detail-input' name="type" value={formData.type} onChange={handleChange}>
                <option value="STORAGE">보관</option>
                <option value="DELIVERY">운송</option>
              </select>
            ) : (
              <span style={{fontWeight:'bold'}}>{formData.type === 'STORAGE' ? '보관' : '운송'}</span>
            )}
          </span>
        </div>

        {/* 예약자명 */}
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

        {/* 이메일 */}
        <div className='reservation-detail-row'>
          <span className='reservation-detail-label'>이메일</span>
          <span className='reservation-detail-value'>
            {isEditMode ? (
              <input className='detail-input' type="email" name="email" value={formData.email} onChange={handleChange} placeholder="이메일 입력" />
            ) : formData.email || '-'}
          </span>
        </div>

        {/* 신청 날짜(읽기 전용) */}
        {mode !== 'store' && (
          <div className='reservation-detail-row'>
            <span className='reservation-detail-label'>신청날짜</span>
            <span className='reservation-detail-value'>
              {selectedReservation?.createdAt?.substring(0, 10)}
            </span>
          </div>
        )}

        {/* 장소 및 기간 */}
        {/* 보관(STORAGE)일 때 */}
        {formData.type === 'STORAGE' && (
          <>
            <div className='reservation-detail-row'>
              <span className='reservation-detail-label'>보관 장소</span>
              <span className='reservation-detail-value'>
                {isEditMode ? (
                  <input 
                    className='detail-input' 
                    type="text" 
                    name="address" 
                    value={formData.address} 
                    onChange={handleChange} 
                    placeholder="보관소 이름 또는 주소" 
                  />
                ) : (
                  formData.address || '보관소 정보 없음'
                )}
              </span>
            </div>
            <div className='reservation-detail-row'>
              <span className='reservation-detail-label'>보관 기간</span>
              <span className='reservation-detail-value'>
                {isEditMode ? (
                  <input 
                    className='detail-input' 
                    type="text" 
                    name="period" 
                    value={formData.period} 
                    onChange={handleChange} 
                    placeholder="YYYY-MM-DD ~ YYYY-MM-DD" 
                  />
                ) : (
                  formData.period || '-'
                )}
              </span>
            </div>
          </>
        )}

        {/* 배송(DELIVERY)일 때 */}
        {formData.type === 'DELIVERY' && (
          <>
            <div className='reservation-detail-row'>
              <span className='reservation-detail-label'>배송 경로</span>
              <span className='reservation-detail-value'>
                {isEditMode ? (
                  <input 
                    className='detail-input' 
                    type="text" 
                    name="address" 
                    value={formData.address} 
                    onChange={handleChange} 
                    placeholder="출발지 -> 도착지" 
                  />
                ) : (
                  formData.address || '경로 정보 없음'
                )}
              </span>
            </div>
            <div className='reservation-detail-row'>
              <span className='reservation-detail-label'>픽업 요청일</span>
              <span className='reservation-detail-value'>
                {isEditMode ? (
                  <input 
                    className='detail-input' 
                    type="text" 
                    name="period" 
                    value={formData.period} 
                    onChange={handleChange} 
                    placeholder="YYYY-MM-DD" 
                  />
                ) : (
                  formData.period ? formData.period.split('~')[0] : '-'
                )}
              </span>
            </div>
          </>
        )}

        {/* 짐 정보 */}
        <div className='reservation-detail-row' style={{alignItems: 'flex-start'}}>
          <span className='reservation-detail-label'>맡긴 짐 정보</span>
          <span className='reservation-detail-value' style={{width: '100%'}}>
            
            {/* [수정] 입력 가능 */}
            {isEditMode ? (
              <div className='luggage-edit-container'>
                {formData.items.map((item, idx) => (
                  <div key={idx} className='luggage-edit-row'>
                    {/* 짐 종류 */}
                    <select 
                      className='detail-input sm'
                      value={item.itemType} 
                      onChange={(e) => handleItemChange(idx, 'itemType', e.target.value)}
                    >
                      <option value="BAG">가방</option>
                      <option value="CARRIER">캐리어</option>
                      <option value="ETC">기타</option>
                    </select>

                    {/* 짐 크기 */}
                    <select 
                      className='detail-input sm'
                      value={item.itemSize} 
                      onChange={(e) => handleItemChange(idx, 'itemSize', e.target.value)}
                    >
                      <option value="S">S</option>
                      <option value="M">M</option>
                      <option value="L">L</option>
                      <option value="XL">XL</option>
                    </select>

                    {/* 수량 */}
                    <input 
                      type="number" 
                      className='detail-input sm'
                      value={item.count} 
                      min="1"
                      onChange={(e) => handleItemChange(idx, 'count', Number(e.target.value))}
                    />
                    <span>개</span>

                    {/* 삭제 버튼 */}
                    <button 
                      type="button" 
                      className='btn-remove-item'
                      onClick={() => handleRemoveItem(idx)}
                    >
                      X
                    </button>
                  </div>
                ))}
                
                {/* 짐 추가 버튼 */}
                <button type="button" className='btn-add-item' onClick={handleAddItem}>
                  + 짐 추가
                </button>
              </div>
            ) : (
              /* [조회] 기존 리스트 */
              formData.items && formData.items.length > 0 ? (
                <ul style={{margin:0, paddingLeft:'20px', textAlign:'left'}}>
                  {formData.items.map((item, idx) => (
                    <li key={idx}>
                      {item.itemType} / {item.itemSize} / {item.count}개
                    </li>
                  ))}
                </ul>
              ) : (
                <span style={{color:'#999'}}>(짐 정보 없음)</span>
              )
            )}
          </span>
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

        {/* 담당 기사 */}
        <div className='reservation-detail-row'>
          <span className='reservation-detail-label'>담당기사</span>
          <span className='reservation-detail-value'>
            {isEditMode ? (
              <input className='detail-input' type="text" name="driver" value={formData.driver} onChange={handleChange} placeholder="기사 배정" />
            ) : formData.driver || '미배정'}
          </span>
        </div>

        {/* 요청사항 */}
        <div className='reservation-detail-row' style={{flexDirection: 'column', gap: '8px', borderBottom: 'none'}}>
          <span className='reservation-detail-label'>요청사항</span>
          <div className='reservation-detail-value' style={{width: '100%', maxWidth: '100%'}}>
            {isEditMode ? (
              <textarea className='detail-textarea' name="notes" rows="3" value={formData.notes} onChange={handleChange} />
            ) : (
              <p style={{margin:0, whiteSpace:'pre-wrap', textAlign:'left'}}>{formData.notes || '-'}</p>
            )}
          </div>
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
