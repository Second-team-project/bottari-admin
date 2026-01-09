import { Upload, X } from 'lucide-react';
import './NoticeCreateModal.css';
import { useRef, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { noticeCreateThunk, noticeImageUploadThunk, noticeIndexThunk } from '../../store/thunks/noticeThunk.js';
import { toast } from 'sonner';

export default function NoticeCreateModal({ createOpen, createCancel }) {
  if (!createOpen) return null;

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const newNoticeInputRef = useRef();

  // 입력값 저장
  const [noticeTitle, setNoticeTitle] = useState('');
  const [noticeContent, setNoticeContent] = useState('');
  

  // 파일 관련
  const [file, setFile] = useState(null); // 올린 파일
  const [preview, setPreview] = useState(''); // 프리뷰 url

  async function handleCreate(e) {
    e.preventDefault();

    try {
      let image = null;
      
      // 파일이 있을 때만 업로드 진행
      if (file) {
        const resultUpload = await dispatch(noticeImageUploadThunk(file)).unwrap();
        image = resultUpload.data.path;
      }

      const data = {
        title: noticeTitle,
        content: noticeContent,
        image : image,
      }

      // 게시글 작성
      await dispatch(noticeCreateThunk(data)).unwrap();

      dispatch(noticeIndexThunk());

      // 작성한 게시글 상세로 이동
      toast.success('공지사항이 정상적으로 등록되었습니다.');

      createCancel()
    } catch(error) {
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

      toast.error(messageFormet ? messageFormet : '공지사항 등록에 실패했습니다.');
    }

  }

  // 이미지 업로드 영역 클릭
  const handleNoticeImgUploadClick = () => {
    newNoticeInputRef.current?.click();
  };

  // 파일 변경시 처리 함수
  function changeFiles(e) {
    // 선택 파일 정보 획득(1개의 파일만 올리는걸 전제)
    const file = e.target.files[0];

    // 미리보기
    const fileReader = new FileReader();
    fileReader.readAsDataURL(file);
    fileReader.addEventListener('load', () => { setPreview(fileReader.result) });

    setFile(file);
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

        <form className='notice-modal-content'>
          <div className='notice-modal-info-row'>
            {/* 제목 */}
            <div className='notice-create-modal-info-item'>
              <label htmlFor='new-notice-title' className='new-notice-title-label'>제목</label>
              <input id='new-notice-title' type="text"
                className='new-notice-title-input'
                value={noticeTitle}
                onChange={(e) => setNoticeTitle(e.target.value)}
                placeholder='제목을 입력해주세요.'
              />
            </div>
          </div>

          {/* 이미지, 내용 */}
          <div className='new-notice-modal-form-group'>
            {/* 이미지 업로드 */}
            <div className='notice-modal-value-img'>
              <label htmlFor='new-notice-content' className='notice-modal-label'>이미지</label>
              <div className="notice-single-image-upload-area" onClick={handleNoticeImgUploadClick}>
                {preview ? (
                  <img src={preview} alt="현재 이미지" className="notice-single-image-preview" />
                ) : (
                  <div className="notice-single-image-placeholder">
                    <Upload size={32} />
                    <span>클릭하여 이미지 업로드</span>
                  </div>
                )}
              </div>
              <input ref={newNoticeInputRef} type="file" id='new-notice-content'
                onChange={changeFiles}
                accept="image/*"
                style={{ display: 'none' }}
              />
            </div>

            {/* 내용 */}
            <div className='new-notice-content-container'>
              <label htmlFor='new-notice-content' className='notice-modal-label'>내용</label>
              <textarea id="new-notice-content"
                className='new-notice-content-textarea'
                value={noticeContent}
                onChange={(e) => setNoticeContent(e.target.value)}
                placeholder='내용을 입력해주세요.'
              ></textarea>
            </div>
          </div>
        </form>

        <div className='notice-modal-footer'>
          <button type='submit' className='btn-edit' onClick={handleCreate}>등록하기</button>
          <button type='button' className='btn-delete' onClick={createCancel}>취소</button>
        </div>
      </div>
    </div>
  );
}
