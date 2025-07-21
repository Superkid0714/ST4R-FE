import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

const BASE_URL = 'https://eridanus.econo.mooo.com';

// 토큰 검증 및 정리 함수
const validateAndCleanToken = () => {
  const token = localStorage.getItem('token');
  if (!token) return null;

  try {
    // JWT 토큰 기본 검증 (만료시간 체크)
    const payload = JSON.parse(atob(token.split('.')[1]));
    const currentTime = Math.floor(Date.now() / 1000);

    if (payload.exp && payload.exp < currentTime) {
      // 토큰이 만료된 경우
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      return null;
    }

    return token;
  } catch (error) {
    // 토큰 형식이 잘못된 경우
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    return null;
  }
};

// Axios 인스턴스 생성
const createApiInstance = () => {
  const instance = axios.create({
    baseURL: BASE_URL,
  });

  // Request 인터셉터: 유효한 토큰만 헤더에 추가
  instance.interceptors.request.use(
    (config) => {
      const token = validateAndCleanToken();
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    },
    (error) => Promise.reject(error)
  );

  // Response 인터셉터: 401 에러 처리
  instance.interceptors.response.use(
    (response) => response,
    (error) => {
      if (error.response?.status === 401) {
        localStorage.removeItem('token');
        localStorage.removeUser('user');

        const customError = new Error('Unauthorized');
        customError.isAuthError = true;
        customError.originalError = error;
        return Promise.reject(customError);
      }
      return Promise.reject(error);
    }
  );

  return instance;
};

const apiInstance = createApiInstance();

// 내가 쓴 글 목록 조회
export const useMyPosts = (options = {}) => {
  return useQuery({
    queryKey: ['myPosts', options],
    queryFn: async () => {
      const token = validateAndCleanToken();
      if (!token) {
        throw new Error('로그인이 필요합니다.');
      }

      console.log('내가 쓴 글 목록 조회 요청:', options);

      const params = new URLSearchParams();

      // 정렬 옵션
      const sort = options.sort || 'createdAt';
      const direction = options.direction || 'desc';
      params.append('sort', sort);
      params.append('direction', direction);

      // 페이징 옵션
      if (options.size && options.size > 0) {
        params.append('size', options.size);
      }
      if (options.page !== undefined && options.page >= 0) {
        params.append('page', options.page);
      }

      try {
        const response = await apiInstance.get(
          `/my/boards?${params.toString()}`
        );
        console.log('내가 쓴 글 목록 조회 성공:', response.data);
        return response.data;
      } catch (error) {
        console.error('내가 쓴 글 목록 조회 실패:', error);

        if (error.isAuthError) {
          throw new Error('로그인이 필요합니다.');
        }

        throw error;
      }
    },
    enabled: !!validateAndCleanToken(), // 토큰이 있을 때만 요청
    staleTime: 1000 * 60 * 5, // 5분간 캐시 유지
    retry: (failureCount, error) => {
      if (error?.message === '로그인이 필요합니다.') return false;
      return failureCount < 2;
    },
  });
};

