import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGetPosts } from '../api/search';
import Header from '../layouts/Header';
import PostCard from '../components/PostCard';
import FilterBar from '../components/FilterBar';

export default function HomePage() {
  const navigate = useNavigate();
  const [searchResults, setSearchResults] = useState([]);
  const [isSearchMode, setIsSearchMode] = useState(false);

  // 백엔드 API에 전달할 옵션들
  const [currentSort, setCurrentSort] = useState('createdAt');
  const [currentDirection, setCurrentDirection] = useState('desc');
  const [currentPeriod, setCurrentPeriod] = useState('daily');
  const [currentCategory, setCurrentCategory] = useState('all');

  // 백엔드에서 필터링된 게시글 목록 조회
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

  // 표시할 게시글 목록 결정
  const displayPosts = isSearchMode
    ? searchResults
    : postsData?.boardPeeks?.content || [];

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

  return (
    <div className="min-h-screen bg-black">
      {/* 헤더 컴포넌트 */}
      <Header
        onSearchResults={handleSearchResults}
        allPosts={postsData?.boardPeeks?.content || []}
      />

      {/* 메인 컨텐츠 영역 */}
      <div className="px-2 pt-2">
        {/* FilterBar */}
        {!isSearchMode && (
          <div className="flex items-center justify-between mb-4">
            <span className="text-yellow-500 text-lg">⭐</span>
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
        )}

        {/* 로딩 상태 */}
        {isPostsLoading && !isSearchMode && (
          <div className="flex justify-center items-center py-8">
            <div className="w-8 h-8 border-2 border-yellow-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
        )}

        {/* 에러 상태 */}
        {postsError && !isSearchMode && !isPostsLoading && (
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
              {postsError?.response?.status === 401
                ? '로그인이 필요합니다'
                : '잠시 후 다시 시도해주세요'}
            </p>
          </div>
        )}

        {/* 게시글 목록 */}
        {!postsError && !isPostsLoading && (
          <div className="space-y-6 mb-20">
            {displayPosts.map((post) => (
              <PostCard key={post.id} post={post} />
            ))}
          </div>
        )}

        {/* 게시글이 없을 때 (로딩도 아니고 에러도 아닌 경우에만) */}
        {!postsError && !isPostsLoading && displayPosts.length === 0 && (
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
