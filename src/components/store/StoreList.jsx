import { useState } from 'react';
import { ChevronLeft, ChevronRight, Plus } from 'lucide-react';
import './StoreList.css';
import StoreModal from './StoreModal';

export default function StoreList() {
  const [selectedItem, setSelectedItem] = useState(null);

  // 보관소 클릭 시 모달 열기 (수정 모드)
  function handleRowClick(item) {
    setSelectedItem(item);
  }

  // 신규 등록 버튼 클릭
  function handleAddClick() {
    setSelectedItem({ id: 'new' });
  }

  // 모달 닫기
  function handleCloseModal() {
    setSelectedItem(null);
  }

  return(
    <div className='store-list-page'>
      <div className='store-list-top'>
        <h2 className='page-title'>보관소 관리</h2>
        <button className='btn-add-store' onClick={handleAddClick}>
          <Plus size={18} />
          보관소 등록
        </button>
      </div>

      {/* 테이블 */}
      <div className='store-list-table'>
        {/* 테이블 헤더 */}
        <div className='store-list-header'>
          <div>번호</div>
          <div>코드</div>
          <div>지점명</div>
          <div>연락처</div>
          <div>주소</div>
          <div>관리</div>
        </div>

        {/* 테이블 바디 - 더미 데이터 5개 */}
        {[...Array(5)].map((_, index) => (
          <div
            key={index}
            className='store-list-row'
            onClick={() => handleRowClick({ id: index + 1 })}
          >
            <div className='store-list-col-no'>{index + 1}</div>
            <div className='store-list-col-code'>ST_00{index + 1}</div>
            <div className='store-list-col-name'>보따리 강남역점</div>
            <div className='store-list-col-phone'>02-123-456{index}</div>
            <div className='store-list-col-addr'>서울시 강남구 강남대로 {123 + index}</div>
            <div className='store-list-col-actions'>
              <button className='btn-edit' onClick={(e) => { e.stopPropagation(); handleRowClick({ id: index + 1 }); }}>수정</button>
              <button className='btn-delete' onClick={(e) => e.stopPropagation()}>삭제</button>
            </div>
          </div>
        ))}
      </div>

      {/* 페이지네이션 */}
      <div className='store-list-pagination'>
        <ChevronLeft className='pagination-btn' color="#6B7280" size={22}/>
        <span className='page-number'>1</span>
        <ChevronRight className='pagination-btn' color="#6B7280" size={22} />
      </div>

      {/* 등록/수정 모달 */}
      <StoreModal selectedItem={selectedItem} onClose={handleCloseModal} />
    </div>
  )
}
