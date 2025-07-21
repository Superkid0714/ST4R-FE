import { useState, useCallback, useMemo, useEffect } from 'react';
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
  onImageClick,
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

  // 이미지 클릭 핸들러
  const handleImageClick = useCallback(
    (e) => {
      if (e) {
        e.preventDefault();
        e.stopPropagation();
      }

      if (onImageClick) {
        onImageClick(currentImageIndex);
      }
    },
    [currentImageIndex, onImageClick]
  );

  // 키보드 네비게이션
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (allImages.length <= 1) return;

      if (e.key === 'ArrowLeft') {
        e.preventDefault();
        goToPrevImage();
      } else if (e.key === 'ArrowRight') {
        e.preventDefault();
        goToNextImage();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [goToPrevImage, goToNextImage, allImages.length]);

  if (!post) return null;

  return (
    <div className="relative h-80 overflow-hidden">
      {allImages.length > 0 ? (
        <div className="relative group h-full">
          {/* 클릭 가능한 이미지 영역 */}
          <div
            className="absolute inset-0 w-full h-full cursor-pointer z-10"
            onClick={handleImageClick}
          />

          {/* 현재 이미지 */}
          <img
            src={allImages[currentImageIndex] || allImages[0]}
            alt={`${post.title} - ${currentImageIndex + 1}`}
            className="w-full h-full object-cover transition-transform group-hover:scale-105"
            style={{ pointerEvents: 'none' }}
          />

          {/* 이미지 슬라이드 컨트롤 */}
          {allImages.length > 1 && (
            <>
              {/* 이전 버튼 */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  goToPrevImage();
                }}
                className="absolute left-4 top-1/2 transform -translate-y-1/2 p-3 bg-black/50 backdrop-blur-sm rounded-full hover:bg-black/70 transition-all duration-200 opacity-0 group-hover:opacity-100 z-20"
                aria-label="이전 이미지"
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
                className="absolute right-4 top-1/2 transform -translate-y-1/2 p-3 bg-black/50 backdrop-blur-sm rounded-full hover:bg-black/70 transition-all duration-200 opacity-0 group-hover:opacity-100 z-20"
                aria-label="다음 이미지"
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

              {/* 슬라이드 인디케이터 - 이미지 내부 하단으로 이동 */}
              <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 flex space-x-2 z-20">
                {allImages.map((_, index) => (
                  <button
                    key={index}
                    onClick={(e) => {
                      e.stopPropagation();
                      setCurrentImageIndex(index);
                    }}
                    className={`w-2 h-2 rounded-full transition-all duration-200 ${
                      index === currentImageIndex
                        ? 'bg-white'
                        : 'bg-white/50 hover:bg-white/75'
                    }`}
                    aria-label={`이미지 ${index + 1}로 이동`}
                  />
                ))}
              </div>
            </>
          )}

          {/* 이미지 카운터 표시 */}
          {allImages.length > 1 && (
            <div className="absolute top-4 right-4 bg-black/50 backdrop-blur-sm rounded-full px-3 py-1 text-sm font-medium z-20">
              {currentImageIndex + 1} / {allImages.length}
            </div>
          )}
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

      <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-black/80 pointer-events-none" />

      <div className="absolute top-4 left-4 right-4 flex justify-between items-center z-30">
        <BackButton className="bg-black/50 backdrop-blur-sm" />

        <div className="flex space-x-2">
          {isLoggedIn ? (
            isAuthor ? (
              /* 내 글인 경우: 삭제/수정/공유/좋아요 버튼 */
              <>
                <button
                  onClick={onDelete}
                  className="p-3 bg-red-500/50 backdrop-blur-sm rounded-full hover:bg-red-500/70 transition-colors"
                  aria-label="게시글 삭제"
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
                  aria-label="게시글 수정"
                >
                  <svg
                    width="18"
                    height="18"
                    viewBox="0 0 18 18"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-5 h-5"
                  >
                    <path
                      d="M2 16H3.2615L13.498 5.7635L12.2365 4.502L2 14.7385V16ZM1.404 17.5C1.14783 17.5 0.933167 17.4133 0.76 17.24C0.586667 17.0668 0.5 16.8522 0.5 16.596V14.8635C0.5 14.6197 0.546833 14.3873 0.6405 14.1663C0.734 13.9453 0.862833 13.7527 1.027 13.5885L13.6905 0.93075C13.8417 0.793416 14.0086 0.687333 14.1913 0.6125C14.3741 0.5375 14.5658 0.5 14.7663 0.5C14.9668 0.5 15.1609 0.535584 15.3488 0.60675C15.5367 0.677917 15.7032 0.791083 15.848 0.946249L17.0693 2.18275C17.2244 2.32758 17.335 2.49425 17.401 2.68275C17.467 2.87125 17.5 3.05975 17.5 3.24825C17.5 3.44942 17.4657 3.64133 17.397 3.824C17.3283 4.00683 17.2191 4.17383 17.0693 4.325L4.4115 16.973C4.24733 17.1372 4.05475 17.266 3.83375 17.3595C3.61275 17.4532 3.38033 17.5 3.1365 17.5H1.404ZM12.8562 5.14375L12.2365 4.502L13.498 5.7635L12.8562 5.14375Z"
                      fill="white"
                    />
                  </svg>
                </button>
                <button
                  onClick={onShare}
                  className="p-3 bg-black/50 backdrop-blur-sm rounded-full hover:bg-black/70 transition-colors"
                  aria-label="게시글 공유"
                >
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 16 16"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-5 h-5"
                  >
                    <path
                      d="M2.30775 15.5C1.80258 15.5 1.375 15.325 1.025 14.975C0.675 14.625 0.5 14.1974 0.5 13.6922V11.7307C0.5 11.5179 0.571833 11.3397 0.7155 11.1962C0.859 11.0525 1.03717 10.9807 1.25 10.9807C1.46283 10.9807 1.641 11.0525 1.7845 11.1962C1.92817 11.3397 2 11.5179 2 11.7307V13.6922C2 13.7692 2.03208 13.8397 2.09625 13.9037C2.16025 13.9679 2.23075 14 2.30775 14H13.6923C13.7692 14 13.8398 13.9679 13.9038 13.9037C13.9679 13.8397 14 13.7692 14 13.6922V11.7307C14 11.5179 14.0718 11.3397 14.2155 11.1962C14.359 11.0525 14.5372 10.9807 14.75 10.9807C14.9628 10.9807 15.141 11.0525 15.2845 11.1962C15.4282 11.3397 15.5 11.5179 15.5 11.7307V13.6922C15.5 14.1974 15.325 14.625 14.975 14.975C14.625 15.325 14.1974 15.5 13.6923 15.5H2.30775ZM7.25 3.38845L5.327 5.31145C5.17817 5.46012 5.00158 5.53354 4.79725 5.5317C4.59275 5.5297 4.41292 5.45112 4.25775 5.29595C4.11292 5.14095 4.03792 4.96537 4.03275 4.7692C4.02758 4.57304 4.10258 4.39737 4.25775 4.2422L7.36725 1.1327C7.46092 1.03904 7.55967 0.973036 7.6635 0.934703C7.76733 0.896203 7.8795 0.876953 8 0.876953C8.1205 0.876953 8.23267 0.896203 8.3365 0.934703C8.44033 0.973036 8.53908 1.03904 8.63275 1.1327L11.7423 4.2422C11.8909 4.39087 11.9643 4.56495 11.9625 4.76445C11.9605 4.96379 11.8871 5.14095 11.7423 5.29595C11.5871 5.45112 11.4089 5.53129 11.2078 5.53645C11.0064 5.54162 10.8282 5.46662 10.673 5.31145L8.75 3.38845V11.0385C8.75 11.2513 8.67817 11.4295 8.5345 11.573C8.391 11.7166 8.21283 11.7885 8 11.7885C7.78717 11.7885 7.609 11.7166 7.4655 11.573C7.32183 11.4295 7.25 11.2513 7.25 11.0385V3.38845Z"
                      fill="white"
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
                  aria-label="게시글 공유"
                >
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 16 16"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-5 h-5"
                  >
                    <path
                      d="M2.30775 15.5C1.80258 15.5 1.375 15.325 1.025 14.975C0.675 14.625 0.5 14.1974 0.5 13.6922V11.7307C0.5 11.5179 0.571833 11.3397 0.7155 11.1962C0.859 11.0525 1.03717 10.9807 1.25 10.9807C1.46283 10.9807 1.641 11.0525 1.7845 11.1962C1.92817 11.3397 2 11.5179 2 11.7307V13.6922C2 13.7692 2.03208 13.8397 2.09625 13.9037C2.16025 13.9679 2.23075 14 2.30775 14H13.6923C13.7692 14 13.8398 13.9679 13.9038 13.9037C13.9679 13.8397 14 13.7692 14 13.6922V11.7307C14 11.5179 14.0718 11.3397 14.2155 11.1962C14.359 11.0525 14.5372 10.9807 14.75 10.9807C14.9628 10.9807 15.141 11.0525 15.2845 11.1962C15.4282 11.3397 15.5 11.5179 15.5 11.7307V13.6922C15.5 14.1974 15.325 14.625 14.975 14.975C14.625 15.325 14.1974 15.5 13.6923 15.5H2.30775ZM7.25 3.38845L5.327 5.31145C5.17817 5.46012 5.00158 5.53354 4.79725 5.5317C4.59275 5.5297 4.41292 5.45112 4.25775 5.29595C4.11292 5.14095 4.03792 4.96537 4.03275 4.7692C4.02758 4.57304 4.10258 4.39737 4.25775 4.2422L7.36725 1.1327C7.46092 1.03904 7.55967 0.973036 7.6635 0.934703C7.76733 0.896203 7.8795 0.876953 8 0.876953C8.1205 0.876953 8.23267 0.896203 8.3365 0.934703C8.44033 0.973036 8.53908 1.03904 8.63275 1.1327L11.7423 4.2422C11.8909 4.39087 11.9643 4.56495 11.9625 4.76445C11.9605 4.96379 11.8871 5.14095 11.7423 5.29595C11.5871 5.45112 11.4089 5.53129 11.2078 5.53645C11.0064 5.54162 10.8282 5.46662 10.673 5.31145L8.75 3.38845V11.0385C8.75 11.2513 8.67817 11.4295 8.5345 11.573C8.391 11.7166 8.21283 11.7885 8 11.7885C7.78717 11.7885 7.609 11.7166 7.4655 11.573C7.32183 11.4295 7.25 11.2513 7.25 11.0385V3.38845Z"
                      fill="white"
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
              aria-label="게시글 공유"
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 16 16"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="w-5 h-5"
              >
                <path
                  d="M2.30775 15.5C1.80258 15.5 1.375 15.325 1.025 14.975C0.675 14.625 0.5 14.1974 0.5 13.6922V11.7307C0.5 11.5179 0.571833 11.3397 0.7155 11.1962C0.859 11.0525 1.03717 10.9807 1.25 10.9807C1.46283 10.9807 1.641 11.0525 1.7845 11.1962C1.92817 11.3397 2 11.5179 2 11.7307V13.6922C2 13.7692 2.03208 13.8397 2.09625 13.9037C2.16025 13.9679 2.23075 14 2.30775 14H13.6923C13.7692 14 13.8398 13.9679 13.9038 13.9037C13.9679 13.8397 14 13.7692 14 13.6922V11.7307C14 11.5179 14.0718 11.3397 14.2155 11.1962C14.359 11.0525 14.5372 10.9807 14.75 10.9807C14.9628 10.9807 15.141 11.0525 15.2845 11.1962C15.4282 11.3397 15.5 11.5179 15.5 11.7307V13.6922C15.5 14.1974 15.325 14.625 14.975 14.975C14.625 15.325 14.1974 15.5 13.6923 15.5H2.30775ZM7.25 3.38845L5.327 5.31145C5.17817 5.46012 5.00158 5.53354 4.79725 5.5317C4.59275 5.5297 4.41292 5.45112 4.25775 5.29595C4.11292 5.14095 4.03792 4.96537 4.03275 4.7692C4.02758 4.57304 4.10258 4.39737 4.25775 4.2422L7.36725 1.1327C7.46092 1.03904 7.55967 0.973036 7.6635 0.934703C7.76733 0.896203 7.8795 0.876953 8 0.876953C8.1205 0.876953 8.23267 0.896203 8.3365 0.934703C8.44033 0.973036 8.53908 1.03904 8.63275 1.1327L11.7423 4.2422C11.8909 4.39087 11.9643 4.56495 11.9625 4.76445C11.9605 4.96379 11.8871 5.14095 11.7423 5.29595C11.5871 5.45112 11.4089 5.53129 11.2078 5.53645C11.0064 5.54162 10.8282 5.46662 10.673 5.31145L8.75 3.38845V11.0385C8.75 11.2513 8.67817 11.4295 8.5345 11.573C8.391 11.7166 8.21283 11.7885 8 11.7885C7.78717 11.7885 7.609 11.7166 7.4655 11.573C7.32183 11.4295 7.25 11.2513 7.25 11.0385V3.38845Z"
                  fill="white"
                />
              </svg>
            </button>
          )}
        </div>
      </div>
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
      aria-label={isLiked ? '좋아요 취소' : '좋아요'}
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

