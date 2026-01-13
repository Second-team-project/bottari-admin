import { useEffect, useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import './DriverList.css';
import { useDispatch, useSelector } from 'react-redux';
import { driverDestroyThunk, driverIndexThunk } from '../../store/thunks/driverThunk.js';
import { openPanel, setPage } from '../../store/slices/driverSlice.js';
import dayjs from 'dayjs';
import { PatternFormat } from 'react-number-format';
import DirverPanel from './DirverPanel.jsx';

export default function DriverList() {
  const dispatch = useDispatch();
  const { drivers, totalCount, currentPage, loading, panel } = useSelector((state) => state.driver);
  const [searchTerm, setSearchTerm] = useState(''); // 검색창 입력값

  // 검색 핸들러
  function handleSearch(e) {
    e.preventDefault();
    // 검색 시 1페이지로 초기화 후 검색
    dispatch(setPage(1));
    dispatch(driverIndexThunk({ page: 1, driverName: searchTerm }));
  };

  // 행 클릭 - 상세 패널 열기
  function handleRowClick(driver) {
    dispatch(openPanel({ mode: 'show', data: driver }));
  };

  // 등록 버튼 클릭(store 모드)
  function handleOpenCreate() {
    dispatch(openPanel({ mode: 'store', data: null }));
  };

  // 삭제 핸들러
  const handleDelete = (e, id) => {
    e.stopPropagation(); // 부모의 클릭 이벤트(상세 열기) 방지
    if(window.confirm('정말 이 기사 정보를 삭제하시겠습니까?')) {
      dispatch(driverDestroyThunk(id)).unwrap()
        .then(() => {
          alert('삭제되었습니다.');
          // 삭제 후 데이터 갱신(현재 페이지 유지)
          dispatch(driverIndexThunk({ page: currentPage, driverName: searchTerm }));
        })
        .catch((err) => {
          alert(`삭제 실패: ${err}`);
        });
    }
  };

  // 페이지네이션 핸들러
  const totalPages = Math.ceil(totalCount / 20);
  
  function handlePrevPage() {
    if(currentPage > 1) {
      dispatch(setPage(currentPage - 1));
    }
  };

  function handleNextPage() {
    if(currentPage < totalPages) {
      dispatch(setPage(currentPage + 1));
    }
  };

  // 페이지 변경 시 데이터 호출
  useEffect(() => {
    // 검색어가 있다면 검색어도 함께 보냄
    dispatch(driverIndexThunk({ page: currentPage, driverName: searchTerm }));
  }, [dispatch, currentPage]);

  console.log("=== 리스트 데이터 확인 ===", drivers);

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
              <button className="create-btn" onClick={handleOpenCreate}>
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
            <div className='driver-list-col-state'>상태</div>
            <div className='driver-list-col-phone'>연락처</div>
            <div className='driver-list-col-email'>이메일</div>
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
              drivers.map((driver, index) => (
                <div
                  key={driver.id}
                  // 현재 선택된 데이터와 ID가 같으면 selected 클래스 추가
                  className={`driver-list-row ${panel.selectedData?.id === driver.id ? 'selected' : ''}`}
                  onClick={() => handleRowClick(driver)}
                >
                  <div className='driver-list-col-no'>{(currentPage - 1) * 20 + index + 1}</div>
                  <div className='driver-list-col-name'>{driver.driverName}</div>
                  <div className={`driver-list-col-state ${driver.attendanceState === 'CLOCKED_IN' ? 'status-on' : 'status-off'}` }>
                      {driver.attendanceState === 'CLOCKED_IN' ? '🟢 출근' : '⚪ 퇴근'}
                  </div>
                  <div className='driver-list-col-phone'>
                    <PatternFormat
                      value={driver.phone}
                      format="###-####-####"
                      displayType="text"
                    />
                  </div>
                  <div className='driver-list-col-email'>{driver.email}</div>
                  <div className='driver-list-col-car'>{driver.carNumber || '-'}</div>
                  <div className='driver-list-col-count'>{driver.deliveryCount || '-'}건</div> 
                  <div className='driver-list-col-date'>
                    {driver.createdAt ? dayjs(driver.createdAt).format('YYYY.MM.DD') : '-'}
                  </div>
                  <div className='driver-list-col-actions'>
                    <button className='btn-edit' onClick={(e) => {
                        e.stopPropagation();
                        dispatch(openPanel({ mode: 'update', data: driver }));
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
          {/* 이전 페이지 버튼 */}
          <button 
            className='pagination-btn' 
            onClick={handlePrevPage} 
            disabled={currentPage === 1}
          >
            <ChevronLeft 
              color={currentPage === 1 ? "#ccc" : "#6B7280"} 
              size={22}
            />
          </button>

          <span className='page-number'>
            {currentPage || 1}
          </span>

          {/* 다음 페이지 버튼 */}
          <button 
            className='pagination-btn' 
            onClick={handleNextPage} 
            disabled={currentPage === totalPages}
          >
            <ChevronRight 
              color={currentPage === totalPages ? "#ccc" : "#6B7280"} 
              size={22} 
            />
          </button>
        </div>
      </div>

      {/* 사이드 패널 */}
      {panel.isOpen && (
        <DirverPanel />
      )}
    </div>
  )
}
