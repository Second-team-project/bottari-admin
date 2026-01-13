import './ChatList.css';

import { useEffect, useState } from 'react';
import { ChevronLeft, ChevronRight, RefreshCw, Search } from 'lucide-react';
import { Outlet, useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { toast } from 'sonner';

import ChatRoom from './ChatRoom.jsx';
import { getChatRooms } from '../../api/chatApi.js';

export default function ChatList() {
  // ===== hooks
  const navigate = useNavigate();
  const { id: urlId } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();

  // URL Query Params
  const page = parseInt(searchParams.get('page')) || 1;
  const searchType = searchParams.get('searchType') || 'userName';
  const keyword = searchParams.get('keyword') || '';

  const filters = { page, searchType, keyword };

  // ===== local states
  const [roomList, setRoomList] = useState([]);
  const [roomCount, setRoomCount] = useState(0);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [selectedIndex, setSelectedIndex] = useState(null);

  // 입력창 state
  const initInputs = { searchType: 'userName', keyword: '' };
  const [inputs, setInputs] = useState({
    searchType: searchType || 'userName',
    keyword: keyword || ''
  });

  const lastPage = Math.ceil(roomCount / 20) || 1;

  // 채팅방 목록 불러오기
  const fetchRooms = async (params) => {
    try {
      const result = await getChatRooms(params);
      setRoomList(result.rooms || result);
      setRoomCount(result.count || result.length || 0);
    } catch (error) {
      toast.error('채팅방 목록을 불러오는데 실패했습니다.');
      console.error('채팅방 목록 불러오기 실패:', error);
    }
  };

  // URL 파라미터 변경 시 API 호출
  useEffect(() => {
    fetchRooms(filters);
  }, [searchParams]);

  // URL 변경 시 입력창 동기화
  useEffect(() => {
    setInputs({
      searchType: searchType,
      keyword: keyword
    });
  }, [searchType, keyword]);

  // URL ID로 채팅방 선택 처리
  useEffect(() => {
    if (urlId && roomList.length > 0) {
      const index = roomList.findIndex(room => String(room.id) === urlId);
      if (index !== -1) {
        setSelectedIndex(index);
        setSelectedRoom(roomList[index]);
      }
    }
  }, [urlId, roomList]);

  // ===== 핸들러
  // 패널 열기
  function handleOpen({ room, index }) {
    setSelectedIndex(index);
    setSelectedRoom(room);
    navigate(`/chat/${room.id}`);
  }

  // 패널 닫기
  function handleClose() {
    setSelectedIndex(null);
    setSelectedRoom(null);
    navigate('/chat');
  }

  // 입력값 변경
  const handleChange = (e) => {
    const { name, value } = e.target;
    setInputs(prev => ({ ...prev, [name]: value }));
  };

  // 검색 실행
  const handleSearch = () => {
    setSearchParams({
      page: 1,
      searchType: inputs.searchType,
      keyword: inputs.keyword
    });
  };

  // 엔터키
  const handleKeyDown = (e) => {
    if (e.key === 'Enter') handleSearch();
  };

  // 필터 초기화
  const handleReset = () => {
    setInputs(initInputs);
    setSearchParams({});
  };

  // 페이지 변경
  const handlePageChange = (newPage) => {
    setSearchParams({
      page: newPage,
      searchType: searchType,
      keyword: keyword
    });
  };

  // 목록 새로고침
  const refreshList = () => {
    const currentFilters = {
      page: parseInt(searchParams.get('page')) || 1,
      searchType: searchParams.get('searchType') || 'userName',
      keyword: searchParams.get('keyword') || ''
    };
    fetchRooms(currentFilters);
  };

  // 유저/비회원 이름 표시
  const getDisplayName = (room) => {
    if (room.chatRoomUser) {
      return room.chatRoomUser.userName || room.chatRoomUser.email;
    }
    if (room.chatRoomBooker) {
      return `[비회원] ${room.chatRoomBooker.userName || room.chatRoomBooker.email}`;
    }
    return '알 수 없음';
  };

  // 유저/비회원 이메일 표시
  const getDisplayEmail = (room) => {
    if (room.chatRoomUser) {
      return room.chatRoomUser.email;
    }
    if (room.chatRoomBooker) {
      return room.chatRoomBooker.email;
    }
    return '-';
  };

  return (
    <div className='chat-list-page'>
      <div className={`chat-list-container ${selectedRoom !== null ? 'with-panel' : ''}`}>
        <h2 className='page-title'>1:1 상담 관리</h2>

        {/* 검색 */}
        <div className='reservation-search-bar'>
          {/* 검색어 입력 */}
          <div className="search-group right-align">
            <select name="searchType" className="chat-list-type-select"
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
        <div className='chat-list-table'>
          {/* 테이블 헤더 */}
          <div className='chat-list-header'>
            <div className='chat-list-col-no'>번호</div>
            <div className='chat-list-col-type'>유형</div>
            <div className='chat-list-col-name'>이름</div>
            <div className='chat-list-col-email'>이메일</div>
            <div className='chat-list-col-date'>최근 상담</div>
            <div className='chat-list-col-status'>상태</div>
          </div>

          {/* 테이블 바디 */}
          {roomList?.map((room, index) => (
            <div
              key={room?.id}
              className={`chat-list-row ${selectedIndex === index ? 'selected' : ''}`}
              onClick={() => handleOpen({ room, index })}
            >
              <div className='chat-list-col-no'>{(page - 1) * 20 + index + 1}</div>
              <div className='chat-list-col-type'>
                <span className={room?.chatRoomUser ? 'type-member' : 'type-guest'}>
                  {room?.chatRoomUser ? '회원' : '비회원'}
                </span>
              </div>
              <div className='chat-list-col-name'>{getDisplayName(room)}</div>
              <div className='chat-list-col-email'>{getDisplayEmail(room)}</div>
              <div className='chat-list-col-date'>{room?.updatedAt}</div>
              <div className='chat-list-col-status'>
                <span className={room?.isBlocked ? 'status-blocked' : 'status-active'}>
                  {room?.isBlocked ? '차단' : '정상'}
                </span>
              </div>
            </div>
          ))}

          {/* 빈 목록 */}
          {roomList?.length === 0 && (
            <div className='chat-list-empty'>
              상담 내역이 없습니다.
            </div>
          )}
        </div>

        {/* 페이지네이션 */}
        <div className='chat-list-pagination'>
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
      </div>

      {/* 사이드 패널 (채팅방) */}
      {selectedRoom && (
        <ChatRoom
          room={selectedRoom}
          onClose={handleClose}
          refreshList={refreshList}
        />
      )}
    </div>
  );
}
