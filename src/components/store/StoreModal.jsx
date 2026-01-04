import { X } from 'lucide-react';
import './StoreModal.css';

export default function StoreModal({ selectedItem, onClose }) {
  if (!selectedItem) return null;

  const isEdit = selectedItem.id !== 'new';

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
              defaultValue={isEdit ? 'ST_001' : ''} 
              placeholder="예: ST_001"
              disabled={isEdit} // 코드는 보통 수정 불가
            />
          </div>

          <div className='store-modal-form-group'>
            <label className='store-modal-label'>보관소 이름</label>
            <input 
              type="text" 
              className='store-modal-input' 
              defaultValue={isEdit ? '강남역점' : ''} 
              placeholder="지점명을 입력하세요"
            />
          </div>

          <div className='store-modal-form-group'>
            <label className='store-modal-label'>전화번호</label>
            <input 
              type="text" 
              className='store-modal-input' 
              defaultValue={isEdit ? '02-123-4567' : ''} 
              placeholder="02-000-0000"
            />
          </div>

          <div className='store-modal-form-group'>
            <label className='store-modal-label'>주소</label>
            <input 
              type="text" 
              className='store-modal-input' 
              defaultValue={isEdit ? '서울시 강남구 강남대로 123' : ''} 
              placeholder="상세 주소를 입력하세요"
            />
          </div>
        </div>

        <div className='store-modal-footer'>
          <button className='btn-cancel' onClick={onClose}>취소</button>
          <button className='btn-save'>{isEdit ? '수정 완료' : '등록하기'}</button>
        </div>
      </div>
    </div>
  );
}
