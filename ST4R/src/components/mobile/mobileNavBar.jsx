import { useLocation, Link } from 'react-router-dom';
import HomeIcon from '../../assets/icons/home.svg?react';
import GroupIcon from '../../assets/icons/group.svg?react';
import WriteIcon from '../../assets/icons/write.svg?react';
import ProfileIcon from '../../assets/icons/profile.svg?react';

function MobileNavBar() {
  const location = useLocation();

  const isActive = (path) => {
    const currentPath = location.pathname;
    if (path === '/home') {
      return (
        currentPath === '/' ||
        currentPath === '/home' ||
        currentPath.startsWith('/home/')
      );
    }
    if (path === '/groups') {
      return currentPath.startsWith('/groups');
    }
    if (path === '/boards/write') {
      return currentPath === '/boards/write' || currentPath === '/groups/write';
    }
    if (path === '/profile') {
      return currentPath.startsWith('/profile');
    }
    return false;
  };

  const menu = [
    {
      key: 'home',
      label: '홈',
      to: '/home/boards',
      Icon: HomeIcon,
      path: '/home',
      available: true,
    },
    {
      key: 'groups',
      label: '모임',
      to: '/groups',
      Icon: GroupIcon,
      path: '/groups',
      available: true,
    },
    {
      key: 'write',
      label: '글 작성',
      to: '/boards/write',
      Icon: WriteIcon,
      path: '/boards/write',
      available: true,
    },
    {
      key: 'profile',
      label: '프로필',
      to: '#',
      Icon: ProfileIcon,
      path: '/profile',
      available: false,
    },
  ];

  // filter 값: 노란색 근사 (FFCE31 계열)
  const yellowFilter =
    'invert(85%) sepia(99%) saturate(1000%) hue-rotate(1deg) brightness(101%) contrast(99%)';
  // filter 값: 회색 근사
  const grayFilter = 'grayscale(1) brightness(70%)';

  // 컬러 값: 글자 색상(아이콘 filter에 맞춰서)
  const yellowText = '#FFCE31';
  const grayText = '#6B6B6B';

  return (
    <nav className="fixed bottom-0 left-0 right-0 w-full h-16 bg-[#101010] shadow-[0px_-20px_40px_0px_rgba(0,0,0,0.40)] z-10">
      <div className="grid grid-cols-4 h-full">
        {menu.map(({ key, label, to, Icon, path, available }) => {
          const active = isActive(path);
          return (
            <Link
              key={key}
              to={to}
              className="flex flex-col items-center justify-center"
              tabIndex={available ? 0 : -1}
              aria-disabled={!available}
              style={{
                pointerEvents: available ? 'auto' : 'none',
                opacity: available ? 1 : 0.5,
              }}
            >
              <Icon
                className="w-7 h-7 mb-1 transition-colors duration-200"
                style={{
                  filter: active ? yellowFilter : grayFilter,
                }}
              />
              <span
                style={{
                  color: active ? yellowText : grayText,
                  fontSize: '13px',
                  lineHeight: 1,
                  fontWeight: active ? 600 : 400,
                  marginTop: '2px',
                  transition: 'color 0.2s',
                }}
              >
                {label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}

export default MobileNavBar;
