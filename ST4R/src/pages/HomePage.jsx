import { useEffect, useState, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGetPosts, useInfiniteGetPosts } from '../api/search';
import Header from '../layouts/Header';
import PostCard from '../components/PostCard';
import FilterBar from '../components/FilterBar';

export default function HomePage() {
  const navigate = useNavigate();
  const [searchResults, setSearchResults] = useState([]);
  const [isSearchMode, setIsSearchMode] = useState(false);
  const [useInfiniteScroll, setUseInfiniteScroll] = useState(false); // 무한 스크롤 토글
  const observerRef = useRef();

  // 백엔드 API에 전달할 옵션들
  const [currentSort, setCurrentSort] = useState('createdAt');
  const [currentDirection, setCurrentDirection] = useState('desc');
  const [currentPeriod, setCurrentPeriod] = useState('daily');
  const [currentCategory, setCurrentCategory] = useState('all');

  // 기존 방식 (한 번에 모든 게시글 로드)
  const {
    data: postsData,
    isLoading: isPostsLoading,
    error: postsError,
  } = useGetPosts({
    sort: currentSort,
    direction: currentDirection,
    period: currentPeriod,
    category: currentCategory,
  });

  // 무한 스크롤용 게시글 목록 조회
  const {
    data: infiniteData,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading: isInfiniteLoading,
    error: infiniteError,
  } = useInfiniteGetPosts({
    sort: currentSort,
    direction: currentDirection,
    period: currentPeriod,
    category: currentCategory,
    size: 10, // 한 페이지당 10개
  });

  // 표시할 게시글 목록 결정
  let displayPosts = [];
  let isLoading = false;
  let error = null;

  if (isSearchMode) {
    displayPosts = searchResults;
  } else if (useInfiniteScroll) {
    // 무한 스크롤 모드
    displayPosts =
      infiniteData?.pages?.flatMap((page) => page.boardPeeks?.content || []) ||
      [];
    isLoading = isInfiniteLoading;
    error = infiniteError;
  } else {
    // 기존 모드 (한 번에 모든 게시글)
    displayPosts = postsData?.boardPeeks?.content || [];
    isLoading = isPostsLoading;
    error = postsError;
  }

  // 무한 스크롤 감지를 위한 Intersection Observer
  const lastPostElementRef = useCallback(
    (node) => {
      if (!useInfiniteScroll || isInfiniteLoading) return;
      if (observerRef.current) observerRef.current.disconnect();

      observerRef.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasNextPage && !isFetchingNextPage) {
          console.log('마지막 게시글이 보임, 다음 페이지 로드');
          fetchNextPage();
        }
      });

      if (node) observerRef.current.observe(node);
    },
    [
      useInfiniteScroll,
      isInfiniteLoading,
      fetchNextPage,
      hasNextPage,
      isFetchingNextPage,
    ]
  );

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get('accessToken');

    if (token) {
      localStorage.setItem('token', token);
      console.log('토큰 저장 완료:', token);
      navigate('/home', { replace: true });
    }
  }, [navigate]);

  // 검색 결과 처리
  const handleSearchResults = (results, searchQuery = '') => {
    setSearchResults(results);
    setIsSearchMode(searchQuery.trim().length > 0);
  };

  // 기간 변경
  const handlePeriodChange = (periodValue) => {
    setCurrentPeriod(periodValue);
  };

  // 정렬/카테고리 변경
  const handleSortFilterChange = (option) => {
    if (option.type === 'sort') {
      setCurrentSort(option.sort);
      setCurrentDirection(option.direction);
    } else if (option.type === 'category') {
      setCurrentCategory(option.value);
    }
  };

  console.log('현재 필터 옵션:', {
    sort: currentSort,
    direction: currentDirection,
    period: currentPeriod,
    category: currentCategory,
  });
  console.log('표시할 게시글 개수:', displayPosts.length);
  console.log('검색 모드:', isSearchMode);
  console.log('무한 스크롤 모드:', useInfiniteScroll);

  return (
    <div className="min-h-screen bg-black">
      {/* 헤더 컴포넌트 */}
      <Header onSearchResults={handleSearchResults} allPosts={displayPosts} />

      {/* 메인 컨텐츠 영역 */}
      <div className="px-2 pt-2">
        {/* FilterBar와 무한 스크롤 토글 */}
        {!isSearchMode && (
          <div className="flex items-center justify-between mb-4">
            <span className="text-yellow-500 text-lg">⭐</span>
            <div className="flex items-center space-x-3">
              {/* 무한 스크롤 토글 버튼 */}
              <button
                onClick={() => setUseInfiniteScroll(!useInfiniteScroll)}
                className={`px-3 py-1 rounded-full text-xs transition-colors ${
                  useInfiniteScroll
                    ? 'bg-yellow-500 text-black'
                    : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                }`}
              >
                {useInfiniteScroll ? '무한 스크롤 ON' : '무한 스크롤 OFF'}
              </button>

              <div className="flex-shrink-0">
                <FilterBar
                  currentPeriod={currentPeriod}
                  currentSort={currentSort}
                  currentDirection={currentDirection}
                  currentCategory={currentCategory}
                  onPeriodChange={handlePeriodChange}
                  onSortFilterChange={handleSortFilterChange}
                />
              </div>
            </div>
          </div>
        )}

        {/* 로딩 상태 */}
        {isLoading && !isSearchMode && (
          <div className="flex justify-center items-center py-8">
            <div className="w-8 h-8 border-2 border-yellow-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
        )}

        {/* 에러 상태 */}
        {error && !isSearchMode && !isLoading && (
          <div className="text-center py-8">
            <div className="text-red-400 mb-4">
              <svg
                className="w-16 h-16 mx-auto mb-4"
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
            </div>
            <p className="text-red-400 text-lg">데이터를 불러올 수 없습니다</p>
            <p className="text-gray-500 text-sm mt-2">
              {error?.response?.status === 401
                ? '로그인이 필요합니다'
                : '잠시 후 다시 시도해주세요'}
            </p>
          </div>
        )}

        {/* 게시글 목록 */}
        {!error && !isLoading && (
          <div className="space-y-6 mb-20">
            {displayPosts.map((post, index) => {
              // 무한 스크롤 모드에서 마지막 게시글에 ref 추가
              if (
                index === displayPosts.length - 1 &&
                useInfiniteScroll &&
                !isSearchMode
              ) {
                return (
                  <div key={post.id} ref={lastPostElementRef}>
                    <PostCard post={post} />
                  </div>
                );
              }
              return <PostCard key={post.id} post={post} />;
            })}

            {/* 무한 스크롤: 다음 페이지 로딩 표시 */}
            {useInfiniteScroll && isFetchingNextPage && !isSearchMode && (
              <div className="flex justify-center items-center py-4">
                <div className="w-6 h-6 border-2 border-yellow-500 border-t-transparent rounded-full animate-spin mr-2"></div>
                <span className="text-gray-400 text-sm">
                  더 많은 게시글을 불러오는 중...
                </span>
              </div>
            )}

            {/* 무한 스크롤: 더 이상 게시글이 없을 때 */}
            {useInfiniteScroll &&
              !hasNextPage &&
              !isSearchMode &&
              displayPosts.length > 0 && (
                <div className="text-center py-8">
                  <p className="text-gray-500 text-sm">
                    모든 게시글을 확인했습니다
                  </p>
                </div>
              )}
          </div>
        )}

        {/* 게시글이 없을 때 */}
        {!error && !isLoading && displayPosts.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-400 text-lg">해당하는 내용이 없습니다</p>
            <p className="text-gray-500 text-sm mt-2">
              {isSearchMode
                ? '다른 키워드로 검색해보세요'
                : '다른 조건으로 검색해보세요'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
