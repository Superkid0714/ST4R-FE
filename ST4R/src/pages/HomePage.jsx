import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGetPosts } from '../api/search';
import Header from '../layouts/Header';
import PostCard from '../components/PostCard';
import FilterBar from '../components/FilterBar'; // FilterBar 컴포넌트 import

export default function HomePage() {
  const navigate = useNavigate();
  const [searchResults, setSearchResults] = useState([]);
  const [isSearchMode, setIsSearchMode] = useState(false);

  // 새로운 백엔드 스펙에 맞춰 분리
  const [currentSort, setCurrentSort] = useState('createdAt');
  const [currentDirection, setCurrentDirection] = useState('desc');
  const [currentPeriod, setCurrentPeriod] = useState('daily');
  const [currentCategory, setCurrentCategory] = useState('all');

  // 기본 게시글 목록 조회 (새 API 스펙)
  const {
    data: postsData,
    isLoading: isPostsLoading,
    error: postsError,
  } = useGetPosts({
    sort: currentSort,
    direction: currentDirection,
    period: currentPeriod,
  });

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get('accessToken');
    console.log(token);

    if (token) {
      localStorage.setItem('token', token);
      console.log('토큰 저장 완료:', token);
      navigate('/home', { replace: true });
    }
  }, [navigate]);

  // 검색 결과 처리
  const handleSearchResults = (results) => {
    setSearchResults(results);
    setIsSearchMode(results.length > 0);
  };

  // 기간 변경
  const handlePeriodChange = (periodValue) => {
    setCurrentPeriod(periodValue);
  };

  // 정렬/카테고리 변경 (통합)
  const handleSortFilterChange = (option) => {
    if (option.type === 'sort') {
      setCurrentSort(option.sort);
      setCurrentDirection(option.direction);
      setCurrentCategory('all');
    } else if (option.type === 'category') {
      setCurrentCategory(option.value);
    }
  };

  // 표시할 게시글 목록 결정 (카테고리 필터링 포함)
  const allPosts = isSearchMode
    ? searchResults
    : postsData?.boardPeeks?.content || [];

  // 디버깅용 로그
  console.log('전체 게시글:', allPosts);
  console.log('현재 카테고리 필터:', currentCategory);
  console.log(
    '게시글별 카테고리:',
    allPosts.map((post) => ({
      id: post.id,
      title: post.title,
      category: post.category,
    }))
  );

  const displayPosts =
    currentCategory === 'all'
      ? allPosts
      : allPosts.filter((post) => {
          console.log(
            `게시글 ${post.id}: ${post.category} === ${currentCategory}?`,
            post.category === currentCategory
          );
          return post.category === currentCategory;
        });

  return (
    <div className="min-h-screen bg-black">
      {/* 헤더 컴포넌트 - 전체 게시글 데이터 전달 */}
      <Header
        onSearchResults={handleSearchResults}
        allPosts={postsData?.boardPeeks?.content || []}
      />

      {/* 메인 컨텐츠 영역 */}
      <div className="px-4 pt-2">
        {/* 현재 인기글 헤더 */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center">
            <h2 className="text-white text-lg font-bold mr-2">현재 인기글</h2>
            <span className="text-yellow-500 text-sm">😊</span>
          </div>

          {/* FilterBar 컴포넌트 사용 */}
          <FilterBar
            currentPeriod={currentPeriod}
            currentSort={currentSort}
            currentDirection={currentDirection}
            currentCategory={currentCategory}
            onPeriodChange={handlePeriodChange}
            onSortFilterChange={handleSortFilterChange}
          />
        </div>

        {/* 로딩 상태 */}
        {isPostsLoading && !isSearchMode && (
          <div className="flex justify-center items-center py-8">
            <div className="w-8 h-8 border-2 border-yellow-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
        )}

        {/* 에러 상태 */}
        {postsError && !isSearchMode && (
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

        {/* 게시글 목록 - PostCard 컴포넌트 사용 */}
        <div className="space-y-6 mb-20">
          {displayPosts.map((post) => (
            <PostCard key={post.id} post={post} />
          ))}
        </div>

        {/* 게시글이 없을 때 */}
        {displayPosts.length === 0 && !isPostsLoading && (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
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
                  d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
                />
              </svg>
            </div>
            <p className="text-gray-400 text-lg">
              {isSearchMode ? '검색 결과가 없습니다' : '아직 게시글이 없습니다'}
            </p>
            <p className="text-gray-500 text-sm mt-2">
              {isSearchMode
                ? '다른 키워드로 검색해보세요'
                : '첫 번째 게시글을 작성해보세요!'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
