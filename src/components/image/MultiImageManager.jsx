import { useState, useRef } from 'react';
import { Plus, Upload, Pencil, Trash2, ChevronUp, ChevronDown, X, Link } from 'lucide-react';
import './MultiImageManager.css';
import { toast } from 'sonner';

/**
 * 다중 이미지 관리 컴포넌트 (이벤트 배너)
 * @param {Object} props
 * @param {string} props.title - 섹션 제목
 * @param {Array} props.data - 이미지 배열 (seq 기준 정렬)
 * @param {Function} props.onCreate - 생성 핸들러 (FormData)
 * @param {Function} props.onUpdate - 수정 핸들러 (id, FormData)
 * @param {Function} props.onDelete - 삭제 핸들러 (id)
 * @param {Function} props.onReorder - 순서 변경 핸들러 (id, direction: 'up' | 'down')
 * @param {string} props.type - 이미지 타입 (EVENT)
 */
export default function MultiImageManager({ title, data = [], onCreate, onUpdate, onDelete, onReorder, type }) {
  // ===== refs
  const fileInputRef = useRef(null);

  // ===== states
  const [isAdding, setIsAdding] = useState(false); // 추가 모드
  const [editingId, setEditingId] = useState(null); // 수정 중인 ID
  const [previewUrl, setPreviewUrl] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [formData, setFormData] = useState({ title: '', link: '' });

  // 이미지 URL 생성 (프록시로 /files → 서버로 전달)
  const getImageUrl = (img) => {
    if (!img) return null;
    return img;  // '/files/guide/...' 그대로 사용
  };

  // [핸들러] 파일 선택
  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toast.error('이미지 파일만 업로드 가능합니다.');
      return;
    }

    setSelectedFile(file);
    setPreviewUrl(URL.createObjectURL(file));
  };

  // 메모리 누수 방지: 미리보기 URL 해제
  useEffect(() => {
    return () => {
      if (previewUrl && previewUrl.startsWith('blob:')) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  // [핸들러] 업로드 영역 클릭
  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  // [핸들러] 추가 버튼 클릭
  const handleAddClick = () => {
    setIsAdding(true);
    setEditingId(null);
    setFormData({ title: '', link: '' });
    setPreviewUrl(null);
    setSelectedFile(null);
  };

  // [핸들러] 수정 버튼 클릭
  const handleEditClick = (item) => {
    setIsAdding(false);
    setEditingId(item.id);
    setFormData({ title: item.title || '', link: item.link || '' });
    setPreviewUrl(null);
    setSelectedFile(null);
  };

  // [핸들러] 취소
  const handleCancel = () => {
    setIsAdding(false);
    setEditingId(null);
    setPreviewUrl(null);
    setSelectedFile(null);
    setFormData({ title: '', link: '' });
  };

  // [핸들러] 저장
  const handleSave = () => {
    // 신규 등록 시 파일 필수
    if (isAdding && !selectedFile) {
      toast.error('이미지를 선택해 주세요.');
      return;
    }

    const submitData = new FormData();
    submitData.append('type', type);
    submitData.append('title', formData.title);
    submitData.append('link', formData.link);
    if (selectedFile) {
      submitData.append('img', selectedFile);
    }

    if (isAdding) {
      onCreate(submitData);
    } else {
      onUpdate(editingId, submitData);
    }

    handleCancel();
  };

  // [핸들러] 삭제
  const handleDelete = (id) => {
    if (window.confirm('정말 삭제하시겠습니까?')) {
      onDelete(id);
    }
  };

  // [핸들러] 순서 변경
  const handleMoveUp = (id) => {
    onReorder(id, 'up');
  };

  const handleMoveDown = (id) => {
    onReorder(id, 'down');
  };

  return (
    <div className="multi-image-manager">
      {/* 상단 */}
      <div className="multi-image-header">
        <h3 className="multi-image-title">{title}</h3>
        <button
          className="multi-image-btn-add"
          onClick={handleAddClick}
          disabled={isAdding}
        >
          <Plus size={18} />
          이미지 추가
        </button>
      </div>

      {/* 컨텐츠 영역 */}
      <div className="multi-image-content">
        {/* 추가 모드: 입력 폼 */}
        {isAdding && (
          <div className="multi-image-form-card">
            <div className="multi-image-form-header">
              <span>새 이미지 추가</span>
              <button className="btn-close" onClick={handleCancel}>
                <X size={18} />
              </button>
            </div>

            <div className="multi-image-form-body">
              {/* 이미지 업로드 */}
              <div className="multi-image-upload-area" onClick={handleUploadClick}>
                {previewUrl ? (
                  <img src={previewUrl} alt="미리보기" className="multi-image-preview" />
                ) : (
                  <div className="multi-image-placeholder">
                    <Upload size={28} color="#9CA3AF" />
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

              {/* 제목, 링크 입력 */}
              <div className="multi-image-inputs">
                <input
                  type="text"
                  placeholder="이미지 제목 (선택)"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="multi-image-input"
                />
                <div className="multi-image-input-wrapper">
                  <Link size={16} color="#9CA3AF" />
                  <input
                    type="text"
                    placeholder="클릭 시 이동할 링크 (선택)"
                    value={formData.link}
                    onChange={(e) => setFormData({ ...formData, link: e.target.value })}
                    className="multi-image-input"
                  />
                </div>
              </div>

              {/* 버튼 */}
              <div className="multi-image-form-actions">
                <button className="btn-save" onClick={handleSave}>등록</button>
                <button className="btn-cancel" onClick={handleCancel}>취소</button>
              </div>
            </div>
          </div>
        )}

        {/* 이미지 리스트 */}
        {data.length === 0 && !isAdding ? (
          <div className="multi-image-empty">
            <p>등록된 이미지가 없습니다.</p>
          </div>
        ) : (
          <div className="multi-image-list">
            {data.map((item, index) => (
              <div key={item.id} className="multi-image-item">
                {/* 수정 모드 */}
                {editingId === item.id ? (
                  <div className="multi-image-form-card editing">
                    <div className="multi-image-form-header">
                      <span>이미지 수정</span>
                      <button className="btn-close" onClick={handleCancel}>
                        <X size={18} />
                      </button>
                    </div>

                    <div className="multi-image-form-body">
                      <div className="multi-image-upload-area" onClick={handleUploadClick}>
                        {previewUrl ? (
                          <img src={previewUrl} alt="미리보기" className="multi-image-preview" />
                        ) : (
                          <img src={getImageUrl(item.img)} alt="현재 이미지" className="multi-image-preview" />
                        )}
                      </div>

                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        onChange={handleFileSelect}
                        style={{ display: 'none' }}
                      />

                      <div className="multi-image-inputs">
                        <input
                          type="text"
                          placeholder="이미지 제목 (선택)"
                          value={formData.title}
                          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                          className="multi-image-input"
                        />
                        <div className="multi-image-input-wrapper">
                          <Link size={16} color="#9CA3AF" />
                          <input
                            type="text"
                            placeholder="클릭 시 이동할 링크 (선택)"
                            value={formData.link}
                            onChange={(e) => setFormData({ ...formData, link: e.target.value })}
                            className="multi-image-input"
                          />
                        </div>
                      </div>

                      <div className="multi-image-form-actions">
                        <button className="btn-save" onClick={handleSave}>수정</button>
                        <button className="btn-cancel" onClick={handleCancel}>취소</button>
                      </div>
                    </div>
                  </div>
                ) : (
                  /* 일반 모드 */
                  <div className="multi-image-card">
                    {/* 순서 버튼 */}
                    <div className="multi-image-order-btns">
                      <button
                        className="btn-order"
                        onClick={() => handleMoveUp(item.id)}
                        disabled={index === 0}
                      >
                        <ChevronUp size={18} />
                      </button>
                      <span className="order-number">{index + 1}</span>
                      <button
                        className="btn-order"
                        onClick={() => handleMoveDown(item.id)}
                        disabled={index === data.length - 1}
                      >
                        <ChevronDown size={18} />
                      </button>
                    </div>

                    {/* 썸네일 */}
                    <div className="multi-image-thumbnail">
                      <img src={getImageUrl(item.img)} alt={item.title || '이벤트 배너'} />
                    </div>

                    {/* 정보 */}
                    <div className="multi-image-info">
                      <p className="multi-image-name">{item.title || '(제목 없음)'}</p>
                      {item.link && <p className="multi-image-link">{item.link}</p>}
                      <p className="multi-image-date">{item.createdAt}</p>
                    </div>

                    {/* 액션 버튼 */}
                    <div className="multi-image-actions">
                      <button className="btn-edit" onClick={() => handleEditClick(item)}>
                        <Pencil size={16} />
                      </button>
                      <button className="btn-delete" onClick={() => handleDelete(item.id)}>
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
