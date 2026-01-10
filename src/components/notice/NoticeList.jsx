import { useEffect, useState } from 'react';
import { ChevronLeft, ChevronRight, Plus } from 'lucide-react';
import './NoticeList.css';
import NoticeModal from './NoticeModal';
import { useDispatch, useSelector } from 'react-redux';
import { noticeDeleteThunk, noticeIndexThunk } from '../../store/thunks/noticeThunk.js';
import NoticeCreateModal from './NoticeCreateModal.jsx';
import { toast } from 'sonner';

export default function NoticeList() {
  const dispatch = useDispatch();

  const { notices, page, limit, count } = useSelector(state => state.notice)

  
  // 공지사항 등록 모달
  const [createModalOpen, setCreateModalOpen] = useState(false);

  // 선택한 공지사항
  const [selectedItem, setSelectedItem] = useState(null);


  // 공지사항 클릭 시 모달 열기
  function handleRowClick(item) {
    setSelectedItem(item);
  }

  // 모달 닫기
  function handleCloseModal() {
    setSelectedItem(null);
  }


  // 공지사항 삭제 버튼
  const handleDeleteNotice = async (e, id) => {
    e.stopPropagation(); // 행 클릭 이벤트(상세보기) 전파 방지

    if (window.confirm('정말 삭제하시겠습니까?')) {
      try {
        await dispatch(noticeDeleteThunk(id)).unwrap();

        dispatch(noticeIndexThunk());

        toast.success('삭제되었습니다.');
      } catch (error) {
        console.log(error);
        toast.error(error.message);
      }
    }
  };

  // 페이지 이동 함수
  const handlePageChange = (newPage) => {
    // Thunk 호출 시 새 페이지 번호를 전달 (Thunk가 page 파라미터를 받도록 구성되어야 함)
    dispatch(noticeIndexThunk(newPage)); 
  };

  // 비활성화 조건 계산
  const isFirstPage = page <= 1;
  const isLastPage = page * limit >= count;

  useEffect(() => {
    dispatch(noticeIndexThunk());
  }, []);

  return(
    <div className='notice-list-page'>
      <div className='notice-list-top'>
        <h2 className='page-title'>공지사항 관리</h2>
        <button className='btn-add-notice'
          onClick={() => setCreateModalOpen(true)}
        >
          <Plus size={18} />
          공지사항 등록
        </button>
        <NoticeCreateModal
          createOpen={createModalOpen}
          createCancel={() => setCreateModalOpen(false)}
        />
      </div>

      {/* 테이블 */}
      <div className='notice-list-table'>
        {/* 테이블 헤더 */}
        <div className='notice-list-header'>
          <div>번호</div>
          <div>제목</div>
          <div>작성자</div>
          <div>작성일</div>
          <div>관리</div>
        </div>

        {/* 테이블 바디 */}
        {notices.map((notice, index) => (
          <div
            key={notice.id}
            className='notice-list-row'
            onClick={() => handleRowClick(notice)}
          >
            <div className='notice-list-col-no'>{(page - 1) * limit + index + 1}</div>
            <div className='notice-list-col-title'>{notice.title}</div>
            <div className='notice-list-col-writer'>{notice.noticeAdmin.adminName}</div>
            <div className='notice-list-col-date'>{notice.createdAt?.substring(0, 10)}</div>
            <div className='notice-list-col-actions'>
              <button type='button' className='btn-edit' onClick={handleRowClick}>수정</button>
              <button className='btn-delete' onClick={(e) => handleDeleteNotice(e, notice.id)}>삭제</button>
            </div>
          </div>
        ))}
      </div>

      {/* 페이지네이션 */}
      <div className='notice-list-pagination'>
        <button 
          className={`pagination-btn ${isFirstPage ? 'disabled' : ''}`}
          onClick={() => !isFirstPage && handlePageChange(page - 1)}
          disabled={isFirstPage}
        >
          <ChevronLeft size={22}/>
        </button>
        
        <span className='page-number'>{page}</span>
        
        <button 
          className={`pagination-btn ${isLastPage ? 'disabled' : ''}`}
          onClick={() => !isLastPage && handlePageChange(page + 1)}
          disabled={isLastPage}
        >
          <ChevronRight size={22} />
        </button>
      </div>

      {/* 중앙 상세 모달 */}
      <NoticeModal selectedItem={selectedItem} onClose={handleCloseModal} />
    </div>
  )
}
