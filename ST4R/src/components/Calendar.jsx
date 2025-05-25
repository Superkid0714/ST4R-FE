import DatePicker from "react-datepicker";
import 'react-datepicker/dist/react-datepicker.css';
import { useState } from 'react';

export default function Calendar({selected, onChange}){
  const today = new Date();
	return (
		<div>
			<DatePicker
			  selected={selected}
        shouldCloseOnSelect // 날짜를 선택하면 datepicker가 자동으로 닫힘
        className="text-sm focus:outline-none h-12 font-['Pretendard'] bg-[#1D1D1D] placeholder:text-[#565656]"
        minDate={today} // today 이전 날짜 선택 불가
			  onChange={onChange} 
			  dateFormat="yyyy-MM-dd"
        placeholderText="날짜를 선택해주세요"
			/>
		</div>
  );
}

