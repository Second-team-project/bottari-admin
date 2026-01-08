import './FaqList.css';

import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Plus } from 'lucide-react';
import { useDispatch } from 'react-redux';

import FaqModal from './FaqModal';
import { createFAQImgThunk, deleteFAQImgThunk, getFAQImgThunk, updateFAQImgThunk } from '../../store/thunks/faqThunk';
import { toast } from 'sonner';
import dayjs from 'dayjs';

export default function FaqList() {
  // ===== hooks
  const dispatch = useDispatch()
  // ===== local states
  const [faqList, setFaqList] = useState([]);
  const [faqCount, setFaqCount] = useState(0);
  const [selectedItem, setSelectedItem] = useState(null);
  const [loading, setLoading] = useState(false);

  // 목록 조회 함수
  const fetchFaq = async () => {
    try {
      setLoading(true);
      const result = await dispatch(getFAQImgThunk()).unwrap();
      console.log('result: ', result.faqs);
      console.log('result-count: ', result.count);
      
      setFaqList(result.faqs);
      setFaqCount(result.count);
    } catch (error) {
      toast.error('오류가 발생했습니다. 새로고침 해주세요.')
      console.error("FAQ 목록 조회 실패:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFaq();
  }, []);
  
  // ===== props 함수
  // 생성
  const handleCreate = async(item) => {
    try {
      await dispatch(createFAQImgThunk(item)).unwrap();
      fetchFaq();
      
      toast.success('faq가 등록되었습니다.')
    } catch (error) {
    toast.error(error.message);
  }}
  // 수정
  const handleUpdate = async(item) => {
    try {
      await dispatch(updateFAQImgThunk(item)).unwrap();
      fetchFaq();
      
      toast.success('faq가 수정되었습니다.')
    } catch (error) {
      toast.error(error.message);
    }
  }
  // 삭제
  const handleDelete = async(id) => {
    try {
      if (window.confirm('정말 삭제하시겠습니까?')) {
        await dispatch(deleteFAQImgThunk(id)).unwrap();
        fetchFaq();
        toast.success('faq가 삭제되었습니다.')
      }
    } catch (error) {
      toast.error(error.message);
    }
  }
  
  // 데이터 클릭 시 모달 열기 (수정 모드)
  function handleRowClick(item) {
    setSelectedItem(item);
  }

  // 신규 등록 버튼 클릭
  function handleAddClick() {
    setSelectedItem({ id: 'new' });
  }

  // 모달 닫기
  function handleCloseModal() {
    setSelectedItem(null);
  }

  return(
    <div className='faq-list-page'>
      <div className='faq-list-top'>
        <h2 className='page-title'>FAQ 관리</h2>
        <button className='btn-add-faq' onClick={handleAddClick}>
          <Plus size={18} />
          FAQ 등록
        </button>
      </div>

      {/* 테이블 */}
      <div className='faq-list-table'>
        {/* 테이블 헤더 */}
        <div className='faq-list-header'>
          <div>번호</div>
          <div>카테고리</div>
          <div>질문</div>
          <div>작성일</div>
          {/* 관리 컬럼은 모달 안에서 처리하므로 목록에서는 제거하거나 상세보기를 유도 */}
          <div>관리</div>
        </div>

        {/* 로딩 중 표시 */}
        {loading && <div className='faq-list-loading'>로딩 중...</div>}

        {/* 데이터 없음 표시 */}
        {!loading && faqList?.length === 0 && (
          <div className='faq-list-empty'>등록된 FAQ가 없습니다.</div>
        )}

        {/* 테이블 바디 */}
        {!loading && faqList?.map((item, index) => (
          <div
            key={item?.id || index}
            className='faq-list-row'
            onClick={() => handleRowClick(item)}
          >
            {/* 번호: 역순 or 순차, 여기선 인덱스 사용 */}
            <div className='faq-list-col-no'>{index + 1}</div>
            <div className='faq-list-col-category'>
              <span>{item?.category || '일반'}</span>
            </div>
            <div className='faq-list-col-question'>{item?.title}</div>
            <div className='faq-list-col-date'>{dayjs(item?.createdAt).format('YYYY-MM-DD HH:mm')}</div>
            <div className='store-list-col-actions'>
              <button className='btn-edit' onClick={(e) => { e.stopPropagation(); handleRowClick(item); }}>수정</button>
              <button className='btn-delete' onClick={(e) => {e.stopPropagation(); handleDelete(item?.id)}}>삭제</button>
            </div>
          </div>
        ))}
      </div>

      {/* 페이지네이션 (추후 구현, 현재는 UI만 유지) */}
      <div className='faq-list-pagination'>
        <ChevronLeft className='pagination-btn' color="#6B7280" size={22}/>
        <span className='page-number'>1</span>
        <ChevronRight className='pagination-btn' color="#6B7280" size={22} />
      </div>

      {/* 모달 */}
      {
        selectedItem && (
          <FaqModal 
            item={selectedItem}
            onClose={handleCloseModal} 
            onCreate={handleCreate} onUpdate={handleUpdate} onDelete={handleDelete}
          />
        )
      }
    </div>
  )
}
