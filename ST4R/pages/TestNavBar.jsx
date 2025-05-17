// pages/TestNavBar.jsx
import { Link } from 'react-router-dom';
import MobileNavBar from '../components/mobile/mobileNavBar';

export default function TestNavBar() {
  return (
    <div className="min-h-screen bg-black text-white">
      <div className="container mx-auto px-4 py-3">
        <h1 className="text-2xl font-bold mb-4">네비게이션 테스트 페이지</h1>
        <p className="mb-2">현재 페이지: 테스트</p>
        <p className="mb-4">아래에 네비게이션 바가 표시되어야 합니다.</p>

        <div className="mt-8">
          <h2 className="text-xl font-semibold mb-2">페이지 링크:</h2>
          <ul className="list-disc pl-5 mb-8">
            <li>
              <Link to="/home/boards" className="text-blue-400">
                홈/게시판
              </Link>
            </li>
            <li>
              <Link to="/groups" className="text-blue-400">
                그룹/모임
              </Link>
            </li>
            <li>
              <Link to="/boards/write" className="text-blue-400">
                글쓰기
              </Link>
            </li>
          </ul>
        </div>

        {/* 추가 콘텐츠로 스크롤 테스트 */}
        <div className="mt-20 mb-32">
          <p className="mb-4">
            네비게이션 바가 화면 하단에 고정되어 있는지 확인하기 위한 추가
            콘텐츠
          </p>
          {Array(10)
            .fill(null)
            .map((_, i) => (
              <div key={i} className="bg-gray-800 p-4 mb-4 rounded">
                테스트 콘텐츠 {i + 1}
              </div>
            ))}
        </div>
      </div>

      {/* 네비게이션 바를 여기에 직접 렌더링해서 테스트 */}
      <MobileNavBar />
    </div>
  );
}
