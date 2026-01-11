import './UserList.css';

import { useEffect, useState } from 'react';
import { ChevronLeft, ChevronRight, RefreshCw, Search } from 'lucide-react';
import { Outlet, useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { toast } from 'sonner';

import UserDetail from './UserDetail.jsx';
import { getUsers } from '../../api/userApi.js';

export default function UserList() {
  // ===== hooks
  const navigate = useNavigate()
  const { id: urlId } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();

  // ===== URL Query Params (Source of Truth)
  // URL에서 값을 읽어옵니다. 없으면 기본값을 사용합니다.
  const page = parseInt(searchParams.get('page')) || 1;
  const status = searchParams.get('status') || '';
  const searchType = searchParams.get('searchType') || 'userName';
  const keyword = searchParams.get('keyword') || '';

  // API 요청용 객체 (useEffect 의존성)
  const filters = { page, status, searchType, keyword };

  // ===== local states
  const [userList, setUserList] = useState([]);
  const [userCount, setUserCount] = useState(0);
  const [selectedUser, setSelectedUser] = useState(null);
  
  // 입력창 state (URL과 동기화 필요)
  const initInputs = { searchType: 'userName', keyword: '' };
  const [inputs, setInputs] = useState({
    searchType: searchType || 'userName',
    keyword: keyword || ''
  });

  const lastPage = Math.ceil(userCount / 20) || 1;
  
  const STATUS_TABS = [
    { label: '전체', value: '' },
    { label: '정상', value: 'ACTIVE' },
    { label: '차단', value: 'BLOCKED' },
    { label: '탈퇴', value: 'WITHDRAWN' },
  ];

  // 유저 데이터 불러오기
  const fetchUsers = async(params) => {
    try {
      const result = await getUsers(params);
      setUserList(result.users);
      setUserCount(result.count);

      console.log('fetchUsers: ', result);
    } catch (error) {
      toast.error('유저 데이터를 불러오는데 실패했습니다.');
      console.error('유저 데이터 불러오기 실패:', error);
    }
  };

  // 1. URL 파라미터가 변경되면 API 호출
  useEffect(() => {
    fetchUsers(filters);
  }, [searchParams]); // searchParams 객체 자체가 변할 때 감지

  // 2. URL이 변경되면(예: 뒤로가기, 새로고침) 입력창도 동기화
  useEffect(() => {
    setInputs({
      searchType: searchType,
      keyword: keyword
    });
  }, [searchType, keyword]);

  // 3. URL ID로 유저 선택 처리
  useEffect(() => {
    if(urlId && userList.length > 0) {
      const index = userList.findIndex(user => String(user.id) === urlId);
      if(index !== -1) {
        setSelectedUser(index);
      }
    }
  }, [urlId, userList]);

  // ===================
  // ||     핸들러     ||
  // === 패널 관련
  function handleOpen({ user, index }) {
    setSelectedUser(index);
    navigate(`/users/${user.id}`)
  }

  function handleClose() {
    setSelectedUser(null);
    navigate(`/users`);
  }

  // === 필터 관련
  // 입력값 변경 (Local State만 변경)
  const handleChange = (e) => {
    const { name, value } = e.target;
      setInputs(prev => ({ ...prev, [name]: value }));
  };

  // 검색 실행 (URL 변경 -> API 호출)
  const handleSearch = () => {
    setSearchParams({
      page: 1, // 검색 시 1페이지 리셋
      status: status, // 기존 상태 유지
      searchType: inputs.searchType,
      keyword: inputs.keyword
    });
  };

  // 엔터키
  const handleKeyDown = (e) => {
    if(e.key === 'Enter') handleSearch();
  };

  // 필터 초기화
  const handleReset = () => {
    setInputs(initInputs);
    setSearchParams({}); // URL 쿼리 전부 제거
  };

  // 상태 필터 변경 (URL 변경)
  const handleStatusChange = (newStatus) => {
    setSearchParams({
      page: 1,
      status: newStatus,
      searchType: searchType, // 기존 검색어 유지
      keyword: keyword
    });
  };

  // 페이지 변경
  const handlePageChange = (newPage) => {
    setSearchParams({
      page: newPage,
      status: status,
      searchType: searchType,
      keyword: keyword
    });
  }

  // === detail에 넘겨줄 
  const refreshList = () => {
    // 현재 URL에 있는 파라미터를 그대로 읽어서 fetchUsers 호출
    const currentFilters = {
      page: parseInt(searchParams.get('page')) || 1,
      status: searchParams.get('status') || '',
      searchType: searchParams.get('searchType') || 'userName',
      keyword: searchParams.get('keyword') || ''
    };
  fetchUsers(currentFilters);
  }

  return(
    <div className='user-list-page'>
      <div className={`user-list-container ${selectedUser !== null ? 'with-panel' : ''}`}>
        <h2 className='list-page-header'>회원 관리</h2>

        {/* 검색 */}
        <div className='reservation-search-bar'>

          {/* 카테고리 필터링 */}
          <div className="search-group">
            {
              STATUS_TABS.map(tab => (
                <button key={tab.label}
                  className={`search-list-tab ${status === tab.value ? 'active' : ''}`}
                  onClick={() => {handleStatusChange(tab.value)}}
                >{tab.label}</button>
              ))
            }
          </div>

          {/* 검색어 입력 */}
          <div className="search-group right-align">
            <select name="searchType" className="user-list-type-select" 
              value={inputs.searchType} onChange={handleChange}
            >
              <option value="userName">이름</option>
              <option value="email">이메일</option>
            </select>
            <input type="text" name="keyword"
              placeholder="검색어 입력"
              value={inputs.keyword}
              onChange={handleChange}
              onKeyDown={handleKeyDown}
              />
            <button className="search-icon-btn" onClick={handleSearch}>
              <Search size={18} />
            </button>

            {/* 초기화 버튼 */}
            <button className="reset-icon-btn" onClick={handleReset} title="검색 초기화">
              <RefreshCw size={18} />
            </button>
          </div>
        </div>


        {/* 테이블 */}
        <div className='user-list-table'>
          {/* 테이블 헤더 */}
          <div className='user-list-header'>
            <div className='user-list-col-no'>번호</div>
            <div className='user-list-col-name'>이름</div>
            <div className='user-list-col-email'>이메일</div>
            <div className='user-list-col-date'>가입일</div>
            <div className='user-list-col-status'>상태</div>
            <div className='user-list-col-actions'>관리</div>
          </div>

          {/* 테이블 바디 - 20개 행 */}
          { userList?.map((user, index) => (
            <div
              key={user?.id}
              className={`user-list-row ${selectedUser === index ? 'selected' : ''} user-list-row-${user?.status?.toLowerCase()}`}
              onClick={() => handleOpen({ user, index })}
            >
              <div className='user-list-col-no'>{(page - 1) * 20 + index + 1}</div>
              <div className='user-list-col-name'>{user?.userName}</div>
              <div className='user-list-col-email'>{user?.email}</div>
              <div className='user-list-col-date'>{user?.createdAt}</div>
              <div className='user-list-col-status'>
                <span className={`user-list-status-badge user-list-status-${user?.status?.toLowerCase()}`}>
                  {STATUS_TABS.find(tab => tab.value === user?.status)?.label || user?.status}
                </span>
              </div>
              <div className='user-list-col-actions'>
                <button className='btn-edit' onClick={(e) => e.stopPropagation()}>관리</button>
              </div>
            </div>
          ))}
        </div>

        {/* 페이지네이션 */}
        <div className='user-list-pagination'>
          <ChevronLeft size={22}
            className={`pagination-btn ${page === 1 ? 'disabled' : ''}`}
            onClick={ () => handlePageChange(Math.max(1, page - 1)) }
          />
          <span className='page-number'>{page}</span>
          <ChevronRight size={22} 
            className={`pagination-btn ${page >= lastPage ? 'disabled' : ''}`}
            onClick={ () => handlePageChange(Math.min(lastPage, page + 1)) }
          />
        </div>
      </div>

      {/* 사이드 패널 */}
      <Outlet context={{ onClose: handleClose, refreshList: refreshList }} />
    </div>
  )
}
