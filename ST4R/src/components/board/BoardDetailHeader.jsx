import { useState, useCallback, useMemo } from 'react';
import BackButton from '../common/BackButton';

export default function BoardDetailHeader({
  post,
  isLoggedIn,
  isAuthor,
  isLiked,
  likeCount,
  onLike,
  onEdit,
  onDelete,
  onShare,
  likeMutation,
}) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const allImages = useMemo(() => {
    if (!post) return [];
    return post.imageUrls || [];
  }, [post]);

  const goToPrevImage = useCallback(() => {
    setCurrentImageIndex((prev) =>
      prev > 0 ? prev - 1 : allImages.length - 1
    );
  }, [allImages.length]);

  const goToNextImage = useCallback(() => {
    setCurrentImageIndex((prev) =>
      prev < allImages.length - 1 ? prev + 1 : 0
    );
  }, [allImages.length]);

  const handleImageClick = useCallback(() => {
    // 이미지 뷰어 열기 이벤트를 부모로 전달
    if (window.boardDetailImageViewer) {
      window.boardDetailImageViewer.open(currentImageIndex);
    }
  }, [currentImageIndex]);

  if (!post) return null;

  return (
    <div className="relative h-80 overflow-hidden">
      {allImages.length > 0 ? (
        <div className="relative group h-full">
          {/* 현재 이미지 */}
          <img
            src={allImages[currentImageIndex] || allImages[0]}
            alt={`${post.title} - ${currentImageIndex + 1}`}
            className="w-full h-full object-cover cursor-pointer transition-transform group-hover:scale-105"
            onClick={handleImageClick}
          />
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors" />

          {/* 이미지 슬라이드 컨트롤 */}
          {allImages.length > 1 && (
            <>
              {/* 이전 버튼 */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  goToPrevImage();
                }}
                className="absolute left-4 top-1/2 transform -translate-y-1/2 p-2 bg-black/50 backdrop-blur-sm rounded-full hover:bg-black/70 transition-colors opacity-0 group-hover:opacity-100"
              >
                <svg
                  className="w-6 h-6 text-white"
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

              {/* 다음 버튼 */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  goToNextImage();
                }}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 p-2 bg-black/50 backdrop-blur-sm rounded-full hover:bg-black/70 transition-colors opacity-0 group-hover:opacity-100"
              >
                <svg
                  className="w-6 h-6 text-white"
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

              {/* 슬라이드 인디케이터 */}
              <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
                {allImages.map((_, index) => (
                  <button
                    key={index}
                    onClick={(e) => {
                      e.stopPropagation();
                      setCurrentImageIndex(index);
                    }}
                    className={`w-2 h-2 rounded-full transition-colors ${
                      index === currentImageIndex ? 'bg-white' : 'bg-white/50'
                    }`}
                  />
                ))}
              </div>
            </>
          )}

          {/* 확대 안내 */}
          <div className="absolute bottom-4 left-4 bg-black/50 backdrop-blur-sm rounded-full px-3 py-1 text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity">
            📷 클릭하여 확대
          </div>
        </div>
      ) : (
        <div className="w-full h-full bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center">
          <svg
            className="w-20 h-20 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1}
              d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
            />
          </svg>
        </div>
      )}

      <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-black/80" />

      <div className="absolute top-4 left-4 right-4 flex justify-between items-center">
        <BackButton className="bg-black/50 backdrop-blur-sm" />

        <div className="flex space-x-2">
          {isLoggedIn ? (
            isAuthor ? (
              /* 내 글인 경우: 삭제/수정/공유/좋아요 버튼 */
              <>
                <button
                  onClick={onDelete}
                  className="p-3 bg-red-500/50 backdrop-blur-sm rounded-full hover:bg-red-500/70 transition-colors"
                >
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                    />
                  </svg>
                </button>
                <button
                  onClick={onEdit}
                  className="p-3 bg-black/50 backdrop-blur-sm rounded-full hover:bg-black/70 transition-colors"
                >
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                    />
                  </svg>
                </button>
                <button
                  onClick={onShare}
                  className="p-3 bg-black/50 backdrop-blur-sm rounded-full hover:bg-black/70 transition-colors"
                >
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z"
                    />
                  </svg>
                </button>
                <LikeButton
                  isLiked={isLiked}
                  onClick={onLike}
                  isLoading={likeMutation.isLoading}
                />
              </>
            ) : (
              /* 다른 사람 글인 경우: 공유/좋아요 버튼 */
              <>
                <button
                  onClick={onShare}
                  className="p-3 bg-black/50 backdrop-blur-sm rounded-full hover:bg-black/70 transition-colors"
                >
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z"
                    />
                  </svg>
                </button>
                <LikeButton
                  isLiked={isLiked}
                  onClick={onLike}
                  isLoading={likeMutation.isLoading}
                />
              </>
            )
          ) : (
            /* 비로그인 상태: 공유 버튼만 */
            <button
              onClick={onShare}
              className="p-3 bg-black/50 backdrop-blur-sm rounded-full hover:bg-black/70 transition-colors"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z"
                />
              </svg>
            </button>
          )}
        </div>
      </div>

      {/* 이미지 카운터 표시 */}
      {allImages.length > 1 && (
        <div className="absolute bottom-4 right-4">
          <div className="bg-black/50 backdrop-blur-sm rounded-full px-3 py-1 text-sm font-medium">
            {currentImageIndex + 1} / {allImages.length}
          </div>
        </div>
      )}
    </div>
  );
}

// 좋아요 버튼 컴포넌트
function LikeButton({ isLiked, onClick, isLoading }) {
  return (
    <button
      onClick={onClick}
      disabled={isLoading}
      className={`p-3 backdrop-blur-sm rounded-full transition-colors ${
        isLiked
          ? 'bg-red-500/80 hover:bg-red-500'
          : 'bg-black/50 hover:bg-black/70'
      } ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
      title={isLiked ? '좋아요 취소' : '좋아요'}
    >
      <svg
        className={`w-5 h-5 ${isLiked ? 'text-white fill-current' : 'text-white'}`}
        fill={isLiked ? 'currentColor' : 'none'}
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
        />
      </svg>
    </button>
  );
}
