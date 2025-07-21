import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import BackButton from '../../components/common/BackButton';
import mainimage from '../../assets/mainimage.png';

const BASE_URL = 'http://eridanus.econo.mooo.com:8080';

// 토큰 검증 및 정리 함수
const validateAndCleanToken = () => {
  const token = localStorage.getItem('token');
  if (!token) return null;

  try {
    // JWT 토큰 기본 검증 (만료시간 체크)
    const payload = JSON.parse(atob(token.split('.')[1]));
    const currentTime = Math.floor(Date.now() / 1000);

    if (payload.exp && payload.exp < currentTime) {
      // 토큰이 만료된 경우
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      return null;
    }

    return token;
  } catch (error) {
    // 토큰 형식이 잘못된 경우
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    return null;
  }
};

// Axios 인스턴스 생성
const createApiInstance = () => {
  const instance = axios.create({
    baseURL: BASE_URL,
  });

  // Request 인터셉터: 유효한 토큰만 헤더에 추가
  instance.interceptors.request.use(
    (config) => {
      const token = validateAndCleanToken();
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    },
    (error) => Promise.reject(error)
  );

  // Response 인터셉터: 401 에러 처리
  instance.interceptors.response.use(
    (response) => response,
    (error) => {
      if (error.response?.status === 401) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');

        const customError = new Error('Unauthorized');
        customError.isAuthError = true;
        customError.originalError = error;
        return Promise.reject(customError);
      }
      return Promise.reject(error);
    }
  );

  return instance;
};

const apiInstance = createApiInstance();

// 찜한 모임 목록 조회
export const useMyLikedGroups = (options = {}) => {
  return useQuery({
    queryKey: ['myLikedGroups', options],
    queryFn: async () => {
      const token = validateAndCleanToken();
      if (!token) {
        throw new Error('로그인이 필요합니다.');
      }

      console.log('찜한 모임 목록 조회 요청:', options);

      const params = new URLSearchParams();

      // 정렬 옵션
      const sort = options.sort || 'createdAt';
      const direction = options.direction || 'desc';
      params.append('sort', sort);
      params.append('direction', direction);

      // 페이징 옵션
      if (options.size && options.size > 0) {
        params.append('size', options.size);
      }
      if (options.page !== undefined && options.page >= 0) {
        params.append('page', options.page);
      }

      try {
        const response = await apiInstance.get(
          `/my/likedGroups?${params.toString()}`
        );
        console.log('찜한 모임 목록 조회 성공:', response.data);
        return response.data;
      } catch (error) {
        console.error('찜한 모임 목록 조회 실패:', error);

        if (error.isAuthError) {
          throw new Error('로그인이 필요합니다.');
        }

        throw error;
      }
    },
    enabled: !!validateAndCleanToken(), // 토큰이 있을 때만 요청
    staleTime: 1000 * 60 * 5, // 5분간 캐시 유지
    retry: (failureCount, error) => {
      if (error?.message === '로그인이 필요합니다.') return false;
      return failureCount < 2;
    },
  });
};

export default function MyLikedGroupsPage() {
  const navigate = useNavigate();

  // 필터 상태 (최신순, 오래된순만)
  const [currentSort, setCurrentSort] = useState('createdAt');
  const [currentDirection, setCurrentDirection] = useState('desc');
  const [showSortMenu, setShowSortMenu] = useState(false);

  // API 호출
  const {
    data: groupsData,
    isLoading,
    error,
    refetch,
  } = useMyLikedGroups({
    sort: currentSort,
    direction: currentDirection,
    size: 20,
  });

  const groups = groupsData?.content || [];

  // 정렬 옵션 (최신순, 오래된순만)
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

  // 개별 모임 카드 컴포넌트
  const GroupCard = ({ group }) => {
    const handleClick = () => {
      navigate(`/groups/${group.id}`);
    };

    const month = group.whenToMeet.slice(5, 7);
    const day = group.whenToMeet.slice(8, 10);
    const time = group.whenToMeet.slice(11, 16);

    return (
      <div
        key={group.id}
        className="relative w-full h-20 sm:h-[105px] bg-[#1D1D1D] rounded-[10px] cursor-pointer hover:bg-[#2A2A2A] transition-colors"
        onClick={handleClick}
      >
        {/* 찜 표시 아이콘 */}
        <div className="absolute top-2 right-2 z-10">
          <svg
            className="w-6 h-6 text-yellow-500 fill-current"
            fill="currentColor"
            viewBox="0 0 24 24"
          >
            <path d="M17.593 3.322c1.1.128 1.907 1.077 1.907 2.185V21L12 17.25 4.5 21V5.507c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0 1 11.186 0Z" />
          </svg>
        </div>

        {/* 이미지 */}
        {group.imageUrls?.length === 0 || !group.imageUrls ? (
          <img
            className="absolute w-14 sm:w-20 sm:h-20 h-14 left-2 top-3 rounded-xl object-cover"
            src={mainimage}
            alt="기본 이미지"
          />
        ) : (
          <img
            className="absolute w-14 sm:w-20 sm:h-20 h-14 left-2 top-3 rounded-xl object-cover"
            src={group.imageUrls[0]}
            alt={group.name}
          />
        )}

        {/* 모임 제목 */}
        <div className="absolute left-[74px] sm:left-[100px] top-4 sm:top-6 justify-start text-base sm:text-xl font-normal font-['Pretendard'] leading-normal text-white">
          {group.name}
        </div>

        {/* 모임 정보 */}
        <div className="absolute right-16 left-[74px] sm:left-[100px] top-11 sm:top-[55px] justify-start text-[#8F8F8F] text-xs sm:text-base font-normal font-['Pretendard'] leading-none truncate">
          {`${month}/${day} ${time}, ${group.location?.marker?.roadAddress || group.location?.marker?.locationName || '위치 정보 없음'}`}
        </div>

        {/* 참여 인원 */}
        <div className="absolute w-14 sm:w-20 h-9 sm:h-14 right-3 top-6 sm:top-6 flex flex-col justify-center bg-[#101010] rounded-3xl">
          <div className="text-center text-[#FFBB02] text-base sm:text-lg font-medium font-['Pretendard']">
            {`${group.currentParticipantCount}/${group.maxParticipantCount}`}
          </div>
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
            <h1 className="text-xl font-medium">내가 찜한 모임</h1>
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
            <h1 className="text-xl font-medium">내가 찜한 모임</h1>
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
                찜한 모임을 보려면 로그인해주세요.
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
            <h1 className="text-xl font-medium">내가 찜한 모임</h1>
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
            <h1 className="text-xl font-medium">내가 찜한 모임</h1>
          </div>

          {/* 정렬 옵션 (최신순, 오래된순만) */}
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

        {/* 모임 목록 */}
        {groups.length === 0 ? (
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
                  d="M17.593 3.322c1.1.128 1.907 1.077 1.907 2.185V21L12 17.25 4.5 21V5.507c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0 1 11.186 0Z"
                />
              </svg>
              <h2 className="text-xl font-bold text-white mb-2">
                찜한 모임이 없습니다
              </h2>
              <p className="text-gray-400 mb-6">
                마음에 드는 모임을 찜해보세요!
              </p>
              <button
                onClick={() => navigate('/groups')}
                className="bg-yellow-500 text-black px-6 py-3 rounded-lg font-medium hover:bg-yellow-400 transition-colors"
              >
                모임 둘러보기
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {groups.map((group) => (
              <GroupCard key={group.id} group={group} />
            ))}
          </div>
        )}

        {/* 하단 여백 (네비게이션 바 공간) */}
        <div className="h-20"></div>
      </div>
    </div>
  );
}
