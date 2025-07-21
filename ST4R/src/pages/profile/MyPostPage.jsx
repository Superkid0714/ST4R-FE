import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMyPosts } from '../../api/myPosts';
import BackButton from '../../components/common/BackButton';

export default function MyPostsPage() {
  const navigate = useNavigate();

  // 필터 상태
  const [currentSort, setCurrentSort] = useState('createdAt');
  const [currentDirection, setCurrentDirection] = useState('desc');
  const [showSortMenu, setShowSortMenu] = useState(false);

  // API 호출
  const {
    data: postsData,
    isLoading,
    error,
    refetch,
  } = useMyPosts({
    sort: currentSort,
    direction: currentDirection,
    size: 20,
  });

  const posts = postsData?.content || [];

  // 정렬 옵션
  const sortOptions = [
    { sort: 'createdAt', direction: 'desc', label: '최신순' },
    { sort: 'createdAt', direction: 'asc', label: '오래된순' },
  ];

  // 정렬 변경 핸들러
  const handleSortChange = (option) => {
    setCurrentSort(option.sort);
    setCurrentDirection(option.direction);
    setShowSortMenu(false);
  };

  // 현재 정렬 라벨 가져오기
  const getCurrentSortLabel = () => {
    return (
      sortOptions.find(
        (option) =>
          option.sort === currentSort && option.direction === currentDirection
      )?.label || '최신순'
    );
  };

  // 개별 게시글 카드 컴포넌트
  const PostCard = ({ post }) => {
    const handleCardClick = () => {
      navigate(`/boards/${post.id}`);
    };

    return (
      <div
        className="bg-[#1A1A1A] rounded-lg p-4 cursor-pointer hover:bg-[#242424] transition-colors"
        onClick={handleCardClick}
      >
        {/* 카테고리 배지 */}
        {post.category && (
          <div className="mb-2">
            <span
              className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${
                post.category === 'SPOT'
                  ? 'bg-green-500/20 text-green-400'
                  : post.category === 'PROMOTION'
                    ? 'bg-purple-500/20 text-purple-400'
                    : 'bg-gray-500/20 text-gray-400'
              }`}
            >
              {post.category === 'SPOT'
                ? '스팟공유글'
                : post.category === 'PROMOTION'
                  ? '홍보글'
                  : '자유글'}
            </span>
          </div>
        )}

        <div className="flex gap-3">
          {/* 왼쪽: 텍스트 콘텐츠 */}
          <div className="flex-1">
            {/* 게시글 제목 */}
            <h3 className="text-white font-medium text-base mb-2 leading-relaxed line-clamp-2">
              {post.title}
            </h3>

            {/* 게시글 설명 */}
            <p className="text-gray-400 text-sm mb-3 leading-relaxed line-clamp-2">
              {post.contentPreview}
            </p>

            {/* 하단 정보 바 */}
            <div className="flex items-center justify-between text-gray-400 text-sm">
              <div className="flex items-center space-x-4">
                {/* 날짜 */}
                <span className="text-gray-500">
                  {new Date(post.createdAt)
                    .toLocaleDateString('ko-KR', {
                      year: 'numeric',
                      month: '2-digit',
                      day: '2-digit',
                    })
                    .replace(/\./g, '.')
                    .replace(/ /g, '')}
                </span>

                {/* 좋아요 */}
                <div className="flex items-center space-x-1">
                  <svg
                    className="w-4 h-4"
                    fill="none"
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
                  <span>{post.likeCount}</span>
                </div>

                {/* 댓글 */}
                <div className="flex items-center space-x-1">
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                    />
                  </svg>
                  <span>{post.commentCount}</span>
                </div>

                {/* 조회수 */}
                <div className="flex items-center space-x-1">
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                    />
                  </svg>
                  <span>{post.viewCount}</span>
                </div>
              </div>
            </div>
          </div>

          {/* 오른쪽: 이미지 (있는 경우) */}
          {post.thumbnailImageUrl && (
            <div className="flex-shrink-0">
              <img
                src={post.thumbnailImageUrl}
                alt={post.title}
                className="w-20 h-20 object-cover rounded-lg"
              />
            </div>
          )}
        </div>
      </div>
    );
  };

  // 로딩 상태
  if (isLoading) {
    return (
      <div className="min-h-screen bg-black text-white">
        <div className="px-4 py-6">
          {/* 헤더 */}
          <div className="flex items-center gap-3 mb-6">
            <BackButton />
            <h1 className="text-xl font-medium">내가 쓴 글</h1>
          </div>

          {/* 로딩 스피너 */}
          <div className="flex justify-center items-center py-12">
            <div className="w-8 h-8 border-2 border-yellow-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
        </div>
      </div>
    );
  }

  // 에러 상태 (로그인 필요)
  if (error?.message === '로그인이 필요합니다.') {
    return (
      <div className="min-h-screen bg-black text-white">
        <div className="px-4 py-6">
          {/* 헤더 */}
          <div className="flex items-center gap-3 mb-6">
            <BackButton />
            <h1 className="text-xl font-medium">내가 쓴 글</h1>
          </div>

          {/* 로그인 필요 메시지 */}
          <div className="flex flex-col items-center justify-center py-12">
            <div className="text-center">
              <svg
                className="w-16 h-16 mx-auto mb-4 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1}
                  d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                />
              </svg>
              <h2 className="text-xl font-bold text-white mb-2">
                로그인이 필요합니다
              </h2>
              <p className="text-gray-400 mb-6">
                내가 쓴 글을 보려면 로그인해주세요.
              </p>
              <button
                onClick={() => navigate('/login')}
                className="bg-yellow-500 text-black px-6 py-3 rounded-lg font-medium hover:bg-yellow-400 transition-colors"
              >
                로그인하러 가기
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // 기타 에러 상태
  if (error) {
    return (
      <div className="min-h-screen bg-black text-white">
        <div className="px-4 py-6">
          {/* 헤더 */}
          <div className="flex items-center gap-3 mb-6">
            <BackButton />
            <h1 className="text-xl font-medium">내가 쓴 글</h1>
          </div>

          {/* 에러 메시지 */}
          <div className="flex flex-col items-center justify-center py-12">
            <div className="text-center">
              <svg
                className="w-16 h-16 mx-auto mb-4 text-red-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1}
                  d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <h2 className="text-xl font-bold text-white mb-2">
                오류가 발생했습니다
              </h2>
              <p className="text-gray-400 mb-6">
                데이터를 불러올 수 없습니다. 잠시 후 다시 시도해주세요.
              </p>
              <button
                onClick={() => refetch()}
                className="bg-yellow-500 text-black px-6 py-3 rounded-lg font-medium hover:bg-yellow-400 transition-colors"
              >
                다시 시도
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="px-4 py-6">
        {/* 헤더 */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <BackButton />
            <h1 className="text-xl font-medium">내가 쓴 글</h1>
          </div>

          {/* 정렬 옵션 */}
          <div className="relative">
            <button
              onClick={() => setShowSortMenu(!showSortMenu)}
              className="flex items-center px-3 py-2 bg-[#1A1A1A] border border-gray-600 rounded-full text-gray-300 text-sm hover:bg-[#2A2A2A] transition-colors"
            >
              <span>{getCurrentSortLabel()}</span>
              <svg
                className={`w-4 h-4 ml-2 transition-transform ${
                  showSortMenu ? 'rotate-180' : ''
                }`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </button>

            {showSortMenu && (
              <div className="absolute top-12 right-0 bg-[#1A1A1A] border border-gray-700 rounded-lg py-2 w-32 z-50 shadow-lg">
                {sortOptions.map((option, index) => (
                  <div
                    key={index}
                    onClick={() => handleSortChange(option)}
                    className={`w-full text-left px-4 py-2 text-sm hover:bg-[#2A2A2A] transition-colors cursor-pointer ${
                      currentSort === option.sort &&
                      currentDirection === option.direction
                        ? 'text-yellow-500 bg-[#2A2A2A]'
                        : 'text-gray-300'
                    }`}
                  >
                    {option.label}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* 게시글 목록 */}
        {posts.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12">
            <div className="text-center">
              <svg
                className="w-16 h-16 mx-auto mb-4 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1}
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
              <h2 className="text-xl font-bold text-white mb-2">
                작성한 글이 없습니다
              </h2>
              <p className="text-gray-400 mb-6">첫 번째 글을 작성해보세요!</p>
              <button
                onClick={() => navigate('/writechoice')}
                className="bg-yellow-500 text-black px-6 py-3 rounded-lg font-medium hover:bg-yellow-400 transition-colors"
              >
                글 작성하기
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {posts.map((post) => (
              <PostCard key={post.id} post={post} />
            ))}
          </div>
        )}

        {/* 하단 여백 (네비게이션 바 공간) */}
        <div className="h-20"></div>
      </div>
    </div>
  );
}

