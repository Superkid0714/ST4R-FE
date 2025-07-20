import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

const BASE_URL = 'http://eridanus.econo.mooo.com:8080';

// 게시글 검색 API (클라이언트 사이드 검색 - 백엔드 지원 시까지)
export const useSearchGroups = (searchQuery, options = {}) => {
  return useQuery({
    queryKey: ['searchGroups', searchQuery, options],
    queryFn: async () => {
      const params = new URLSearchParams();

      // 검색어 유효성 검사 및 처리
      const trimmedQuery = searchQuery?.trim();

      // 검색어가 있을 때만 검색 파라미터 추가
      if (trimmedQuery) {
        // 검색 타입에 따른 길이 제한 검사
        switch (options.searchType) {
          case 'leaderName':
            // 모임장 검색
            if (trimmedQuery.length >= 2) {
              params.append('leaderName', trimmedQuery);
            } else {
              return { content: [] };
            }
            break;
          default:
            // 제목 검색
            if (trimmedQuery.length >= 2) {
              params.append('name', trimmedQuery);
            } else {
              return { content: [] };
            }
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

      // 위치 기반 검색 옵션
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

          // 도로명 주소 추가
          if (options.location.roadAddress) {
            params.append('location.roadAddress', options.location.roadAddress);
          }
        }
      }

      if (options.meetBetween) {
        params.append(
            'meetBetweenStart',
            options.meetBetween.start
          );
        params.append(
          'meetBetweenEnd',
          options.meetBetween.end
        );
      }

      // 페이징 옵션
      if (options.size && options.size > 0) {
        params.append('size', options.size);
      }
      if (options.page !== undefined && options.page >= 0) {
        params.append('page', options.page);
      }

      //검색 요청
      const requestUrl = `${BASE_URL}/groups?${params.toString()}`;

      const response = await axios.get(requestUrl);
      return response.data;
    },
    enabled: true,
    staleTime: 1000 * 60 * 5,
    onerror: (error) => {
      console.error('검색 API 에러:', error);
      if (error?.response?.status === 422) {
        console.error('422 에러 상세:', error.response?.data);
      }
      if (error?.response?.status === 400) {
        console.error('400 에러 상세:', error.response?.data);
        console.error('요청 URL:', error.config?.url);
      }
    },
  });
};
