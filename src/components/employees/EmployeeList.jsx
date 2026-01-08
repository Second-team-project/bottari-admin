import { useEffect, useState } from 'react';
import { ChevronLeft, ChevronRight, Plus } from 'lucide-react';
import './EmployeeList.css';
import EmployeeDetail from './EmployeeDetail';
import { useDispatch, useSelector } from 'react-redux';
import { employeeDestroyThunk, employeeIndexThunk } from '../../store/thunks/employeeThunk.js';
import { openPanel, setPage } from '../../store/slices/employeeSlice.js';

export default function EmployeeList() {
  const dispatch = useDispatch();
  const { 
    employees, 
    totalCount, 
    currentPage,
    panel, 
    selectedData,
    loading
  } = useSelector(state => state.employee);
  const [searchTerm, setSearchTerm] = useState('');

  // 검색 핸들러
  const handleSearch = (e) => {
    e.preventDefault();
    dispatch(setPage(1));
    // 검색 시 page: 1과 검색어를 함께 전달
    dispatch(employeeIndexThunk({ page: 1, name: searchTerm }));
  };

  // 행 클릭 - 상세/수정 패널 열기
  const handleRowClick = (e, emp) => {
    e.stopPropagation(); // 행 클릭 이벤트 버블링 방지
    dispatch(openPanel({ mode: 'update', data: emp }));
  };

  /// 등록 버튼 클릭(store 모드)
  const handleOpenCreate = () => {
    dispatch(openPanel({ mode: 'store', data: null }));
  };

  // 삭제 처리
  const handleDelete = async (e, id) => {
    e.stopPropagation();
    if(window.confirm('정말 이 직원 정보를 삭제하시겠습니까?')) {
      await dispatch(employeeDestroyThunk(id))
        .unwrap()
        .then(() => {
          alert('삭제되었습니다.');
          // 삭제 후 현재 페이지 데이터 갱신
          dispatch(employeeIndexThunk({ page: currentPage, name: searchTerm }));
        })
        .catch((err) => {
          alert(`삭제 실패: ${err}`);
        });
    }
  };

  // 페이지네이션 핸들러
  const totalPages = Math.ceil(totalCount / 20);
  
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

  // 페이지 진입 시 데이터 조회
  useEffect(() => {
    dispatch(employeeIndexThunk(currentPage));
  }, []);

  return(
    <div className='employee-list-page'>
      <div className={`employee-list-container ${panel.isOpen ? 'with-panel' : ''}`}>
        {/* 타이틀 및 검색/등록 */}
        <div className='employee-list-top-bar'>
          <h2 className='page-title'>직원 관리</h2>

          <div className='employee-list-controls'>
            {/* 검색 폼 */}
            <form onSubmit={handleSearch} className='search-form'>
              <input 
                type="text" 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="이름 검색"
                className='search-input'
              />
              <button type="submit" className="btn-search">검색</button>
            </form>

            {/* 등록 버튼 */}
            <button className='btn-register' onClick={handleOpenCreate}>
              <Plus size={18} /> 직원 등록
            </button>
          </div>
        </div>

        {/* 테이블 */}
        <div className='employee-list-table'>
          {/* 테이블 헤더 */}
          <div className='employee-list-header'>
            <div className='employee-list-col-no'>번호</div>
            <div className='employee-list-col-name'>이름</div>
            <div className='employee-list-col-id'>아이디</div>
            <div className='employee-list-col-phone'>연락처</div>
            <div className='employee-list-col-date'>등록일</div>
            <div className='employee-list-col-actions'>관리</div>
          </div>

          {/* 테이블 바디 - 20개 행 */}
          {loading ? (
             <div className='state-message'>로딩 중...</div>
          ) : (
            employees.length > 0 ? (
              employees.map((emp, index) => (
                <div
                  key={emp.id}
                  className={`employee-list-row ${selectedData?.id === emp.id ? 'selected' : ''}`}
                  onClick={() => handleRowClick(emp)}
                >
                  <div className='employee-list-col-no'>{totalCount - ((currentPage - 1) * 10) - index}</div>
                  <div className='employee-list-col-name'>{emp.adminName}</div>
                  <div className='employee-list-col-id'>{emp.accountId}</div>
                  <div className='employee-list-col-phone'>{emp.phone}</div>
                  <div className='employee-list-col-date'>{emp.createdAt?.substring(0, 10)}</div>
                  <div className='employee-list-col-actions'>
                    <button className='btn-edit' onClick={(e) => {
                      e.stopPropagation();
                      handleRowClick(emp);
                    }}>수정</button>
                    <button className='btn-delete' onClick={(e) => handleDelete(e, emp.id)}>삭제</button>
                  </div>
                </div>
              ))
            ) : (
              <div className='state-message'>
                등록된 직원이 없습니다.
              </div>
            )
          )}
        </div>

          {/* 페이지네이션 */}
          <div className='employee-list-pagination'>
            <ChevronLeft 
              className={`pagination-btn ${currentPage === 1 ? 'disabled' : ''}`} 
              color={currentPage === 1 ? "#ccc" : "#6B7280"} 
              size={22}
              onClick={handlePrevPage}
            />
            <span className='page-number'>{currentPage} / {totalPages}</span>
            <ChevronRight 
              className={`pagination-btn ${currentPage === totalPages ? 'disabled' : ''}`} 
              color={currentPage === totalPages ? "#ccc" : "#6B7280"} 
              size={22} 
              onClick={handleNextPage}
            />
          </div>
        </div>
        {/* 사이드 패널 */}
      {panel.isOpen && <EmployeeDetail key={selectedData?.id || 'new'} />}
    </div>
  );
}


//           {[...Array(20)].map((_, index) => (
//             <div
//               key={index}
//               className={`employee-list-row ${selectedRow === index ? 'selected' : ''}`}
//               onClick={() => handleRowClick(index)}
//             >
//               <div className='employee-list-col-no'>{index + 1}</div>
//               <div className='employee-list-col-name'>홍길동</div>
//               <div className='employee-list-col-id'>hong123</div>
//               <div className='employee-list-col-phone'>010-9876-5432</div>
//               <div className='employee-list-col-date'>2024.01.15</div>
//               <div className='employee-list-col-actions'>
//                 <button className='btn-edit' onClick={(e) => e.stopPropagation()}>수정</button>
//                 <button className='btn-delete' onClick={(e) => e.stopPropagation()}>삭제</button>
//               </div>
//             </div>
//           ))}
//         </div>

//         {/* 페이지네이션 */}
//         <div className='employee-list-pagination'>
//           <ChevronLeft className='pagination-btn' color="#6B7280" size={22}/>
//           <span className='page-number'>1</span>
//           <ChevronRight className='pagination-btn' color="#6B7280" size={22} />
//         </div>
//       </div>

//       {/* 사이드 패널 */}
//       <EmployeeDetail selectedRow={selectedRow} onClose={handleClosePanel} />
//     </div>
//   )
// }
