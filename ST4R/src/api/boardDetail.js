import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';

const BASE_URL = 'http://eridanus.econo.mooo.com:8080';

// 게시글 상세 조회
export const useBoardDetail = (boardId) => {
  return useQuery({
    queryKey: ['boardDetail', boardId],
    queryFn: async () => {
      const response = await axios.get(`${BASE_URL}/home/boards/${boardId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      return response.data;
    },
    enabled: !!boardId, // boardId가 있을 때만 요청
    staleTime: 1000 * 60 * 5, // 5분간 캐시 유지
    retry: 2,
  });
};

// 게시글 좋아요 토글
export const useLikeBoard = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (boardId) => {
      const response = await axios.post(
        `${BASE_URL}/home/boards/${boardId}/like`,
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
        window.location.href = '/login';
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
      const response = await axios.get(
        `${BASE_URL}/home/boards/${boardId}/comments`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );
      return response.data;
    },
    enabled: !!boardId,
    staleTime: 1000 * 60 * 2, // 2분간 캐시 유지
  });
};

// 댓글 작성
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
        window.location.href = '/login';
      } else {
        console.error('댓글 작성 실패:', error);
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
      const response = await axios.post(
        `${BASE_URL}/home/boards/${boardId}/comments/${commentId}/like`,
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
      console.error('댓글 좋아요 실패:', error);
    },
  });
};
