import { ChevronLeft, ChevronRight } from 'lucide-react';
import './Reservation.css';

export default function Reservation() {
  return (
    <>
      <h2>실시간 예약현황</h2>
      <div className="reservation-container">
        <div className="reservation-table-top">
          <div className="dateOfSignIN">신청일</div>
          <div className="deliveryAndStorage">구분</div>
          <div className="reservation-name">예약자명</div>
          <div className="contact-number">연락처</div>
          <div className="reservation-empty1"></div>
          <div className="dayOfreservation">예약기간</div>
          <div className="reservation-empty2"></div>
          <div className="reservation-empty3"></div>
          <div className="numberOfLuggage">짐 갯수</div> 
          <div className="reservation-empty4"></div>
          <div className="paymentAmmount">결제금액</div>
          <div className="reservation-empty5"></div>
          <div className="periodOfSignIn">신청일자</div>
       </div>
       <div className="reservation-table-middle">
        <div className="dateOfSignIN">2020.01.01</div>
        <div className="deliveryAndStorage">구분</div>
        <div className="reservation-name">예약자명</div>
        <div className="contact-number">연락처</div>
        <div className="reservation-empty1"></div>
        <div className="dayOfreservation">예약기간</div>
        <div className="reservation-empty2"></div>
        <div className="reservation-empty3"></div>
        <div className="numberOfLuggage">짐 갯수</div> 
        <div className="reservation-empty4"></div>
        <div className="paymentAmmount">결제금액</div>
        <div className="reservation-empty5"></div>
        <div className="periodOfSignIn">신청일자</div>
       </div>
       <div className="reservation-table-middle">
        <div className="dateOfSignIN">2020.01.01</div>
        <div className="deliveryAndStorage">구분</div>
        <div className="reservation-name">예약자명</div>
        <div className="contact-number">연락처</div>
        <div className="reservation-empty1"></div>
        <div className="dayOfreservation">예약기간</div>
        <div className="reservation-empty2"></div>
        <div className="reservation-empty3"></div>
        <div className="numberOfLuggage">짐 갯수</div> 
        <div className="reservation-empty4"></div>
        <div className="paymentAmmount">결제금액</div>
        <div className="reservation-empty5"></div>
        <div className="periodOfSignIn">신청일자</div>
       </div>
       <div className="reservation-table-middle">
        <div className="dateOfSignIN">2020.01.01</div>
        <div className="deliveryAndStorage">구분</div>
        <div className="reservation-name">예약자명</div>
        <div className="contact-number">연락처</div>
        <div className="reservation-empty1"></div>
        <div className="dayOfreservation">예약기간</div>
        <div className="reservation-empty2"></div>
        <div className="reservation-empty3"></div>
        <div className="numberOfLuggage">짐 갯수</div> 
        <div className="reservation-empty4"></div>
        <div className="paymentAmmount">결제금액</div>
        <div className="reservation-empty5"></div>
        <div className="periodOfSignIn">신청일자</div>
       </div>
       <div className="reservation-table-middle">
        <div className="dateOfSignIN">2020.01.01</div>
        <div className="deliveryAndStorage">구분</div>
        <div className="reservation-name">예약자명</div>
        <div className="contact-number">연락처</div>
        <div className="reservation-empty1"></div>
        <div className="dayOfreservation">예약기간</div>
        <div className="reservation-empty2"></div>
        <div className="reservation-empty3"></div>
        <div className="numberOfLuggage">짐 갯수</div> 
        <div className="reservation-empty4"></div>
        <div className="paymentAmmount">결제금액</div>
        <div className="reservation-empty5"></div>
        <div className="periodOfSignIn">신청일자</div>
       </div>
       <div className="reservation-table-middle">
        <div className="dateOfSignIN">2020.01.01</div>
        <div className="deliveryAndStorage">구분</div>
        <div className="reservation-name">예약자명</div>
        <div className="contact-number">연락처</div>
        <div className="reservation-empty1"></div>
        <div className="dayOfreservation">예약기간</div>
        <div className="reservation-empty2"></div>
        <div className="reservation-empty3"></div>
        <div className="numberOfLuggage">짐 갯수</div> 
        <div className="reservation-empty4"></div>
        <div className="paymentAmmount">결제금액</div>
        <div className="reservation-empty5"></div>
        <div className="periodOfSignIn">신청일자</div>
       </div>
       <div className="reservation-table-middle">
        <div className="dateOfSignIN">2020.01.01</div>
        <div className="deliveryAndStorage">구분</div>
        <div className="reservation-name">예약자명</div>
        <div className="contact-number">연락처</div>
        <div className="reservation-empty1"></div>
        <div className="dayOfreservation">예약기간</div>
        <div className="reservation-empty2"></div>
        <div className="reservation-empty3"></div>
        <div className="numberOfLuggage">짐 갯수</div> 
        <div className="reservation-empty4"></div>
        <div className="paymentAmmount">결제금액</div>
        <div className="reservation-empty5"></div>
        <div className="periodOfSignIn">신청일자</div>
       </div>

        {/* 페이지 버튼 */}
        <div className='pagenation-btn-container'>
          <ChevronLeft className='pagenation-btn' size={22}/>
          <p className='page-number'>1</p>
          <ChevronRight className='pagenation-btn' size={22} />
        </div>
      </div>

    </>
  )
}