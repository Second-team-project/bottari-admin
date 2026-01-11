import dayjs from 'dayjs';
import './ChatBubble.css';

/**
 * 관리자용 채팅 말풍선 컴포넌트
 * @param {string} content - 메시지 내용
 * @param {string} messageType - 메시지 타입 (TEXT | IMAGE)
 * @param {string} senderType - 발신자 타입 (USER | ADMIN)
 * @param {string} createdAt - 생성 시간
 * @param {boolean} isRead - 읽음 여부
 * @param {boolean} isMine - 내가 보낸 메시지인지 (ADMIN)
 */
export default function ChatBubble({
  content,
  messageType = 'TEXT',
  senderType,
  createdAt,
  isRead,
  isMine
}) {
  const formatTime = (dateString) => dateString ? dayjs(dateString).format('HH:mm') : '';

  return (
    <div className={`chat-bubble-wrapper ${isMine ? 'mine' : 'other'}`}>
      {/* 상대방 메시지일 때 라벨 (선택 사항, 여기선 '고객' 등으로 표시 가능하나 일단 생략하거나 디자인에 따라 추가) */}
      {/* {!isMine && <span className="chat-bubble-sender">고객</span>} */}

      <div className="chat-bubble-content-row">
        {/* 내 메시지: 시간 왼쪽 */}
        {isMine && (
          <div className="chat-bubble-meta">
            {!isRead && <span className="chat-bubble-unread">1</span>}
            <span className="chat-bubble-time">{formatTime(createdAt)}</span>
          </div>
        )}

        {/* 말풍선 */}
        <div className={`chat-bubble ${isMine ? 'mine' : 'other'}`}>
          {messageType === 'IMAGE' ? (
            <img
              src={content}
              alt="전송된 이미지"
              className="chat-bubble-image"
              onClick={() => window.open(content, '_blank')}
            />
          ) : (
            <p className="chat-bubble-text">{content}</p>
          )}
        </div>

        {/* 상대방 메시지: 시간 오른쪽 */}
        {!isMine && (
          <div className="chat-bubble-meta">
            <span className="chat-bubble-time">{formatTime(createdAt)}</span>
          </div>
        )}
      </div>
    </div>
  );
}
