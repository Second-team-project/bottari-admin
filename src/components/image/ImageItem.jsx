
export default function ImageItem({ category }) {
  // category: 'MAIN_BANNER' | 'EVENT_BANNER' | 'SERVICE_INTRO' | 'GUIDE' | 'PRICING_GUIDE'
  
  return (
    <div className="image-item-container" style={{ textAlign: 'center' }}>
      <h3 style={{ marginBottom: '20px' }}>{category} 이미지 관리</h3>
      
      {/* 이미지 미리보기 박스 (틀) */}
      <div style={{ 
        width: '100%', 
        maxWidth: '600px', 
        height: '300px', 
        backgroundColor: '#eee', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        borderRadius: '8px',
        margin: '0 auto 20px',
        color: '#999'
      }}>
        이미지 미리보기 영역
      </div>

      <div className="image-item-actions" style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
        <button className="btn-edit" style={{ padding: '10px 20px' }}>이미지 변경/등록</button>
        <button className="btn-delete" style={{ padding: '10px 20px' }}>삭제</button>
      </div>
    </div>
  );
}
