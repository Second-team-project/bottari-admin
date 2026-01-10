import { useState, useEffect } from 'react';
import { toast } from 'sonner';

import './ImageManagePage.css';
import SingleImageManager from './SingleImageManager';
import MultiImageManager from './MultiImageManager';
import { getGuideImg, createGuideImg, updateGuideImg, updateGuideImgOrder, deleteGuideImg } from '../../api/guideImgApi';

export default function ImageManagePage() {
  // ===== hooks

  // ===== local states
  const [images, setImages] = useState([]);
  const [activeTab, setActiveTab] = useState('BANNER');

  // 이미지 데이터 불러오기
  const fetchImages = async () => {
    try {
      const result = await getGuideImg();
      setImages(result);

      console.log('guideImg-Page-fetch: ', result);
    } catch (error) {
      toast.error('이미지를 불러오는데 실패했습니다.');
      console.error('이미지 불러오기 실패:', error);
    }
  };

  // 마운트 시 데이터 불러오기
  useEffect(() => {
    fetchImages();
  }, []);

  // ===== 타입별 데이터 필터링
  const mainBanner = images.find(img => img.type === 'BANNER') || null;
  const eventBanners = images.filter(img => img.type === 'EVENT').sort((a, b) => a.sortOrder - b.sortOrder);
  const serviceIntro = images.find(img => img.type === 'SERVICE') || null;
  const usageGuide = images.find(img => img.type === 'USAGE') || null;
  const priceGuide = images.find(img => img.type === 'PRICE') || null;

  // ===== 핸들러 함수
  // 생성
  const handleCreate = async (formData) => {
    try {
      await createGuideImg(formData);
      fetchImages();

      console.log('handleCreate: ', formData);
      toast.success('이미지가 등록되었습니다.');
    } catch (error) {
      toast.error(error.message || '이미지 등록에 실패했습니다.');
    }
  };

  // 수정
  const handleUpdate = async (id, formData) => {
    try {
      await updateGuideImg({ id, formData });
      fetchImages();

      console.log('handleUpdate: ', id, formData);
      toast.success('이미지가 수정되었습니다.');
    } catch (error) {
      toast.error(error.message || '이미지 수정에 실패했습니다.');
    }
  };

  // 삭제
  const handleDelete = async (id) => {
    try {
      await deleteGuideImg(id);
      fetchImages();

      console.log('handleDelete: ', id);
      toast.success('이미지가 삭제되었습니다.');
    } catch (error) {
      toast.error(error.message || '이미지 삭제에 실패했습니다.');
    }
  };

  // 순서 변경 (이벤트 배너용)
  const handleReorder = async (id, direction) => {
    try {
      // 현재 아이템 인덱스 찾기
      const currentIndex = eventBanners.findIndex(img => img.id === id);
      const targetIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1;

      // 범위 체크
      if (targetIndex < 0 || targetIndex >= eventBanners.length) return;

      const current = eventBanners[currentIndex];
      const target = eventBanners[targetIndex];

      // 두 아이템의 sortOrder 교환 (API 2번 호출)
      await Promise.all([
        updateGuideImgOrder({ id: current.id, sortOrder: target.sortOrder }),
        updateGuideImgOrder({ id: target.id, sortOrder: current.sortOrder })
      ]);

      fetchImages();
    } catch (error) {
      toast.error('순서 변경에 실패했습니다.');
    }
  };

  return (
    <div className='image-manage-page'>
      <h2 className='page-title'>이미지 관리</h2>

      {/* 탭 버튼 영역 */}
      <div className='image-manage-tabs'>
        <button
          className={`image-manage-tab-btn ${activeTab === 'BANNER' ? 'active' : ''}`}
          onClick={() => setActiveTab('BANNER')}
        >
          메인 배너
        </button>
        <button
          className={`image-manage-tab-btn ${activeTab === 'EVENT' ? 'active' : ''}`}
          onClick={() => setActiveTab('EVENT')}
        >
          이벤트 배너
        </button>
        <button
          className={`image-manage-tab-btn ${activeTab === 'SERVICE' ? 'active' : ''}`}
          onClick={() => setActiveTab('SERVICE')}
        >
          서비스 소개
        </button>
        <button
          className={`image-manage-tab-btn ${activeTab === 'USAGE' ? 'active' : ''}`}
          onClick={() => setActiveTab('USAGE')}
        >
          이용 안내
        </button>
        <button
          className={`image-manage-tab-btn ${activeTab === 'PRICE' ? 'active' : ''}`}
          onClick={() => setActiveTab('PRICE')}
        >
          요금 안내
        </button>
      </div>

      {/* 탭 내용 영역 */}
      <div className='image-manage-content'>
        {activeTab === 'BANNER' && (
          <SingleImageManager
            title="메인 배너 이미지"
            type="BANNER"
            data={mainBanner}
            onCreate={handleCreate}
            onUpdate={handleUpdate}
            onDelete={handleDelete}
          />
        )}
        {activeTab === 'EVENT' && (
          <MultiImageManager
            title="이벤트 배너 이미지"
            type="EVENT"
            data={eventBanners}
            onCreate={handleCreate}
            onUpdate={handleUpdate}
            onDelete={handleDelete}
            onReorder={handleReorder}
          />
        )}
        {activeTab === 'SERVICE' && (
          <SingleImageManager
            title="서비스 소개 이미지"
            type="SERVICE"
            data={serviceIntro}
            onCreate={handleCreate}
            onUpdate={handleUpdate}
            onDelete={handleDelete}
          />
        )}
        {activeTab === 'USAGE' && (
          <SingleImageManager
            title="이용 안내 이미지"
            type="USAGE"
            data={usageGuide}
            onCreate={handleCreate}
            onUpdate={handleUpdate}
            onDelete={handleDelete}
          />
        )}
        {activeTab === 'PRICE' && (
          <SingleImageManager
            title="요금 안내 이미지"
            type="PRICE"
            data={priceGuide}
            onCreate={handleCreate}
            onUpdate={handleUpdate}
            onDelete={handleDelete}
          />
        )}
      </div>
    </div>
  );
}
