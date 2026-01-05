import { Plus } from 'lucide-react';
import './BasicPricing.css';

export default function BasicPricing({ type }) {
  // type: 'DELIVERY' | 'STORAGE'
  
  // 임시 데이터 (차후 API 연동)
  const dummyData = [
    { id: 1, item_type: 'CARRIER', item_size: '21', item_weight: '~10kg', base_price: 9000 },
    { id: 2, item_type: 'CARRIER', item_size: '24', item_weight: '~10kg', base_price: 11000 },
    { id: 3, item_type: 'BAG', item_size: 'S', item_weight: '~10kg', base_price: 9000 },
    { id: 4, item_type: 'BOX', item_size: 'M', item_weight: '~20kg', base_price: 13000 },
  ];

  return (
    <div className="basic-pricing-page">
      <div className='basic-pricing-top'>
        <h2 className='basic-pricing-title'>
          {type === 'DELIVERY' ? '배송' : '보관'} 기본 요금 설정
        </h2>
        <button className='basic-pricing-btn-add'>
          <Plus size={18} />
          요금 등록
        </button>
      </div>

      {/* 테이블 영역 */}
      <div className='basic-pricing-table'>
        {/* 테이블 헤더 */}
        <div className='basic-pricing-header'>
          <div>품목 (크기)</div>
          <div>무게</div>
          <div>기본 요금</div>
          <div>관리</div>
        </div>

        {/* 테이블 바디 */}
        <div className='basic-pricing-body'>
          {dummyData.map((item) => (
            <div key={item.id} className='basic-pricing-row'>
              <div className='basic-pricing-col-name'>
                {item.item_type} ({item.item_size})
              </div>
              <div className='basic-pricing-col-weight'>{item.item_weight}</div>
              <div className='basic-pricing-col-price'>
                {item.base_price.toLocaleString()}원
              </div>
              <div className='basic-pricing-col-actions'>
                <button className='btn-edit' onClick={(e) => e.stopPropagation()}>수정</button>
                <button className='btn-delete' onClick={(e) => e.stopPropagation()}>삭제</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
