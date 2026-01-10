import { Upload, X } from 'lucide-react';
import './NoticeModal.css';
import { useState } from 'react';
import { toast } from 'sonner';
import { noticeImageUploadThunk, noticeIndexThunk, noticeUpdateThunk } from '../../store/thunks/noticeThunk';
import { useDispatch } from 'react-redux';

export default function NoticeModal({ selectedItem, onClose }) {
  if (!selectedItem) return null;

  const dispatch = useDispatch();

  // FaqModal과 동일한 상태 관리 방식
  const [formData, setFormData] = useState({
    title: selectedItem.title || '',
    content: selectedItem.content || '',
    img: selectedItem.img || '',
  });

  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(selectedItem.img || '');

  // 입력 핸들러
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // 파일 선택 및 미리보기 핸들러
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file)); // 미리보기 생성
    }
  };

  // 수정 요청 핸들러 (FaqModal의 handleSave 방식)
  const handleUpdate = async () => {
    try {
      let finalImgPath = formData.img;

      // 새 파일이 선택되었다면 이미지 먼저 업로드
      if (selectedFile) {
        const uploadResult = await dispatch(noticeImageUploadThunk(selectedFile)).unwrap();
        // 백엔드 응답 구조에 따라 경로 추출 (result.data.path)
        finalImgPath = uploadResult.data.path;
      }

      // 최종 게시글 수정 thunk 호출
      await dispatch(noticeUpdateThunk({
        id: selectedItem.id,
        data: {
          title: formData.title,
          content: formData.content,
          image: finalImgPath,
        }
      })).unwrap();

      toast.success("공지사항이 수정되었습니다.");

      dispatch(noticeIndexThunk());
      onClose();
    } catch (error) {
      const rawMessage = error.data?.[0];

      function extractAfterColon(message) {
        // 문자열이 아니거나, 문자열이어도 값이 비어 있으면 처리하지 마라 라는 방어코드
        if (!message || typeof message !== 'string') return '';

        // 첫 ':'를 찾아 인덱스를 저장
        const idx = message.indexOf(':');

        // 첫 ':' 뒤 문장을 리턴
        // -1은 ':'가 없을 때 즉 기준점을 찾지 못 했을 때
        return idx === -1 ? message : message.slice(idx + 1).trim();
      }

      const messageFormet = extractAfterColon(rawMessage);

      toast.error(messageFormet ? messageFormet : '공지사항 수정에 실패했습니다.');
    }
  };

  return (
    <div className='notice-modal-overlay' onClick={onClose}>
      <div className='notice-modal-container' onClick={(e) => e.stopPropagation()}>
        <div className='notice-modal-header'>
          <h3>공지사항 수정</h3>
          <button className='notice-modal-close' onClick={onClose}>
            <X size={22} />
          </button>
        </div>

        <div className='notice-modal-content'>
          {/* 상단 정보 (작성자, 작성일, 수정일) */}
          <div className='notice-modal-info-row'>
            <div className='notice-modal-info-item'>
              <span className='notice-modal-info-label'>작성자</span>
              <span className='notice-modal-info-value'>{selectedItem.noticeAdmin.adminName}</span>
            </div>
            <div className='notice-modal-info-item'>
              <span className='notice-modal-info-label'>작성일</span>
              <span className='notice-modal-info-value'>{selectedItem.createdAt}</span>
            </div>
            {
              selectedItem.createdAt !== selectedItem.updatedAt && (
                <div className='notice-modal-info-item'>
                  <span className='notice-modal-info-label'>수정일</span>
                  <span className='notice-modal-info-value'>{selectedItem.updatedAt}</span>
                </div>
              )
            }
          </div>

          {/* 제목 */}
          <div className='notice-modal-form-group'>
            <span className='notice-modal-label'>제목</span>
            <input 
              name="title"
              type="text" 
              className='update-notice-title-input' 
              value={formData.title} 
              onChange={handleChange}
            />
          </div>
          
          {/* 이미지 */}
          <div className='notice-modal-form-group'>
            <span className='notice-modal-label'>이미지 (선택)</span>
            <label className='notice-file-upload-btn'>
              <Upload size={16} style={{ marginRight: '8px' }}/>
              이미지 변경
              <input type="file" accept="image/*" onChange={handleFileChange} hidden />
            </label>
            
            {previewUrl && (
              <div className='notice-img-preview-container'>
                <img src={previewUrl} alt="Preview" className="notice-single-image-preview" />
              </div>
            )}
          </div>

          {/* 내용 */}
          <div className='notice-modal-form-group'>
            <span className='notice-modal-label'>내용</span>
            <textarea 
              name="content"
              className='update-notice-content-textarea' 
              value={formData.content}
              onChange={handleChange}
            ></textarea>
          </div>
        </div>

        <div className='notice-modal-footer'>
          <button className='btn-edit' onClick={handleUpdate}>수정하기</button>
          <button className='notice-btn-cancel' onClick={onClose}>취소</button>
        </div>
      </div>
    </div>
  );
}
