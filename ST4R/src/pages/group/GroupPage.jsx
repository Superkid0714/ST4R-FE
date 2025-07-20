import SearchBar from '../../components/common/SearchBar';
import { useNavigate } from 'react-router-dom';
import GroupCard from '../../components/GroupCard';
import ChatRoomCard from '../../components/ChatRoomCard';
import { useSearchGroups, useGetGroups } from '../../api/group/getgroup';
import FilterBar from '../../components/FilterBar(group)';
import { useEffect, useState } from 'react';
import { useGetMyChats, useGetInitialChatPreviews } from '../../api/chat/getMyChats';
import { connectChatPreview } from '../../hooks/useChatPreview';

export default function GroupPage() {
  const navigate = useNavigate();
  const [searchResults, setSearchResults] = useState([]);
  const [isSearchMode, setIsSearchMode] = useState(false);

  const [currentSort, setCurrentSort] = useState('createdAt'); //정렬 기본값: 최신순
  const [currentDirection, setCurrentDirection] = useState('desc'); //방향 기본값: 내림차순
  const [currentPeriod, setCurrentPeriod] = useState('daily'); //기간 기본값: 일별

  //채팅 목록 가져오기
  const {
    data: myChats,
    isLoading: isMyChatsLoading,
    error: myChatsError,
  } = useGetMyChats();

  //초기 채팅 미리보기 데이터 설정
  const [chatPreviews, setChatPreviews] = useState([]);

  //채팅 미리보기 내용 가져오기(http)
  const { data: initialChatPreviews, isLoading: isInitialPreviewLoading } = useGetInitialChatPreviews();

  //채팅 미리보기 내용 가져오기(웹소켓)
  connectChatPreview({ setChatPreviews });

  useEffect(() => {
    if (initialChatPreviews) {
      setChatPreviews(initialChatPreviews);
    }
  }, [initialChatPreviews]);

  //모임 목록 가져오기
  const {
    data: groupsData,
    isLoading: isGruopsLoading,
    error: groupsError,
  } = useGetGroups({
    sort: currentSort,
    direction: currentDirection,
    period: currentPeriod,
  });

  // 표시할 모임 목록 결정
  const displayGroups = isSearchMode
    ? searchResults
    : groupsData?.content || [];

  //검색 결과 처리
  const handleSearchResults = (results, searchQuery = '') => {
    setSearchResults(results);
    setIsSearchMode(searchQuery.trim().length > 0);
  };

  //기간 필터 변경
  const handlePeriodChange = (period) => {
    setCurrentPeriod(period);
  };

  //정렬 필터 변경
  const handleSortChange = (option) => {
    setCurrentSort(option.sort);
    setCurrentDirection(option.direction);
  };

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
        <SearchBar
          onSearchResults={handleSearchResults}
          allposts={groupsData?.content || []}
          placeholder="관심 가는 그룹을 찾아보세요."
        ></SearchBar>

        {/* 채팅방 */}
        <div className="w-full flex flex-col justify-start items-start gap-2">
          <div className="text-xl font-['Pretendard'] leading-normal">
            나의 모임
          </div>

          {isMyChatsLoading && <div>채팅방 로딩 중...</div>}
          {myChatsError && <div>채팅방을 불러오는 데 실패했습니다.</div>}

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
          {isGruopsLoading && !isSearchMode && (
            <div className="mx-auto py-8">
              <div className="w-8 h-8 border-2 border-yellow-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
          )}

          {groupsError && <div>값을 불러오는데 에러가 생겼습니다.</div>}

          {/* 모임 박스 목록*/}
          {displayGroups.map((group) => (
            <GroupCard key={group.id} group={group}></GroupCard>
          ))}
        </div>
      </div>
    </div>
  );
}
