import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useBackendSearchPosts } from '../api/search';
import Header from '../layouts/Header';
import PostCard from '../components/PostCard';
import FilterBar from '../components/FilterBar';
import axios from 'axios';

export default function HomePage() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  // 인증 상태 관리
  const [authChecked, setAuthChecked] = useState(false);
  const [isProcessingLogin, setIsProcessingLogin] = useState(false);

  // 검색 상태
  const [searchQuery, setSearchQuery] = useState('');
  const [searchType, setSearchType] = useState('titleAndContent');

  // 백엔드 API에 전달할 옵션들
  const [currentSort, setCurrentSort] = useState('createdAt');
  const [currentDirection, setCurrentDirection] = useState('desc');
  const [currentPeriod, setCurrentPeriod] = useState('daily');
  const [currentCategory, setCurrentCategory] = useState('all');

  // 검색 에러 상태 추가
  const [searchError, setSearchError] = useState('');

  // 지도 검색 파라미터 추출
  const mapSearchParams = {
    lat: searchParams.get('lat'),
    lng: searchParams.get('lng'),
    locationName: searchParams.get('locationName'),
    roadAddress: searchParams.get('roadAddress'),
    searchRadius: searchParams.get('searchRadius'),
  };

  const isMapSearchActive = mapSearchParams.lat && mapSearchParams.lng;

  // 백엔드 검색 API 옵션 구성
  const searchOptions = {
    searchType,
    sort: currentSort,
    direction: currentDirection,
    period: currentPeriod,
    category: currentCategory,
  };

  // 지도 검색이 활성화된 경우 위치 정보 추가
  if (isMapSearchActive) {
    searchOptions.location = {
      latitude: parseFloat(mapSearchParams.lat),
      longitude: parseFloat(mapSearchParams.lng),
      distanceInMeters: parseInt(mapSearchParams.searchRadius) || 1000,
      roadAddress: mapSearchParams.roadAddress,
    };
  }

  // 백엔드 검색 API 사용 - 로그인 처리 중에는 비활성화
  const {
    data: postsData,
    isLoading: isPostsLoading,
    error: postsError,
    refetch: refetchPosts,
  } = useBackendSearchPosts(searchQuery, {
    ...searchOptions,
    enabled: !isProcessingLogin,
  });

  // 표시할 게시글 목록
  const displayPosts = postsData?.boardPeeks?.content || [];

  // 토큰 유효성 검사 함수
  const validateToken = (token) => {
    if (!token) return false;

    try {
      const parts = token.split('.');
      if (parts.length !== 3) {
        console.error('잘못된 JWT 토큰 형식');
        return false;
      }

      const payload = JSON.parse(atob(parts[1]));
      const currentTime = Math.floor(Date.now() / 1000);

      console.log('토큰 검증:', {
        exp: payload.exp,
        currentTime,
        isValid: payload.exp > currentTime,
        timeLeft: payload.exp - currentTime,
      });

      if (payload.exp && payload.exp < currentTime) {
        console.log('토큰 만료됨');
        return false;
      }

      return true;
    } catch (error) {
      console.error('토큰 파싱 에러:', error);
      return false;
    }
  };

  // 인증 상태 확인 함수
  const checkAuthStatus = () => {
    const token = localStorage.getItem('token');
    console.log('저장된 토큰:', token ? '존재함' : '없음');

    if (!token) {
      setAuthChecked(true);
      return;
    }

    if (!validateToken(token)) {
      console.log('유효하지 않은 토큰, 정리 중...');
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      setAuthChecked(true);
      return;
    }

    console.log('유효한 토큰 확인됨');
    setAuthChecked(true);
  };

  // 카카오 로그인 토큰 처리 함수 - 401/404 에러 모두 처리
  const handleKakaoLogin = async () => {
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get('accessToken');

    if (!token) {
      console.log('URL에 토큰 없음');
      return;
    }

    console.log('카카오 로그인 토큰 처리 시작');
    setIsProcessingLogin(true);

    try {
      // 1. 먼저 토큰 유효성 확인
      if (!validateToken(token)) {
        throw new Error('받은 토큰이 유효하지 않습니다.');
      }

      // 2. 토큰 저장
      localStorage.setItem('token', token);
      console.log('새 토큰 저장 완료');

      // 3. URL에서 토큰 파라미터 제거
      const newSearchParams = new URLSearchParams(searchParams);
      newSearchParams.delete('accessToken');

      const newUrl = newSearchParams.toString()
        ? `${window.location.pathname}?${newSearchParams.toString()}`
        : window.location.pathname;

      window.history.replaceState({}, '', newUrl);
      setSearchParams(newSearchParams);

      // 4. axios 인터셉터를 우회하여 직접 요청 생성
      console.log('사용자 정보 조회 시작 (인터셉터 우회)...');

      const userResponse = await axios
        .create({
          baseURL: 'https://eridanus.econo.mooo.com',
          timeout: 15000,
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        })
        .get('/my');

      console.log('사용자 정보 조회 성공:', userResponse.data);

      // 5. 사용자 정보 저장
      localStorage.setItem('user', JSON.stringify(userResponse.data));

      // 6. 닉네임 확인 및 리다이렉트
      if (
        !userResponse.data.nickname ||
        userResponse.data.nickname.trim() === ''
      ) {
        console.log('닉네임 없음, 회원가입 완료 페이지로 이동');
        navigate('/complete-registration', { replace: true });
        return;
      }

      // 7. 성공적으로 완료된 경우 리다이렉트
      const returnUrl = sessionStorage.getItem('returnUrl');
      if (returnUrl && returnUrl !== '/login' && returnUrl !== '/login-alert') {
        console.log('저장된 returnUrl로 이동:', returnUrl);
        sessionStorage.removeItem('returnUrl');
        navigate(returnUrl, { replace: true });
      } else {
        console.log('홈으로 이동');
        // 현재 홈 페이지에 있으므로 페이지 새로고침으로 상태 업데이트
        window.location.reload();
      }
    } catch (error) {
      console.error('카카오 로그인 처리 실패:', error);
      console.error('에러 상세:', {
        status: error.response?.status,
        statusText: error.response?.statusText,
        data: error.response?.data,
        message: error.message,
        name: error.name,
      });

      // 토큰 정리
      localStorage.removeItem('token');
      localStorage.removeItem('user');

      // 에러 타입별 처리 - 401과 404 모두 회원가입 필요로 처리
      if (error.response?.status === 401 || error.response?.status === 404) {
        console.log('사용자 정보 없음 또는 인증 실패 - 회원가입 필요');
        // 토큰을 다시 저장하고 회원가입 페이지로
        localStorage.setItem('token', token);
        navigate('/complete-registration', { replace: true });
      } else if (error.response?.status === 500) {
        console.log('서버 내부 오류');
        alert(
          '서버에 일시적인 문제가 발생했습니다. 잠시 후 다시 시도해주세요.'
        );
        navigate('/home', { replace: true });
      } else if (
        error.code === 'ECONNABORTED' ||
        error.message.includes('timeout')
      ) {
        console.log('요청 타임아웃');
        alert('서버 응답이 지연되고 있습니다. 잠시 후 다시 시도해주세요.');
        navigate('/home', { replace: true });
      } else if (error.code === 'ERR_NETWORK') {
        console.log('네트워크 오류');
        alert('네트워크 연결을 확인해주세요.');
        navigate('/home', { replace: true });
      } else {
        console.log('알 수 없는 오류');
        alert('로그인 처리 중 오류가 발생했습니다. 페이지를 새로고침해주세요.');
        navigate('/home', { replace: true });
      }
    } finally {
      setIsProcessingLogin(false);
    }
  };

  // 초기 인증 상태 확인
  useEffect(() => {
    checkAuthStatus();

    // storage 이벤트 리스너
    const handleStorageChange = () => {
      console.log('storage 변경 감지');
      checkAuthStatus();
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  // 카카오 로그인 처리
  useEffect(() => {
    if (authChecked && !isProcessingLogin) {
      handleKakaoLogin();
    }
  }, [authChecked, navigate]);

  // 검색 처리
  const handleSearch = (query) => {
    setSearchError('');
    setSearchQuery(query);
  };

  // 검색 타입 변경
  const handleSearchTypeChange = (type) => {
    setSearchError('');
    setSearchType(type);
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

  // 검색 에러 처리
  useEffect(() => {
    if (postsError) {
      if (postsError.isAuthError && postsError.shouldRetryWithoutAuth) {
        console.log('인증 에러로 인한 재시도');
        setTimeout(() => {
          refetchPosts();
        }, 1000);
        return;
      }

      if (postsError.isNetworkError) {
        setSearchError('네트워크 연결을 확인해주세요.');
        return;
      }

      if (
        postsError.message &&
        (postsError.message.includes('자 이상') ||
          postsError.message.includes('자 이하'))
      ) {
        setSearchError(postsError.message);
      } else {
        setSearchError('');
      }
    } else {
      setSearchError('');
    }
  }, [postsError, refetchPosts]);

  // 로딩 상태
  if (!authChecked || isProcessingLogin) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="flex flex-col items-center">
          <div className="w-8 h-8 border-2 border-yellow-500 border-t-transparent rounded-full animate-spin mb-4"></div>
          <p className="text-gray-400 text-center">
            {isProcessingLogin ? '로그인 처리 중...' : '로딩 중...'}
          </p>
          {isProcessingLogin && (
            <p className="text-gray-500 text-sm mt-2 text-center">
              서버와 통신 중입니다. 잠시만 기다려주세요.
            </p>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black">
      {/* 헤더 컴포넌트 */}
      <Header
        onSearch={handleSearch}
        onSearchTypeChange={handleSearchTypeChange}
        isSearchLoading={isPostsLoading}
        searchQuery={searchQuery}
        searchType={searchType}
      />

      {/* 메인 컨텐츠 영역 */}
      <div className="px-2 pt-2">
        {/* FilterBar */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <span className="text-yellow-500 text-lg">⭐</span>
            <span className="text-white text-lg font-medium">게시글</span>
          </div>
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

        {/* 검색 에러 표시 */}
        {searchError && (
          <div className="mb-4 bg-red-500/10 border border-red-500/20 rounded-lg p-3">
            <div className="flex items-center space-x-2">
              <svg
                className="w-5 h-5 text-red-400 flex-shrink-0"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <span className="text-red-400 text-sm">{searchError}</span>
            </div>
          </div>
        )}

        {/* 로딩 상태 */}
        {isPostsLoading && (
          <div className="flex justify-center items-center py-8">
            <div className="w-8 h-8 border-2 border-yellow-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
        )}

        {/* 에러 상태 */}
        {postsError &&
          !isPostsLoading &&
          !searchError &&
          !postsError.isAuthError && (
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
              <p className="text-red-400 text-lg">
                데이터를 불러올 수 없습니다
              </p>
              <p className="text-gray-500 text-sm mt-2">
                {postsError?.isNetworkError
                  ? '네트워크 연결을 확인해주세요'
                  : '잠시 후 다시 시도해주세요'}
              </p>
              <button
                onClick={() => refetchPosts()}
                className="mt-4 bg-yellow-500 text-black px-4 py-2 rounded-lg font-medium hover:bg-yellow-400 transition-colors"
                type="button"
              >
                다시 시도
              </button>
            </div>
          )}

        {/* 게시글 목록 */}
        {!postsError && !isPostsLoading && !searchError && (
          <div className="space-y-6 mb-20">
            {displayPosts.map((post) => (
              <PostCard key={post.id} post={post} />
            ))}
          </div>
        )}

        {/* 게시글이 없을 때 */}
        {!postsError &&
          !isPostsLoading &&
          !searchError &&
          displayPosts.length === 0 && (
            <div className="text-center py-12">
              {isMapSearchActive ? (
                <div>
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
                        d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1}
                        d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                    </svg>
                  </div>
                  <p className="text-gray-400 text-lg">
                    {searchQuery
                      ? `"${searchQuery}"에 대한 검색 결과가 이 지역에 없습니다`
                      : `${mapSearchParams.locationName} 근처에 게시글이 없습니다`}
                  </p>
                  <p className="text-gray-500 text-sm mt-2">
                    {searchQuery
                      ? '다른 키워드로 검색하거나 검색 반경을 늘려보세요'
                      : '검색 반경을 늘리거나 다른 지역을 선택해보세요'}
                  </p>
                  <button
                    onClick={() => navigate('/map-search')}
                    className="mt-4 bg-yellow-500 text-black px-4 py-2 rounded-lg font-medium hover:bg-yellow-400 transition-colors"
                    type="button"
                  >
                    다른 지역 선택하기
                  </button>
                </div>
              ) : (
                <div>
                  <p className="text-gray-400 text-lg">
                    {searchQuery
                      ? `"${searchQuery}"에 대한 검색 결과가 없습니다`
                      : '게시글이 없습니다'}
                  </p>
                  <p className="text-gray-500 text-sm mt-2">
                    {searchQuery
                      ? '다른 키워드로 검색해보세요'
                      : '첫 번째 게시글을 작성해보세요!'}
                  </p>
                </div>
              )}
            </div>
          )}
      </div>
    </div>
  );
}
