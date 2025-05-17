// pages/board/BoardPage.jsx
export default function BoardPage() {
  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">게시판</h2>
      <div className="space-y-4">
        <div className="bg-gray-800 p-4 rounded">
          <h3 className="text-lg font-semibold">React 19 주요 기능 소개</h3>
          <p className="text-gray-400 text-sm">작성자: 홍길동 · 2025.05.18</p>
        </div>
        <div className="bg-gray-800 p-4 rounded">
          <h3 className="text-lg font-semibold">Tailwind CSS 4 사용법</h3>
          <p className="text-gray-400 text-sm">작성자: 김철수 · 2025.05.17</p>
        </div>
        <div className="bg-gray-800 p-4 rounded">
          <h3 className="text-lg font-semibold">PWA 개발 팁</h3>
          <p className="text-gray-400 text-sm">작성자: 이영희 · 2025.05.16</p>
        </div>
      </div>
    </div>
  );
}
