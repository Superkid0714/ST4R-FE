import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLogoutMutation } from '../api/auth';
import Header from '../layouts/Header';

export default function HomePage() {
  const navigate = useNavigate();
  const logout = useLogoutMutation();

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

  const handleLogout = () => {
    logout.mutate();
  };

  return (
    <div className="min-h-screen bg-black">
      {/* 헤더 컴포넌트 */}
      <Header />

      {/* 메인 컨텐츠 영역 */}
      <div className="px-4 pt-4">
        <span className="text-white">홈화면 컨텐츠</span>

        {/* 테스트 로그아웃 버튼 */}
        <div
          onClick={handleLogout}
          className="fixed left-3 right-3 bottom-20 h-15 bg-star-yellow rounded-lg cursor-pointer z-10"
        >
          <div className="absolute left-5 top-4 text-base font-extrabold">
            <span className="text-black">로그아웃</span>
          </div>
        </div>
      </div>
    </div>
  );
}
