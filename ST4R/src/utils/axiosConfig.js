import axios from 'axios';

const BASE_URL = 'https://eridanus.econo.mooo.com';

// JWT 토큰 검증 함수
const isTokenValid = (token) => {
  if (!token) return false;

  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    const currentTime = Math.floor(Date.now() / 1000);

    // 토큰 만료 5분 전에 미리 무효처리 (자동 갱신을 위해)
    const bufferTime = 5 * 60; // 5분
    if (payload.exp && payload.exp < currentTime + bufferTime) {
      return false;
    }

    return true;
  } catch (error) {
    console.error('토큰 검증 실패:', error);
    return false;
  }
};

// 토큰 정리 함수
const clearAuthData = () => {
  const hadToken = !!localStorage.getItem('token');
  localStorage.removeItem('token');
  localStorage.removeItem('user');

  if (hadToken) {
    console.log('토큰이 정리되었습니다.');
  }

  return hadToken;
};

// 로그인 리다이렉트 함수
const redirectToLogin = (reason = 'token_expired') => {
  console.log('로그인 리다이렉트:', reason);

  // 현재 페이지 정보 저장 (로그인 후 돌아오기 위해)
  const returnUrl = window.location.pathname + window.location.search;
  if (returnUrl !== '/login' && returnUrl !== '/login-alert') {
    sessionStorage.setItem('returnUrl', returnUrl);
  }

  // 개발/배포 환경에 따른 카카오 로그인 URL
  const isDevelopment = window.location.hostname === 'localhost';
  const redirectUrl = isDevelopment
    ? 'http://localhost:5173'
    : window.location.origin;

  const loginUrl = `https://eridanus.econo.mooo.com/oauth/kakao?redirect=${redirectUrl}`;

  // 직접 카카오 로그인으로 이동
  window.location.href = loginUrl;
};

// Axios 기본 설정
axios.defaults.baseURL = BASE_URL;
axios.defaults.timeout = 10000; // 10초 타임아웃

// Request 인터셉터
axios.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');

    // 토큰이 있으면 유효성 검사
    if (token) {
      if (isTokenValid(token)) {
        config.headers.Authorization = `Bearer ${token}`;
      } else {
        // 토큰이 만료된 경우 정리하고 에러 발생
        clearAuthData();

        // 로그인이 필요한 요청인지 확인
        const isAuthRequired =
          config.url?.includes('/my') || config.headers?.Authorization;

        if (isAuthRequired) {
          return Promise.reject({
            response: { status: 401 },
            message: 'Token expired',
            isTokenExpired: true,
          });
        }
      }
    }

    return config;
  },
  (error) => {
    console.error('Request 인터셉터 에러:', error);
    return Promise.reject(error);
  }
);

// Response 인터셉터
axios.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    console.error('API 에러:', error.response?.status, error.config?.url);

    // 401 에러 처리
    if (error.response?.status === 401 || error.isTokenExpired) {
      const hadToken = clearAuthData();
      const currentPath = window.location.pathname;

      // 로그인이 필수인 페이지들
      const authRequiredPaths = [
        '/boards/write',
        '/boards/edit',
        '/groups/write',
        '/groups/edit',
        '/writechoice',
        '/profile/edit',
        '/profile/my-posts',
        '/profile/liked-posts',
        '/profile/liked-groups',
      ];

      // 프로필 페이지는 특별 처리
      if (currentPath === '/profile') {
        // 프로필 페이지에서는 컴포넌트에서 처리하도록 에러 전달
        const authError = new Error('Authentication required');
        authError.isAuthError = true;
        authError.shouldRedirectToLogin = true;
        return Promise.reject(authError);
      }

      // 인증이 필수인 페이지에서 토큰이 만료된 경우
      if (authRequiredPaths.some((path) => currentPath.startsWith(path))) {
        if (hadToken) {
          // 토큰이 있었다면 자동으로 재로그인
          redirectToLogin('auth_required_page');
        } else {
          // 토큰이 없었다면 로그인 알림 페이지로
          window.location.href = '/login-alert';
        }
        return Promise.reject(error);
      }

      // 홈 페이지나 게시글 상세 등에서는 비로그인 상태로 계속 진행
      if (
        currentPath === '/home' ||
        currentPath === '/' ||
        currentPath.startsWith('/boards/') ||
        currentPath.startsWith('/groups/')
      ) {
        const authError = new Error('Token expired');
        authError.isAuthError = true;
        authError.shouldRetryWithoutAuth = true;
        authError.originalError = error;
        return Promise.reject(authError);
      }
    }

    // 네트워크 에러 처리
    if (!error.response) {
      console.error('네트워크 에러 또는 서버 무응답');
      const networkError = new Error('네트워크 연결을 확인해주세요.');
      networkError.isNetworkError = true;
      return Promise.reject(networkError);
    }

    return Promise.reject(error);
  }
);

export default axios;
