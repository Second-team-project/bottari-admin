import './SingleImageManager.css';
import { useState, useRef } from 'react';
import { Upload, Pencil, Trash2 } from 'lucide-react';
import { toast } from 'sonner';

/**
 * 단일 이미지 관리 컴포넌트 (메인배너, 서비스소개, 이용안내, 요금안내)
 * @param {Object} props
 * @param {string} props.title - 섹션 제목
 * @param {Object|null} props.data - 이미지 데이터 (없으면 null)
 * @param {Function} props.onCreate - 생성 핸들러 (FormData)
 * @param {Function} props.onUpdate - 수정 핸들러 (id, FormData)
 * @param {Function} props.onDelete - 삭제 핸들러 (id)
 * @param {string} props.type - 이미지 타입 (BANNER, SERVICE, USAGE, PRICE)
 */
export default function SingleImageManager({ title, data, onCreate, onUpdate, onDelete, type }) {
  // ===== refs
  const fileInputRef = useRef(null);

  // ===== states
  const [isEditing, setIsEditing] = useState(false); // 수정 모드
  const [previewUrl, setPreviewUrl] = useState(null); // 미리보기 URL
  const [selectedFile, setSelectedFile] = useState(null); // 선택된 파일
  const [formData, setFormData] = useState({ title: '' });

  // 이미지 존재 여부
  const hasImage = data !== null && data !== undefined;

  // 이미지 URL 생성 (프록시로 /files → 서버로 전달)
  const getImageUrl = (img) => {
    if (!img) return null;
    return img;  // '/files/guide/...' 그대로 사용
  };

  // [핸들러] 파일 선택
  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // 이미지 파일 검증
    if (!file.type.startsWith('image/')) {
      toast.error('이미지 파일만 업로드 가능합니다.');
      return;
    }

    setSelectedFile(file);
    setPreviewUrl(URL.createObjectURL(file));
  };

  // [핸들러] 업로드 영역 클릭
  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  // [핸들러] 수정 버튼 클릭
  const handleEditClick = () => {
    setIsEditing(true);
    setFormData({ title: data?.title || '' });
    setPreviewUrl(null);
    setSelectedFile(null);
  };

  // [핸들러] 취소
  const handleCancel = () => {
    setIsEditing(false);
    setPreviewUrl(null);
    setSelectedFile(null);
    setFormData({ title: '' });
  };

  // [핸들러] 저장 (등록/수정)
  const handleSave = () => {
    // 신규 등록 시 파일 필수
    if (!hasImage && !selectedFile) {
      toast.error('이미지를 선택해 주세요.');
      return;
    }
    if(!formData.title.trim()) {
      toast.error('이미지 제목을 입력해 주세요.');
      return;
    }

    const submitData = new FormData();
    submitData.append('type', type);
    submitData.append('title', formData.title);
    if (selectedFile) {
      submitData.append('img', selectedFile);
    }

    if (hasImage) {
      // 수정
      onUpdate(data.id, submitData);
    } else {
      // 신규 등록
      onCreate(submitData);
    }

    handleCancel();
  };

  // [핸들러] 삭제
  const handleDelete = () => {
    if (window.confirm('정말 삭제하시겠습니까?')) {
      onDelete(data.id);
    }
  };

  return (
    <div className="single-image-manager">
      {/* 상단 */}
      <div className="single-image-header">
        <h3 className="single-image-title">{title}</h3>
      </div>

      {/* 이미지 영역 */}
      <div className="single-image-content">
        {/* 이미지가 없거나 수정모드일 때: 업로드 영역 */}
        {(!hasImage || isEditing) && (
          <div className="single-image-upload-section">
            {/* 미리보기 또는 업로드 영역 */}
            <div
              className="single-image-upload-area"
              onClick={handleUploadClick}
            >
              {previewUrl ? (
                <img src={previewUrl} alt="미리보기" className="single-image-preview" />
              ) : isEditing && hasImage ? (
                <img src={getImageUrl(data.img)} alt="현재 이미지" className="single-image-preview" />
              ) : (
                <div className="single-image-placeholder">
                  <Upload size={32} />
                  <span>클릭하여 이미지 업로드</span>
                </div>
              )}
            </div>

            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileSelect}
              style={{ display: 'none' }}
            />

            {/* 제목 입력 (선택) */}
            <div className="single-image-form">
              <input
                type="text"
                placeholder="이미지 제목 (선택)"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="single-image-input"
              />
            </div>

            {/* 버튼 영역 */}
            <div className="single-image-actions">
              <button className="btn-save img-flex-center" onClick={handleSave}>
                {hasImage ? '수정' : '등록'}
              </button>
              {isEditing && (
                <button className="btn-cancel img-flex-center" onClick={handleCancel}>취소</button>
              )}
            </div>
          </div>
        )}

        {/* 이미지가 있고 수정모드가 아닐 때: 이미지 표시 */}
        {hasImage && !isEditing && (
          <div className="single-image-display">
            <div className="single-image-wrapper">
              <img
                src={getImageUrl(data.img)}
                alt={data.title || '이미지'}
                className="single-image-view"
              />
            </div>

            <div className="single-image-info">
              {data.title && <p className="single-image-name">{data.title}</p>}
              <p className="single-image-date">등록일: {data.createdAt}</p>
            </div>

            <div className="single-image-actions img-flex-center">
              <button className="btn-edit" onClick={handleEditClick}>
                <Pencil size={16} />
                수정
              </button>
              <button className="btn-delete img-flex-center" onClick={handleDelete}>
                <Trash2 size={16} />
                삭제
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
