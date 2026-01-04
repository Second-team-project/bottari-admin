import { useState } from 'react';
import './PricingPage.css';
import BasicPricing from './BasicPricing';
import AdditionalPricing from './AdditionalPricing';

export default function PricingPage() {
  // activeTab: 'DELIVERY' | 'STORAGE' | 'ADDITIONAL'
  const [activeTab, setActiveTab] = useState('DELIVERY');

  return (
    <div className='pricing-page'>
      <h2 className='page-title'>요금 관리</h2>

      {/* 탭 버튼 영역 */}
      <div className='pricing-tabs'>
        <button 
          className={`pricing-tab-btn ${activeTab === 'DELIVERY' ? 'active' : ''}`}
          onClick={() => setActiveTab('DELIVERY')}
        >
          배송 요금
        </button>
        <button 
          className={`pricing-tab-btn ${activeTab === 'STORAGE' ? 'active' : ''}`}
          onClick={() => setActiveTab('STORAGE')}
        >
          보관 요금
        </button>
        <button 
          className={`pricing-tab-btn ${activeTab === 'ADDITIONAL' ? 'active' : ''}`}
          onClick={() => setActiveTab('ADDITIONAL')}
        >
          추가 요금 설정
        </button>
      </div>

      {/* 탭 내용 영역 */}
      <div className='pricing-content'>
        {activeTab === 'DELIVERY' && <BasicPricing type="DELIVERY" />}
        {activeTab === 'STORAGE' && <BasicPricing type="STORAGE" />}
        {activeTab === 'ADDITIONAL' && <AdditionalPricing />}
      </div>
    </div>
  );
}
