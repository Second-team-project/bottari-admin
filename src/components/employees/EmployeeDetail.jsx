import { X } from 'lucide-react';
import './EmployeeDetail.css';
import { useDispatch, useSelector } from 'react-redux';
import { useState } from 'react';
import { employeeStoreThunk, employeeUpdateThunk } from '../../store/thunks/employeeThunk.js';
import { closePanel } from '../../store/slices/employeeSlice.js';

export default function EmployeeDetail() {
  const dispatch = useDispatch();
  const { panel, selectedData } = useSelector((state) => state.employee);
  const [formData, setFormData] = useState({
    adminName: '',
    accountId: '',
    password: '',
    phone: '',
    email: '',
    code: '', // 관리 코드 (본사/지점 등)
  });

  // 입력 값 변경 핸들러
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // 저장(Submit) 핸들러
  const handleSubmit = async (e) => {
    e.preventDefault();

    // 간단한 유효성 검사
    if (!formData.adminName || !formData.accountId || !formData.phone) {
      alert('이름, 아이디, 연락처는 필수 입력 항목입니다.');
      return;
    }

    try {
      if (panel.mode === 'store') {
        // 등록
        if (!formData.password) {
          alert('신규 등록 시 비밀번호는 필수입니다.');
          return;
        }
        await dispatch(employeeStoreThunk(formData)).unwrap();
        alert('직원이 등록되었습니다.');
      } else {
        // 수정
        // 비밀번호가 비어있으면 전송하지 않거나 백엔드에서 처리 (여기서는 그대로 전송하되 백엔드에서 null 체크한다고 가정)
        const updateData = { ...formData };
        if (!updateData.password) {
          return delete updateData.password; // 빈 값이면 객체에서 제거
        }
        await dispatch(employeeUpdateThunk({ id: selectedData.id, payload: updateData })).unwrap();
        alert('직원 정보가 수정되었습니다.');
      }
    } catch (error) {
      alert(`요청 실패: ${error}`);
    }
  };

  return (
    <div className='employee-detail-panel'>
      <div className='employee-detail-header'>
        <h3>{panel.mode === 'store' ? '직원 등록' : '직원 상세/수정'}</h3>
        <button className='employee-detail-close' onClick={() => dispatch(closePanel())}>
          <X size={20} />
        </button>
      </div>

      <form className='employee-detail-content' onSubmit={handleSubmit}>
        <div className='form-group'>
          <label className='form-label'>이름 <span className='required'>*</span></label>
          <input
            type='text'
            name='adminName'
            className='form-input'
            value={formData.adminName}
            onChange={handleChange}
            placeholder='이름 입력'
          />
        </div>

        <div className='form-group'>
          <label className='form-label'>아이디 <span className='required'>*</span></label>
          <input
            type='text'
            name='accountId'
            className='form-input'
            value={formData.accountId}
            onChange={handleChange}
            placeholder='사용할 아이디'
            disabled={panel.mode === 'update'} // 아이디는 수정 불가 처리 (정책에 따라 변경 가능)
          />
        </div>

        <div className='form-group'>
          <label className='form-label'>
            비밀번호 {panel.mode === 'store' && <span className='required'>*</span>}
          </label>
          <input
            type='password'
            name='password'
            className='form-input'
            value={formData.password}
            onChange={handleChange}
            placeholder={panel.mode === 'update' ? '변경 시에만 입력하세요' : '비밀번호 입력'}
          />
        </div>

        <div className='form-group'>
          <label className='form-label'>연락처 <span className='required'>*</span></label>
          <input
            type='text'
            name='phone'
            className='form-input'
            value={formData.phone}
            onChange={handleChange}
            placeholder='010-0000-0000'
          />
        </div>

        <div className='form-group'>
          <label className='form-label'>이메일</label>
          <input
            type='email'
            name='email'
            className='form-input'
            value={formData.email}
            onChange={handleChange}
            placeholder='example@bottari.com'
          />
        </div>

        <div className='form-group'>
          <label className='form-label'>관리 코드</label>
          <input
            type='text'
            name='code'
            className='form-input'
            value={formData.code}
            onChange={handleChange}
            placeholder='부서/지점 코드'
          />
        </div>

        {/* 하단 버튼 영역 */}
        <div className='employee-detail-actions'>
          <button type='submit' className='btn-save'>
            {panel.mode === 'store' ? '등록하기' : '수정하기'}
          </button>
          <button type='button' className='btn-cancel' onClick={() => dispatch(closePanel())}>
            취소
          </button>
        </div>
      </form>
    </div>
  );
}

//       <div className='employee-detail-content'>
//         <div className='employee-detail-row'>
//           <span className='employee-detail-label'>번호</span>
//           <span className='employee-detail-value'>{selectedRow + 1}</span>
//         </div>
//         <div className='employee-detail-row'>
//           <span className='employee-detail-label'>이름</span>
//           <span className='employee-detail-value'>홍길동</span>
//         </div>
//         <div className='employee-detail-row'>
//           <span className='employee-detail-label'>아이디</span>
//           <span className='employee-detail-value'>hong123</span>
//         </div>
//         <div className='employee-detail-row'>
//           <span className='employee-detail-label'>연락처</span>
//           <span className='employee-detail-value'>010-9876-5432</span>
//         </div>
//         <div className='employee-detail-row'>
//           <span className='employee-detail-label'>이메일</span>
//           <span className='employee-detail-value'>hong@bottari.com</span>
//         </div>
//         <div className='employee-detail-row'>
//           <span className='employee-detail-label'>등록일</span>
//           <span className='employee-detail-value'>2024.01.15</span>
//         </div>
//       </div>

//       <div className='employee-detail-actions'>
//         <button className='btn-edit'>수정</button>
//         <button className='btn-delete'>삭제</button>
//       </div>
//     </div>
//   );
// }
