import { useEffect, useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import './DriverList.css';
import DriverDetail from './DriverDetail.jsx';
import { useDispatch, useSelector } from 'react-redux';
import { driverDestroyThunk, driverIndexThunk } from '../../store/thunks/driverThunk.js';
import { openPanel, setPage } from '../../store/slices/driverSlice.js';

export default function DriverList() {
  const dispatch = useDispatch();
  const { drivers, totalCount, currentPage, loading, panel } = useSelector((state) => state.driver);
  const [searchTerm, setSearchTerm] = useState(''); // 검색창 입력값

  // 검색 핸들러
  const handleSearch = (e) => {
    e.preventDefault();
    // 검색 시 1페이지로 초기화 후 검색
    dispatch(setPage(1));
    dispatch(driverIndexThunk({ page: 1, name: searchTerm }));
  };

  // 행 클릭 - 상세/수정 패널 열기
  const handleRowClick = (driver) => {
    dispatch(openPanel({ mode: 'show', data: driver }));
  };

  // 등록 버튼 클릭(store 모드)
  const handleOpenCreate = () => {
    dispatch(openPanel({ mode: 'store', data: null }));
  };

  // 삭제 핸들러
  const handleDelete = (e, id) => {
    e.stopPropagation(); // 부모의 클릭 이벤트(상세 열기) 방지
    if (window.confirm('정말 이 기사 정보를 삭제하시겠습니까?')) {
      dispatch(driverDestroyThunk(id))
        .unwrap()
        .then(() => {
          alert('삭제되었습니다.');
          // 삭제 후 데이터 갱신 (현재 페이지 유지 or 1페이지 이동)
          dispatch(driverIndexThunk({ page: currentPage, name: searchTerm }));
        })
        .catch((err) => {
          alert(`삭제 실패: ${err}`);
        });
    }
  };

  // 페이지네이션 핸들러
  const totalPages = Math.ceil(totalCount / 10);
  
  const handlePrevPage = () => {
    if(currentPage > 1) {
      return dispatch(setPage(currentPage - 1));
    }
  };

  const handleNextPage = () => {
    if(currentPage < totalPages) {
      return dispatch(setPage(currentPage + 1));
    }
  };

  // 페이지 변경 시 데이터 호출
  useEffect(() => {
    // 검색어가 있다면 검색어도 함께 보냄
    dispatch(driverIndexThunk({ page: currentPage, name: searchTerm }));
  }, [dispatch, currentPage]);

  return(
    <div className='driver-list-page'>
      <div className={`driver-list-container ${panel.isOpen ? 'with-panel' : ''}`}>
        {/* 상단 타이틀 및 검색/등록 */}
        <div className='driver-list-top-bar'>
          <h2 className='page-title'>기사 관리</h2>

          <div className='driver-list-controls'>
              {/* 검색 폼 */}
              <form onSubmit={handleSearch} className='search-form'>
                <input 
                  type="text" 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="이름 검색"
                  className='search-input'
                />
                <button type="submit" className="btn-edit">검색</button>
              </form>
              
              {/* 등록 버튼 */}
              <button className="btn-edit" onClick={handleOpenCreate} style={{ backgroundColor: '#2563EB' }}>
                + 기사 등록
              </button>
            </div>
          </div>

        {/* 테이블 */}
        <div className='driver-list-table'>
          {/* 테이블 헤더 */}
          <div className='driver-list-header'>
            <div className='driver-list-col-no'>번호</div>
            <div className='driver-list-col-name'>이름</div>
            <div className='driver-list-col-phone'>연락처</div>
            <div className='driver-list-col-car'>차량번호</div>
            <div className='driver-list-col-count'>배송건수</div>
            <div className='driver-list-col-date'>등록일</div>
            <div className='driver-list-col-actions'>관리</div>
          </div>

          {/* 테이블 바디 - 20개 행 */}
          {loading ? (
            <div className='state-message'>로딩 중...</div>
          ) : (
            drivers.length > 0 ? (
              drivers.map((driver) => (
                <div
                  key={driver.id}
                  // 현재 선택된 데이터와 ID가 같으면 selected 클래스 추가
                  className={`driver-list-row ${panel.selectedData?.id === driver.id ? 'selected' : ''}`}
                  onClick={() => handleRowClick(driver)}
                >
                  <div className='driver-list-col-no'>{driver.id}</div>
                  <div className='driver-list-col-name'>{driver.driverName}</div>
                  <div className='driver-list-col-phone'>{driver.phone}</div>
                  <div className='driver-list-col-car'>{driver.carNumber || '-'}</div>
                  <div className='driver-list-col-count'>{driver.deliveryCount || '-'}건</div> 
                  <div className='driver-list-col-date'>
                    {driver.createdAt ? new Date(driver.createdAt).toLocaleDateString() : '-'}
                  </div>
                  <div className='driver-list-col-actions'>
                    <button className='btn-edit' onClick={(e) => {
                        e.stopPropagation();
                        handleRowClick(driver); // 수정 버튼 클릭 시에도 동일하게 패널 열기
                      }}>수정</button>
                    <button className='btn-delete' onClick={(e) => handleDelete(e, driver.id)}>삭제</button>
                  </div>
                </div>
              ))
            ) : (
              <div style={{ padding: '40px', textAlign: 'center', color: '#999' }}>
                데이터가 없습니다.
              </div>
            )
          )}
        </div>

        {/* 페이지네이션 */}
        <div className='driver-list-pagination'>
          <ChevronLeft 
            className='pagination-btn' 
            color={currentPage === 1 ? "#ccc" : "#6B7280"} 
            size={22}
            onClick={handlePrevPage}
            style={{ pointerEvents: currentPage === 1 ? 'none' : 'auto' }}
          />
          <span className='page-number'>
            {currentPage} / {totalPages || 1}
          </span>
          <ChevronRight 
            className='pagination-btn' 
            color={currentPage === totalPages ? "#ccc" : "#6B7280"} 
            size={22} 
            onClick={handleNextPage}
            style={{ pointerEvents: currentPage === totalPages ? 'none' : 'auto' }}
          />
        </div>
      </div>

      {/* 사이드 패널 */}
      {panel.isOpen && (
        <DriverDetail key={panel.selectedData?.id || 'new'} />
      )}
    </div>
  )
}
