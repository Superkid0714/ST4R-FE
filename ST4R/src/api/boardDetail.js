import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';

const BASE_URL = 'http://eridanus.econo.mooo.com:8080';

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

// 401 에러 처리는 인터셉터에서 자동으로 처리됩니다

// Axios 인스턴스 생성 (인터셉터 적용)
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
        // 토큰 정리
        localStorage.removeItem('token');
        localStorage.removeItem('user');

        // 401 에러를 특별한 객체로 변환하여 컴포넌트에서 처리할 수 있도록 함
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

// 게시글 상세 조회 (로그인 없이도 접근 가능)
export const useBoardDetail = (boardId) => {
  return useQuery({
    queryKey: ['boardDetail', boardId],
    queryFn: async () => {
      const token = validateAndCleanToken();

      console.log('게시글 상세 조회 요청:', { boardId, hasToken: !!token });

      try {
        const response = await apiInstance.get(`/home/boards/${boardId}`);
        console.log('게시글 상세 조회 성공:', response.data);
        return response.data;
      } catch (error) {
        console.error(
          '게시글 상세 조회 실패:',
          error.response?.status,
          error.message
        );

        // 401 에러인 경우 비로그인 상태로 처리
        if (error.isAuthError) {
          // 토큰 없이 다시 시도
          try {
            const publicResponse = await axios.get(
              `${BASE_URL}/home/boards/${boardId}`
            );
            console.log(
              '비로그인 상태로 게시글 조회 성공:',
              publicResponse.data
            );
            return publicResponse.data;
          } catch (publicError) {
            console.error('비로그인 상태 조회도 실패:', publicError);
            throw publicError;
          }
        }

        throw error;
      }
    },
    enabled: !!boardId,
    staleTime: 1000 * 60 * 5,
    retry: (failureCount, error) => {
      // 401 에러는 재시도하지 않음
      if (error?.isAuthError) return false;
      return failureCount < 2;
    },
  });
};

// 게시글 수정 권한 확인
export const useCheckEditPermission = (boardId) => {
  return useQuery({
    queryKey: ['editPermission', boardId],
    queryFn: async () => {
      const token = validateAndCleanToken();
      if (!token) return { canEdit: false };

      try {
        const response = await apiInstance.get(
          `/home/boards/${boardId}/edit-permission`
        );
        return response.data;
      } catch (error) {
        console.error('수정 권한 확인 실패:', error);
        return { canEdit: false };
      }
    },
    enabled: !!boardId && !!validateAndCleanToken(),
    retry: false, // 권한 확인은 재시도하지 않음
  });
};

// 게시글 삭제
export const useDeleteBoard = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (boardId) => {
      const token = validateAndCleanToken();
      if (!token) {
        throw new Error('로그인이 필요합니다.');
      }

      const response = await apiInstance.delete(`/home/boards/${boardId}`);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['posts']);
      alert('게시글이 삭제되었습니다.');
      window.location.href = '/home';
    },
    onError: (error) => {
      if (error.isAuthError) {
        alert('로그인이 필요합니다.');
        window.location.href = '/login';
      } else if (error.response?.status === 403) {
        alert('삭제 권한이 없습니다.');
      } else if (error.message === '로그인이 필요합니다.') {
        alert(error.message);
        window.location.href = '/login';
      } else {
        alert('게시글 삭제에 실패했습니다.');
      }
    },
  });
};

// 게시글 좋아요 토글 (로그인 필요)
export const useLikeBoard = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (boardId) => {
      const token = validateAndCleanToken();
      if (!token) {
        throw new Error('로그인이 필요합니다.');
      }

      const response = await apiInstance.post(
        `/home/boards/${boardId}/likes`,
        {}
      );
      return response.data;
    },
    onSuccess: (data, boardId) => {
      queryClient.invalidateQueries(['boardDetail', boardId]);
      queryClient.invalidateQueries(['posts']);
    },
    onError: (error) => {
      if (error.isAuthError || error.message === '로그인이 필요합니다.') {
        alert('로그인이 필요합니다.');
        window.location.href = '/login';
      } else {
        console.error('좋아요 실패:', error);
        alert('좋아요 처리 중 오류가 발생했습니다.');
      }
    },
  });
};

// 댓글 목록 조회 (로그인 없이도 접근 가능)
export const useComments = (boardId) => {
  return useQuery({
    queryKey: ['comments', boardId],
    queryFn: async () => {
      console.log('댓글 목록 조회 요청:', { boardId });

      try {
        const response = await apiInstance.get(
          `/home/boards/${boardId}/comments`
        );
        console.log('댓글 목록 조회 성공:', response.data);
        return response.data;
      } catch (error) {
        console.error(
          '댓글 목록 조회 실패:',
          error.response?.status,
          error.message
        );

        // 401 에러인 경우 비로그인 상태로 처리
        if (error.isAuthError) {
          try {
            const publicResponse = await axios.get(
              `${BASE_URL}/home/boards/${boardId}/comments`
            );
            console.log('비로그인 상태로 댓글 조회 성공:', publicResponse.data);
            return publicResponse.data;
          } catch (publicError) {
            console.error('비로그인 상태 댓글 조회도 실패:', publicError);
            // 댓글 조회 실패 시 빈 배열 반환
            return [];
          }
        }

        // 다른 에러의 경우 빈 배열 반환
        return [];
      }
    },
    enabled: !!boardId,
    staleTime: 1000 * 60 * 2,
    retry: (failureCount, error) => {
      if (error?.isAuthError) return false;
      return failureCount < 2;
    },
  });
};

// 댓글 작성 (로그인 필요)
export const useCreateComment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ boardId, content }) => {
      const token = validateAndCleanToken();
      if (!token) {
        throw new Error('로그인이 필요합니다.');
      }

      const response = await apiInstance.post(
        `/home/boards/${boardId}/comments`,
        {
          content,
        }
      );
      return response.data;
    },
    onSuccess: (data, { boardId }) => {
      queryClient.invalidateQueries(['comments', boardId]);
      queryClient.invalidateQueries(['boardDetail', boardId]);
    },
    onError: (error) => {
      if (error.isAuthError || error.message === '로그인이 필요합니다.') {
        alert('로그인이 필요합니다.');
        window.location.href = '/login';
      } else {
        console.error('댓글 작성 실패:', error);
        alert('댓글 작성 중 오류가 발생했습니다.');
      }
    },
  });
};

// 댓글 좋아요 (로그인 필요)
export const useLikeComment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ boardId, commentId }) => {
      const token = validateAndCleanToken();
      if (!token) {
        throw new Error('로그인이 필요합니다.');
      }

      const response = await apiInstance.post(
        `/home/boards/${boardId}/comments/${commentId}/likes`,
        {}
      );
      return response.data;
    },
    onSuccess: (data, { boardId }) => {
      queryClient.invalidateQueries(['comments', boardId]);
    },
    onError: (error) => {
      if (error.isAuthError || error.message === '로그인이 필요합니다.') {
        alert('로그인이 필요합니다.');
        window.location.href = '/login';
      } else {
        console.error('댓글 좋아요 실패:', error);
      }
    },
  });
};
