import { Outlet } from 'react-router-dom';

export default function MobileLayout() {
  return (
    <div>
      {/* 공통 레이아웃 */}
      <header>공통 헤더(미정)</header>

      {/* 라우트 페이지가 여기에 보여짐 */}
      <Outlet />

      <footer>공통 푸터(네비바)</footer>
    </div>
  );
}
