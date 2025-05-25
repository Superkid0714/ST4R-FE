import SearchBar from '../../components/common/SearchBar';

export default function GroupPage() {
  return (
    <>
      <div className="h-16 relative">
        <div className="absolute justify-start text-3xl font-normal font-['Pretendard'] leading-normal">
          모임
        </div>
        <div className="right-0 top-0.5 absolute px-2.5 py-1 bg-[#1D1D1D] rounded-[60px] flex items-center gap-1.5 ">
          <img src="src/assets/icons/add_circle.svg" alt="모임 만들기" />
          <div className="text-[#8F8F8F] text-lg font-normal font-['Pretendard']">
            모임 만들기
          </div>
        </div>
      </div>

      <div className=" flex flex-col gap-8">
        <SearchBar placeholder="관심 가는 그룹을 찾아보세요."></SearchBar>

        {/* 채팅방 */}
        <div className="w-full flex flex-col justify-start items-start gap-2">
          <div className="text-xl font-['Pretendard'] leading-normal">
            나의 모임
          </div>

          <div
            key="1"
            className=" relative w-full h-20 sm:h-[105px] bg-[#1D1D1D] rounded-[10px]"
          >
            <img
              className="absolute w-14 sm:w-20 h-auto left-2 top-3 rounded-xl"
              src="https://placehold.co/70x70"
            />
            <div className="absolute left-[74px] sm:left-[100px] top-4 sm:top-6 justify-start text-base sm:text-xl font-normal font-['Pretendard'] leading-normal">
              여수 돌산에서 별보실분
            </div>
            <div className="absolute left-[74px] sm:left-[100px] top-11 sm:top-[55px] justify-start text-[#8F8F8F] text-xs sm:text-base font-normal font-['Pretendard'] leading-none">
              김김김111: 저희 그럼 11시에 보도록 하죠
            </div>
            <div className="absolute w-14 sm:w-20 h-9 sm:h-14 right-3 top-6 sm:top-6 bg-[#FFBB02] rounded-3xl ">
              <div className="absolute left-4 sm:left-7 top-1.5 sm:top-3.5 text-center text-[#000000] text-base sm:text-lg font-semibold font-['Pretendard']">
                99+
              </div>
            </div>
          </div>
        </div>

        {/* 모임 목록 */}
        <div className="w-full flex flex-col justify-start items-start gap-2">
          <div className="self-stretch h-6 inline-flex justify-between items-center">
            <div className="flex justify-start items-center gap-1">
              <div className="justify-start text-xl font-['Pretendard'] leading-normal">
                인기 모임
              </div>
              <img src="src\assets\icons\fire.svg" alt="인기" />
            </div>
            <img src="src\assets\icons\filter.svg" alt="검색필터" />
          </div>

          {/* 모임 박스 1개 */}
          <div
            key="1"
            className=" relative w-full h-20 sm:h-[105px] bg-[#1D1D1D] rounded-[10px]"
          >
            <img
              className="absolute w-14 sm:w-20 h-auto left-2 top-3 rounded-xl"
              src="https://placehold.co/70x70"
            />
            <div className="absolute left-[74px] sm:left-[100px] top-4 sm:top-6 justify-start text-base sm:text-xl font-normal font-['Pretendard'] leading-normal">
              여수 돌산에서 별보실분
            </div>
            <div className="absolute left-[74px] sm:left-[100px] top-11 sm:top-[55px] justify-start text-[#8F8F8F] text-xs sm:text-base font-normal font-['Pretendard'] leading-none">
              5/11일 19:00, 전남 여수시 돌산읍
            </div>
            <div className="absolute w-14 sm:w-20 h-9 sm:h-14 right-3 top-6 sm:top-6 bg-[#101010] rounded-3xl ">
              <div className="absolute left-4 sm:left-7 top-1.5 sm:top-3.5 text-center text-[#FFBB02] text-base sm:text-lg font-medium font-['Pretendard']">
                2/5
              </div>
            </div>
          </div>

          <div
            key="2"
            className=" relative w-full h-20 sm:h-[105px] bg-[#1D1D1D] rounded-[10px]"
          >
            <img
              className="absolute w-14 sm:w-20 h-auto left-2 top-3 rounded-xl"
              src="https://placehold.co/70x70"
            />
            <div className="absolute left-[74px] sm:left-[100px] top-4 sm:top-6 justify-start text-base sm:text-xl font-normal font-['Pretendard'] leading-normal">
              여수 돌산에서 별보실분
            </div>
            <div className="absolute left-[74px] sm:left-[100px] top-11 sm:top-[55px]  justify-start text-[#8F8F8F] text-xs sm:text-base font-normal font-['Pretendard'] leading-none">
              5/11일 19:00, 전남 여수시 돌산읍
            </div>
            <div className="absolute w-14 sm:w-20 h-9 sm:h-14 right-3 top-6 sm:top-6 bg-[#101010] rounded-3xl ">
              <div className="absolute left-4 sm:left-7 top-1.5 sm:top-3.5 text-center text-[#FFBB02] text-base sm:text-lg font-medium font-['Pretendard']">
                2/5
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
