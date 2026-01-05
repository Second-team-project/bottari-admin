import { useState } from 'react';
import { Plus, ChevronLeft, ChevronRight } from 'lucide-react';
import './AdditionalPricing.css';

export default function AdditionalPricing() {
  
  // 임시 데이터
  const [data, setData] = useState([
    { id: 1, service_type: 'STORAGE', min_value: 1, max_value: 3, rate: 100 },
    { id: 2, service_type: 'STORAGE', min_value: 4, max_value: 7, rate: 85 },
    { id: 3, service_type: 'STORAGE', min_value: 8, max_value: 15, rate: 75 },
    { id: 4, service_type: 'STORAGE', min_value: 16, max_value: 30, rate: 65 },
  ]);

  // 상태 관리
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [editValues, setEditValues] = useState({
    service_type: 'STORAGE', min_value: '', max_value: '', rate: ''
  });

  // [핸들러]
  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditValues(prev => ({ ...prev, [name]: value }));
  };

  const handleAddClick = () => {
    setIsAdding(true);
    setEditingId(null);
    setEditValues({ service_type: 'STORAGE', min_value: '', max_value: '', rate: '' });
  };

  const handleEditClick = (item) => {
    setIsAdding(false);
    setEditingId(item.id);
    setEditValues({ ...item });
  };

  const handleCancel = () => {
    setIsAdding(false);
    setEditingId(null);
  };

  const handleSave = () => {
    if (isAdding) {
      const newItem = { id: Date.now(), ...editValues };
      setData([newItem, ...data]);
    } else {
      setData(data.map(item => item.id === editingId ? { ...item, ...editValues } : item));
    }
    handleCancel();
  };

  const handleDelete = (id) => {
    if (window.confirm('정말 삭제하시겠습니까?')) {
      setData(data.filter(item => item.id !== id));
    }
  };

  return (
    <div className="additional-pricing-page">
      <div className='additional-pricing-top'>
        <h2 className='additional-pricing-title'>추가 요금 설정</h2>
        <button className='additional-pricing-btn-add' onClick={handleAddClick} disabled={isAdding}>
          <Plus size={18} />
          추가 요금 등록
        </button>
      </div>

      <div className='additional-pricing-table'>
        <div className='additional-pricing-header'>
          <div className='color-gray'>No</div>
          <div>서비스 타입</div>
          <div>적용 구간 (일/거리)</div>
          <div>적용 요율 (%)</div>
          <div>관리</div>
        </div>

        <div className='additional-pricing-body'>
          {/* 1. 등록 모드 */}
          {isAdding && (
            <div className='additional-pricing-row adding-row'>
              <div>-</div>
              <div className='additional-pricing-col-type'>
                <select name="service_type" value={editValues.service_type} onChange={handleChange} className='pricing-input'>
                  <option value="STORAGE">보관</option>
                  <option value="DELIVERY">배송</option>
                </select>
              </div>
              <div className='additional-pricing-col-range'>
                <input 
                  name="min_value" 
                  value={editValues.min_value} 
                  onChange={handleChange} 
                  placeholder="최소" 
                  className='pricing-input small'
                />
                <span className='range-separator'>~</span>
                <input 
                  name="max_value" 
                  value={editValues.max_value} 
                  onChange={handleChange} 
                  placeholder="최대" 
                  className='pricing-input small'
                />
              </div>
              <div className='additional-pricing-col-rate'>
                <input 
                  type="number"
                  name="rate" 
                  value={editValues.rate} 
                  onChange={handleChange} 
                  placeholder="%" 
                  className='pricing-input small'
                /> <span className="unit">%</span>
              </div>
              <div className='additional-pricing-col-actions'>
                <button className='btn-save' onClick={handleSave}>저장</button>
                <button className='btn-cancel' onClick={handleCancel}>취소</button>
              </div>
            </div>
          )}

          {/* 2. 리스트 */}
          {data.map((item, index) => (
            <div key={item.id} className={`additional-pricing-row ${editingId === item.id ? 'editing-row' : ''}`}>
              {editingId === item.id ? (
                // 수정 모드
                <>
                  <div className='color-gray'>{index + 1}</div>
                  <div className='additional-pricing-col-type'>
                    <select name="service_type" value={editValues.service_type} onChange={handleChange} className='pricing-input'>
                      <option value="STORAGE">보관</option>
                      <option value="DELIVERY">배송</option>
                    </select>
                  </div>
                  <div className='additional-pricing-col-range'>
                    <input 
                      name="min_value" 
                      value={editValues.min_value} 
                      onChange={handleChange} 
                      className='pricing-input small'
                    />
                    <span className='range-separator'>~</span>
                    <input 
                      name="max_value" 
                      value={editValues.max_value} 
                      onChange={handleChange} 
                      className='pricing-input small'
                    />
                  </div>
                  <div className='additional-pricing-col-rate'>
                    <input 
                      type="number"
                      name="rate" 
                      value={editValues.rate} 
                      onChange={handleChange} 
                      className='pricing-input small'
                    /> <span className="unit">%</span>
                  </div>
                  <div className='additional-pricing-col-actions'>
                    <button className='btn-save' onClick={handleSave}>저장</button>
                    <button className='btn-cancel' onClick={handleCancel}>취소</button>
                  </div>
                </>
              ) : (
                // 일반 모드
                <>
                  <div className='color-gray'>{index + 1}</div>
                  <div className='additional-pricing-col-type'>
                    {item.service_type === 'STORAGE' ? '보관' : '배송'}
                  </div>
                  <div className='additional-pricing-col-range'>
                    {item.min_value} ~ {item.max_value}
                  </div>
                  <div className='additional-pricing-col-rate'>
                    {item.rate}%
                  </div>
                  <div className='additional-pricing-col-actions'>
                    <button className='btn-edit' onClick={() => handleEditClick(item)}>수정</button>
                    <button className='btn-delete' onClick={() => handleDelete(item.id)}>삭제</button>
                  </div>
                </>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* 페이지네이션 */}
      <div className='additional-pricing-pagination'>
        <ChevronLeft className='pagination-btn' color="#6B7280" size={22}/>
        <span className='page-number'>1</span>
        <ChevronRight className='pagination-btn' color="#6B7280" size={22} />
      </div>
    </div>
  );
}