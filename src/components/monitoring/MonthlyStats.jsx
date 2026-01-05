import { useSelector } from 'react-redux';
import './MonthlyStats.css';
import { useMemo } from 'react';

export default function MonthlyStats() {
  const { monthlyStats } = useSelector((state) => state.stats);

  // 데이터 합계 계산 (useMemo를 써서 데이터가 바뀔 때만 재계산)
  const totals = useMemo(() => {
    const initial = {
      totalRevenue: 0,
      totalReservations: 0,
      totalDelivery: 0,
      totalStorage: 0
    };

    if(!monthlyStats || monthlyStats.length === 0) {
      return initial;
    }

    // 배열을 돌면서 누적 합계 계산
    return monthlyStats.reduce((acc, curr) => ({
      totalRevenue: acc.totalRevenue + Number(curr.totalRevenue),
      totalReservations: acc.totalReservations + curr.totalReservations,
      totalDelivery: acc.totalDelivery + curr.totalDelivery,
      totalStorage: acc.totalStorage + curr.totalStorage,
    }), initial);
  }, [monthlyStats]);

  return (
    <div className="monthly-stats-container">
      <h2 className='monthly-stats-title'>이번 달 현황</h2>
      <hr className='monthly-stats-hr' />
      
      <div className="monthly-stats-content-box">
        
        {/* 이번 달 매출 */}
        <div className="monthly-card sales-card">
          <h3 className="monthly-card-title">이번 달 매출</h3>
          <p className='monthly-sales-total'>
            {totals.totalRevenue.toLocaleString()}원
          </p>
        </div>

        {/* 이번 달 총 예약 건수 */}
        <div className="monthly-card">
          <h3 className="monthly-card-title">총 예약 건수</h3>
          <p className='monthly-count-total'>
            <span className="monthly-highlight">{totals.totalReservations}</span>건
          </p>
        </div>

        {/* 이번 달 배송 및 보관 건수 */}
        <div className="monthly-card row-card">
          <div className="monthly-sub-item">
            <p className="monthly-sub-title">총 배송 건수</p>
            <p className="monthly-sub-count">{totals.totalDelivery}건</p>
          </div>
          <div className="monthly-line"></div>
          <div className="monthly-sub-item">
            <p className="monthly-sub-title">총 보관 건수</p>
            <p className="monthly-sub-count">{totals.totalStorage}건</p>
          </div>
        </div>

      </div>
    </div>
  );
}