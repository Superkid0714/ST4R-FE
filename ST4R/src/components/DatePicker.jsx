import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

//현재 날짜&시간
const today = new Date();

// 선택한 날짜가 오늘인지 검사하는 함수
function isToday(date) {
  if (!date) return false;

  return (
    date.getDate() === today.getDate() &&
    date.getMonth() === today.getMonth() &&
    date.getFullYear() === today.getFullYear()
  );
}

//날짜 선택 버튼
export function DateSelector({ selected, onChange }) {
  return (
    <DatePicker
      selected={selected}
      shouldCloseOnSelect // 날짜를 선택하면 datepicker가 자동으로 닫힘
      className="text-sm focus:outline-none h-12 font-['Pretendard'] bg-[#1D1D1D] placeholder:text-[#565656]"
      minDate={today} // today 이전 날짜 선택 불가
      onChange={onChange}
      dateFormat="yyyy-MM-dd"
      placeholderText="날짜를 선택해주세요"
    />
  );
}

//시간 선택 버튼
export function TimeSelector({ selected, onChange, selectedDate }) {
  return (
    <DatePicker
      selected={selected}
      showTimeSelect //날짜+시간
      showTimeSelectOnly //시간만 선택(showTimeSelect랑 같이 써야됨)
      timeIntervals={30} // 시간 간격
      shouldCloseOnSelect // 날짜를 선택하면 datepicker가 자동으로 닫힘
      className="text-sm  focus:outline-none h-12 font-['Pretendard'] bg-[#1D1D1D] placeholder:text-[#565656]"
      minTime={isToday(selectedDate) ? today : new Date(0, 0, 0, 0, 0)}
      maxTime={new Date(0, 0, 0, 23, 59)}
      onChange={onChange}
      dateFormat="HH:mm a"
      placeholderText="시간을 선택해주세요"
    />
  );
}

//날짜+시간 합쳐주는 함수
export function combine(date, time) {

  if (!date) return null;
  if (!time) return null;

  const pad = (n) => String(n).padStart(2, "0");

  const year = date.getFullYear();
  const month = pad(date.getMonth()+1);
  const day = pad(date.getDate());
  const hours = pad(time.getHours());
  const minutes = pad(time.getMinutes());

  return `${year}-${month}-${day}T${hours}:${minutes}:00+09:00`
}
