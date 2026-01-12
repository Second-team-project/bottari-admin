import { X } from 'lucide-react';
import './StoreModal.css';
import { useState, useEffect } from 'react';
import { toast } from 'sonner';

export default function StoreModal({ store, onClose, onCreate, onUpdate, onDelete }) {
  const [formData, setFormData] = useState({
    code: store?.code || '', storeName: store?.storeName || '', tel: store?.tel || '', addr: store?.addr || '',
  });

  // [수정] 훅 규칙 준수를 위해 useEffect 안에서 에러 처리
  useEffect(() => {
    if (!store) {
      toast.error('오류가 발생했습니다. 새로고침 후 다시 시도 해주세요.');
      onClose();
    }
  }, [store, onClose]);

  // [수정] store가 없을 때 렌더링 중단 (모든 훅 선언 이후에 위치)
  if (!store) {
    return null;
  }

  const isEdit = store?.id !== 'new';

  // [핸들러] 입력값 변경
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // [핸들러] 저장 (등록/수정 공통 - 실제론 API 각각 호출)
  const handleSave = () => {
    // const { code, storeName, tel, addr } = formData;
    // 유효성 검사 (빈 값 체크)
    if (!formData.code.trim()) {
      return toast.error('보관소 코드를 입력해주세요.');
    }
    if (!formData.storeName.trim()) {
      return toast.error('보관소 이름을 입력해주세요.');
    }
    if (!formData.tel.trim()) {
      return toast.error('전화번호를 입력해주세요.');
    }
    if (!formData.addr.trim()) {
      return toast.error('주소를 입력해주세요.');
    }

    // 검증 통과 요청
    if (isEdit) {
      onUpdate({ ...formData, id: store.id });
    } else {
      onCreate(formData);
    }

    onClose();
  };

  return (
    <div className='store-modal-overlay' onClick={onClose}>
      <div className='store-modal-container' onClick={(e) => e.stopPropagation()}>
        <div className='store-modal-header'>
          <h3>{isEdit ? '보관소 정보 수정' : '신규 보관소 등록'}</h3>
          <button className='store-modal-close' onClick={onClose}>
            <X size={22} />
          </button>
        </div>

        <div className='store-modal-content'>
          <div className='store-modal-form-group'>
            <label className='store-modal-label'>보관소 코드</label>
            <input 
              type="text" 
              className='store-modal-input' 
              name="code"
              value={formData.code}
              onChange={handleChange}
              placeholder="예: BS000"
              disabled={isEdit} // 코드는 보통 수정 불가
            />
          </div>

          <div className='store-modal-form-group'>
            <label className='store-modal-label'>보관소 이름</label>
            <input 
              type="text" 
              className='store-modal-input' 
              name="storeName"
              value={formData.storeName}
              onChange={handleChange}
              placeholder="지점명을 입력하세요"
            />
          </div>

          <div className='store-modal-form-group'>
            <label className='store-modal-label'>전화번호</label>
            <input 
              type="text" 
              className='store-modal-input' 
              name="tel"
              value={formData.tel}
              onChange={handleChange}
              placeholder="053-000-0000"
            />
          </div>

          <div className='store-modal-form-group'>
            <label className='store-modal-label'>주소</label>
            <input 
              type="text" 
              className='store-modal-input' 
              name="addr"
              value={formData.addr}
              onChange={handleChange}
              placeholder="상세 주소를 입력하세요"
            />
          </div>
        </div>

        <div className='store-modal-footer'>
          <button className='btn-save' onClick={handleSave}>{isEdit ? '수정하기' : '등록하기'}</button>
          <button className='btn-cancel' onClick={onClose}>취소</button>
        </div>
      </div>
    </div>
  );
}
