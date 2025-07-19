import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

const BASE_URL = 'http://eridanus.econo.mooo.com:8080';

// 날씨 정보 조회 API
export const useWeather = (latitude, longitude, enabled = true) => {
  return useQuery({
    queryKey: ['weather', latitude, longitude],
    queryFn: async () => {
      if (!latitude || !longitude) {
        throw new Error('위치 정보가 필요합니다.');
      }

      console.log('날씨 API 요청:', { latitude, longitude });

      const response = await axios.get(`${BASE_URL}/home/weather`, {
        params: {
          latitude,
          longitude,
        },
      });

      console.log('날씨 API 응답:', response.data);
      return response.data;
    },
    enabled: enabled && !!latitude && !!longitude,
    staleTime: 1000 * 60 * 10, // 10분간 캐시 유지 (날씨는 자주 변하지 않음)
    retry: 2,
    onError: (error) => {
      console.error('날씨 정보 조회 실패:', error);
    },
  });
};

// 날씨 상태를 한글로 변환하는 함수
export const getWeatherKorean = (weatherEnum) => {
  const weatherMap = {
    THUNDERSTORM: '천둥번개',
    DRIZZLE: '이슬비',
    RAIN: '비',
    SNOW: '눈',
    MIST: '안개',
    SQUALL: '돌풍',
    TORNADO: '토네이도',
    CLEAR: '맑음',
    PARTLY_CLOUDY: '부분적으로 흐림',
    CLOUDY: '흐림',
    ICE_RAIN: '어는 비',
  };

  return weatherMap[weatherEnum] || '알 수 없음';
};

// 날씨 상태에 따른 아이콘을 반환하는 함수
export const getWeatherIcon = (weatherEnum) => {
  const iconMap = {
    THUNDERSTORM: '⛈️',
    DRIZZLE: '🌦️',
    RAIN: '🌧️',
    SNOW: '❄️',
    MIST: '🌫️',
    SQUALL: '💨',
    TORNADO: '🌪️',
    CLEAR: '☀️',
    PARTLY_CLOUDY: '⛅',
    CLOUDY: '☁️',
    ICE_RAIN: '🌨️',
  };

  return iconMap[weatherEnum] || '🌤️';
};

// 위치 정보를 가져오는 훅
export const useGeolocation = () => {
  return useQuery({
    queryKey: ['geolocation'],
    queryFn: () => {
      return new Promise((resolve, reject) => {
        if (!navigator.geolocation) {
          reject(new Error('Geolocation is not supported'));
          return;
        }

        navigator.geolocation.getCurrentPosition(
          (position) => {
            resolve({
              latitude: position.coords.latitude,
              longitude: position.coords.longitude,
            });
          },
          (error) => {
            console.error('위치 정보 조회 실패:', error);
            // 기본 위치 (광주광역시)로 설정
            resolve({
              latitude: 35.1595454,
              longitude: 126.8526012,
            });
          },
          {
            timeout: 10000,
            maximumAge: 1000 * 60 * 5, // 5분간 캐시된 위치 사용
          }
        );
      });
    },
    staleTime: 1000 * 60 * 10, // 10분간 캐시 유지
    retry: 1,
  });
};
