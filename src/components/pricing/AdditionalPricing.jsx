import { useState } from 'react';
import { Plus, ChevronLeft, ChevronRight } from 'lucide-react';
import './AdditionalPricing.css';
import { toast } from 'sonner';

export default function AdditionalPricing({ data, onCreate, onUpdate, onDelete }) {
  // 상태 관리
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [editValues, setEditValues] = useState({
    serviceType: 'S', minValue: '', maxValue: '', rate: ''
  });

  // [핸들러]
  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditValues(prev => ({ ...prev, [name]: value }));
  };

  const handleAddClick = () => {
    setIsAdding(true);
    setEditingId(null);
    setEditValues({ serviceType: 'S', minValue: '', maxValue: '', rate: '' });
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
    if(parseInt(editValues.minValue) >= parseInt(editValues.maxValue)) {
      toast.error('최대값은 최소값보다 커야합니다.')
      return;
    }
    if (isAdding) {
      const newItem = { ...editValues };
      onCreate(newItem)
    } else {
      const updateItem = { id:editingId, ...editValues }
      onUpdate(updateItem)
    }
    handleCancel();
  };

  const handleDelete = (id) => {
    if (window.confirm('정말 삭제하시겠습니까?')) {
      onDelete(id);
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
                <select name="serviceType" value={editValues.serviceType} onChange={handleChange} className='pricing-input'>
                  <option value="S">보관</option>
                  <option value="D">배송</option>
                </select>
              </div>
              <div className='additional-pricing-col-range'>
                <input 
                  name="minValue" 
                  value={editValues.minValue} 
                  onChange={handleChange} 
                  placeholder='최소 (숫자)'
                  className='pricing-input small'
                /><span className="unit">{editValues.serviceType === 'S' ? '일' : 'km'}</span>
                <span className='range-separator'>~</span>
                <input 
                  name="maxValue" 
                  value={editValues.maxValue} 
                  onChange={handleChange} 
                  placeholder='최대 (숫자)'
                  className='pricing-input small'
                /><span className="unit">{editValues.serviceType === 'S' ? '일' : 'km'}</span>
              </div>
              <div className='additional-pricing-col-rate'>
                <input 
                  type="number"
                  name="rate" 
                  value={editValues.rate} 
                  onChange={handleChange} 
                  placeholder="% (숫자)" 
                  className='pricing-input small'
                /> <span className="unit">%</span>
              </div>
              <div className='additional-pricing-col-actions'>
                <button className='btn-save' onClick={handleSave}>저장</button>
                <button className='btn-delete' onClick={handleCancel}>취소</button>
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
                    <select name="serviceType" value={editValues.serviceType} onChange={handleChange} className='pricing-input'>
                      <option value="S">보관</option>
                      <option value="D">배송</option>
                    </select>
                  </div>
                  <div className='additional-pricing-col-range'>
                    <input 
                      name="minValue" 
                      value={editValues.minValue} 
                      onChange={handleChange} 
                      className='pricing-input small'
                    /><span className="unit">{editValues.serviceType === 'S' ? '일' : 'km'}</span>
                    <span className='range-separator'>~</span>
                    <input 
                      name="maxValue" 
                      value={editValues.maxValue} 
                      onChange={handleChange} 
                      className='pricing-input small'
                    /><span className="unit">{editValues.serviceType === 'S' ? '일' : 'km'}</span>
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
                    <button className='btn-delete' onClick={handleCancel}>취소</button>
                  </div>
                </>
              ) : (
                // 일반 모드
                <>
                  <div className='color-gray'>{index + 1}</div>
                  <div className='additional-pricing-col-type'>
                    {item.serviceType === 'S' ? '보관' : '배송'}
                  </div>
                  <div className='additional-pricing-col-range'>
                    {item.minValue} ~ {item.maxValue}
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
        <ChevronLeft className='pagination-btn' size={22}/>
        <span className='page-number'>1</span>
        <ChevronRight className='pagination-btn' size={22} />
      </div>
    </div>
  );
}