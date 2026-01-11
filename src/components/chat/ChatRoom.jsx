import './ChatRoom.css';

import { useEffect, useState, useRef } from 'react';
import { X, Send, Ban } from 'lucide-react';
import { toast } from 'sonner';
import { io } from 'socket.io-client';
import { useSelector } from 'react-redux';

import { getChatMessages, blockChatRoom } from '../../api/chatApi.js';
import ChatBubble from './ChatBubble';

export default function ChatRoom({ room, onClose, refreshList }) {
  // ===== hooks
  const { admin } = useSelector(state => state.auth);
  const messagesEndRef = useRef(null);

  // ===== local states
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [socket, setSocket] = useState(null);
  const [isConnected, setIsConnected] = useState(false);

  // 메시지 영역 스크롤
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // 메시지 목록 불러오기
  const fetchMessages = async () => {
    try {
      const result = await getChatMessages(room.id);
      setMessages(result || []);
    } catch (error) {
      console.error('메시지 불러오기 실패:', error);
      toast.error('오류가 발생했습니다. 새로고침 후 재시도 해주세요.');
    }
  };

  // 소켓 연결
  useEffect(() => {
    const newSocket = io(import.meta.env.VITE_SERVER_URL, {
      withCredentials: true,
    });

    newSocket.on('connect', () => {
      console.log('🔌 관리자 소켓 연결:', newSocket.id);
      setIsConnected(true);
    });

    newSocket.on('disconnect', () => {
      console.log('🔌 관리자 소켓 해제');
      setIsConnected(false);
    });

    setSocket(newSocket);

    return () => {
      newSocket.close();
    };
  }, []);

  // 방 입장 및 메시지 수신
  useEffect(() => {
    if (!socket || !room?.id) return;

    // 이전 메시지 로드
    fetchMessages();

    // 방 입장 (userType 전달)
    socket.emit('join', { roomId: room.id, userType: 'ADMIN' });

    // 메시지 수신
    const handleMessage = (message) => {
      setMessages(prev => [...prev, message]);

      // 상대방(USER) 메시지면 바로 읽음 처리
      if (message.senderType === 'USER') {
        socket.emit('read', { messageId: message.id, roomId: room.id });
      }
    };

    // 읽음 처리 수신 (상대방이 읽었을 때)
    const handleMessagesRead = ({ messageIds }) => {
      setMessages(prev => prev.map(msg =>
        messageIds.includes(msg.id) ? { ...msg, isRead: true } : msg
      ));
    };

    socket.on('message', handleMessage);
    socket.on('messagesRead', handleMessagesRead);

    return () => {
      socket.off('message', handleMessage);
      socket.off('messagesRead', handleMessagesRead);
    };
  }, [socket, room?.id]);

  // 메시지 추가 시 스크롤
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // 메시지 전송
  const handleSendMessage = () => {
    if (!inputMessage.trim() || !socket || !room?.id) return;

    socket.emit('message', {
      roomId: room.id,
      senderType: 'ADMIN',
      adminId: admin?.id,
      content: inputMessage.trim(),
      messageType: 'TEXT',
    });

    setInputMessage('');
  };

  // 엔터키로 전송
  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  // 차단 처리
  const handleBlock = async () => {
    const action = room.isBlocked ? '차단 해제' : '차단';
    if (!window.confirm(`이 상담을 ${action}하시겠습니까?`)) return;

    try {
      await blockChatRoom(room.id, !room.isBlocked);
      toast.success(`상담이 ${action}되었습니다.`);
      refreshList();
    } catch (error) {
      toast.error(`${action} 처리에 실패했습니다.`);
    }
  };

  // 유저 정보 표시
  const getUserInfo = () => {
    if (room.chatRoomUser) {
      return {
        type: '회원',
        name: room.chatRoomUser.userName || '-',
        email: room.chatRoomUser.email || '-',
      };
    }
    if (room.chatRoomBooker) {
      return {
        type: '비회원',
        name: room.chatRoomBooker.userName || '-',
        email: room.chatRoomBooker.email || '-',
        reservId: room.chatRoomBooker.reservId,
      };
    }
    return { type: '알 수 없음', name: '-', email: '-' };
  };

  const userInfo = getUserInfo();

  return (
    <div className='chat-room-panel'>
      {/* 헤더 */}
      <div className='chat-room-header'>
        <div className='chat-room-header-info'>
          <h3>1:1 상담</h3>
          <span className={`chat-room-type ${userInfo.type === '회원' ? 'member' : 'guest'}`}>
            {userInfo.type}
          </span>
        </div>
        <button className='chat-room-close' onClick={onClose}>
          <X size={20} />
        </button>
      </div>

      {/* 유저 정보 */}
      <div className='chat-room-user-info'>
        <div className='chat-room-info-row'>
          <span className='info-label'>이름</span>
          <span className='info-value'>{userInfo.name}</span>
        </div>
        <div className='chat-room-info-row'>
          <span className='info-label'>이메일</span>
          <span className='info-value'>{userInfo.email}</span>
        </div>
        {userInfo.reservId && (
          <div className='chat-room-info-row'>
            <span className='info-label'>예약코드</span>
            <span className='info-value'>{userInfo.reservId}</span>
          </div>
        )}
        <div className='chat-room-info-row'>
          <span className='info-label'>상태</span>
          <span className={`info-value ${room.isBlocked ? 'blocked' : 'active'}`}>
            {room.isBlocked ? '차단됨' : '정상'}
          </span>
        </div>
      </div>

      {/* 메시지 영역 */}
      <div className='chat-room-messages'>
        {messages.length === 0 ? (
          <div className='chat-room-empty'>
            아직 대화 내역이 없습니다.
          </div>
        ) : (
          messages.map((msg, idx) => (
            <ChatBubble
              key={msg.id || idx}
              content={msg.content}
              messageType={msg.messageType}
              senderType={msg.senderType}
              createdAt={msg.createdAt}
              isRead={msg.isRead}
              isMine={msg.senderType === 'ADMIN'}
            />
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* 입력 영역 */}
      <div className='chat-room-input-area'>
        {room.isBlocked ? (
          <div className='chat-room-blocked-msg'>
            차단된 상담입니다. 메시지를 보낼 수 없습니다.
          </div>
        ) : (
          <>
            <textarea
              className='chat-room-input'
              placeholder='메시지를 입력하세요...'
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyDown={handleKeyDown}
              disabled={!isConnected}
            />
            <button
              className='chat-room-send-btn'
              onClick={handleSendMessage}
              disabled={!inputMessage.trim() || !isConnected}
            >
              <Send size={18} />
            </button>
          </>
        )}
      </div>

      {/* 하단 액션 */}
      <div className='chat-room-actions'>
        <button
          className={room.isBlocked ? 'btn-edit' : 'btn-delete'}
          onClick={handleBlock}
        >
          <Ban size={16} />
          {room.isBlocked ? '차단 해제' : '상담 차단'}
        </button>
      </div>
    </div>
  );
}
