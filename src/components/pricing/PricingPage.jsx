import './PricingPage.css';

import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';

import BasicPricing from './BasicPricing.jsx';
import AdditionalPricing from './AdditionalPricing.jsx';

import { createAdditionalPricingThunk, createPricingThunk, deleteAdditionalPricingThunk, deletePricingThunk, getAdditionalPricingThunk, getPricingThunk, updateAdditionalPricingThunk, updatePricingThunk } from '../../store/thunks/pricingThunk.js';
import { toast } from 'sonner';

export default function PricingPage() {
  // ===== hooks
  const dispatch = useDispatch();
  // ===== local states
  // 기본 요금 데이터
  const [basePricing, setBasePricing] = useState([]);
  // 추가 요금 데이터
  const [additionalPricing, setAdditionalPricing] = useState([]);
  // activeTab: 'DELIVERY' | 'STORAGE' | 'ADDITIONAL'
  const [activeTab, setActiveTab] = useState('DELIVERY');

  // 기본 가격 불러오기
  const fetchBasePrice = async() => {
    try {
      const result = await dispatch(getPricingThunk()).unwrap()
      
      // console.log('PricingPage: ', result)

      setBasePricing(result)
      
    } catch (error) {
      toast.error('오류가 발생했습니다. 새로고침 해주세요.')
      console.error('기본 요금 불러오기 실패: ', error)
    }
  }

  // 추가 가격 불러오기
  const fetchAdditionalPrice = async() => {
    try {
      const result = await dispatch(getAdditionalPricingThunk()).unwrap()
      
      console.log('fetchAdditionalPrice: ', result)

      setAdditionalPricing(result)
      
    } catch (error) {
      toast.error('오류가 발생했습니다. 새로고침 해주세요.')
      console.error('기본 요금 불러오기 실패: ', error)
    }
  }

  // 마운트 시 가격 불러오기
  useEffect(() => {
    fetchBasePrice();
    fetchAdditionalPrice();
  }, [])

  // ===== props 보낼 함수
  // === 기본
  // 생성
  const handleCreate = async(item) => {
    try {
      await dispatch(createPricingThunk(item)).unwrap();
      fetchBasePrice();

      toast.success('요금이 등록되었습니다.')
  } catch (error) {
    toast.error(error.message);
  }}
  // 수정
  const handleUpdate = async(item) => {
    try {
      await dispatch(updatePricingThunk(item)).unwrap();
      fetchBasePrice();

      toast.success('요금이 수정되었습니다.')
    } catch (error) {
      toast.error(error.message);
    }
  }
  // 삭제
  const handleDelete = async(id) => {
    try {
      await dispatch(deletePricingThunk(id)).unwrap();
      fetchBasePrice();
      
      toast.success('요금이 삭제되었습니다.')
    } catch (error) {
      toast.error(error.message);
    }
  }
  // === 추가
  // 생성
  const handleCreateAdditional = async(item) => {
    try {
      await dispatch(createAdditionalPricingThunk(item)).unwrap();
      fetchAdditionalPrice();

      toast.success('요금이 등록되었습니다.')
    } catch (error) {
      toast.error(error.message);
    }
  }
  // 수정
  const handleUpdateAdditional = async(item) => {
    try {
      await dispatch(updateAdditionalPricingThunk(item)).unwrap();
      fetchAdditionalPrice();

      toast.success('요금이 수정되었습니다.')
    } catch (error) {
      toast.error(error.message);
    }
  }
  // 삭제
  const handleDeleteAdditional = async(id) => {
    try {
      await dispatch(deleteAdditionalPricingThunk(id)).unwrap();
      fetchAdditionalPrice();
      
      toast.success('요금이 삭제되었습니다.')
    } catch (error) {
      toast.error(error.message);
    }
  }


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
        {activeTab === 'DELIVERY' && <BasicPricing type="D" 
          data={basePricing.filter(data => data.serviceType === 'D')} 
          onCreate={handleCreate} onUpdate={handleUpdate} onDelete={handleDelete}
        />}
        {activeTab === 'STORAGE' && <BasicPricing type="S" 
          data={basePricing.filter(data => data.serviceType === 'S')} 
          onCreate={handleCreate} onUpdate={handleUpdate} onDelete={handleDelete}
        />}
        {activeTab === 'ADDITIONAL' && <AdditionalPricing 
          data={additionalPricing} 
          onCreate={handleCreateAdditional} onUpdate={handleUpdateAdditional} onDelete={handleDeleteAdditional}
        />}
      </div>
    </div>
  );
}
