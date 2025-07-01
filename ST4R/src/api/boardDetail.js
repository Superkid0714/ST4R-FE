import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';

const BASE_URL = 'http://eridanus.econo.mooo.com:8080';

// 게시글 상세 조회 (로그인 없이도 접근 가능)
export const useBoardDetail = (boardId) => {
  return useQuery({
    queryKey: ['boardDetail', boardId],
    queryFn: async () => {
      const token = localStorage.getItem('token');

      // 헤더 설정: 토큰이 있으면 포함, 없으면 빈 객체
      const config = {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      };

      console.log('게시글 상세 조회 요청:', { boardId, hasToken: !!token });

      try {
        const response = await axios.get(
          `${BASE_URL}/home/boards/${boardId}`,
          config
        );
        console.log('게시글 상세 조회 성공:', response.data);
        return response.data;
      } catch (error) {
        console.error(
          '게시글 상세 조회 실패:',
          error.response?.status,
          error.message
        );
        throw error;
      }
    },
    enabled: !!boardId, // boardId가 있을 때만 요청
    staleTime: 1000 * 60 * 5, // 5분간 캐시 유지
    retry: 2,
  });
};

// 게시글 수정 권한 확인
export const useCheckEditPermission = (boardId) => {
  return useQuery({
    queryKey: ['editPermission', boardId],
    queryFn: async () => {
      const token = localStorage.getItem('token');
      if (!token) return { canEdit: false };

      try {
        const response = await axios.get(
          `${BASE_URL}/home/boards/${boardId}/edit-permission`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        return response.data;
      } catch (error) {
        return { canEdit: false };
      }
    },
    enabled: !!boardId && !!localStorage.getItem('token'),
  });
};

// 게시글 삭제
export const useDeleteBoard = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (boardId) => {
      const response = await axios.delete(
        `${BASE_URL}/home/boards/${boardId}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );
      return response.data;
    },
    onSuccess: () => {
      // 메인 페이지 목록 업데이트
      queryClient.invalidateQueries(['posts']);
      alert('게시글이 삭제되었습니다.');
      window.location.href = '/home';
    },
    onError: (error) => {
      if (error.response?.status === 401) {
        alert('로그인이 필요합니다.');
      } else if (error.response?.status === 403) {
        alert('삭제 권한이 없습니다.');
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
      const response = await axios.post(
        `${BASE_URL}/home/boards/${boardId}/likes`,
        {},
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );
      return response.data;
    },
    onSuccess: (data, boardId) => {
      // 게시글 상세 정보 다시 불러오기
      queryClient.invalidateQueries(['boardDetail', boardId]);
      // 메인 페이지 목록도 업데이트
      queryClient.invalidateQueries(['posts']);
    },
    onError: (error) => {
      if (error.response?.status === 401) {
        alert('로그인이 필요합니다.');
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
      const token = localStorage.getItem('token');

      // 헤더 설정: 토큰이 있으면 포함, 없으면 빈 객체
      const config = {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      };

      console.log('댓글 목록 조회 요청:', { boardId, hasToken: !!token });

      try {
        const response = await axios.get(
          `${BASE_URL}/home/boards/${boardId}/comments`,
          config
        );
        console.log('댓글 목록 조회 성공:', response.data);
        return response.data;
      } catch (error) {
        console.error(
          '댓글 목록 조회 실패:',
          error.response?.status,
          error.message
        );
        // 댓글 조회 실패 시 빈 배열 반환 (페이지는 정상 동작)
        return [];
      }
    },
    enabled: !!boardId,
    staleTime: 1000 * 60 * 2, // 2분간 캐시 유지
  });
};

// 댓글 작성 (로그인 필요)
export const useCreateComment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ boardId, content }) => {
      const response = await axios.post(
        `${BASE_URL}/home/boards/${boardId}/comments`,
        { content },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
            'Content-Type': 'application/json',
          },
        }
      );
      return response.data;
    },
    onSuccess: (data, { boardId }) => {
      // 댓글 목록 다시 불러오기
      queryClient.invalidateQueries(['comments', boardId]);
      // 게시글 상세 정보도 업데이트 (댓글 수 변경)
      queryClient.invalidateQueries(['boardDetail', boardId]);
    },
    onError: (error) => {
      if (error.response?.status === 401) {
        alert('로그인이 필요합니다.');
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
      const response = await axios.post(
        `${BASE_URL}/home/boards/${boardId}/comments/${commentId}/likes`,
        {},
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );
      return response.data;
    },
    onSuccess: (data, { boardId }) => {
      queryClient.invalidateQueries(['comments', boardId]);
    },
    onError: (error) => {
      if (error.response?.status === 401) {
        alert('로그인이 필요합니다.');
      } else {
        console.error('댓글 좋아요 실패:', error);
      }
    },
  });
};
