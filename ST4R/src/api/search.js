import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

const BASE_URL = 'http://eridanus.econo.mooo.com:8080';

// 게시글 검색 API (클라이언트 사이드 검색 - 백엔드 지원 시까지)
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

      // 카테고리 옵션
      if (options.category && options.category !== 'all') {
        params.append('category', options.category);
      }

      // 더 많은 게시글을 한 번에 가져오기
      params.append('size', options.size || 10); // 기본 10개
      if (options.page !== undefined && options.page >= 1) {
        params.append('page', options.page);
      }

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

// 게시글 목록 조회 (다양한 크기로 시도)
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

      // 카테고리 옵션 (백엔드에서 지원)
      if (options.category && options.category !== 'all') {
        params.append('category', options.category);
      }

      // 다양한 size 파라미터 시도
      const size = options.size || 20; // 기본값을 20으로 증가
      params.append('size', size);

      // limit 파라미터도 함께 시도 (백엔드가 다른 이름을 쓸 수도 있음)
      params.append('limit', size);

      // count 파라미터도 시도
      params.append('count', size);

      // 페이지 번호 (0부터 시작하는 경우도 시도)
      const page = options.page || 0; // 0부터 시작으로 변경
      params.append('page', page);

      console.log(
        'API 요청 (다양한 파라미터):',
        `${BASE_URL}/home?${params.toString()}`
      );
      console.log('요청한 게시글 수:', size);

      const response = await axios.get(`${BASE_URL}/home?${params.toString()}`);

      console.log('API 응답:', response.data);
      console.log(
        '받은 게시글 수:',
        response.data.boardPeeks?.content?.length || 0
      );
      console.log(
        '총 게시글 수:',
        response.data.boardPeeks?.totalElements || 0
      );
      console.log(
        '현재 페이지:',
        response.data.boardPeeks?.pageable?.pageNumber
      );
      console.log('페이지 크기:', response.data.boardPeeks?.pageable?.pageSize);
      console.log('전체 페이지 수:', response.data.boardPeeks?.totalPages);

      return response.data;
    },
    staleTime: 1000 * 60 * 2, // 2분간 캐시 유지
    retry: 2,
  });
};
