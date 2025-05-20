export default function GroupPage() {

  return (
    <div className="w-full flex flex-col justify-start items-start gap-2">
      
      {/* 모임 박스 1개 */}
      <div key="1" className=" relative w-full h-20 sm:h-26 bg-[#1D1D1D] rounded-[10px]">
        <img
          className="absolute w-15 sm:w-21 h-auto left-[11px] top-[11px] rounded-[10px]"
          src="https://placehold.co/70x70"
        />
        <div className="absolute left-[85px] sm:left-[110px] top-[14px] sm:top-[23px] justify-start text-lg sm:text-xl font-normal font-['Pretendard'] leading-normal">
          여수 돌산에서 별보실분
        </div>
        <div className="absolute left-[85px] sm:left-[110px] top-[44px] sm:top-[55px]  justify-start text-[#8F8F8F] text-sm sm:text-base font-normal font-['Pretendard'] leading-none">
          5/11일 19:00, 전남 여수시 돌산읍
        </div>
        <div className="absolute w-16 sm:w-20 h-10 sm:h-13 right-[20px] top-[18px] sm:top-[25px] bg-[#101010] rounded-[60px] overflow-hidden">
          <div className="absolute left-[21px] sm:left-[27px] top-[10px] sm:top-[16px] text-center text-[#FFBB02] text-base font-medium font-['Pretendard'] leading-tight">
            2/5
          </div>
        </div>
      </div>

      <div key="2" className=" relative w-full h-20 sm:h-26 bg-[#1D1D1D] rounded-[10px]">
        <img
          className="absolute w-15 sm:w-21 h-auto left-[11px] top-[11px] rounded-[10px]"
          src="https://placehold.co/70x70"
        />
        <div className="absolute left-[85px] sm:left-[110px] top-[14px] sm:top-[23px] justify-start text-lg sm:text-xl font-normal font-['Pretendard'] leading-normal">
          여수 돌산에서 별보실분
        </div>
        <div className="absolute left-[85px] sm:left-[110px] top-[44px] sm:top-[55px]  justify-start text-[#8F8F8F] text-sm sm:text-base font-normal font-['Pretendard'] leading-none">
          5/11일 19:00, 전남 여수시 돌산읍
        </div>
        <div className="absolute w-16 sm:w-20 h-10 sm:h-13 right-[20px] top-[18px] sm:top-[25px] bg-[#101010] rounded-[60px] overflow-hidden">
          <div className="absolute left-[21px] sm:left-[27px] top-[10px] sm:top-[16px] text-center text-[#FFBB02] text-base font-medium font-['Pretendard'] leading-tight">
            2/5
          </div>
        </div>
      </div>

    </div>
  );
}
