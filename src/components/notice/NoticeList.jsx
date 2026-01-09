import { useEffect, useState } from 'react';
import { ChevronLeft, ChevronRight, Plus } from 'lucide-react';
import './NoticeList.css';
import NoticeModal from './NoticeModal';
import { useDispatch, useSelector } from 'react-redux';
import { noticeIndexThunk } from '../../store/thunks/noticeThunk.js';

export default function NoticeList() {
  const dispatch = useDispatch();

  const { notices, page, limit } = useSelector(state => state.notice)

  const [selectedItem, setSelectedItem] = useState(null);

  // 공지사항 클릭 시 모달 열기
  function handleRowClick(item) {
    setSelectedItem(item);
  }

  // 모달 닫기
  function handleCloseModal() {
    setSelectedItem(null);
  }

  useEffect(() => {
    dispatch(noticeIndexThunk());
  }, []);

  return(
    <div className='notice-list-page'>
      <div className='notice-list-top'>
        <h2 className='page-title'>공지사항 관리</h2>
        <button className='btn-add-notice'>
          <Plus size={18} />
          공지사항 등록
        </button>
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

        {/* 테이블 바디 - 더미 데이터 10개 */}
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
              <button className='btn-edit' onClick={(e) => e.stopPropagation()}>수정</button>
              <button className='btn-delete' onClick={(e) => e.stopPropagation()}>삭제</button>
            </div>
          </div>
        ))}
      </div>

      {/* 페이지네이션 */}
      <div className='notice-list-pagination'>
        <ChevronLeft className='pagination-btn' size={22}/>
        <span className='page-number'>1</span>
        <ChevronRight className='pagination-btn' size={22} />
      </div>

      {/* 중앙 상세 모달 */}
      <NoticeModal selectedItem={selectedItem} onClose={handleCloseModal} />
    </div>
  )
}
