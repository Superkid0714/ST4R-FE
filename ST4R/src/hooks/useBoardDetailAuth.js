import { useState, useEffect } from 'react';

export function useBoardDetailAuth() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    const checkAuthStatus = () => {
      const token = localStorage.getItem('token');

      if (!token) {
        setIsLoggedIn(false);
        setCurrentUser(null);
        return;
      }

      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        const currentTime = Math.floor(Date.now() / 1000);

        if (payload.exp && payload.exp > currentTime) {
          setIsLoggedIn(true);

          const userInfo = {
            id: payload.id || payload.sub,
            email: payload.email,
            name:
              payload.name ||
              payload.nickname ||
              `사용자${payload.id || payload.sub}`,
          };

          setCurrentUser(userInfo);
          localStorage.setItem('user', JSON.stringify(userInfo));
        } else {
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          setIsLoggedIn(false);
          setCurrentUser(null);
        }
      } catch (error) {
        console.error('토큰 파싱 에러:', error);
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setIsLoggedIn(false);
        setCurrentUser(null);
      }
    };

    checkAuthStatus();

    const handleStorageChange = () => {
      checkAuthStatus();
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  return { isLoggedIn, currentUser };
}

