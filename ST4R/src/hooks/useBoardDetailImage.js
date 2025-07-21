import { useState, useCallback, useEffect } from 'react';

export function useBoardDetailImage() {
  const [isImageViewerOpen, setIsImageViewerOpen] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  // 이미지 클릭 핸들러
  const handleImageClick = useCallback((index = 0) => {
    setSelectedImageIndex(index);
    setIsImageViewerOpen(true);
  }, []);

  // 이미지 뷰어 닫기
  const handleCloseImageViewer = useCallback(() => {
    setIsImageViewerOpen(false);
  }, []);

  // 전역 이미지 뷰어 설정 (헤더 컴포넌트에서 사용) - 이 부분이 누락되어 있었습니다!
  useEffect(() => {
    window.boardDetailImageViewer = {
      open: handleImageClick,
    };

    return () => {
      delete window.boardDetailImageViewer;
    };
  }, [handleImageClick]);

  return {
    isImageViewerOpen,
    selectedImageIndex,
    handleImageClick,
    handleCloseImageViewer,
  };
}

