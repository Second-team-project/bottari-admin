import { useDispatch, useSelector } from 'react-redux';
import './Statistics.css';
import { getDailyStats } from '../../store/thunks/statsThunk.js';
import { useEffect } from 'react';

export default function Statistics() {
  const dispatch = useDispatch();
  const { dailyStats, loading } = useSelector((state) => state.stats);

  useEffect(() => {
    dispatch(getDailyStats());
  }, []);

  // 데이터가 아직 없거나 로딩 중일 때 보여줄 임시 값
  // 하루 통계 변수
  const data = dailyStats || {
    totalReservations: 0,
    totalDelivery: 0,
    totalStorage: 0,
    totalRevenue: 0,
    completedDelivery: 0,
    completedStorage: 0,
    cancelledReservations: 0,
  };

  // 하루 처리 현황 총합 계산 (완료 + 취소)
  const totalProcessed = (data.completedDelivery || 0) 
                       + (data.completedStorage || 0) 
                       + (data.cancelledReservations || 0);

  // 로딩 처리
  if (loading && !dailyStats) {
      return <div className="statistics-container">로딩 중...</div>;
    }

  return (
    <>
      <div className="statistics-container">
        <h2 className='statistics-title'>통합 모니터링</h2>
        <hr className='statistics-hr' />
        <div className="statistics-content-box">
          <div className="statistics-content-card">
            <div className="today-order-total-container">
              <div className="today-new-order-total-container">
                <h3 className='today-order-title'>오늘의 신규예약</h3>
                <p className='today-order-total'><span className="total-count">{data.totalReservations}</span>건</p>
              </div>
              <div className="today-order-delivery-storage-container">
                <div className="today-order-sub-container">
                  <div className="today-order-sub-title-container">
                    <p className='today-order-sub-title'>배송</p>
                    <p className="today-order-sub-title-eng">delivery</p>
                  </div>
                  <p className='today-order-sub-total'>{data.totalDelivery}건</p>
                </div>
                <div className="today-order-line"></div>
                <div className="today-order-sub-container">
                  <div className="today-order-sub-title-container">
                    <p className='today-order-sub-title'>보관</p>
                    <p className="today-order-sub-title-eng">storage</p>
                  </div>
                  <p className='today-order-sub-total'>{data.totalStorage}건</p>
                </div>
              </div>
            </div>
          </div>
          <div className="today-state-container">
            <div className="today-state-dashbord">
              <h3>오늘의 배송/보관 처리 현황</h3>
              <p className="today-state-dashbord-total">{totalProcessed}건</p>
            </div>
            <div className='today-state-sub-container'>
              <div className="today-state-sub-card">
                <p className="today-state-sub-title">배송 완료</p>
                <p className="today-state-sub-total">{data.completedDelivery}건</p>
              </div>
              <div className="today-state-line"></div>
              <div className="today-state-sub-card">
                <p className="today-state-sub-title">보관 완료</p>
                <p className="today-state-sub-total">{data.completedStorage}건</p>
              </div>
              <div className="today-state-line"></div>
              <div className="today-state-sub-card">
                <p className="today-state-sub-title">취소</p>
                <p className="today-state-sub-total">{data.cancelledReservations}건</p>
              </div>
            </div>
          </div>
          <div className="today-sales-container">
            <h3>오늘의 총 매출</h3>
            <p className='today-sales-total'>{Number(data.totalRevenue).toLocaleString()}원</p>
          </div>
        </div>
      </div>
    </>
  )
}

// 2. 상단 왼쪽 : 오늘의 신규예약
//  - 총 예약 건수, 배송 건수, 보관 건수

// 3. 상단 중앙 : 
//  - 처리완료 : 오늘 배송 완료된 건, 오늘 픽업 완료된 보관 건, 
//  - 취소 : 오늘 취소가 된 건 (배송+보관)

// 4. 상단 오른쪽 : 오늘 총 매출