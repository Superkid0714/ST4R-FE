import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

const BASE_URL = 'http://eridanus.econo.mooo.com:8080';

// 게시글 검색 API (추후 백엔드에서 지원 시 활성화)
export const useSearchPosts = (searchQuery, options = {}) => {
  return useQuery({
    queryKey: ['searchPosts', searchQuery, options],
    queryFn: async () => {
      if (!searchQuery?.trim()) {
        return { boardPeeks: { content: [] } };
      }

      const params = new URLSearchParams();

      // 기간 옵션 (필수 파라미터)
      const period = options.period || 'daily';
      params.append('period', period);

      // 정렬 옵션
      const sort = options.sort || 'createdAt';
      const direction = options.direction || 'desc';
      params.append('sort', sort);
      params.append('direction', direction);

      // 페이징 옵션 (1부터 시작)
      if (options.size && options.size > 0) {
        params.append('size', options.size);
      }
      if (options.page !== undefined && options.page >= 1) {
        params.append('page', options.page);
      }

      // 검색어 파라미터 (추후 백엔드에서 지원 시 추가)
      // params.append('query', searchQuery);

      console.log('검색 API 요청:', `${BASE_URL}/home?${params.toString()}`);

      const response = await axios.get(`${BASE_URL}/home?${params.toString()}`);

      // 현재는 검색 기능이 없으므로 전체 결과에서 클라이언트 사이드 필터링
      const allPosts = response.data.boardPeeks?.content || [];
      const filteredPosts = allPosts.filter(
        (post) =>
          post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          post.contentPreview?.toLowerCase().includes(searchQuery.toLowerCase())
      );

      return {
        ...response.data,
        boardPeeks: {
          ...response.data.boardPeeks,
          content: filteredPosts,
        },
      };
    },
    enabled: !!searchQuery?.trim(), // 검색어가 있을 때만 요청
    staleTime: 1000 * 60 * 5, // 5분간 캐시 유지
    retry: 2,
  });
};

// 게시글 목록 조회
export const useGetPosts = (options = {}) => {
  return useQuery({
    queryKey: ['posts', options],
    queryFn: async () => {
      const params = new URLSearchParams();

      // 기간 옵션 (필수 파라미터)
      const period = options.period || 'daily';
      params.append('period', period);

      // 정렬 옵션
      const sort = options.sort || 'createdAt';
      const direction = options.direction || 'desc';
      params.append('sort', sort);
      params.append('direction', direction);

      // 페이징 옵션 (1부터 시작)
      if (options.size && options.size > 0) {
        params.append('size', options.size);
      }
      if (options.page !== undefined && options.page >= 1) {
        params.append('page', options.page);
      }

      console.log('API 요청:', `${BASE_URL}/home?${params.toString()}`);

      const response = await axios.get(`${BASE_URL}/home?${params.toString()}`);

      console.log('API 응답:', response.data);

      return response.data;
    },
    staleTime: 1000 * 60 * 2, // 2분간 캐시 유지
    retry: 2,
  });
};
