import { useLocation, Link } from 'react-router-dom';

function MobileNavBar() {
  const location = useLocation();

  // 현재 활성화된 탭 확인
  const isActive = (path) => {
    const currentPath = location.pathname;
    if (path == '/home') {
      return currentPath.startsWith('/home');
    }
    return currentPath.startsWith(path);
  };

  return(
    <nav className="fixed bottom-0 left-0 right-0 bg-black border-t border-gray-800 h-16 z-10"
    <div className="grid gird-cols-5 h-full">
      {/* 홈 탭 */}
      <Link
        to="/home/board"
        className ="flex flex-col items-center justify-center"
        >
          <svg
          xmlns="http://ww.w3.org/2000/svg"
          fill ="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          className={`w-6 h-6 ${isActive('/home')?'text-yellow-400':'text-gray-400'}`}>
            <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
            />
            </svg>
        </Link>




    </div>
  )






}
