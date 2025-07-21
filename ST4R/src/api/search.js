import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

const BASE_URL = 'https://eridanus.econo.mooo.com';

export const useBackendSearchPosts = (searchQuery, options = {}) => {
  return useQuery({
    queryKey: ['backendSearchPosts', searchQuery, options],
    queryFn: async () => {
      const params = new URLSearchParams();

      // 검색어 유효성 검사 및 처리
      const trimmedQuery = searchQuery?.trim();

      // 검색어가 있을 때만 검색 파라미터 추가
      if (trimmedQuery) {
        // 검색 타입에 따른 길이 제한 검사
        switch (options.searchType) {
          case 'title':
            // 제목 검색
            if (trimmedQuery.length >= 2) {
              params.append('title', trimmedQuery);
            } else {
              // 검색어가 너무 짧으면 빈 결과 반환
              return { boardPeeks: { content: [] } };
            }
            break;
          case 'content':
            // 내용 검색
            if (trimmedQuery.length >= 2 && trimmedQuery.length <= 5000) {
              params.append('content', trimmedQuery);
            } else {
              // 길이 제한에 맞지 않으면 에러 표시
              if (trimmedQuery.length < 2) {
                throw new Error('내용 검색은 2자 이상 입력해주세요.');
              } else if (trimmedQuery.length > 5000) {
                throw new Error('내용 검색은 5000자 이하로 입력해주세요.');
              }
              return { boardPeeks: { content: [] } };
            }
            break;
          case 'titleAndContent':
            // 제목+내용 검색
            if (trimmedQuery.length >= 2) {
              params.append('title', trimmedQuery);
              params.append('content', trimmedQuery);
            } else {
              return { boardPeeks: { content: [] } };
            }
            break;
          case 'author':
            // 작성자 검색
            if (trimmedQuery.length >= 2) {
              params.append('authorName', trimmedQuery);
            } else {
              return { boardPeeks: { content: [] } };
            }
            break;
          default:
            // 기본값
            if (trimmedQuery.length >= 2) {
              params.append('title', trimmedQuery);
              params.append('content', trimmedQuery);
            } else {
              return { boardPeeks: { content: [] } };
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

      // 카테고리 옵션
      if (options.category && options.category !== 'all') {
        params.append('categories', options.category.toLowerCase());
      }

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

          console.log('위치 검색 파라미터:', {
            'location.latitude': options.location.latitude,
            'location.longitude': options.location.longitude,
            'location.distanceInMeters': distance,
            'location.roadAddress': options.location.roadAddress,
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
      console.log('검색 API 요청 URL:', requestUrl);

      const response = await axios.get(requestUrl);
      return response.data;
    },
    // 검색어나 위치 검색이 있을 때만 쿼리 실행
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
      // 400 에러 (위치 검색 관련)도 재시도하지 않음
      if (error?.response?.status === 400) {
        console.error(
          '400 에러 발생 - 위치 파라미터 확인 필요:',
          error.response?.data
        );
        return false;
      }
      // 사용자 입력 오류는 재시도하지 않음
      if (
        error?.message?.includes('자 이상') ||
        error?.message?.includes('자 이하')
      ) {
        return false;
      }
      return failureCount < 2;
    },
    onError: (error) => {
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

// 지도 검색 전용 API
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

      // 도로명 주소 추가
      if (location.roadAddress) {
        params.append('location.roadAddress', location.roadAddress);
      }

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

