import { useState, useEffect } from 'react';
import { X, Upload } from 'lucide-react';
import './FaqModal.css';
import { toast } from 'sonner';
import dayjs from 'dayjs';

// 카테고리 목록 (필요에 따라 서버에서 불러오거나 상수로 관리)
const CATEGORIES = ['예약', '배송', '보관', '결제/환불', '이용', '계정', '기타'];

export default function FaqModal({ item, onClose, onCreate, onUpdate, onDelete }) {

  const [formData, setFormData] = useState({
    category: item?.category || CATEGORIES[0],
    title: item?.title || '', 
    content: item?.content || '',
    img: item?.img || '',
  });

  if (!item) {
    toast.error('오류가 발생했습니다. 새로고침 후 다시 시도 해주세요.')
    return null;
  }
  const isEdit = item?.id !== 'new';

  const [selectedFile, setSelectedFile] = useState(null);
  
  // 미리보기 URL 초기화
  const [previewUrl, setPreviewUrl] = useState(() => {
    return item?.img || '';
  });

  // 입력 핸들러
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // 파일 선택 핸들러
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  // 저장 (생성/수정)
  const handleSave = async () => {
    // 유효성 검사
    if(!formData.title.trim()) {
      return toast.error("질문을 입력해주세요.");
    }
    if(!formData.content.trim()) {
      return toast.error("답변을 입력해주세요.");
    }

    try {
      const submitData = new FormData();
      submitData.append('category', formData.category);
      submitData.append('title', formData.title);
      submitData.append('content', formData.content);
      
      // 파일이 새로 선택된 경우에만 전송
      if (selectedFile) {
        submitData.append('img', selectedFile); 
      }
      // 수정 시 이미지 삭제/유지 플래그가 필요할 수 있음. 
      // 현재 백엔드 로직상 파일 안 보내면 기존 유지라고 가정.

      if (!isEdit) { 
        await onCreate(submitData);
      } else {
        await onUpdate({ id: item.id, formData: submitData });
      }
      onClose(); // refreshNeeded = true

    } catch (error) {
      console.error("저장 실패:", error);
      toast.error("저장에 실패했습니다.");
    }

  };

  return (
    <div className='faq-modal-overlay' onClick={() => onClose()}>
      <div className='faq-modal-container' onClick={(e) => e.stopPropagation()}>
        <div className='faq-modal-header'>
          <h3>{isEdit ? 'FAQ 수정' : 'FAQ 작성'}</h3>
          <button className='faq-modal-close' onClick={() => onClose()}>
            <X size={22} />
          </button>
        </div>

        <div className='faq-modal-content'>
          {/* 상단 정보 (카테고리) */}
          <div className='faq-modal-info-row'>
            <div className='faq-modal-info-item'>
              <span className='faq-modal-info-label'>카테고리</span>
              <select 
                name="category" 
                value={formData.category} 
                onChange={handleChange}
                className="faq-input-select"
              >
                {CATEGORIES.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            {/* 작성일 등은 보여주기만 (수정 불가) */}
            <div className='faq-modal-info-item'>
              <span className='faq-modal-info-label'>작성일</span>
              <span className='faq-modal-info-value'>
                {dayjs(item?.createdAt).format('YYYY-MM-DD HH:mm')}
              </span>
            </div>
          </div>

          {/* 질문 (Q) */}
          <div className='faq-modal-form-group'>
            <span className='faq-modal-label'>질문 (Question)</span>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="질문을 입력하세요"
                className="faq-input-text"
              />
          </div>

          {/* 이미지 첨부 (옵션) */}
          <div className='faq-modal-form-group'>
             <span className='faq-modal-label'>이미지 (선택)</span>
             {/* {!isView && ( */}
               <label className='faq-file-upload-btn'>
                 <Upload size={16} style={{ marginRight: '8px' }}/>
                 이미지 선택
                 <input type="file" accept="image/*" onChange={handleFileChange} hidden />
               </label>
             {/* )} */}
             {previewUrl && (
               <div className='faq-img-preview'>
                 <img src={previewUrl} alt="Preview" />
               </div>
             )}
          </div>

          {/* 답변 (A) */}
          <div className='faq-modal-form-group'>
            <span className='faq-modal-label'>답변 (Answer)</span>
              <textarea
                name="content"
                value={formData.content}
                onChange={handleChange}
                placeholder="답변을 입력하세요"
                className="faq-input-textarea"
                rows={6}
              />
          </div>
        </div>

        <div className='faq-modal-footer'>
          <button className='btn-save' onClick={handleSave}>
            {isEdit  ? '저장' : '생성'}
          </button>
          <button className='btn-cancel' onClick={onClose}>취소</button>
        </div>
      </div>
    </div>
  );
}
