import { useState } from 'react';
import { useLocation, Link, useNavigate } from 'react-router-dom';
import HomeIcon from '../../assets/icons/home.svg?react';
import GroupIcon from '../../assets/icons/group.svg?react';
import WriteIcon from '../../assets/icons/writechoice.svg?react';
import ProfileIcon from '../../assets/icons/profile.svg?react';

function MobileNavBar() {
  const location = useLocation();
  const navigate = useNavigate();

  const [highlight, setHighlight] = useState('');

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
    if (path === '/writechoice') {
      return currentPath === '/writechoice';
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
      to: '/home',
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
      to: '/writechoice',
      Icon: WriteIcon,
      path: '/writechoice',
      available: true,
    },
    {
      key: 'profile',
      label: '프로필',
      to: '/profile',
      Icon: ProfileIcon,
      path: '/profile',
      available: true,
    },
  ];

  // 색상/필터 정의
  const yellowFilter =
    'invert(85%) sepia(99%) saturate(1000%) hue-rotate(1deg) brightness(101%) contrast(99%)';
  const flashYellowFilter =
    'invert(94%) sepia(99%) saturate(1000%) hue-rotate(1deg) brightness(112%) contrast(105%)';
  const grayFilter = 'grayscale(1) brightness(70%)';
  const yellowText = '#FFCE31';
  const flashYellowText = '#FFE600';
  const grayText = '#6B6B6B';

  // 메뉴 클릭시 반짝 효과 + 이동
  const handleMenuClick = (e, to, key, available) => {
    if (!available) return;
    e.preventDefault();
    setHighlight(key);
    setTimeout(() => {
      setHighlight('');
      navigate(to);
    }, 180);
  };

  return (
    <nav className="fixed bottom-0 left-0 right-0 w-full h-16 bg-[#101010] shadow-[0px_-20px_40px_0px_rgba(0,0,0,0.40)] z-10">
      <div className="grid grid-cols-4 h-full">
        {menu.map(({ key, label, to, Icon, path, available }) => {
          const active = isActive(path);
          const isFlash = highlight === key;

          const iconFilter = isFlash
            ? flashYellowFilter
            : active
              ? yellowFilter
              : grayFilter;

          const textColor = isFlash
            ? flashYellowText
            : active
              ? yellowText
              : grayText;

          const fontWeight = active || isFlash ? 700 : 400;

          return (
            <Link
              key={key}
              to={to}
              className="flex flex-col items-center justify-center"
              tabIndex={available ? 0 : -1}
              aria-disabled={!available}
              onClick={(e) => handleMenuClick(e, to, key, available)}
              style={{
                pointerEvents: available ? 'auto' : 'none',
                opacity: available ? 1 : 0.5,
              }}
            >
              <Icon
                className="w-7 h-7 mb-1 transition-all duration-200"
                style={{
                  filter: iconFilter,
                  transition: 'filter 0.15s',
                }}
              />
              <span
                style={{
                  color: textColor,
                  fontSize: '13px',
                  lineHeight: 1,
                  fontWeight: fontWeight,
                  marginTop: '2px',
                  transition: 'color 0.15s, font-weight 0.15s',
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
