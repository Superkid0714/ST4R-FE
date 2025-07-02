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

  // 게시글 목록 조회 (크기 증가해서 시도)
  const {
    data: postsData,
    isLoading: isPostsLoading,
    error: postsError,
  } = useGetPosts({
    sort: currentSort,
    direction: currentDirection,
    period: currentPeriod,
    category: currentCategory,
    size: 20, // 크기를 20으로 증가
    page: 0, // 페이지를 0부터 시작으로 변경
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

  console.log('=== 디버깅 정보 ===');
  console.log('현재 필터 옵션:', {
    sort: currentSort,
    direction: currentDirection,
    period: currentPeriod,
    category: currentCategory,
  });
  console.log('검색 모드:', isSearchMode);
  console.log('postsData:', postsData);
  console.log('postsData.boardPeeks:', postsData?.boardPeeks);
  console.log('postsData.boardPeeks.content:', postsData?.boardPeeks?.content);
  console.log('displayPosts 배열:', displayPosts);
  console.log('displayPosts 길이:', displayPosts.length);
  console.log(
    '각 게시글 ID:',
    displayPosts.map((post) => post.id)
  );
  console.log('==================');

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

        {/* 게시글 목록 - 디버깅용 */}
        {!postsError && !isPostsLoading && (
          <div className="space-y-6 mb-20">
            {displayPosts.length > 0 ? (
              displayPosts.map((post, index) => {
                console.log(
                  `렌더링 중: ${index + 1}번째 게시글, ID: ${post.id}, 제목: ${post.title}`
                );
                return (
                  <div key={post.id} className="bg-gray-800 p-4 rounded-lg">
                    <h3 className="text-white font-bold">
                      {index + 1}. {post.title || '제목 없음'}
                    </h3>
                    <p className="text-gray-400 text-sm">ID: {post.id}</p>
                    <p className="text-gray-300 mt-2">
                      {post.contentPreview || '내용 미리보기 없음'}
                    </p>
                  </div>
                );
              })
            ) : (
              <div className="text-center py-8 text-gray-400">
                게시글이 없습니다 (displayPosts.length = {displayPosts.length})
              </div>
            )}
          </div>
        )}

        {/* 게시글이 없을 때 */}
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

        {/* 총 게시글 수 표시 */}
        {!isPostsLoading && !isSearchMode && postsData?.boardPeeks && (
          <div className="text-center py-4 text-gray-500 text-sm">
            총 {postsData.boardPeeks.totalElements || 0}개 중{' '}
            {displayPosts.length}개 표시
            {postsData.boardPeeks.totalElements > displayPosts.length && (
              <span> (더 많은 게시글이 있습니다)</span>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
