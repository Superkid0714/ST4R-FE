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

      // 위치 기반 검색 옵션 - 개선된 처리
      if (options.location) {
        console.log('위치 기반 검색 활성화:', options.location);

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

          console.log('위치 검색 파라미터:', {
            latitude: options.location.latitude,
            longitude: options.location.longitude,
            distance: distance,
          });
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
      console.log('백엔드 검색 API 요청:', requestUrl);

      const response = await axios.get(requestUrl);

      console.log('백엔드 검색 API 응답:', response.data);

      return response.data;
    },
    enabled: true,
    staleTime: 1000 * 60 * 5,
    retry: 2,
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

      console.log(
        '지도 검색 API 요청:',
        `${BASE_URL}/home?${params.toString()}`
      );

      const response = await axios.get(`${BASE_URL}/home?${params.toString()}`);
      return response.data;
    },
    enabled: !!(location?.latitude && location?.longitude),
    staleTime: 1000 * 60 * 2, // 2분 캐시
    retry: 1,
  });
};
