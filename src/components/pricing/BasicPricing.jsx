import { useState } from 'react';
import { Plus, ChevronLeft, ChevronRight } from 'lucide-react';
import './BasicPricing.css';

export default function BasicPricing({ type }) {
  // type: 'DELIVERY' | 'STORAGE'

  // 임시 데이터
  const [data, setData] = useState([
    { id: 1, item_type: 'CARRIER', item_size: '21', item_weight: '~10kg', base_price: 9000 },
    { id: 2, item_type: 'CARRIER', item_size: '24', item_weight: '~10kg', base_price: 11000 },
    { id: 3, item_type: 'BAG', item_size: 'S', item_weight: '~10kg', base_price: 9000 },
    { id: 4, item_type: 'BOX', item_size: 'M', item_weight: '~20kg', base_price: 13000 },
  ]);

  // 상태 관리
  const [isAdding, setIsAdding] = useState(false); // 등록 모드 여부
  const [editingId, setEditingId] = useState(null); // 수정 중인 ID
  const [editValues, setEditValues] = useState({ // 입력값 저장
    item_type: 'CARRIER', item_size: '', item_weight: '', base_price: ''
  });

  // [핸들러] 입력값 변경
  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditValues(prev => ({ ...prev, [name]: value }));
  };

  // [핸들러] 등록 버튼 클릭
  const handleAddClick = () => {
    setIsAdding(true);
    setEditingId(null);
    setEditValues({ item_type: 'CARRIER', item_size: '', item_weight: '', base_price: '' });
  };

  // [핸들러] 수정 버튼 클릭
  const handleEditClick = (item) => {
    setIsAdding(false);
    setEditingId(item.id);
    setEditValues({ ...item }); // 기존 값 불러오기
  };

  // [핸들러] 취소
  const handleCancel = () => {
    setIsAdding(false);
    setEditingId(null);
  };

  // [핸들러] 저장 (등록/수정 공통 - 실제론 API 호출)
  const handleSave = () => {
    if (isAdding) {
      // 등록 로직 (임시)
      const newItem = { id: Date.now(), ...editValues, base_price: Number(editValues.base_price) };
      setData([newItem, ...data]);
    } else {
      // 수정 로직 (임시)
      setData(data.map(item => item.id === editingId ? { ...item, ...editValues, base_price: Number(editValues.base_price) } : item));
    }
    handleCancel();
  };

  // [핸들러] 삭제
  const handleDelete = (id) => {
    if (window.confirm('정말 삭제하시겠습니까?')) {
      setData(data.filter(item => item.id !== id));
    }
  };

  return (
    <div className="basic-pricing-page">
      <div className='basic-pricing-top'>
        <h2 className='basic-pricing-title'>
          {type === 'DELIVERY' ? '배송' : '보관'} 기본 요금 설정
        </h2>
        <button className='basic-pricing-btn-add' onClick={handleAddClick} disabled={isAdding}>
          <Plus size={18} />
          요금 등록
        </button>
      </div>

      <div className='basic-pricing-table'>
        {/* 헤더 */}
        <div className='basic-pricing-header'>
          <div className='color-gray'>No</div>
          <div>품목</div>
          <div>크기</div>
          <div>무게</div>
          <div>기본 요금</div>
          <div>관리</div>
        </div>

        <div className='basic-pricing-body'>
          {/* 1. 등록 모드일 때 나타나는 입력 행 */}
          {isAdding && (
            <div className='basic-pricing-row adding-row'>
              <div>-</div>
              <div>
                <select name="item_type" value={editValues.item_type} onChange={handleChange} className='pricing-input'>
                  <option value="CARRIER">CARRIER</option>
                  <option value="BAG">BAG</option>
                  <option value="BOX">BOX</option>
                  <option value="GOLF">GOLF</option>
                </select>
              </div>
              <div>
                <input 
                  name="item_size" 
                  value={editValues.item_size} 
                  onChange={handleChange} 
                  placeholder="크기" 
                  className='pricing-input'
                />
              </div>
              <div>
                <select name="item_weight" value={editValues.item_weight} onChange={handleChange} className='pricing-input'>
                  <option value="">선택</option>
                  <option value="~10kg">~10kg</option>
                  <option value="~20kg">~20kg</option>
                  <option value="~30kg">~30kg</option>
                  <option value="OVER">OVER</option>
                </select>
              </div>
              <div>
                <input 
                  type="number"
                  name="base_price" 
                  value={editValues.base_price} 
                  onChange={handleChange} 
                  placeholder="금액" 
                  className='pricing-input'
                />
              </div>
              <div className='basic-pricing-col-actions'>
                <button className='btn-save' onClick={handleSave}>저장</button>
                <button className='btn-delete' onClick={handleCancel}>취소</button>
              </div>
            </div>
          )}

          {/* 2. 데이터 리스트 */}
          {data.map((item, index) => (
            <div key={item.id} className={`basic-pricing-row ${editingId === item.id ? 'editing-row' : ''}`}>
              {editingId === item.id ? (
                // [수정 모드]
                <>
                  <div className='color-gray'>{index + 1}</div>
                  <div>
                    <select name="item_type" value={editValues.item_type} onChange={handleChange} className='pricing-input'>
                      <option value="CARRIER">CARRIER</option>
                      <option value="BAG">BAG</option>
                      <option value="BOX">BOX</option>
                      <option value="GOLF">GOLF</option>
                    </select>
                  </div>
                  <div>
                    <input 
                      name="item_size" 
                      value={editValues.item_size} 
                      onChange={handleChange} 
                      className='pricing-input'
                    />
                  </div>
                  <div>
                     <select name="item_weight" value={editValues.item_weight} onChange={handleChange} className='pricing-input'>
                      <option value="~10kg">~10kg</option>
                      <option value="~20kg">~20kg</option>
                      <option value="~30kg">~30kg</option>
                      <option value="OVER">OVER</option>
                    </select>
                  </div>
                  <div>
                    <input 
                      type="number"
                      name="base_price" 
                      value={editValues.base_price} 
                      onChange={handleChange} 
                      className='pricing-input'
                    />
                  </div>
                  <div className='basic-pricing-col-actions'>
                    <button className='btn-save' onClick={handleSave}>저장</button>
                    <button className='btn-cancel' onClick={handleCancel}>취소</button>
                  </div>
                </>
              ) : (
                // [일반 모드]
                <>
                  <div className='color-gray'>{index + 1}</div>
                  <div className='basic-pricing-col-name'>
                    {item.item_type}
                  </div>
                  <div>
                    {item.item_size}
                  </div>
                  <div className='basic-pricing-col-weight'>{item.item_weight}</div>
                  <div className='basic-pricing-col-price'>
                    {item.base_price.toLocaleString()}원
                  </div>
                  <div className='basic-pricing-col-actions'>
                    <button className='btn-edit' onClick={() => handleEditClick(item)}>수정</button>
                    <button className='btn-delete' onClick={() => handleDelete(item.id)}>삭제</button>
                  </div>
                </>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* 페이지네이션 (디자인용) */}
      <div className='basic-pricing-pagination'>
        <ChevronLeft className='pagination-btn' color="#6B7280" size={22}/>
        <span className='page-number'>1</span>
        <ChevronRight className='pagination-btn' color="#6B7280" size={22} />
      </div>
    </div>
  );
}
