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

// 게시글 상세 조회
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

        if (error.isAuthError) {
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
      if (error?.isAuthError) return false;
      return failureCount < 2;
    },
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

// 게시글 좋아요 토글 - 개선된 버전
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
    onError: (error, boardId) => {
      if (error.isAuthError || error.message === '로그인이 필요합니다.') {
        alert('로그인이 필요합니다.');
        window.location.href = '/login';
      } else if (error.response?.status === 409) {
        // 409 에러는 이미 좋아요를 누른 상태이므로 특별 처리하지 않음
        console.log('이미 좋아요를 누른 게시글입니다.');
        // 게시글 정보를 다시 불러와서 최신 상태로 업데이트
        queryClient.invalidateQueries(['boardDetail', boardId]);
      } else {
        console.error('좋아요 실패:', error);
        alert('좋아요 처리 중 오류가 발생했습니다.');
      }
    },
  });
};

// 댓글 목록 조회
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

        // 백엔드 응답 구조에 맞게 처리
        if (response.data.content) {
          return response.data.content; // 페이징된 응답의 경우
        }
        return response.data; // 배열로 직접 온 경우
      } catch (error) {
        console.error(
          '댓글 목록 조회 실패:',
          error.response?.status,
          error.message
        );

        if (error.isAuthError) {
          try {
            const publicResponse = await axios.get(
              `${BASE_URL}/home/boards/${boardId}/comments`
            );
            console.log('비로그인 상태로 댓글 조회 성공:', publicResponse.data);

            if (publicResponse.data.content) {
              return publicResponse.data.content;
            }
            return publicResponse.data;
          } catch (publicError) {
            console.error('비로그인 상태 댓글 조회도 실패:', publicError);
            return [];
          }
        }

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

// 댓글 작성 - 개선된 버전
export const useCreateComment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ boardId, content }) => {
      const token = validateAndCleanToken();
      if (!token) {
        throw new Error('로그인이 필요합니다.');
      }

      console.log('댓글 작성 요청:', { boardId, content });

      // 댓글 데이터 형식 확인
      const commentData = {
        content: content.trim(),
      };

      const response = await apiInstance.post(
        `/home/boards/${boardId}/comments`,
        commentData
      );

      console.log('댓글 작성 성공:', response.data);
      return response.data;
    },
    onSuccess: (data, { boardId }) => {
      console.log('댓글 작성 완료, 목록 새로고침');
      queryClient.invalidateQueries(['comments', boardId]);
      queryClient.invalidateQueries(['boardDetail', boardId]);
    },
    onError: (error, { boardId }) => {
      console.error('댓글 작성 실패:', error);

      if (error.isAuthError || error.message === '로그인이 필요합니다.') {
        alert('로그인이 필요합니다.');
        window.location.href = '/login';
      } else if (error.response?.status === 400) {
        console.error('댓글 작성 400 에러:', error.response?.data);
        alert('댓글 내용을 확인해주세요.');
      } else {
        alert('댓글 작성 중 오류가 발생했습니다.');
      }
    },
  });
};

// 댓글 좋아요
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
      } else if (error.response?.status === 409) {
        console.log('이미 좋아요를 누른 댓글입니다.');
      } else {
        console.error('댓글 좋아요 실패:', error);
      }
    },
  });
};
