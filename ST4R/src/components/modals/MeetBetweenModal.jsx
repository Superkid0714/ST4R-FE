import { DateSelector } from '../DatePicker';

export default function MeetBetweenModal({
  onClose,
  meetBetweenStart,
  meetBetweenEnd,
  setMeetBetweenStart,
  setMeetBetweenEnd,
  setIsMeetBetweenActive
}) {
  return (
    <div className="w-96 font-['Pretendard'] p-5 flex flex-col text-center gap-6 bg-[#1D1D1D] rounded-2xl">
      <div className="flex-shrink-0">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <button
              onClick={() => {
                onClose();
                setIsMeetBetweenActive(false);
                setMeetBetweenStart('');
                setMeetBetweenEnd('');
              }}
            >
              ✕
            </button>
            <h1 className="text-xl font-bold">모임 기간 조회</h1>
          </div>

          <button
            className="bg-yellow-500 text-black px-4 py-2 rounded-lg font-medium hover:bg-yellow-400 transition-colors"
            onClick={() => {
              if (meetBetweenStart && meetBetweenEnd) {
                onClose();
                setIsMeetBetweenActive(true);
              } else {
                alert('날짜를 모두 선택하세요.');
              }
            }}
          >
            적용하기
          </button>
        </div>
      </div>
      <div className="flex gap-2">
        <div className="flex flex-col gap-3 items-start">
          <div className="pl-2">시작일</div>
          <div className="pl-3 flex-1 h-12 bg-[#101010] rounded-[10px]">
            <DateSelector
              selected={meetBetweenStart}
              onChange={(date) => {
                setMeetBetweenStart(date);
              }}
              bg="#101010"
              minDate={new Date('1970-01-01')}
            />
          </div>
        </div>

        <div className="flex flex-col gap-3 items-start">
          <div className="pl-2">종료일</div>
          <div className="pl-3 flex-1 h-12 bg-[#101010] rounded-[10px]">
            <DateSelector
              selected={meetBetweenEnd}
              onChange={(date) => {
                setMeetBetweenEnd(date);
              }}
              bg="#101010"
              minDate={new Date(meetBetweenStart)}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
