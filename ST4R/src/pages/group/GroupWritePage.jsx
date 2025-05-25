import west from '../../assets/icons/west.svg';

export default function GroupWritePage() {

  

  return (
    <div className="p-2">
      <div className="inline-flex justify-start items-center gap-3">
        <div className="p-1.5 bg-[#1D1D1D] rounded-[60px]">
          <img src={west} alt="화살표" className="w-6 h-6" />
        </div>
        <div className="text-[#8F8F8F] text-2xl font-normal font-['Pretendard'] leading-loose">
          모임 만들기
        </div>
      </div>

      <div className="flex flex-col gap-8">
        <div></div>

        <div className="flex gap-2 justify-start">
          <img src="../src/assets/icons/camera.svg" alt="사진" />
          <img src="https://placehold.co/70x70" className="rounded-xl" />
          <img src="https://placehold.co/70x70" className="rounded-xl" />
        </div>

        {/* 모임 제목 칸 */}
        <div className="flex flex-col gap-2.5">
          <div className="text-lg font-['Pretendard']">모임 제목</div>
          <input
            type="text"
            placeholder="모임의 제목을 작성해보세요."
            className="h-12 px-2 bg-[#1D1D1D] rounded-[10px] focus:outline-none text-sm placeholder:text-[#565656] font-['Pretendard']"
          />
        </div>

        {/* 모임 일정 칸 */}
        <div className="flex flex-col gap-2.5">
          <div className="text-lg font-['Pretendard']">모임 일정</div>
          <div className="flex gap-2">
            <div className="relative flex-1 h-12 bg-[#1D1D1D] rounded-[10px]">
              <div className="left-3 top-3.5 absolute justify-start text-sm font-['Pretendard']">
                25/05/16
              </div>
              <img
                src="../src/assets/icons/drop_down.svg"
                alt="드롭바"
                className="absolute right-3 top-3"
              />
            </div>
            <div className="relative flex-1 h-12 bg-[#1D1D1D] rounded-[10px]">
              <div className="left-3 top-3.5 absolute justify-start text-sm font-['Pretendard']">
                오후 7:30
              </div>
              <img
                src="../src/assets/icons/drop_down.svg"
                alt="드롭바"
                className="absolute right-3 top-3"
              />
            </div>
          </div>
        </div>

        {/* 모임 인원/비밀번호 칸 */}
        <div className="flex flex-col gap-2.5">
          <div className="text-lg font-['Pretendard']">
            모임 인원 / 입장 비밀번호
          </div>
          <div className="flex gap-2">
            <div className="relative flex-1 h-12 bg-[#1D1D1D] rounded-[10px]">
              <div className="left-3 top-3.5 absolute justify-start text-sm font-['Pretendard']">
                최대 10명
              </div>
            </div>
            <div className="relative flex-1 h-12 bg-[#1D1D1D] rounded-[10px]">
              <div className="left-3 top-3.5 absolute justify-start text-sm font-['Pretendard']">
                PW: 12345
              </div>
            </div>
          </div>
        </div>

        {/* 모임 위치 칸 */}
        <div className="flex flex-col gap-2.5">
          <div className="text-lg font-['Pretendard']">모임 위치</div>
          <div className="h-12 relative bg-[#1D1D1D] rounded-[10px]">
            <div className="left-3 top-3.5 absolute justify-start text-sm font-['Pretendard']">
              서울 특별시 용산구
            </div>
          </div>
        </div>

        {/* 모임 설명 칸 */}
        <div className="flex flex-col gap-2.5">
          <div className="text-lg font-['Pretendard']">모임 설명</div>
          <textarea
            type="text"
            placeholder={`모임 설명에 들어갈 내용을 자유롭게 작성해주세요\n(1000자 이내까지 작성 가능)`}
            className="h-48 px-2 py-4 text-sm font-['Pretendard'] focus:outline-none bg-[#1D1D1D] rounded-[10px] placeholder:text-[#565656]"
          />
        </div>
      </div>
    </div>
  );
}
