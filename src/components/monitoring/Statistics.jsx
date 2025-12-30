import './Statistics.css';

export default function Statistics() {
  return (
    <>
      <div className="statistics-container">
        <h2 className='statistics-title'>통합 모니터링</h2>
        <hr className='statistics-hr' />
        <div className="statistics-content-box">
          <div className="statistics-content-item">
            <h3 className='statistics-content-item-sub-title'>오늘의 신규예약</h3>
            <div className='statistics-content-item-sub-contents'>
              <div className="statistics-content-item-sub-contents-item">
                <p className='statistics-content-item-sub-contents-item-title'>총 예약 건수</p>
                <p className='statistics-content-item-sub-contents-item-value'>10건</p>
              </div>
              <div className="statistics-content-item-sub-contents-item">
                <p className='statistics-content-item-sub-contents-item-title'>배송 건수</p>
                <p className='statistics-content-item-sub-contents-item-value'>8건</p>
              </div>
              <div className="statistics-content-item-sub-contents-item">
                <p className='statistics-content-item-sub-contents-item-title'>보관 건수</p>
                <p className='statistics-content-item-sub-contents-item-value'>2건</p>
              </div>
            </div>
          </div>
          <div className="statistics-content-item">
            <h3 className='statistics-content-item-sub-title'>오늘의 배송/보관</h3>
            <div className='statistics-content-item-sub-contents'>
              <div className="statistics-content-item-sub-contents-item">
                <p className='statistics-content-item-sub-contents-item-title'>오늘 배송 완료된 건</p>
                <p className='statistics-content-item-sub-contents-item-value'>10건</p>
              </div>
              <div className="statistics-content-item-sub-contents-item">
                <p className='statistics-content-item-sub-contents-item-title'>오늘 픽업 완료된 보관 건</p>
                <p className='statistics-content-item-sub-contents-item-value'>8건</p>
              </div>
              <div className="statistics-content-item-sub-contents-item">
                <p className='statistics-content-item-sub-contents-item-title'>오늘 취소가 된 건</p>
                <p className='statistics-content-item-sub-contents-item-value'>2건</p>
              </div>
            </div>
          </div>
          <div className="statistics-content-item">
            <h3 className='statistics-content-item-sub-title'>오늘의 총 매출</h3>
            <div className='statistics-content-item-sub-contents'>
              <div className="statistics-content-item-sub-contents-item">
                <p className='statistics-content-item-sub-contents-item-title'>총 매출</p>
                <p className='statistics-content-item-sub-contents-item-value'>1,000,000원</p>
              </div>
              <div className="statistics-content-item-sub-contents-item">
                <p className='statistics-content-item-sub-contents-item-title'>배송 매출</p>
                <p className='statistics-content-item-sub-contents-item-value'>800,000원</p>
              </div>
              <div className="statistics-content-item-sub-contents-item">
                <p className='statistics-content-item-sub-contents-item-title'>보관 매출</p>
                <p className='statistics-content-item-sub-contents-item-value'>20,000원</p>
              </div>
            </div>
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