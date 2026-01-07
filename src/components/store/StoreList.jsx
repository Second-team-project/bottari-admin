import './StoreList.css';

import { useEffect, useState } from 'react';
import { ChevronLeft, ChevronRight, Plus } from 'lucide-react';
import { useDispatch } from 'react-redux';

import StoreModal from './StoreModal';
import { createStoreThunk, deleteStoreThunk, getStoreThunk, updateStoreThunk } from '../../store/thunks/storeThunk.js';
import { toast } from 'sonner';

export default function StoreList() {
  // ===== hooks 
  const dispatch = useDispatch();
  // =====local states
  const [storeList, setStoreList] = useState([])
  const [selectedItem, setSelectedItem] = useState(null);

  // 보관소 불러오기
  const fetchStore = async() => {
    try {
      const result = await dispatch(getStoreThunk()).unwrap()
      console.log(result)

      setStoreList(result)
    } catch (error) {
      toast.error('오류가 발생했습니다. 새로고침 해주세요.')
      console.error('보관소 불러오기 실패: ', error)
    }
  }
  
  useEffect(() => {
    fetchStore()
  }, [])

  // ===== props 함수
  // 생성
  const handleCreate = async(item) => {
    try {
      await dispatch(createStoreThunk(item)).unwrap();
      fetchStore();

      toast.success('보관소가 추가되었습니다.')
  } catch (error) {
    toast.error(error.message);
  }}
  // 수정
  const handleUpdate = async(item) => {
    try {
      await dispatch(updateStoreThunk(item)).unwrap();
      fetchStore();

      toast.success('보관소 정보가 수정되었습니다.')
    } catch (error) {
      toast.error(error.message);
    }
  }
  // 삭제
  const handleDelete = async(id) => {
    try {
      if (window.confirm('정말 삭제하시겠습니까?')) {
        await dispatch(deleteStoreThunk(id)).unwrap();
        fetchStore();
        toast.success('보관소 정보가 삭제되었습니다.')
      }
    } catch (error) {
      toast.error(error.message);
    }
  }


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
        {storeList?.map((store, index) => (
          <div
            key={store?.id}
            className='store-list-row'
            onClick={() => handleRowClick(store)}
          >
            <div className='store-list-col-no'>{index + 1}</div>
            <div className='store-list-col-code'>{store?.code}</div>
            <div className='store-list-col-name'>{store?.storeName}</div>
            <div className='store-list-col-phone'>{store?.tel}</div>
            <div className='store-list-col-addr'>{store?.addr}</div>
            <div className='store-list-col-actions'>
              <button className='btn-edit' onClick={(e) => { e.stopPropagation(); handleRowClick(store); }}>수정</button>
              <button className='btn-delete' onClick={(e) => {e.stopPropagation(); handleDelete(store?.id)}}>삭제</button>
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
      {
        selectedItem && (
          <StoreModal store={selectedItem} onClose={handleCloseModal} 
            onCreate={handleCreate} onUpdate={handleUpdate} onDelete={handleDelete}      
          />
        )
      }
    </div>
  )
}
