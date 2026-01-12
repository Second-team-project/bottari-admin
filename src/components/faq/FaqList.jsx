import './FaqList.css';

import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Plus } from 'lucide-react';
import { useSearchParams } from 'react-router-dom';

import FaqModal from './FaqModal';
import { getFAQ, createFAQ, updateFAQ, deleteFAQ } from '../../api/faqApi';
import { toast } from 'sonner';
import dayjs from 'dayjs';

export default function FaqList() {
  // ===== hooks
  const [searchParams, setSearchParams] = useSearchParams();

  // ===== URL Query Params (Source of Truth)
  // URL에서 값을 읽어옵니다. 없으면 기본값을 사용합니다.
  const page = parseInt(searchParams.get('page')) || 1;
  const category = searchParams.get('category') || '전체';

  // API 요청용 객체
  const filters = { page, category };

  // ===== local states
  const [faqList, setFaqList] = useState([]);
  const [faqCount, setFaqCount] = useState(0);
  const [selectedItem, setSelectedItem] = useState(null);
  const [loading, setLoading] = useState(false);

  // 목록 조회 함수
  const fetchFaq = async (params) => {
    try {
      setLoading(true);
      const result = await getFAQ(params);
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

  // URL 파라미터가 변경되면 API 호출
  useEffect(() => {
    fetchFaq(filters);
  }, [searchParams]);

  // pagination
  const lastPage = Math.ceil(faqCount / 20) || 1;
  
  // ===== props 함수
  // 현재 상태로 목록 새로고침
  const refreshList = () => {
    fetchFaq(filters);
  }

  // 생성
  const handleCreate = async(item) => {
    try {
      await createFAQ(item);
      refreshList();
      
      toast.success('faq가 등록되었습니다.')
    } catch (error) {
    toast.error(error.message);
  }}
  // 수정
  const handleUpdate = async(item) => {
    try {
      // item이 { id, formData } 형태라고 가정 (기존 Thunk와 동일)
      await updateFAQ(item);
      refreshList();
      
      toast.success('faq가 수정되었습니다.')
    } catch (error) {
      toast.error(error.message);
    }
  }
  // 삭제
  const handleDelete = async(id) => {
    try {
      if (window.confirm('정말 삭제하시겠습니까?')) {
        await deleteFAQ(id);
        refreshList();
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

  // 카테고리 변경 핸들러
  const handleCategoryChange = (newCategory) => {
    setSearchParams({
      page: 1, // 필터 변경 시 1페이지로 리셋
      category: newCategory
    });
  };

  // 페이지 변경 핸들러
  const handlePageChange = (newPage) => {
    setSearchParams({
      page: newPage,
      category: category // 기존 카테고리 유지
    });
  };

  const CATEGORIES = ['전체', '예약', '배송', '보관', '결제/환불', '이용', '계정', '기타'];


  return(
    <div className='faq-list-page'>
      <div className='faq-list-top'>
        <h2 className='page-title'>FAQ 관리</h2>
        <button className='btn-add-faq' onClick={handleAddClick}>
          <Plus size={18} />
          FAQ 등록
        </button>
      </div>

      {/* 카테고리 필터링 */}
      <div className="faq-category-tabs">
        {
          CATEGORIES.map(cat => (
            <button key={cat}
              className={`search-list-tab ${category === cat ? 'active' : ''}`}
              onClick={() => handleCategoryChange(cat)}
            >{cat}</button>
          ))
        }
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
            {/* 번호: 전체 게시글 기준 역순이나 순차 번호가 좋지만, 여기선 페이지 내 인덱스 활용 */}
            <div className='faq-list-col-no'>{(page - 1) * 20 + index + 1}</div>
            <div className='faq-list-col-category'>
              <span>{item?.category || '일반'}</span>
            </div>
            <div className='faq-list-col-question'>{item?.title}</div>
            <div className='faq-list-col-date'>{dayjs(item?.createdAt).format('YYYY-MM-DD')}</div>
            <div className='store-list-col-actions'>
              <button className='btn-edit' onClick={(e) => { e.stopPropagation(); handleRowClick(item); }}>수정</button>
              <button className='btn-delete' onClick={(e) => {e.stopPropagation(); handleDelete(item?.id)}}>삭제</button>
            </div>
          </div>
        ))}
      </div>

      {/* 페이지네이션 */}
      <div className='faq-list-pagination'>
        <ChevronLeft size={22}
          className={`pagination-btn ${page === 1 ? 'disabled' : ''}`}
          onClick={() => handlePageChange(Math.max(1, page - 1))}
        />
        <span className='page-number'>{page}</span>
        <ChevronRight size={22} 
          className={`pagination-btn ${page >= lastPage ? 'disabled' : ''}`}
          onClick={() => handlePageChange(Math.min(lastPage, page + 1))}
        />
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
