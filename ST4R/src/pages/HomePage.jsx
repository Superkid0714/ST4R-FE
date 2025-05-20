import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { logoutmutation } from '../api/auth';
import SearchBar from '../components/common/SearchBar'; // 테스트하기 위해서 import

export default function HomePage() {
  const navigate = useNavigate();
  const location = useLocation();
  const logout = logoutmutation();

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get('accessToken');
    console.log(token);

    if (token) {
      localStorage.setItem('token', token);
      console.log('토큰 저장 완료:', token);
      navigate('/home', { replace: true });
    }
  }, [navigate]);

  return (
    <>
      {/* 검색바 컴포넌트 추가 */}
      <div className="mb-6 px-2">
        <SearchBar />
      </div>

      <span className="text-[#FFFFFF]">홈화면</span>

      {/* 테스트 로그아웃 버튼 */}
      <div
        onClick={() => {
          logout.mutate();
        }}
        className="absolute left-[12px] right-[12px] bottom-[80px] h-[60px] bg-[#FFBB02] rounded-[10px]"
      >
        <div className="absolute left-[20px] top-[18px] text-base font-extrabold font-['Pretendard']">
          <span className="text-[#000000]">로그아웃</span>
        </div>
      </div>
    </>
  );
}
