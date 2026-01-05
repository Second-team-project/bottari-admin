import { useEffect, useState } from 'react';
import { ChevronDown, ChevronLeft, ChevronRight, X, Plus, Search, RefreshCw } from 'lucide-react';
import './ReservationList.css';
import ReservationDetail from './ReservationDetail.jsx';
import { useDispatch, useSelector } from 'react-redux';
import { reservationDestroyThunk, reservationIndexThunk } from '../../store/thunks/reservationThunk.js';
import { openPanel } from '../../store/slices/reservationSlice.js';

export default function ReservationList() {
  const dispatch = useDispatch();
  const { reservations, totalCount, loading, panel } = useSelector((state) => state.reservation);
  // 검색 필터 상태 (로컬 관리)
  const [filters, setFilters] = useState({
    page: 1,
    state: '',
    searchType: 'userName',
    keyword: '',
    startDate: '',
    endDate: '',
  });

  // 검색 핸들러
  const handleSearch = () => {
    setFilters({ ...filters, page: 1 });
    dispatch(reservationIndexThunk({ ...filters, page: 1 }));
  };

  // 엔터키 처리
  const handleKeyDown = (e) => {
    if(e.key === 'Enter') {
      return handleSearch();
    }
  };

  // 입력값 변경 핸들러
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  // 상태(Select) 변경 시 즉시 검색
  const handleStateChange = (e) => {
    const newState = e.target.value;
    setFilters((prev) => ({ ...prev, state: newState, page: 1 }));
    dispatch(reservationIndexThunk({ ...filters, state: newState, page: 1 }));
  };

  // 삭제 핸들러
  const handleDelete = async (id) => {
    if (window.confirm('정말 이 예약을 삭제하시겠습니까?')) {
      await dispatch(reservationDestroyThunk(id));
      // 삭제 후 목록이 줄어드니 필요하면 재조회 로직 추가 가능(현재는 리덕스에서 자동 제거됨)
    }
  };

  useEffect(() => {
    dispatch(reservationIndexThunk(filters));
  }, [dispatch, filters.page]);

  return(
    <div className='reservation-list-page'>
      <div className={`reservation-list-container ${panel.isOpen ? 'with-panel' : ''}`}>

        {/* 상단 헤더(제목 + 등록 버튼) */}
        <div className='list-page-header'>
          <h2 className='page-title'>예약 관리</h2>
          <button 
            className='create-btn' 
            onClick={() => dispatch(openPanel({ mode: 'store', data: null }))}
          >
            <Plus size={16} /> 예약 등록
          </button>
        </div>

        {/* 검색 및 필터 영역 */}
        <div className='reservation-search-bar'>
          <div className='search-group'>
            <label>기간</label>
            <input type='date' name='startDate' value={filters.startDate} onChange={handleChange} />
            <span>~</span>
            <input type='date' name='endDate' value={filters.endDate} onChange={handleChange} />
          </div>

          <div className='search-group'>
            <label>상태</label>
            <select name='state' value={filters.state} onChange={handleStateChange}>
              <option value=''>전체</option>
              <option value='PENDING_PAYMENT'>결제대기</option>
              <option value='RESERVED'>예약완료</option>
              <option value='CANCELLED'>취소됨</option>
            </select>
          </div>

          <div className='search-group right-align'>
            <select name='searchType' value={filters.searchType} onChange={handleChange}>
              <option value='userName'>예약자명</option>
              <option value='code'>예약코드</option>
            </select>
            <input
              type='text'
              name='keyword'
              placeholder='검색어 입력'
              value={filters.keyword}
              onChange={handleChange}
              onKeyDown={handleKeyDown}
            />
            <button className='search-icon-btn' onClick={handleSearch}>
              <Search size={18} />
            </button>
            <button className='reset-icon-btn' onClick={() => window.location.reload()}>
              <RefreshCw size={18} />
            </button>
          </div>
        </div>

        {/* 테이블 */}
        <div className='reservation-list-table'>
          {/* 테이블 헤더 */}
          <div className='reservation-list-header'>
            <div className='reservation-list-col-no'>No</div>
            <div className='reservation-list-col-type'>예약코드</div>
            <div className='reservation-list-col-name'>예약자명</div>
            <div className='reservation-list-col-phone'>연락처</div>
            <div className='reservation-list-col-date'>신청날짜</div>
            <div className='reservation-list-col-status'>처리현황</div>
            <div className='reservation-list-col-actions'>관리</div>
          </div>

          {/* 테이블 바디 (Redux 데이터 매핑) */}
          {loading ? (
             <div className='loading-msg'>데이터를 불러오는 중입니다...</div>
          ) : reservations.length === 0 ? (
             <div className='empty-msg'>검색 결과가 없습니다.</div>
          ) : (
            reservations.map((item) => (
              <div
                key={item.id}
                className={`reservation-list-row ${panel.selectedReservation?.id === item.id ? 'selected' : ''}`}
                onClick={() => dispatch(openPanel({ mode: 'show', data: item }))} // 행 클릭 시 상세 모드
              >
                <div className='reservation-list-col-no'>{item.id}</div>
                <div className='reservation-list-col-type'>{item.code}</div>
                <div className='reservation-list-col-name'>
                  {item.reservationUser ? item.reservationUser.userName : '(비회원)'}
                </div>
                <div className='reservation-list-col-phone'>
                  {item.reservationUser ? item.reservationUser.phone : '-'}
                </div>
                <div className='reservation-list-col-date'>
                  {item.createdAt?.substring(0, 10)}
                </div>
                <div className='reservation-list-col-status'>
                  <span className={`status-text ${item.state}`}>
                    {item.state === 'PENDING_PAYMENT' && '결제대기'}
                    {item.state === 'RESERVED' && '예약완료'}
                    {item.state === 'CANCELLED' && '취소'}
                  </span>
                </div>
                <div className='reservation-list-col-actions'>
                  <button 
                    className='btn-edit' 
                    onClick={(e) => {
                      e.stopPropagation(); // 행 클릭 이벤트 막기
                      dispatch(openPanel({ mode: 'update', data: item }));
                    }}
                  >
                    수정
                  </button>
                  <button 
                    className='btn-delete' 
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDelete(item.id);
                    }}
                  >
                    삭제
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* 페이지네이션 */}
        <div className='reservation-list-pagination'>
          <button 
            className='pagination-btn' 
            disabled={filters.page === 1}
            onClick={() => setFilters({...filters, page: filters.page - 1})}
          >
            <ChevronLeft color="#6B7280" size={22}/>
          </button>
          
          <span className='page-number'>{filters.page}</span>
          
          <button 
            className='pagination-btn'
            // 다음 페이지 데이터가 없으면 비활성화 (간단 로직)
            disabled={reservations.length < 20} 
            onClick={() => setFilters({...filters, page: filters.page + 1})}
          >
            <ChevronRight color="#6B7280" size={22} />
          </button>
        </div>
      </div>
      {panel.isOpen && (
        <ReservationDetail 
          key={panel.mode + (panel.selectedReservation?.id || '')} 
        />
      )}
    </div>
  );
}