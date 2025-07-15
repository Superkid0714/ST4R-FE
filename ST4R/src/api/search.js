import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

const BASE_URL = 'http://eridanus.econo.mooo.com:8080';

// 백엔드 검색 API
export const useBackendSearchPosts = (searchQuery, options = {}) => {
  return useQuery({
    queryKey: ['backendSearchPosts', searchQuery, options],
    queryFn: async () => {
      const params = new URLSearchParams();

      // 검색어가 있을 때만 검색 파라미터 추가 (중복 방지)
      if (searchQuery?.trim()) {
        // 검색 타입에 따라 다른 파라미터 설정 - 중복 제거
        switch (options.searchType) {
          case 'title':
            params.append('title', searchQuery.trim());
            break;
          case 'content':
            params.append('content', searchQuery.trim());
            break;
          case 'titleAndContent':
            // 제목+내용 검색의 경우 하나의 파라미터만 사용
            params.append('query', searchQuery.trim());
            break;
          case 'author':
            params.append('authorName', searchQuery.trim());
            break;
          default:
            // 기본값: 통합 검색
            params.append('query', searchQuery.trim());
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

      // 위치 기반 검색 옵션 - 개선된 처리
      if (options.location) {
        if (options.location.latitude && options.location.longitude) {
          params.append(
            'location.latitude',
            options.location.latitude.toString()
          );
          params.append(
            'location.longitude',
            options.location.longitude.toString()
          );

          // 거리 설정 (기본값: 1000m)
          const distance = options.location.distanceInMeters || 1000;
          params.append('location.distanceInMeters', distance.toString());
        }
      }

      // 페이징 옵션
      if (options.size && options.size > 0) {
        params.append('size', options.size);
      }
      if (options.page !== undefined && options.page >= 1) {
        params.append('page', options.page);
      }

      const requestUrl = `${BASE_URL}/home?${params.toString()}`;
      console.log('검색 API 요청 URL:', requestUrl);

      const response = await axios.get(requestUrl);

      return response.data;
    },
    enabled: true,
    staleTime: 1000 * 60 * 5,
    retry: (failureCount, error) => {
      // 422 에러는 재시도하지 않음
      if (error?.response?.status === 422) {
        console.error(
          '422 에러 발생 - 파라미터 확인 필요:',
          error.response?.data
        );
        return false;
      }
      return failureCount < 2;
    },
    onError: (error) => {
      console.error('검색 API 에러:', error);
      if (error?.response?.status === 422) {
        console.error('422 에러 상세:', error.response?.data);
      }
    },
  });
};

// 지도 검색 전용 API (더 빠른 응답을 위한 별도 hook)
export const useMapSearchPosts = (location, options = {}) => {
  return useQuery({
    queryKey: ['mapSearchPosts', location, options],
    queryFn: async () => {
      if (!location?.latitude || !location?.longitude) {
        return { boardPeeks: { content: [] } };
      }

      const params = new URLSearchParams();

      // 위치 파라미터
      params.append('location.latitude', location.latitude.toString());
      params.append('location.longitude', location.longitude.toString());
      params.append(
        'location.distanceInMeters',
        (location.distanceInMeters || 1000).toString()
      );

      // 기본 정렬 (최신순)
      params.append('sort', options.sort || 'createdAt');
      params.append('direction', options.direction || 'desc');
      params.append('period', options.period || 'daily');

      // 카테고리 필터
      if (options.category && options.category !== 'all') {
        params.append('categories', options.category.toLowerCase());
      }

      // 페이지 크기 제한 (지도 검색은 더 적게)
      params.append('size', options.size || 20);

      const response = await axios.get(`${BASE_URL}/home?${params.toString()}`);
      return response.data;
    },
    enabled: !!(location?.latitude && location?.longitude),
    staleTime: 1000 * 60 * 2, // 2분 캐시
    retry: 1,
  });
};
