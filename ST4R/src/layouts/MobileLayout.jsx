import { Outlet } from 'react-router-dom';
import MobileNavBar from '../components/mobile/mobileNavBar';

export default function MobileLayout() {
  return (
    <div className="flex flex-col min-h-screen bg-black text-white">
      {/* 컨텐츠 영역  */}
      <main className="flex-1 overflow-y-auto pb-16">
        <div className="mx-auto px-3 py-4">
          <Outlet />
        </div>
      </main>

      {/* 하단 네비게이션 바*/}
      <MobileNavBar />
    </div>
  );
}
