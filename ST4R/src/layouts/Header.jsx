import { useNavigate } from 'react-router-dom';
import SearchBar from '../components/common/SearchBar';
import FortuneIcon from '../assets/icons/fortune.svg?react';

export default function Header({ onSearchResults, allPosts = [] }) {
  // props 추가
  const navigate = useNavigate();

  // 토큰 존재 여부로 로그인 상태 확인
  const token = localStorage.getItem('token');
  const isAuthenticated = !!token;

  // 로그인 버튼 클릭 핸들러
  const handleLoginClick = () => {
    navigate('/login');
  };

  // 운세 버튼 클릭 핸들러
  const handleFortuneClick = () => {
    // 운세 페이지로 이동하거나 모달을 띄우는 로직
    console.log('운세 버튼 클릭');
  };

  // 알림 버튼 클릭 핸들러
  const handleNotificationClick = () => {
    console.log('알림 버튼 클릭');
  };

  return (
    <header className="bg-black text-white pt-6 pb-4">
      <div className="px-4">
        {/* 상단 타이틀과 알림 영역 */}
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-white">Startlight</h1>
          <div className="flex items-center space-x-2">
            {/* 알림 아이콘 */}
            <button
              onClick={handleNotificationClick}
              className="bg-[#2A2A2A] rounded-full p-2 hover:bg-[#3A3A3A] transition-colors"
            >
              <svg
                className="w-5 h-5 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                />
              </svg>
            </button>

            {/* 로그인 상태에 따른 조건부 렌더링 */}
            {isAuthenticated ? (
              /* 로그인된 경우: 운세 버튼 */
              <button
                onClick={handleFortuneClick}
                className="bg-[#2A2A2A] rounded-full px-3 py-2 hover:bg-[#3A3A3A] transition-colors flex items-center space-x-1"
              >
                {/* 운세 아이콘 */}
                <FortuneIcon className="w-4 h-4 text-gray-400" />
                <span className="text-gray-400 text-sm">운세</span>
              </button>
            ) : (
              /* 로그인 안된 경우: 로그인 버튼 */
              <button
                onClick={handleLoginClick}
                className="bg-[#FFBB02] rounded-full px-4 py-2 hover:bg-[#E6A500] transition-colors flex items-center space-x-1"
              >
                <svg
                  className="w-4 h-4 text-black"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1"
                  />
                </svg>
                <span className="text-black text-sm font-medium">로그인</span>
              </button>
            )}
          </div>
        </div>

        {/* 위치와 날씨 정보 */}
        <div className="flex items-center space-x-3 mb-6">
          <div className="flex items-center bg-[#2A2A2A] rounded-full px-3 py-2 text-gray-300 text-sm">
            <svg
              className="w-4 h-4 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
              />
            </svg>
            광주광역시
          </div>
          <div className="flex items-center bg-[#2A2A2A] rounded-full px-3 py-2 text-gray-300 text-sm">
            <svg
              className="w-4 h-4 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z"
              />
            </svg>
            19°C / 맑음
          </div>
        </div>

        {/* 검색바 */}
        <div className="mb-2">
          <SearchBar onSearchResults={onSearchResults} allPosts={allPosts} />
        </div>
      </div>
    </header>
  );
}
