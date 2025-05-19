import { useLocation, Link } from 'react-router-dom';

// SVG 파일을  import
import homeSvg from '../../src/assets/icons/home.svg';
import groupSvg from '../../src/assets/icons/group.svg';
import writeSvg from '../../src/assets/icons/write.svg';
import chatSvg from '../../src/assets/icons/chat.svg';
import profileSvg from '../../src/assets/icons/profile.svg';

function MobileNavBar() {
  const location = useLocation();

  // 현재 활성화된 탭 확인
  const isActive = (path) => {
    const currentPath = location.pathname;

    // 홈/게시판 경로 확인
    if (path === '/home') {
      return (
        currentPath === '/' ||
        currentPath === '/home' ||
        currentPath.startsWith('/home/')
      );
    }

    // 모임 경로 확인
    if (path === '/groups') {
      return currentPath.startsWith('/groups');
    }

    // 글쓰기 경로 확인 (boards/write 또는 groups/write)
    if (path === '/boards/write') {
      return currentPath === '/boards/write' || currentPath === '/groups/write';
    }

    // 메시지 또는 프로필 경로 확인
    return currentPath.startsWith(path);
  };

  // SVG 필터 색상 설정
  const getActiveStyle = {
    filter:
      'brightness(0) saturate(100%) invert(88%) sepia(32%) saturate(1960%) hue-rotate(324deg) brightness(103%) contrast(98%)',
  };

  const getInactiveStyle = {
    filter:
      'brightness(0) saturate(100%) invert(70%) sepia(14%) saturate(168%) hue-rotate(188deg) brightness(94%) contrast(93%)',
  };

  return (
    <nav className="fixed bottom-0 left-0 right-0 w-full h-16 bg-[#101010] shadow-[0px_-20px_40px_0px_rgba(0,0,0,0.40)] z-10">
      <div className="grid grid-cols-5 h-full">
        {/* 홈 탭 */}
        <Link to="/home/boards" className="flex items-center justify-center">
          <img
            src={homeSvg}
            alt="홈"
            className="w-7 h-7"
            style={isActive('/home') ? getActiveStyle : getInactiveStyle}
          />
        </Link>
        {/* 그룹/모임 탭 */}
        <Link to="/groups" className="flex items-center justify-center">
          <img
            src={groupSvg}
            alt="모임"
            className="w-7 h-7"
            style={isActive('/groups') ? getActiveStyle : getInactiveStyle}
          />
        </Link>
        {/*글쓰기 탭 같은 경우는 모임글을 쓸 것인지 아니면 커뮤니티 글을 적을지 선택지를 줘야하는 것과 연결해야 함  */}
        {/* 글쓰기 탭 */}
        <Link to="/boards/write" className="flex items-center justify-center">
          <img
            src={writeSvg}
            alt="글쓰기"
            className="w-7 h-7"
            style={
              isActive('/boards/write') ? getActiveStyle : getInactiveStyle
            }
          />
        </Link>
        {/* 채팅/메시지 탭 - 향후 개발 예정 */}
        <Link to="#" className="flex items-center justify-center">
          <img
            src={chatSvg}
            alt="메시지"
            className="w-7 h-7 opacity-50"
            style={getInactiveStyle}
          />
        </Link>
        {/* 프로필 탭 - 향후 개발 예정 */}
        <Link to="#" className="flex items-center justify-center">
          <img
            src={profileSvg}
            alt="프로필"
            className="w-7 h-7 opacity-50"
            style={getInactiveStyle}
          />
        </Link>
      </div>
    </nav>
  );
}

export default MobileNavBar;
