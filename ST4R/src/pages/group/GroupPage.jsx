import GroupSearchBar from '../../components/GroupSerchBar';
import { useNavigate, useSearchParams } from 'react-router-dom';
import GroupCard from '../../components/GroupCard';
import ChatRoomCard from '../../components/ChatRoomCard';
import { useSearchGroups } from '../../api/group/getgroup';
import FilterBar from '../../components/FilterBar(group)';
import { useEffect, useState } from 'react';
import {
  useGetMyChats,
  useGetInitialChatPreviews,
} from '../../api/chat/getMyChats';
import { connectChatPreview } from '../../hooks/useChatPreview';
import MeetBetweenModal from '../../components/modals/MeetBetweenModal';
import ModalPortal from '../../components/common/ModalPortal';

export default function GroupPage() {
  const navigate = useNavigate();
  const [meetBetweenModal, setMeetBetweenModal] = useState(false);
  const [meetBetweenStart, setMeetBetweenStart] = useState('');
  const [meetBetweenEnd, setMeetBetweenEnd] = useState('');
  const [isMeetBetweenActive, setIsMeetBetweenActive] = useState(false);

  //1. 채팅 목록 조회
  const {
    data: myChats,
    isLoading: isMyChatsLoading,
    error: myChatsError,
  } = useGetMyChats();

  //초기 채팅 미리보기 데이터 설정
  const [chatPreviews, setChatPreviews] = useState([]);

  //채팅 미리보기 내용 가져오기(http)
  const { data: initialChatPreviews, isLoading: isInitialPreviewLoading } =
    useGetInitialChatPreviews();

  //채팅 미리보기 내용 가져오기(웹소켓)
  connectChatPreview({ setChatPreviews });

  useEffect(() => {
    if (initialChatPreviews) {
      setChatPreviews(initialChatPreviews);
    }
  }, [initialChatPreviews]);

  // 2. 모임 목록 조회
  const [searchParams] = useSearchParams();

  // 검색 상태
  const [searchQuery, setSearchQuery] = useState('');
  const [searchType, setSearchType] = useState('name'); //검색 기본값: 제목
  const [searchError, setSearchError] = useState('');

  // 백엔드 API에 전달할 옵션들
  const [currentSort, setCurrentSort] = useState('createdAt'); //정렬 기본값: 최신순
  const [currentDirection, setCurrentDirection] = useState('desc'); //방향 기본값: 내림차순
  const [currentPeriod, setCurrentPeriod] = useState('daily'); //기간 기본값: 일별

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
  };

  // 날짜 검색이 활성화된 경우 기간 정보 추가
  if (isMeetBetweenActive) {
    const getStartDateString = (d) => {
      return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}T00:00:00+09:00`;
    };
    const getEndDateString = (d) => {
      return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}T23:59:00+09:00`;
    };
    searchOptions.meetBetween = {
      start: getStartDateString(meetBetweenStart),
      end: getEndDateString(meetBetweenEnd),
    };
  }

  // 지도 검색이 활성화된 경우 위치 정보 추가
  if (isMapSearchActive) {
    searchOptions.location = {
      latitude: parseFloat(mapSearchParams.lat),
      longitude: parseFloat(mapSearchParams.lng),
      distanceInMeters: parseInt(mapSearchParams.searchRadius) || 1000,
      roadAddress: mapSearchParams.roadAddress, // 도로명 주소 추가
    };
  }

  // 지도 검색 버튼 클릭 핸들러
  const handleMapSearchClick = () => {
    if (isMapSearchActive) {
      // 지도 검색 모드 해제
      navigate('/groups');
    } else {
      // 지도 검색 페이지로 이동
      navigate('/map-search?from=groups');
    }
  };

  // 백엔드 검색 API 사용
  const {
    data: groupsData,
    isLoading: isGroupsLoading,
    error: groupsError,
  } = useSearchGroups(searchQuery, searchOptions);

  // 표시할 모임 목록 결정
  const displayGroups = groupsData?.content || [];

  //기간 필터 변경
  const handlePeriodChange = (period) => {
    setCurrentPeriod(period);
  };

  //정렬 필터 변경
  const handleSortChange = (option) => {
    setCurrentSort(option.sort);
    setCurrentDirection(option.direction);
  };

  // 검색 타입 변경
  const handleSearchTypeChange = (type) => {
    setSearchType(type);
  };

  // 검색 처리
  const handleSearch = (query) => {
    setSearchError('');
    setSearchQuery(query);
  };

  // 검색 에러 처리
  useEffect(() => {
    if (groupsError) {
      if (
        groupsError.message &&
        (groupsError.message.includes('자 이상') ||
          groupsError.message.includes('자 이하'))
      ) {
        setSearchError(groupsError.message);
      } else {
        setSearchError('');
      }
    } else {
      setSearchError('');
    }
  }, [groupsError]);

  return (
    <div>
      <div className="h-16 relative">
        <div className="absolute justify-start text-3xl font-normal font-['Pretendard'] leading-normal">
          모임
        </div>
        <div className="right-0 top-0.5 hover:bg-[#2A2A2A] absolute px-2.5 py-1 bg-[#1D1D1D] rounded-[60px] flex items-center gap-1.5 ">
          <img src="src/assets/icons/add_circle.svg" alt="모임 만들기" />
          <div
            className="text-[#8F8F8F] hover:cursor-pointer text-lg font-normal font-['Pretendard']"
            onClick={() => {
              navigate('/groups/write');
            }}
          >
            모임 만들기
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-8">
        <div className="flex gap-2 items-center">
          <GroupSearchBar
            onSearch={handleSearch}
            onSearchTypeChange={handleSearchTypeChange}
            isLoading={isGroupsLoading}
            placeholder="관심 가는 그룹을 찾아보세요."
            showSearchTypeSelector={true}
            currentSearchType={searchType}
          ></GroupSearchBar>
          <button
            onClick={() => setMeetBetweenModal(true)}
            className={`rounded-full w-9 h-9 p-2 transition-colors flex items-center space-x-1 ${
              isMeetBetweenActive
                ? 'bg-yellow-500 text-black'
                : 'bg-[#2A2A2A] text-gray-400 hover:bg-[#3A3A3A]'
            }`}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke-width="1.5"
              stroke="currentColor"
              class="size-6"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5"
              />
            </svg>
          </button>
          {meetBetweenModal ? (
            <ModalPortal>
              <MeetBetweenModal
                onClose={() => setMeetBetweenModal(false)}
                meetBetweenStart={meetBetweenStart}
                meetBetweenEnd={meetBetweenEnd}
                setMeetBetweenStart={setMeetBetweenStart}
                setMeetBetweenEnd={setMeetBetweenEnd}
                setIsMeetBetweenActive={setIsMeetBetweenActive}
              ></MeetBetweenModal>
            </ModalPortal>
          ) : null}
          <button
            onClick={handleMapSearchClick}
            className={`rounded-full w-9 h-9 p-2 transition-colors flex items-center space-x-1 ${
              isMapSearchActive
                ? 'bg-yellow-500 text-black'
                : 'bg-[#2A2A2A] text-gray-400 hover:bg-[#3A3A3A]'
            }`}
            title={isMapSearchActive ? '지도 검색 해제' : '지도로 검색'}
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
                strokeWidth={1.5}
                d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m-6 3l6-3"
              />
            </svg>
          </button>
        </div>
        {/* 지도 검색 활성 상태 표시 */}
        {isMapSearchActive && (
          <div className="mb-3 bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <svg
                  className="w-4 h-4 text-yellow-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
                <span className="text-yellow-500 text-sm font-medium">
                  지도 검색 활성화됨
                </span>
              </div>
              <div className="text-xs text-yellow-400">
                {parseInt(searchParams.get('searchRadius')) >= 1000
                  ? `${parseInt(searchParams.get('searchRadius')) / 1000}km`
                  : `${searchParams.get('searchRadius')}m`}{' '}
                반경
              </div>
            </div>
            <div className="text-xs text-gray-400 mt-1">
              {searchParams.get('roadAddress')}
            </div>
          </div>
        )}

        {/* 채팅방 */}
        <div className="w-full flex flex-col justify-start items-start gap-2">
          <div className="text-xl font-['Pretendard'] leading-normal">
            나의 모임
          </div>

          {isMyChatsLoading && (
            <div className="mx-auto py-8">
              <div className="w-8 h-8 border-2 border-yellow-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
          )}

          {myChatsError?.status === 401 && (
            <div className="text-[#8F8F8F] font-['Pretendard']">
              로그인 하고 모임에 가입하세요!
            </div>
          )}

          {/* 채팅방 박스 목록 */}
          {myChats &&
            myChats.map((chatRoom, i) => {
              const chatPreview = chatPreviews.find(
                (prev) => prev.teamId === chatRoom.id
              );
              return (
                <ChatRoomCard
                  key={chatRoom.id}
                  chatRoom={chatRoom}
                  chatPreview={chatPreview}
                ></ChatRoomCard>
              );
            })}
        </div>

        {/* 모임 목록 */}
        <div className="w-full flex flex-col justify-start items-start gap-2">
          <div className="self-stretch h-6 inline-flex justify-between items-center mb-2">
            <div className="flex justify-start items-center gap-1">
              <div className="justify-start text-xl font-['Pretendard'] leading-normal">
                인기 모임
              </div>
              <img src="src\assets\icons\fire.svg" alt="인기" />
            </div>
            <FilterBar
              currentPeriod={currentPeriod}
              currentSort={currentSort}
              currentDirection={currentDirection}
              onPeriodChange={handlePeriodChange}
              onSortFilterChange={handleSortChange}
            ></FilterBar>
          </div>

          {/* 로딩 상태 */}
          {isGroupsLoading && (
            <div className="mx-auto py-8">
              <div className="w-8 h-8 border-2 border-yellow-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
          )}

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

          {/* 에러 상태 - 검색 에러가 아닌 경우만 표시 */}
          {groupsError && !isGroupsLoading && !searchError && (
            <div className="text-center py-8 mx-auto">
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
                {groupsError?.response?.status === 401
                  ? '로그인이 필요합니다'
                  : '잠시 후 다시 시도해주세요'}
              </p>
            </div>
          )}

          {/* 모임 박스 목록*/}
          {!groupsError &&
            !isGroupsLoading &&
            !searchError &&
            displayGroups.map((group) => (
              <GroupCard key={group.id} group={group}></GroupCard>
            ))}
          
          {/* 검색 결과가 없을 때 */}
          {!groupsError &&
          !isGroupsLoading &&
          !searchError &&
          displayGroups.length === 0 && (
            <div className="text-center mx-auto py-12">
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
    </div>
  );
}

