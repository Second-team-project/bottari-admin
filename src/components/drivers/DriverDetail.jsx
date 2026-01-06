import { X } from 'lucide-react';
import './DriverDetail.css';
import { useDispatch, useSelector } from 'react-redux';
import { useState } from 'react';
import { closePanel } from '../../store/slices/driverSlice.js';
import { driverIndexThunk, driverStoreThunk, driverUpdateThunk } from '../../store/thunks/driverThunk.js';

export default function DriverDetail() {
  const dispatch = useDispatch();
  const { panel, currentPage, selectedData } = useSelector((state) => state.driver);
  const { mode } = panel; // mode: 'store' | 'update'

  // 초기값 설정
  // selectedData가 없으면 빈 문자열(등록 모드)
  const [formData, setFormData] = useState({
    name: selectedData?.driverName || '',
    phone: selectedData?.phone || '',
    email: selectedData?.email || '',
    carNumber: selectedData?.carNumber || '',
    memo: selectedData?.memo || '', // 특이사항
  });

  // 입력값 변경 핸들러
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  // 닫기 핸들러
  const handleClose = () => {
    dispatch(closePanel());
  };

  // 저장(등록/수정) 핸들러
  const handleSubmit = async (e) => {
    e.preventDefault();

    // 유효성 검사
    if(!formData.name.trim()) {
      return alert('이름을 입력해주세요.');
    }
    if(!formData.phone.trim()) {
      return alert('연락처를 입력해주세요.');
    }
      
    try {
      if (mode === 'store') {
        // 등록 로직
        await dispatch(driverStoreThunk(formData)).unwrap();
        alert('기사가 등록되었습니다.');
        // 등록 후 목록 갱신
        dispatch(driverIndexThunk({ page: 1 }));
      } else {
        // 수정 로직
        await dispatch(driverUpdateThunk({ id: selectedData.id, data: formData })).unwrap();
        alert('기사 정보가 수정되었습니다.');
        // 수정 후 현재 페이지 목록 갱신
        dispatch(driverIndexThunk({ page: currentPage }));
      }
      // 성공 시 패널 닫기
      dispatch(closePanel());
    } catch(error) {
      console.error(error);
      alert('처리 중 오류가 발생했습니다.');
    }
  };

  return (
    <div className='driver-detail-panel'>
      {/* 헤더 */}
      <div className='driver-detail-header'>
        <h3 className="detail-title">
          {mode === 'store' ? '기사 등록' : '기사 정보 수정'}
        </h3>
        <button type="button" className="btn-close" onClick={handleClose}>
          <X size={24} />
        </button>
      </div>

      {/* 폼 태그 */}
      <form onSubmit={handleSubmit} className='driver-detail-content'>
        {/* ID (수정 모드일 때만 표시) */}
        {mode === 'update' && (
          <div className='driver-detail-row'>
            <span className='driver-detail-label'>번호 (ID)</span>
            <span className='driver-detail-text'>{selectedData.id}</span>
          </div>
        )}

        {/* 이름 */}
        <div className='driver-detail-row'>
          <label htmlFor='name' className='driver-detail-label'>이름 <span className='required'>*</span></label>
          <input 
            type="text" 
            id="name"
            name="name" 
            className='driver-detail-input'
            value={formData.name} 
            onChange={handleChange}
            placeholder="이름 입력"
          />
        </div>

        {/* 연락처 */}
        <div className='driver-detail-row'>
          <label htmlFor='phone' className='driver-detail-label'>연락처 <span className='required'>*</span></label>
          <input 
            type="text" 
            id="phone"
            name="phone" 
            className='driver-detail-input'
            value={formData.phone} 
            onChange={handleChange}
            placeholder="010-0000-0000"
          />
        </div>

        {/* 이메일 */}
        <div className='driver-detail-row'>
          <label htmlFor='email' className='driver-detail-label'>이메일</label>
          <input 
            type="email" 
            id="email"
            name="email" 
            className='driver-detail-input'
            value={formData.email} 
            onChange={handleChange}
            placeholder="user@example.com"
          />
        </div>

        {/* 차량번호 */}
        <div className='driver-detail-row'>
          <label htmlFor='car_number' className='driver-detail-label'>차량번호</label>
          <input 
            type="text" 
            id="car_number"
            name="car_number" 
            className='driver-detail-input'
            value={formData.carNumber} 
            onChange={handleChange}
            placeholder="예: 12가 3456"
          />
        </div>

        {/* 배송 건수 / 등록일(수정 모드에서만 보이는 읽기 전용 정보) */}
        {mode === 'update' && (
          <>
            <div className='driver-detail-row'>
              <span className='driver-detail-label'>배송 건수</span>
              <span className='driver-detail-text'>{selectedData.deliveryCount || 0}건</span>
            </div>
            <div className='driver-detail-row'>
              <span className='driver-detail-label'>등록일</span>
              <span className='driver-detail-text'>
                {selectedData.createdAt ? new Date(selectedData.createdAt).toLocaleDateString() : '-'}
              </span>
            </div>
          </>
        )}
        
        {/* 특이사항(메모) */}
        <div className='driver-detail-memo'>
          <label htmlFor='memo' className='driver-detail-label'>특이사항</label>
          <textarea 
            id="memo"
            name="memo"
            className='driver-detail-textarea'
            value={formData.memo}
            onChange={handleChange}
            placeholder="특이사항을 입력하세요."
          />
        </div>

        <div className='driver-detail-actions'>
          {/* 취소 버튼은 패널 닫기 */}
          <button type="button" className='btn-cancel' onClick={handleClose}>
            취소
          </button>
          <button type="submit" className='btn-save'>
            {mode === 'store' ? '등록하기' : '수정하기'}
          </button>
        </div>
      </form>
    </div>
  );
}

//       <div className='driver-detail-content'>
//         <div className='driver-detail-row'>
//           <span className='driver-detail-label'>번호</span>
//           <span className='driver-detail-value'>{selectedRow + 1}</span>
//         </div>
//         <div className='driver-detail-row'>
//           <span className='driver-detail-label'>이름</span>
//           <span className='driver-detail-value'>김기사</span>
//         </div>
//         <div className='driver-detail-row'>
//           <span className='driver-detail-label'>연락처</span>
//           <span className='driver-detail-value'>010-1234-5678</span>
//         </div>
//         <div className='driver-detail-row'>
//           <span className='driver-detail-label'>이메일</span>
//           <span className='driver-detail-value'>driver@bottari.com</span>
//         </div>
//         <div className='driver-detail-row'>
//           <span className='driver-detail-label'>차량번호</span>
//           <span className='driver-detail-value'>12가 3456</span>
//         </div>
//         <div className='driver-detail-row'>
//           <span className='driver-detail-label'>배송 건수</span>
//           <span className='driver-detail-value'>150건</span>
//         </div>
//         <div className='driver-detail-row'>
//           <span className='driver-detail-label'>등록일</span>
//           <span className='driver-detail-value'>2024.01.01</span>
//         </div>
        
//         {/* 특이사항 (메모) */}
//         <div className='driver-detail-memo'>
//           <span className='driver-detail-label'>특이사항</span>
//           <div className='driver-detail-value'>
//             서울 강남 지역 전문 기사님.<br/>
//             오전 시간대 선호하심.
//           </div>
//         </div>
//       </div>

//       <div className='driver-detail-actions'>
//         <button className='btn-edit'>수정</button>
//         <button className='btn-delete'>삭제</button>
//       </div>
//     </div>
//   );
// }
