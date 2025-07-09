import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

const BASE_URL = 'http://eridanus.econo.mooo.com:8080';

// 백엔드 검색 API
export const useBackendSearchPosts = (searchQuery, options = {}) => {
  return useQuery({
    queryKey: ['backendSearchPosts', searchQuery, options],
    queryFn: async () => {
      const params = new URLSearchParams();

      // 검색어가 있을 때만 검색 파라미터 추가
      if (searchQuery?.trim()) {
        // 검색 타입에 따라 다른 파라미터 설정
        switch (options.searchType) {
          case 'title':
            params.append('title', searchQuery.trim());
            break;
          case 'content':
            params.append('content', searchQuery.trim());
            break;
          case 'titleAndContent':
            // 제목+내용 검색의 경우
            params.append('title', searchQuery.trim());
            params.append('content', searchQuery.trim());
            break;
          case 'author':
            params.append('authorName', searchQuery.trim());
            break;
          default:
            // 기본값: 제목+내용 검색
            params.append('title', searchQuery.trim());
            params.append('content', searchQuery.trim());
        }
      }

      // 기간 옵션
      const period = options.period || 'daily';
      params.append('period', period);

      // 정렬 옵션
      const sort = options.sort || 'createdAt';
      const direction = options.direction || 'desc';
      params.append('sort', sort);
      params.append('direction', direction);

      // 카테고리 옵션
      if (options.category && options.category !== 'all') {
        params.append('categories', options.category.toLowerCase());
      }

      // 위치 기반 검색 옵션
      if (options.location) {
        if (options.location.latitude) {
          params.append('location.latitude', options.location.latitude);
        }
        if (options.location.longitude) {
          params.append('location.longitude', options.location.longitude);
        }
        if (options.location.distanceInMeters) {
          params.append(
            'location.distanceInMeters',
            options.location.distanceInMeters
          );
        }
      }

      // 페이징 옵션
      if (options.size && options.size > 0) {
        params.append('size', options.size);
      }
      if (options.page !== undefined && options.page >= 1) {
        params.append('page', options.page);
      }

      console.log(
        '백엔드 검색 API 요청:',
        `${BASE_URL}/home?${params.toString()}`
      );

      const response = await axios.get(`${BASE_URL}/home?${params.toString()}`);

      console.log('백엔드 검색 API 응답:', response.data);

      return response.data;
    },
    enabled: true,
    staleTime: 1000 * 60 * 5,
    retry: 2,
  });
};
