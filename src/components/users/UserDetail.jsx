import './UserDetail.css';

import { useEffect, useState } from 'react';
import { useNavigate, useOutletContext, useParams } from 'react-router-dom';

import { X } from 'lucide-react';

import { deleteUser, getUserDetail, updateUser } from '../../api/userApi.js';
import { toast } from 'sonner';
import dayjs from 'dayjs';

export default function UserDetail() {
  // 부모에게서 받은 값들
  const { id } = useParams(); // 직접 URL에서 ID를 가져옴
  const { onClose, refreshList } = useOutletContext(); // 부모가 보낸 함수들
  // ===== hooks
  const navigate = useNavigate()
  // ===== local states
  const [user, setUser] = useState({})
  const [status, setStatus] = useState('')
  const [adminMemo, setadminMemo] = useState('')

  const STATE_KOREAN = {
    PENDING_PAYMENT: '결제대기',
    RESERVED: '예약완료',
    PICKING_UP: '픽업중',
    IN_PROGRESS: '진행중',
    COMPLETED: '완료',
    CANCELLED: '취소',
  };

  // 유저 데이터 불러오기
  const fetchUser = async () => {
    try {
      const result = await getUserDetail(id);
      setUser(result);
      setStatus(result.status);
      setadminMemo(result.adminMemo);

      console.log('fetchUsers: ', result);
    } catch (error) {
      toast.error('유저 데이터를 불러오는데 실패했습니다.');
      console.error('유저 데이터 불러오기 실패:', error);
    }
  };

  // 마운트 시 데이터 불러오기
  useEffect(() => {
    fetchUser();
  }, [id]);

  // ===== 핸들러
  // 정보 수정
  const handleUpdate = async() => {
    try {
      await updateUser(id, { status, adminMemo });
      refreshList();
      fetchUser();
      
      toast.success('유저 정보가 수정되었습니다.')
    } catch (error) {
      toast.error(error.message);
    }
  }

  // 유저 삭제
  const handleDelete = async() => {
    try {
      if (!window.confirm('정말 이 회원을 탈퇴 처리하시겠습니까?')) return;
      await deleteUser(id);
      refreshList();
      navigate('/users');
      
      toast.success('유저가 탈퇴 처리되었습니다.')
    } catch (error) {
      toast.error(error.message);
    }
  }

  return (
    <div className='user-detail-panel'>
      <div className='user-detail-header'>
        <h3>회원 상세</h3>
        <button className='user-detail-close' onClick={onClose}>
          <X size={20} />
        </button>
      </div>

      <div className='user-detail-content'>
        <div className='user-detail-row'>
          <span className='user-detail-label'>이름(닉네임)</span>
          <span className='user-detail-value'>{user?.userName}</span>
        </div>
        <div className='user-detail-row'>
          <span className='user-detail-label'>이메일</span>
          <span className='user-detail-value'>{user?.email}</span>
        </div>
        <div className='user-detail-row'>
          <span className='user-detail-label'>연락처</span>
          <span className='user-detail-value'>{user?.phone !== null ? user.phone : '-'}</span>
        </div>
        <div className='user-detail-row'>
          <span className='user-detail-label'>가입일</span>
          <span className='user-detail-value'>{user?.createdAt}</span>
        </div>
        <div className='user-detail-row'>
          <span className='user-detail-label'>소셜</span>
          <span className='user-detail-value'>{user?.provider}</span>
        </div>
        <div className='user-detail-row'>
          <span className='user-detail-label'>총 결제 금액</span>
          <span className='user-detail-value'>{Number(user?.totalPayment).toLocaleString()}</span>
        </div>
        <div className='user-detail-row'>
          <span className='user-detail-label'>총 예약 횟수</span>
          <span className='user-detail-value'>{user?.reservationCount}</span>
        </div>
        <div className='user-detail-row'>
          <span className='user-detail-label'>예약 취소 횟수</span>
          <span className='user-detail-value'>{user?.cancelCount || '-'}</span>
        </div>
        <div className='user-detail-row'>
          <span className='user-detail-label'>회원 상태</span>
          <select name="status" id="status" 
            className='user-detail-select'
            onChange={(e) => setStatus(e.target.value)}
            value={status}
          >
            <option value="ACTIVE">정상</option>
            <option value="BANNED">차단</option>
          </select>
        </div>
        
        {/* 관리자 메모 */}
        <div className='user-detail-memo'>
          <span className='user-detail-label'>관리자 메모</span>
          <textarea name="adminMemo" id="adminMemo" className='user-detail-textarea'
            value={adminMemo}
            onChange={(e) => setadminMemo(e.target.value)}
          ></textarea>
        </div>

        <div className='user-detail-memo'>
          <span className='user-detail-label'>최근 결제 내역</span>
          {
            user?.userIdReservations&& user.userIdReservations.length > 0 ? (
              <>
                <div className="user-detail-reserve-item-header">
                  <span className="reserv-date">예약 날짜</span>
                  <span className="reserv-type">서비스 타입</span>
                  <span className="reserv-state state">진행 상태</span>
                  <span className="reserv-price">결제 금액</span>
                </div>
                {
                  user.userIdReservations.map(reserv => (
                    <div key={reserv.id} className="user-detail-reserve-item">
                    <span className="reserv-date">{dayjs(reserv.createdAt).format('YYYY-MM-DD')}</span>
                    <span className="reserv-type">[{reserv.code.startsWith('D') ? ' 배송 ' : ' 보관 '}]</span>
                    <span className={`reserv-state state-${reserv.state}`}>{STATE_KOREAN[reserv.state] || reserv.state}</span>
                    <span className="reserv-price">{Number(reserv.price).toLocaleString()}원</span>
                  </div>
                  ))
                }
              </>

            ) : (
              <div className="user-detail-empty">이용 내역이 없습니다.</div>
            )
          }
        </div>

      </div>

      <div className='user-detail-actions'>
        {/* 회원은 수정보다는 '차단'이나 '메모 수정'이 주 기능 */}
        <button className='btn-edit' onClick={handleUpdate}>저장하기</button>
        <button className='btn-delete' onClick={handleDelete}>탈퇴처리</button>
      </div>
    </div>
  );
}
