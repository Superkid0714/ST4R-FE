import west from '../../assets/icons/west.svg';
import { useState } from 'react';
import {
  DateSelector,
  TimeSelector,
  combine,
} from '../../components/DatePicker';

export default function GroupWritePage() {
  const [name, setName] = useState(''); // 제목

  const [selectedDate, setSelectedDate] = useState(''); //날짜
  const [selectedTime, setSelectedTime] = useState(''); //시간
  const whenToMeet = combine(selectedDate, selectedTime); //ISO 8601 형식 + KST 시간대 오프셋(+09:00) / ex) 2025-05-16T15:56:00+09:00

  const [maxParticipantCount, setMaxParticipantCount] = useState(''); //최대 인원 수
  const [password, setPassword] = useState(''); //비밀번호
  const [description, setDescription] = useState(''); //본문

  return (
    <div className="p-2 max-w-screen w-full">
      <div className="inline-flex justify-start items-center gap-3">
        <div className="p-1.5 bg-[#1D1D1D] rounded-[60px]">
          <img src={west} alt="화살표" className="w-6 h-6" />
        </div>
        <div className="text-[#8F8F8F] text-2xl font-normal font-['Pretendard'] leading-loose">
          모임 만들기
        </div>
      </div>

      <div className="flex flex-col gap-8 ">
        <div></div>

        <div className="flex gap-2 justify-start">
          <img src="../src/assets/icons/camera.svg" alt="사진" />
          <img
            src="https://placehold.co/70x70"
            className="w-18 h-auto rounded-xl"
          />
          <img
            src="https://placehold.co/70x70"
            className="w-18 h-auto rounded-xl"
          />
        </div>

        {/* 모임 제목 칸 */}
        <div className="flex flex-col gap-2.5">
          <div className="text-lg font-['Pretendard']">모임 제목</div>
          <input
            type="text"
            placeholder="모임의 제목을 작성해보세요."
            value={name}
            minLength={2}
            maxLength={30}
            onChange={(e) => setName(e.target.value)}
            className="h-12 px-2 bg-[#1D1D1D] rounded-[10px] focus:outline-none text-sm placeholder:text-[#565656] font-['Pretendard']"
          />
        </div>

        {/* 모임 일정 칸 */}
        <div className="flex flex-col gap-2.5">
          <div className="text-lg font-['Pretendard']">모임 일정</div>
          <div className="flex gap-2">
            <div className="pl-3 flex-1 h-12 bg-[#1D1D1D] rounded-[10px]">
              <DateSelector
                selected={selectedDate}
                onChange={(date) => {
                  setSelectedDate(date);
                }}
              ></DateSelector>
            </div>
            <div className="pl-3 flex-1 h-12 bg-[#1D1D1D] rounded-[10px]">
              <TimeSelector
                selected={selectedTime}
                onChange={(time) => {
                  setSelectedTime(time);
                }}
                selectedDate={selectedDate}
              ></TimeSelector>
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
                최대:
              </div>
              <input
                type="text"
                className="w-full h-12 pl-12 pr-3 bg-[#1D1D1D] rounded-[10px] focus:outline-none text-sm font-['Pretendard']"
                value={maxParticipantCount}
                minLength={1}
                maxLength={2} //99명까지
                onChange={(e) => {
                  //숫자만 입력 가능
                  if (/^\d*$/.test(e.target.value)) {
                    setMaxParticipantCount(e.target.value);
                  }
                }}
              />
            </div>
            <div className="relative flex-1 h-12 bg-[#1D1D1D] rounded-[10px]">
              <div className="left-3 top-3.5 absolute justify-start text-sm font-['Pretendard']">
                PW:
              </div>
              <input
                type="text"
                className="w-full h-12 pl-12 pr-3 bg-[#1D1D1D] rounded-[10px] focus:outline-none text-sm font-['Pretendard']"
                value={password}
                maxLength={5}
                onChange={(e) => {
                  if (e.target.value.length <= 5) { //한국어는 자음+모음을 치는 중엔 한글자로 보기때문에 오류가능성ㅇ -> 한번더 검사
                    setPassword(e.target.value);
                  }
                }}
              />
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
            value={description}
            maxLength={1000} // 최대 1000자
            onChange={(e) => setDescription(e.target.value)}
            className="h-48 px-2 py-4 text-sm font-['Pretendard'] focus:outline-none bg-[#1D1D1D] rounded-[10px] placeholder:text-[#565656]"
          />
        </div>
      </div>
    </div>
  );
}
