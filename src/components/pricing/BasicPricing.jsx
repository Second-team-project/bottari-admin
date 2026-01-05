
export default function BasicPricing({ type }) {
  // type: 'DELIVERY' | 'STORAGE'
  
  return (
    <div className="basic-pricing-container">
      <h3>{type === 'DELIVERY' ? '배송' : '보관'} 기본 요금 설정</h3>
      <p style={{ color: '#666' }}>
        여기에 {type === 'DELIVERY' ? '배송' : '보관'} 관련 물품별 기본 요금 테이블이 들어갑니다. (Tab UI Grid)
      </p>
      {/* 추후 구현: ItemType 별 그리드 */}
    </div>
  );
}
