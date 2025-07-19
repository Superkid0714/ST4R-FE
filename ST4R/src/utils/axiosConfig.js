import axios from 'axios';

const BASE_URL = 'http://eridanus.econo.mooo.com:8080';

// JWT 토큰 검증 함수
const isTokenValid = (token) => {
  if (!token) return false;

  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    const currentTime = Math.floor(Date.now() / 1000);

    // 토큰이 만료되었는지 확인
    if (payload.exp && payload.exp < currentTime) {
      return false;
    }

    return true;
  } catch (error) {
    return false;
  }
};

// 토큰 정리 함수
const clearAuthData = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
};

// Axios 기본 설정
axios.defaults.baseURL = BASE_URL;

// Request 인터셉터
axios.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');

    // 토큰이 있으면 유효성 검사
    if (token) {
      if (isTokenValid(token)) {
        config.headers.Authorization = `Bearer ${token}`;
      } else {
        // 토큰이 만료된 경우 정리
        clearAuthData();
      }
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response 인터셉터
axios.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // 401 에러 처리
    if (error.response?.status === 401) {
      clearAuthData();

      // 현재 경로에 따라 다르게 처리
      const currentPath = window.location.pathname;

      // 로그인이 필수인 페이지들
      const authRequiredPaths = [
        '/boards/write',
        '/boards/edit',
        '/groups/write',
        '/groups/edit',
        '/writechoice',
        '/profile',
      ];

      // 현재 페이지가 로그인 필수 페이지인 경우 홈으로 리다이렉트 (알림 없이)
      if (authRequiredPaths.some((path) => currentPath.startsWith(path))) {
        window.location.href = '/home';
        return Promise.reject(error);
      }

      // 게시글 상세 페이지나 홈 페이지인 경우 비로그인 상태로 계속 진행
      if (
        currentPath.startsWith('/boards/') ||
        currentPath === '/home' ||
        currentPath === '/'
      ) {
        // 에러를 특별한 형태로 변환하여 컴포넌트에서 처리
        const authError = new Error('Token expired');
        authError.isAuthError = true;
        authError.shouldRetryWithoutAuth = true;
        authError.originalError = error;
        return Promise.reject(authError);
      }
    }

    return Promise.reject(error);
  }
);

export default axios;
