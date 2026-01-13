import '../ReservationDetail.css';
import { X } from 'lucide-react';

export default function LuggageEditor({ items, onChange, readOnly = true, pricing = [] }) {
  // 1. [Helper] 종류(Type) 목록 추출 (중복제거)
  const typeList = pricing?.length > 0 ? [...new Set(pricing.map(p => p.itemType))] : [];

  // 2. [Helper] 선택된 Type에 맞는 Size 목록 추출
  const getAvailableSizes = (currentType) => {
    if (!currentType || !pricing || pricing.length < 1) return [];
    return pricing
      .filter(p => p.itemType === currentType)
      .map(p => p.itemSize)
      .filter((v, i, self) => self.indexOf(v) === i); // 중복제거
  }

  // 3. [Helper] 선택된 Type + Size에 맞는 Weight 목록 추출
  const getAvailableWeights = (currentType, currentSize) => {
    if (!currentType || !pricing || pricing.length < 1) return [];
    // Size가 없는 타입(예: 골프)일 경우 null도 허용해서 필터링
    const targetSize = currentSize || null;
    return pricing
      .filter(p => p.itemType === currentType && p.itemSize === targetSize)
      .map(p => p.itemWeight)
      .filter((v, i, self) => self.indexOf(v) === i);
  }

  // ===== 데이터 변경 핸들러 (순수 데이터 관리) =====
  const handleItemChange = (index, field, value) => {
    const newItems = [...items];
    const currentItem = { ...newItems[index] };

    // 필드 업데이트
    currentItem[field] = value;

    // 연쇄 초기화 로직 (Cascading Reset)
    if (field === 'itemType') {
      // 종류가 바뀌면 크기/무게 초기화
      // GOLF인 경우 사이즈를 null로, 아니면 빈 문자열로 설정
      currentItem.itemSize = value === 'GOLF' ? null : '';
      currentItem.itemWeight = '';
    } else if (field === 'itemSize') {
      // 크기가 바뀌면 무게 초기화
      currentItem.itemWeight = '';
    }

    newItems[index] = currentItem;
    onChange(newItems);
  };

  // 짐 항목 추가
  const handleAddItem = () => {
    // 초기값: 첫 번째 타입으로 설정 (없으면 기본값 'CARRIER')
    const defaultType = typeList.length > 0 ? typeList[0] : 'CARRIER';
    onChange([...items, {
      itemType: defaultType,
      itemSize: '',
      itemWeight: '',
      count: 1,
    }]);
  }
  
  // 짐 항목 삭제
  const handleRemoveItem = (index) => {
    onChange(items.filter((_, i) => i !== index));
  };

  // ===== 한글 맵핑용
  const TYPE_LABELS = {
    'CARRIER': '캐리어',
    'BAG': '가방',
    'BOX': '상자',
    'GOLF': '골프가방',
  }

  // 읽기 전용 모드
  if (readOnly) {
    if (!items || items.length === 0) {
      return <span className="luggage-empty">(짐 정보 없음)</span>;
    }
    return (
      <ul className="luggage-list">
        {items.map((item, idx) => (
          <li key={idx}>
            {TYPE_LABELS[item.itemType] || item.itemType} / {item.itemSize || '-'} / {item.itemWeight || '-'} / {item.count}개
          </li>
        ))}
      </ul>
    );
  }

  // 편집 모드
  return (
    <div className="luggage-edit-container flex-end">
      {items.map((item, idx) => {
          // 각 행(Row)마다 가능한 옵션 계산
          const availableSizes = getAvailableSizes(item.itemType);
          const availableWeights = getAvailableWeights(item.itemType, item.itemSize);
          const hasSizes = availableSizes.length > 0 && availableSizes.some(s => s !== null);

          return(
            <div key={idx} className="luggage-edit-row">
              {/* 종류선택 */}
              <select
                className="detail-input sm"
                value={item.itemType || ''}
                onChange={(e) => handleItemChange(idx, 'itemType', e.target.value)}
              >
                <option value="" disabled>종류 선택</option>
                {typeList.map(type => (
                  <option key={type} value={type}>{TYPE_LABELS[type] || type}</option>
                ))}
              </select>

              {/* 크기 선택 */}
              <select
                className="detail-input sm"
                value={item.itemSize || ''}
                onChange={(e) => handleItemChange(idx, 'itemSize', e.target.value)}
                disabled={!hasSizes}
                style={{ backgroundColor: !hasSizes ? '#f0f0f0' : 'white' }}
              >
                <option value="" disabled>크기 선택</option>
                {availableSizes.map(size => (
                  size && <option key={size} value={size}>{size}</option>
                ))}
              </select>

              {/* 무게 선택: 필드명을 itemWeight로 수정 */}
              <select
                className="detail-input sm"
                value={item.itemWeight || ''}
                onChange={(e) => handleItemChange(idx, 'itemWeight', e.target.value)}
              >
                <option value="" disabled>무게 선택</option>
                {availableWeights.map(weight => (
                  <option key={weight} value={weight}>{weight}</option>
                ))}
              </select>

              {/* 개수 입력 */}
              <input
                type="number"
                className="detail-input sm"
                value={item.count}
                min="1"
                max="9"
                onChange={(e) => handleItemChange(idx, 'count', Number(e.target.value))}
              />
              <span>개</span>

              {/* 삭제 버튼 */}
              <button
                type="button"
                className="btn-remove-item"
                onClick={() => handleRemoveItem(idx)}
              >
                <X size={18} />
              </button>
            </div>
          )
        }
      )}
      
      <button type="button" className="btn-add-item" onClick={handleAddItem}>
        + 짐 추가
      </button>
    </div>
  );
}