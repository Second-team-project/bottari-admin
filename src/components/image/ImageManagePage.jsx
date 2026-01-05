import { useState } from 'react';
import './ImageManagePage.css';
import ImageItem from './ImageItem';

export default function ImageManagePage() {
  // activeTab: 'MAIN' | 'EVENT' | 'INTRO' | 'GUIDE' | 'PRICE'
  const [activeTab, setActiveTab] = useState('MAIN');

  return (
    <div className='image-manage-page'>
      <h2 className='page-title'>이미지 관리</h2>

      {/* 탭 버튼 영역 */}
      <div className='image-manage-tabs'>
        <button 
          className={`image-manage-tab-btn ${activeTab === 'MAIN' ? 'active' : ''}`}
          onClick={() => setActiveTab('MAIN')}
        >
          메인 배너
        </button>
        <button 
          className={`image-manage-tab-btn ${activeTab === 'EVENT' ? 'active' : ''}`}
          onClick={() => setActiveTab('EVENT')}
        >
          이벤트 배너
        </button>
        <button 
          className={`image-manage-tab-btn ${activeTab === 'INTRO' ? 'active' : ''}`}
          onClick={() => setActiveTab('INTRO')}
        >
          서비스 소개
        </button>
        <button 
          className={`image-manage-tab-btn ${activeTab === 'GUIDE' ? 'active' : ''}`}
          onClick={() => setActiveTab('GUIDE')}
        >
          이용 안내
        </button>
        <button 
          className={`image-manage-tab-btn ${activeTab === 'PRICE' ? 'active' : ''}`}
          onClick={() => setActiveTab('PRICE')}
        >
          요금 안내
        </button>
      </div>

      {/* 탭 내용 영역 */}
      <div className='image-manage-content'>
        {activeTab === 'MAIN' && <ImageItem category="메인 배너" />}
        {activeTab === 'EVENT' && <ImageItem category="이벤트 배너" />}
        {activeTab === 'INTRO' && <ImageItem category="서비스 소개" />}
        {activeTab === 'GUIDE' && <ImageItem category="이용 안내" />}
        {activeTab === 'PRICE' && <ImageItem category="요금 안내" />}
      </div>
    </div>
  );
}
