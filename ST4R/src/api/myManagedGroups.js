import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

const BASE_URL = 'https://eridanus.econo.mooo.com';

// 토큰 검증 및 정리 함수
const validateAndCleanToken = () => {
  const token = localStorage.getItem('token');
  if (!token) return null;

  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    const currentTime = Math.floor(Date.now() / 1000);

    if (payload.exp && payload.exp < currentTime) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      return null;
    }

    return token;
  } catch (error) {
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

  instance.interceptors.response.use(
    (response) => response,
    (error) => {
      if (error.response?.status === 401) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');

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

// 내가 모임장인 모임 목록 조회
export const useMyManagedGroups = () => {
  return useQuery({
    queryKey: ['myManagedGroups'],
    queryFn: async () => {
      const token = validateAndCleanToken();
      if (!token) {
        throw new Error('로그인이 필요합니다.');
      }

      console.log('내가 모임장인 모임 목록 조회 요청');

      try {
        // 먼저 내가 참여한 모임들을 가져와서 그 중 모임장인 것들을 필터링
        const response = await apiInstance.get('/my/groups');
        console.log('내 모임 목록 조회 성공:', response.data);

        // 모임장인 모임들만 필터링 (isLeader 필드가 있다고 가정)
        const managedGroups =
          response.data.content?.filter((group) => group.isLeader) || [];

        return {
          content: managedGroups,
          totalElements: managedGroups.length,
        };
      } catch (error) {
        console.error('내 모임 목록 조회 실패:', error);

        if (error.isAuthError) {
          throw new Error('로그인이 필요합니다.');
        }

        // 만약 /my/groups가 없다면 다른 엔드포인트 시도
        try {
          const response = await apiInstance.get('/groups/managed');
          console.log('관리 모임 목록 조회 성공:', response.data);
          return response.data;
        } catch (error2) {
          console.error('관리 모임 목록 조회도 실패:', error2);

          // 모든 방법이 실패하면 빈 배열 반환
          return {
            content: [],
            totalElements: 0,
          };
        }
      }
    },
    enabled: !!validateAndCleanToken(),
    staleTime: 1000 * 60 * 5,
    retry: (failureCount, error) => {
      if (error?.message === '로그인이 필요합니다.') return false;
      return failureCount < 1;
    },
  });
};

