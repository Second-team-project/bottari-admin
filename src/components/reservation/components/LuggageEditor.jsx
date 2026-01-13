export default function LuggageEditor({ items, onChange, readOnly = false }) {
  // 짐 항목 내용 변경
  const handleItemChange = (index, field, value) => {
    const newItems = [...items];
    newItems[index] = { ...newItems[index], [field]: value };
    onChange(newItems);
  };

  // 짐 항목 추가
  const handleAddItem = () => {
    onChange([...items, { itemType: 'BAG', itemSize: 'S', count: 1 }]);
  };

  // 짐 항목 삭제
  const handleRemoveItem = (index) => {
    onChange(items.filter((_, i) => i !== index));
  };

  // 읽기 전용 모드
  if (readOnly) {
    if (!items || items.length === 0) {
      return <span className="luggage-empty">(짐 정보 없음)</span>;
    }
    return (
      <ul className="luggage-list">
        {items.map((item, idx) => (
          <li key={idx}>
            {item.itemType} / {item.itemSize} / {item.count}개
          </li>
        ))}
      </ul>
    );
  }

  // 편집 모드
  return (
    <div className="luggage-edit-container">
      {items.map((item, idx) => (
        <div key={idx} className="luggage-edit-row">
          <select
            className="detail-input sm"
            value={item.itemType}
            onChange={(e) => handleItemChange(idx, 'itemType', e.target.value)}
          >
            <option value="BAG">가방</option>
            <option value="CARRIER">캐리어</option>
            <option value="ETC">기타</option>
          </select>

          <select
            className="detail-input sm"
            value={item.itemSize}
            onChange={(e) => handleItemChange(idx, 'itemSize', e.target.value)}
          >
            <option value="S">S</option>
            <option value="M">M</option>
            <option value="L">L</option>
            <option value="XL">XL</option>
          </select>

          <input
            type="number"
            className="detail-input sm"
            value={item.count}
            min="1"
            onChange={(e) => handleItemChange(idx, 'count', Number(e.target.value))}
          />
          <span>개</span>

          <button
            type="button"
            className="btn-remove-item"
            onClick={() => handleRemoveItem(idx)}
          >
            X
          </button>
        </div>
      ))}

      <button type="button" className="btn-add-item" onClick={handleAddItem}>
        + 짐 추가
      </button>
    </div>
  );
}
