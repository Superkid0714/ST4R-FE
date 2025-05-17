// pages/board/BoardPage.jsx
export default function BoardPage() {
  return (
    <div>
      <h2 className="text-2xl font-bold mb-6 text-white">게시판</h2>

      {/* 검색 필터 영역 */}
      <div className="bg-gray-900 rounded-lg p-4 mb-6">
        <div className="flex justify-between mb-3">
          <div className="text-lg font-semibold">필터</div>
          <button className="text-blue-400 text-sm">초기화</button>
        </div>
        <div className="flex space-x-2 overflow-x-auto pb-2">
          <button className="bg-blue-500 text-white px-3 py-1 rounded-full text-sm whitespace-nowrap">
            전체
          </button>
          <button className="bg-gray-800 text-gray-300 px-3 py-1 rounded-full text-sm whitespace-nowrap">
            프론트엔드
          </button>
          <button className="bg-gray-800 text-gray-300 px-3 py-1 rounded-full text-sm whitespace-nowrap">
            백엔드
          </button>
          <button className="bg-gray-800 text-gray-300 px-3 py-1 rounded-full text-sm whitespace-nowrap">
            디자인
          </button>
          <button className="bg-gray-800 text-gray-300 px-3 py-1 rounded-full text-sm whitespace-nowrap">
            기획
          </button>
          <button className="bg-gray-800 text-gray-300 px-3 py-1 rounded-full text-sm whitespace-nowrap">
            마케팅
          </button>
        </div>
      </div>

      {/* 게시글 목록 */}
      <div className="space-y-4">
        <div className="bg-gray-800 p-4 rounded-lg">
          <div className="flex justify-between items-center mb-2">
            <span className="bg-blue-500 text-xs font-medium text-white px-2 py-1 rounded">
              프론트엔드
            </span>
            <span className="text-gray-400 text-xs">1시간 전</span>
          </div>
          <h3 className="text-lg font-semibold mb-2">
            React 19의 주요 기능 소개
          </h3>
          <p className="text-gray-300 text-sm mb-3 line-clamp-2">
            React 19에서 추가된 새로운 기능들과 성능 개선 사항들에 대해
            알아보세요. 특히 useSignal과 같은 새로운 hook들이 어떻게 앱의 상태
            관리를 개선하는지 살펴봅니다.
          </p>
          <div className="flex justify-between items-center">
            <div className="flex items-center text-gray-400 text-sm">
              <span>홍길동</span>
            </div>
            <div className="flex items-center space-x-3 text-gray-400 text-sm">
              <div className="flex items-center">
                <svg
                  className="w-4 h-4 mr-1"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                  />
                </svg>
                <span>128</span>
              </div>
              <div className="flex items-center">
                <svg
                  className="w-4 h-4 mr-1"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
                  />
                </svg>
                <span>24</span>
              </div>
              <div className="flex items-center">
                <svg
                  className="w-4 h-4 mr-1"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                  />
                </svg>
                <span>42</span>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-gray-800 p-4 rounded-lg">
          <div className="flex justify-between items-center mb-2">
            <span className="bg-green-600 text-xs font-medium text-white px-2 py-1 rounded">
              백엔드
            </span>
            <span className="text-gray-400 text-xs">3시간 전</span>
          </div>
          <h3 className="text-lg font-semibold mb-2">
            Tailwind CSS 4 사용법 정리
          </h3>
          <p className="text-gray-300 text-sm mb-3 line-clamp-2">
            최신 버전의 Tailwind CSS 4에 추가된 기능들과 효과적인 사용법에 대해
            정리했습니다. 다크 모드 지원과 새로운 유틸리티 클래스들을 활용하는
            방법을 알아보세요.
          </p>
          <div className="flex justify-between items-center">
            <div className="flex items-center text-gray-400 text-sm">
              <span>김철수</span>
            </div>
            <div className="flex items-center space-x-3 text-gray-400 text-sm">
              <div className="flex items-center">
                <svg
                  className="w-4 h-4 mr-1"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                  />
                </svg>
                <span>95</span>
              </div>
              <div className="flex items-center">
                <svg
                  className="w-4 h-4 mr-1"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
                  />
                </svg>
                <span>18</span>
              </div>
              <div className="flex items-center">
                <svg
                  className="w-4 h-4 mr-1"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                  />
                </svg>
                <span>36</span>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-gray-800 p-4 rounded-lg">
          <div className="flex justify-between items-center mb-2">
            <span className="bg-purple-600 text-xs font-medium text-white px-2 py-1 rounded">
              디자인
            </span>
            <span className="text-gray-400 text-xs">어제</span>
          </div>
          <h3 className="text-lg font-semibold mb-2">PWA 개발 팁 모음</h3>
          <p className="text-gray-300 text-sm mb-3 line-clamp-2">
            Progressive Web App 개발에 관한 유용한 팁들과 성능 최적화 방법에
            대해 공유합니다. 사용자 경험을 향상시키는 오프라인 지원 기능 구현
            방법도 알아보세요.
          </p>
          <div className="flex justify-between items-center">
            <div className="flex items-center text-gray-400 text-sm">
              <span>이영희</span>
            </div>
            <div className="flex items-center space-x-3 text-gray-400 text-sm">
              <div className="flex items-center">
                <svg
                  className="w-4 h-4 mr-1"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                  />
                </svg>
                <span>76</span>
              </div>
              <div className="flex items-center">
                <svg
                  className="w-4 h-4 mr-1"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
                  />
                </svg>
                <span>12</span>
              </div>
              <div className="flex items-center">
                <svg
                  className="w-4 h-4 mr-1"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                  />
                </svg>
                <span>29</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 글쓰기 버튼 (고정) */}
      <div className="fixed bottom-20 right-4">
        <button className="bg-blue-500 hover:bg-blue-600 text-white rounded-full w-14 h-14 flex items-center justify-center shadow-lg transition">
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 4v16m8-8H4"
            />
          </svg>
        </button>
      </div>
    </div>
  );
}
