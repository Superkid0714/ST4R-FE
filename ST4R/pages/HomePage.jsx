import { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { logoutmutation } from '../src/api/auth';

export default function HomePage() {
  const navigate = useNavigate();
  const location = useLocation();
  const logout = logoutmutation();

  useEffect(() => {
    //처음 화면 열렸을 때만 실행하도록 useEffect사용

    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get('accessToken');
    console.log(token);

    if (token) {
      localStorage.setItem('token', token);
      console.log('토큰 저장 완료:', token);
      navigate('/home', { replace: true }); //주소창에서 토큰 지우기
    }
  }, [navigate]);

  return (
    <>
      <span className="text-[#FFFFFF]">홈화면</span>


      {/* 테스트 로그아웃 버튼 */}
      <div
        onClick={()=>{logout.mutate()}}
        className="absolute left-[12px] right-[12px] bottom-[80px] h-[60px] bg-[#FFBB02] rounded-[10px]"
      >
        <div
          className="absolute left-[20px] top-[18px] text-base font-extrabold font-['Pretendard']"
        >
          <span className="text-[#000000]">로그아웃</span>
        </div>
      </div>

    </>
  );
}
