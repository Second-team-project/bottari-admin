import { Plus } from 'lucide-react';
import './AdditionalPricing.css';

export default function AdditionalPricing() {
  
  // 임시 데이터 (차후 API 연동)
  const dummyData = [
    { id: 1, service_type: 'STORAGE', min_value: 1, max_value: 3, rate: 100 },
    { id: 2, service_type: 'STORAGE', min_value: 4, max_value: 7, rate: 85 },
    { id: 3, service_type: 'STORAGE', min_value: 8, max_value: 15, rate: 75 },
    { id: 4, service_type: 'STORAGE', min_value: 16, max_value: 30, rate: 65 },
  ];

  return (
    <div className="additional-pricing-page">
      <div className='additional-pricing-top'>
        <h2 className='additional-pricing-title'>추가 요금 설정</h2>
        <button className='additional-pricing-btn-add'>
          <Plus size={18} />
          추가 요금 등록
        </button>
      </div>

      {/* 테이블 영역 */}
      <div className='additional-pricing-table'>
        {/* 테이블 헤더 */}
        <div className='additional-pricing-header'>
          <div>서비스 타입</div>
          <div>적용 구간 (일/거리)</div>
          <div>적용 요율 (%)</div>
          <div>관리</div>
        </div>

        {/* 테이블 바디 */}
        <div className='additional-pricing-body'>
          {dummyData.map((item) => (
            <div key={item.id} className='additional-pricing-row'>
              <div className='additional-pricing-col-type'>
                {item.service_type === 'STORAGE' ? '보관' : '배송'}
              </div>
              <div className='additional-pricing-col-range'>
                {item.min_value} ~ {item.max_value}
              </div>
              <div className='additional-pricing-col-rate'>
                {item.rate}%
              </div>
              <div className='additional-pricing-col-actions'>
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