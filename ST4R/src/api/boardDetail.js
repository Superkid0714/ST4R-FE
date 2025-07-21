import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
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

// 게시글 좋아요 토글 - 409 에러 처리 개선
export const useLikeBoard = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (boardId) => {
      const token = validateAndCleanToken();
      if (!token) {
        throw new Error('로그인이 필요합니다.');
      }

      console.log('좋아요 요청 시작:', boardId);

      try {
        // 좋아요 API 호출
        const response = await apiInstance.post(
          `/home/boards/${boardId}/likes`,
          {}
        );
        console.log('좋아요 요청 성공:', response.data);
        return response.data;
      } catch (error) {
        // 409 Conflict 에러는 이미 좋아요한 상태에서 다시 좋아요를 시도할 때 발생
        if (error.response?.status === 409) {
          console.log('409 에러 감지 - 좋아요 취소 시도');

          try {
            // 좋아요 취소 API 호출 (DELETE 방식)
            const deleteResponse = await apiInstance.delete(
              `/home/boards/${boardId}/likes`
            );
            console.log('좋아요 취소 성공:', deleteResponse.data);
            return { action: 'unlike', data: deleteResponse.data };
          } catch (deleteError) {
            console.error('좋아요 취소 실패:', deleteError);

            // DELETE 엔드포인트가 없는 경우, 다시 POST로 토글 시도
            if (
              deleteError.response?.status === 404 ||
              deleteError.response?.status === 405
            ) {
              console.log('DELETE 엔드포인트 없음 - POST로 토글 시도');

              // 백엔드가 POST 요청으로 토글을 지원하는지 확인
              // 409 에러가 나는 것은 이미 좋아요한 상태이므로,
              // 게시글 상태를 새로고침하여 현재 상태를 확인
              const currentPostResponse = await apiInstance.get(
                `/home/boards/${boardId}`
              );
              const currentPost = currentPostResponse.data;

              return {
                action: 'refresh',
                liked: currentPost.liked,
                likeCount: currentPost.likeCount,
              };
            }

            throw deleteError;
          }
        }

        throw error;
      }
    },
    onMutate: async (boardId) => {
      // 낙관적 업데이트를 위해 현재 쿼리 취소
      await queryClient.cancelQueries(['boardDetail', boardId]);

      // 이전 데이터 백업
      const previousBoardDetail = queryClient.getQueryData([
        'boardDetail',
        boardId,
      ]);

      // 낙관적 업데이트: 좋아요 상태 토글
      queryClient.setQueryData(['boardDetail', boardId], (old) => {
        if (!old) return old;

        const newLiked = !old.liked;
        const newLikeCount = newLiked
          ? (old.likeCount || 0) + 1
          : Math.max(0, (old.likeCount || 0) - 1);

        console.log('낙관적 업데이트:', {
          이전: { liked: old.liked, likeCount: old.likeCount },
          변경: { liked: newLiked, likeCount: newLikeCount },
        });

        return {
          ...old,
          liked: newLiked,
          likeCount: newLikeCount,
        };
      });

      return { previousBoardDetail };
    },
    onSuccess: (data, boardId) => {
      console.log('좋아요 토글 성공:', data);

      // 서버 응답에 따라 상태 업데이트
      if (data?.action === 'refresh') {
        // 서버에서 현재 상태를 받아온 경우
        queryClient.setQueryData(['boardDetail', boardId], (old) => {
          if (!old) return old;
          return {
            ...old,
            liked: data.liked,
            likeCount: data.likeCount,
          };
        });
      } else {
        // 일반적인 경우 게시글 정보 새로고침
        queryClient.invalidateQueries(['boardDetail', boardId]);
      }

      // 게시글 목록도 새로고침
      queryClient.invalidateQueries(['posts']);
    },
    onError: (error, boardId, context) => {
      console.error('좋아요 토글 실패:', error);

      // 에러 발생 시 이전 상태로 롤백
      if (context?.previousBoardDetail) {
        queryClient.setQueryData(
          ['boardDetail', boardId],
          context.previousBoardDetail
        );
      }

      if (error.isAuthError || error.message === '로그인이 필요합니다.') {
        alert('로그인이 필요합니다.');
        window.location.href = '/login';
      } else {
        console.error('좋아요 처리 중 예상치 못한 오류:', error);

        // 다른 에러의 경우 게시글 정보를 새로고침하여 정확한 상태 동기화
        queryClient.invalidateQueries(['boardDetail', boardId]);

        // 사용자에게는 간단한 메시지만 표시
        alert('잠시 후 다시 시도해주세요.');
      }
    },
  });
};

// 댓글 목록 조회 - 개선된 에러 처리
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

        // 500 에러 등 서버 에러의 경우 빈 배열 반환
        if (error.response?.status >= 500) {
          console.log('서버 에러로 인해 빈 댓글 목록 반환');
          return [];
        }

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
            // 공개 조회도 실패하면 빈 배열 반환
            if (publicError.response?.status >= 500) {
              return [];
            }
            return [];
          }
        }

        // 기타 에러의 경우도 빈 배열 반환하여 앱이 크래시되지 않도록 함
        return [];
      }
    },
    enabled: !!boardId,
    staleTime: 1000 * 60 * 2,
    retry: (failureCount, error) => {
      // 500 에러는 재시도하지 않음
      if (error?.response?.status >= 500) return false;
      if (error?.isAuthError) return false;
      return failureCount < 1; // 1회만 재시도
    },
    // 에러가 발생해도 빈 배열을 반환하도록 설정
    onError: (error) => {
      console.log('댓글 조회 에러, 빈 배열로 처리:', error.message);
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
      } else if (error.response?.status >= 500) {
        alert(
          '서버 오류로 댓글 작성에 실패했습니다. 잠시 후 다시 시도해주세요.'
        );
      } else {
        alert('댓글 작성 중 오류가 발생했습니다.');
      }
    },
  });
};

// 댓글 수정
export const useUpdateComment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ boardId, commentId, content }) => {
      const token = validateAndCleanToken();
      if (!token) {
        throw new Error('로그인이 필요합니다.');
      }

      console.log('댓글 수정 요청:', { boardId, commentId, content });

      const commentData = {
        content: content.trim(),
      };

      const response = await apiInstance.put(
        `/home/boards/${boardId}/comments/${commentId}`,
        commentData
      );

      console.log('댓글 수정 성공:', response.data);
      return response.data;
    },
    onSuccess: (data, { boardId }) => {
      console.log('댓글 수정 완료, 목록 새로고침');
      queryClient.invalidateQueries(['comments', boardId]);
      queryClient.invalidateQueries(['boardDetail', boardId]);
    },
    onError: (error, { boardId }) => {
      console.error('댓글 수정 실패:', error);

      if (error.isAuthError || error.message === '로그인이 필요합니다.') {
        alert('로그인이 필요합니다.');
        window.location.href = '/login';
      } else if (error.response?.status === 403) {
        alert('댓글 수정 권한이 없습니다.');
      } else if (error.response?.status === 400) {
        console.error('댓글 수정 400 에러:', error.response?.data);
        alert('댓글 내용을 확인해주세요.');
      } else if (error.response?.status >= 500) {
        alert(
          '서버 오류로 댓글 수정에 실패했습니다. 잠시 후 다시 시도해주세요.'
        );
      } else {
        alert('댓글 수정 중 오류가 발생했습니다.');
      }
    },
  });
};

// 댓글 삭제
export const useDeleteComment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ boardId, commentId }) => {
      const token = validateAndCleanToken();
      if (!token) {
        throw new Error('로그인이 필요합니다.');
      }

      console.log('댓글 삭제 요청:', { boardId, commentId });

      const response = await apiInstance.delete(
        `/home/boards/${boardId}/comments/${commentId}`
      );

      console.log('댓글 삭제 성공:', response.data);
      return { commentId, boardId };
    },
    onMutate: async ({ boardId, commentId }) => {
      // 진행 중인 쿼리들을 취소
      await queryClient.cancelQueries(['comments', boardId]);
      await queryClient.cancelQueries(['boardDetail', boardId]);

      // 이전 데이터 백업
      const previousComments = queryClient.getQueryData(['comments', boardId]);
      const previousBoardDetail = queryClient.getQueryData([
        'boardDetail',
        boardId,
      ]);

      // 낙관적 업데이트: 댓글을 즉시 UI에서 제거
      queryClient.setQueryData(['comments', boardId], (old) => {
        if (!old || !Array.isArray(old)) {
          console.log('댓글 데이터가 배열이 아님:', old);
          return old;
        }
        const filtered = old.filter((comment) => comment.id !== commentId);
        console.log('댓글 삭제 후 남은 댓글 수:', filtered.length);
        return filtered;
      });

      // 게시글의 댓글 수 감소
      queryClient.setQueryData(['boardDetail', boardId], (old) => {
        if (!old) return old;
        const updated = {
          ...old,
          commentCount: Math.max(0, (old.commentCount || 0) - 1),
        };
        console.log(
          '댓글 수 업데이트:',
          old.commentCount,
          '->',
          updated.commentCount
        );
        return updated;
      });

      return { previousComments, previousBoardDetail };
    },
    onSuccess: (data, variables) => {
      console.log('댓글 삭제 성공, 최신 데이터 가져오기');
      // 성공 시 서버에서 최신 데이터 가져오기
      queryClient.invalidateQueries(['comments', variables.boardId]);
      queryClient.invalidateQueries(['boardDetail', variables.boardId]);
    },
    onError: (error, { boardId }, context) => {
      console.error('댓글 삭제 실패:', error);

      // 에러 발생 시 이전 상태로 롤백
      if (context?.previousComments) {
        queryClient.setQueryData(
          ['comments', boardId],
          context.previousComments
        );
      }
      if (context?.previousBoardDetail) {
        queryClient.setQueryData(
          ['boardDetail', boardId],
          context.previousBoardDetail
        );
      }

      if (error.isAuthError || error.message === '로그인이 필요합니다.') {
        alert('로그인이 필요합니다.');
        window.location.href = '/login';
      } else if (error.response?.status === 403) {
        alert('댓글 삭제 권한이 없습니다.');
      } else if (error.response?.status === 404) {
        alert('댓글을 찾을 수 없습니다.');
        // 404인 경우 이미 삭제된 것으로 간주하고 목록 새로고침
        queryClient.invalidateQueries(['comments', boardId]);
        queryClient.invalidateQueries(['boardDetail', boardId]);
      } else if (error.response?.status >= 500) {
        alert(
          '서버 오류로 댓글 삭제에 실패했습니다. 잠시 후 다시 시도해주세요.'
        );
      } else {
        alert('댓글 삭제 중 오류가 발생했습니다.');
      }
    },
  });
};

