export default function GroupPage() {
  return (
    <div className="w-full flex flex-col justify-start items-start gap-2">
      {/* 모임 박스 1개 */}
      <div
        key="1"
        className=" relative w-full h-20 sm:h-27 bg-[#1D1D1D] rounded-[10px]"
      >
        <img
          className="absolute w-14 sm:w-21 h-auto left-2 top-3 rounded-xl"
          src="https://placehold.co/70x70"
        />
        <div className="absolute left-19 sm:left-28 top-4 sm:top-6 justify-start text-base sm:text-xl font-normal font-['Pretendard'] leading-normal">
          여수 돌산에서 별보실분
        </div>
        <div className="absolute left-19 sm:left-28 top-11 sm:top-15  justify-start text-[#8F8F8F] text-xs sm:text-base font-normal font-['Pretendard'] leading-none">
          5/11일 19:00, 전남 여수시 돌산읍
        </div>
        <div className="absolute w-14 sm:w-20 h-9 sm:h-13 right-3 top-6 sm:top-7 bg-[#101010] rounded-3xl ">
          <div className="absolute left-4 sm:left-7 top-2 sm:top-3.5 text-center text-[#FFBB02] text-base sm:text-lg font-medium font-['Pretendard'] leading-tight">
            2/5
          </div>
        </div>
      </div>

      <div
        key="2"
        className=" relative w-full h-20 sm:h-27 bg-[#1D1D1D] rounded-[10px]"
      >
        <img
          className="absolute w-14 sm:w-21 h-auto left-2 top-3 rounded-xl"
          src="https://placehold.co/70x70"
        />
        <div className="absolute left-19 sm:left-28 top-4 sm:top-6 justify-start text-base sm:text-xl font-normal font-['Pretendard'] leading-normal">
          여수 돌산에서 별보실분
        </div>
        <div className="absolute left-19 sm:left-28 top-11 sm:top-15  justify-start text-[#8F8F8F] text-xs sm:text-base font-normal font-['Pretendard'] leading-none">
          5/11일 19:00, 전남 여수시 돌산읍
        </div>
        <div className="absolute w-14 sm:w-20 h-9 sm:h-13 right-3 top-6 sm:top-7 bg-[#101010] rounded-3xl ">
          <div className="absolute left-4 sm:left-7 top-2 sm:top-3.5 text-center text-[#FFBB02] text-base sm:text-lg font-medium font-['Pretendard'] leading-tight">
            2/5
          </div>
        </div>
      </div>
    </div>
  );
}
