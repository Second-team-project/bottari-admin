import { X } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { closePanel, openPanel } from '../../store/slices/driverSlice';
import { driverIndexThunk, driverStoreThunk, driverUpdateThunk } from '../../store/thunks/driverThunk';
import './DriverDetail.css';


export default function DriverForm({ mode }) {
  const dispatch = useDispatch();
  const { selectedData, currentPage } = useSelector((state) => state.driver);
  
  // 초기 빈 값 정의
  const INITIAL_FORM_DATA = {
    accountId: '',
    password: '',
    driverName: '',
    phone: '',
    email: '',
    carNumber: '',
    notes: '',
    attendanceState: 'CLOCKED_OUT',
  };

  const isStore = mode === 'store';
  const isUpdate = mode === 'update';

  // 초기 상태값 계산 함수
  function getInitialState() {
    // 등록 모드이거나 선택된 데이터가 없으면 빈 폼 반환
    if (isStore || !selectedData) {
      return { ...INITIAL_FORM_DATA };
    }

    // 수정 모드면 선택된 데이터로 채움(비밀번호는 보안상 비워둠)
    return {
      accountId: selectedData.accountId || '',
      password: '', // 수정 시 비밀번호는 비워두고 입력할 때만 변경
      driverName: selectedData.driverName || '',
      phone: selectedData.phone || '',
      email: selectedData.email || '',
      carNumber: selectedData.carNumber || '',
      notes: selectedData.notes || '',
      attendanceState: selectedData.attendanceState || 'CLOCKED_OUT',
    };
  };

  const [formData, setFormData] = useState(getInitialState);

  // 모드(mode)가 바뀌거나, 선택된 데이터(selectedData)가 바뀌면 폼을 강제로 리셋
  useEffect(() => {
    setFormData(getInitialState());
  }, [mode, selectedData]);


  // 입력 핸들러
  function handleChange(e) {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // 저장 핸들러
  async function handleSubmit(e) {
    e.preventDefault();

    // 유효성 검사
    if (!formData.accountId.trim()) return alert('아이디를 입력해주세요.');
    if (!formData.driverName.trim()) return alert('이름을 입력해주세요.');
    if (!formData.phone.trim()) return alert('연락처를 입력해주세요.');

    try {
      if (isStore) {
        // 등록 로직
        await dispatch(driverStoreThunk(formData)).unwrap();
        alert('기사가 등록되었습니다.');
        dispatch(driverIndexThunk({ page: 1 })); // 첫 페이지로 이동
        dispatch(closePanel());
      } else if (isUpdate) {
        // 수정 로직
        const updatePayload = { ...formData };
        
        // 비밀번호가 비어있으면 전송 객체에서 삭제 (기존 비번 유지)
        if (!updatePayload.password) {
          delete updatePayload.password;
        }

        await dispatch(driverUpdateThunk({ id: selectedData.id, data: updatePayload })).unwrap();
        alert('기사 정보가 수정되었습니다.');
        dispatch(driverIndexThunk({ page: currentPage })); // 현재 페이지 새로고침
        
        // 수정 완료 후 상세 보기 모드로 전환
        dispatch(openPanel({ mode: 'show', data: { ...selectedData, ...updatePayload } }));
      }
    } catch (error) {
      console.error(error);
      alert('처리 중 오류가 발생했습니다.');
    }
  };

  // 취소 핸들러
  function handleCancel() {
    if(isUpdate) {
      // 수정하다 취소하면 다시 'show' 모드로 돌아가서 원래 데이터 보여줌
      dispatch(openPanel({ mode: 'show', data: selectedData }));
    } else {
      dispatch(closePanel());
    }
  };

  return (
    <div className="driver-detail-panel">
      <div className="driver-detail-header">
        <h3 className="detail-title">{isStore ? '기사 등록' : '기사 정보 수정'}</h3>
        <button type="button" className="btn-close" onClick={() => dispatch(closePanel())}>
          <X size={24} />
        </button>
      </div>

      <form onSubmit={handleSubmit} className="driver-detail-content">
        {/* 아이디 (수정 시 읽기 전용) */}
        <div className="driver-detail-row">
          <label className="driver-detail-label">아이디</label>
          <input
            type="text"
            id="accountId"
            name="accountId"
            className="driver-detail-input"
            value={formData.accountId}
            onChange={handleChange}
            placeholder="로그인 아이디"
            readOnly={isUpdate}
            disabled={isUpdate} // 시각적으로도 비활성화
          />
        </div>

        {/* 비밀번호 */}
        <div className="driver-detail-row">
          <label htmlFor="password" className="driver-detail-label">비밀번호</label>
          <input
            type="password"
            id="password"
            name="password"
            className="driver-detail-input"
            value={formData.password}
            onChange={handleChange}
            placeholder={isUpdate ? "변경 시에만 입력" : "비밀번호 입력"}
          />
        </div>

        {/* 이름 */}
        <div className="driver-detail-row">
          <label htmlFor="driverName" className="driver-detail-label">이름</label>
          <input
            type="text"
            id="driverName"
            name="driverName"
            className="driver-detail-input"
            value={formData.driverName}
            onChange={handleChange}
            placeholder="이름 입력"
          />
        </div>

        {/* 연락처 */}
        <div className="driver-detail-row">
          <label htmlFor="phone" className="driver-detail-label">연락처</label>
          <input
            type="text"
            id="phone"
            name="phone"
            className="driver-detail-input"
            value={formData.phone}
            onChange={handleChange}
            placeholder="01000000000"
          />
        </div>

        {/* 이메일 */}
        <div className="driver-detail-row">
          <label htmlFor="email" className="driver-detail-label">이메일</label>
          <input
            type="email"
            id="email"
            name="email"
            className="driver-detail-input"
            value={formData.email}
            onChange={handleChange}
            placeholder="user@example.com"
          />
        </div>

        {/* 차량번호 */}
        <div className="driver-detail-row">
          <label htmlFor="carNumber" className="driver-detail-label">차량번호</label>
          <input
            type="text"
            id="carNumber"
            name="carNumber"
            className="driver-detail-input"
            value={formData.carNumber}
            onChange={handleChange}
            placeholder="예: 12가3456"
          />
        </div>

        {/* 특이사항 */}
        <div className="driver-detail-notes">
          <label htmlFor="notes" className="driver-detail-label">특이사항</label>
          <textarea
            id="notes"
            name="notes"
            className="driver-detail-textarea"
            value={formData.notes}
            onChange={handleChange}
            placeholder="특이사항을 입력하세요."
          />
        </div>

        {/* 하단 버튼 */}
        <div className="driver-detail-actions">
          <button type="button" className="btn-cancel" onClick={handleCancel}>
            취소
          </button>
          <button type="submit" className="btn-save">
            {isStore ? '등록하기' : '수정하기'}
          </button>
        </div>
      </form>
    </div>
  );
}