import { useState, useEffect, useCallback } from 'react';

export default function ImageViewer({
  images = [],
  initialIndex = 0,
  isOpen = false,
  onClose,
}) {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const [isZoomed, setIsZoomed] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);

  const goToPrevious = useCallback(() => {
    setCurrentIndex((prev) => (prev > 0 ? prev - 1 : images.length - 1));
    setIsZoomed(false);
    setImageLoaded(false);
  }, [images.length]);

  const goToNext = useCallback(() => {
    setCurrentIndex((prev) => (prev < images.length - 1 ? prev + 1 : 0));
    setIsZoomed(false);
    setImageLoaded(false);
  }, [images.length]);

  const toggleZoom = useCallback(() => {
    setIsZoomed(!isZoomed);
  }, [isZoomed]);

  useEffect(() => {
    setCurrentIndex(initialIndex);
    setIsZoomed(false);
    setImageLoaded(false);
  }, [initialIndex]);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!isOpen) return;

      if (e.key === 'Escape') {
        onClose();
      }
      if (e.key === 'ArrowLeft') {
        e.preventDefault();
        goToPrevious();
      }
      if (e.key === 'ArrowRight') {
        e.preventDefault();
        goToNext();
      }
      if (e.key === ' ' || e.key === 'Enter') {
        e.preventDefault();
        toggleZoom();
      }
    };

    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
      return () => window.removeEventListener('keydown', handleKeyDown);
    }
  }, [isOpen, onClose, goToPrevious, goToNext, toggleZoom]);

  if (!isOpen || !images || images.length === 0) {
    return null;
  }

  return (
    <div className="fixed inset-0 bg-black z-50 flex items-center justify-center">
      <div className="absolute top-4 left-4 right-4 z-30 flex justify-between items-center">
        {/* 왼쪽: 닫기 버튼 */}
        <button
          onClick={onClose}
          className="p-3 bg-black/70 hover:bg-black/90 rounded-full text-white transition-colors"
          aria-label="이미지 뷰어 닫기"
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>

        {/* 중앙: 이미지 카운터 */}
        {images.length > 1 && (
          <div className="bg-black/70 rounded-full px-4 py-2 text-white text-sm font-medium">
            {currentIndex + 1} / {images.length}
          </div>
        )}

        {/* 오른쪽: 줌 버튼 */}
        <button
          onClick={toggleZoom}
          className="p-3 bg-black/70 hover:bg-black/90 rounded-full text-white transition-colors"
          aria-label={isZoomed ? '줌 아웃' : '줌 인'}
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            {isZoomed ? (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM13 10H7"
              />
            ) : (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7"
              />
            )}
          </svg>
        </button>
      </div>

      {/* 메인 이미지 컨테이너 */}
      <div
        className={`relative w-full h-full flex items-center justify-center p-4 overflow-auto ${
          isZoomed ? 'cursor-zoom-out' : 'cursor-zoom-in'
        }`}
        onClick={toggleZoom}
      >
        {/* 로딩 스피너 */}
        {!imageLoaded && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-8 h-8 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
          </div>
        )}

        <img
          src={images[currentIndex]}
          alt={`이미지 ${currentIndex + 1}`}
          className={`transition-all duration-300 ease-in-out ${
            isZoomed
              ? 'max-w-none h-auto cursor-zoom-out'
              : 'max-w-full max-h-full object-contain cursor-zoom-in'
          } ${!imageLoaded ? 'opacity-0' : 'opacity-100'}`}
          onLoad={() => setImageLoaded(true)}
          onClick={(e) => {
            e.stopPropagation();
            toggleZoom();
          }}
          style={isZoomed ? { minWidth: '150%', minHeight: '150%' } : {}}
        />

        {/* 이전/다음 버튼 */}
        {images.length > 1 && (
          <>
            <button
              onClick={(e) => {
                e.stopPropagation();
                goToPrevious();
              }}
              className="absolute left-4 top-1/2 transform -translate-y-1/2 p-4 bg-black/70 hover:bg-black/90 rounded-full text-white transition-colors z-20"
              aria-label="이전 이미지"
            >
              <svg
                className="w-8 h-8"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 19l-7-7 7-7"
                />
              </svg>
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                goToNext();
              }}
              className="absolute right-4 top-1/2 transform -translate-y-1/2 p-4 bg-black/70 hover:bg-black/90 rounded-full text-white transition-colors z-20"
              aria-label="다음 이미지"
            >
              <svg
                className="w-8 h-8"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </button>
          </>
        )}

        {/* 하단 인디케이터 */}
        {images.length > 1 && (
          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2 z-20">
            {images.map((_, index) => (
              <button
                key={index}
                onClick={(e) => {
                  e.stopPropagation();
                  setCurrentIndex(index);
                  setIsZoomed(false);
                  setImageLoaded(false);
                }}
                className={`h-2 rounded-full transition-all duration-200 ${
                  index === currentIndex
                    ? 'bg-white w-6'
                    : 'bg-white/50 hover:bg-white/75 w-2'
                }`}
                aria-label={`이미지 ${index + 1}로 이동`}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
