import { Upload, X } from 'lucide-react';
import './NoticeCreateModal.css';
import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { noticeCreateThunk, noticeImageUploadThunk, noticeIndexThunk } from '../../store/thunks/noticeThunk.js';
import { toast } from 'sonner';

export default function NoticeCreateModal({ createOpen, createCancel }) {
  if (!createOpen) return null;
  
  const dispatch = useDispatch();
  
  // 상태 관리 통합 (객체 방식)
  const [formData, setFormData] = useState({
    title: '',
    content: '',
  });
  
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState('');
  
  // 입력 핸들러
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  // 이미지 변경 핸들러
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };
  
  // 4. 등록 실행
  async function handleCreate() {
    try {
      let imagePath = null;
      
      // 파일이 있을 때만 이미지 서버 업로드 진행
      if (selectedFile) {
        const resultUpload = await dispatch(noticeImageUploadThunk(selectedFile)).unwrap();
        imagePath = resultUpload.data.path;
      }
      
      const data = {
        title: formData.title,
        content: formData.content,
        image: imagePath,
      };

      await dispatch(noticeCreateThunk(data)).unwrap();

      dispatch(noticeIndexThunk());

      toast.success('공지사항이 등록되었습니다.');

      createCancel();
    } catch(error) {
      const rawMessage = error.data?.[0];
      const extractAfterColon = (msg) => {
        if (!msg || typeof msg !== 'string') return '';

        const idx = msg.indexOf(':');

        return idx === -1 ? msg : msg.slice(idx + 1).trim();
      };
      
      const messageFormat = extractAfterColon(rawMessage);
      toast.error(messageFormat || '공지사항 등록에 실패했습니다.');
    }
  }

  return (
    <div className='notice-modal-overlay' onClick={createCancel}>
      <div className='notice-modal-container' onClick={(e) => e.stopPropagation()}>
        <div className='notice-modal-header'>
          <h3>공지사항 등록</h3>
          <button className='notice-modal-close' onClick={createCancel}>
            <X size={22} />
          </button>
        </div>

        <div className='notice-modal-content'>
          {/* 제목 영역 */}
          <div className='notice-modal-info-row'>
            <div className='notice-create-modal-info-item' style={{ width: '100%' }}>
              <span className='notice-modal-label'>제목</span>
              <input 
                name="title"
                type="text"
                className='new-notice-title-input'
                onChange={handleChange}
                placeholder='공지사항 제목을 입력하세요.'
              />
            </div>
          </div>

          {/* 이미지 업로드 영역 (NoticeModal UI 적용) */}
          <div className='notice-modal-form-group'>
            <span className='notice-modal-label'>이미지 (선택)</span>
            <label className='notice-file-upload-btn'>
              <Upload size={16} style={{ marginRight: '8px' }}/>
              이미지 첨부
              <input type="file" accept="image/*" onChange={handleFileChange} hidden />
            </label>
            
            {previewUrl && (
              <div className='notice-img-preview-container'>
                <img src={previewUrl} alt="Preview" className="notice-single-image-preview" />
              </div>
            )}
          </div>

          {/* 내용 영역 */}
          <div className='notice-modal-form-group'>
            <span className='notice-modal-label'>내용</span>
            <textarea 
              name="content"
              className='new-notice-content-textarea'
              onChange={handleChange}
              placeholder='공지사항 내용을 입력하세요.'
            ></textarea>
          </div>
        </div>

        <div className='notice-modal-footer'>
          <button className='btn-edit' onClick={handleCreate}>등록하기</button>
          <button className='notice-btn-cancel' onClick={createCancel}>취소</button>
        </div>
      </div>
    </div>
  );
}
