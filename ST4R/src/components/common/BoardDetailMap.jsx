import { useEffect, useRef, useState } from 'react';

// 카카오 맵 안전 접근 함수
const safeKakaoAccess = () => {
  try {
    return typeof window !== 'undefined' &&
      window.kakao &&
      window.kakao.maps &&
      typeof window.kakao.maps.Map === 'function'
      ? window.kakao
      : null;
  } catch (error) {
    console.error('카카오 맵 접근 실패:', error);
    return null;
  }
};

export default function BoardDetailMap({ location }) {
  const mapContainer = useRef(null);
  const mapRef = useRef(null);
  const markerRef = useRef(null);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [mapError, setMapError] = useState(null);

  useEffect(() => {
    if (!location?.marker || !mapContainer.current) return;

    const initMap = async () => {
      try {
        // 카카오 맵이 로드될 때까지 대기
        let kakao = safeKakaoAccess();
        let attempts = 0;
        const maxAttempts = 50; // 5초 대기

        while (!kakao && attempts < maxAttempts) {
          await new Promise((resolve) => setTimeout(resolve, 100));
          kakao = safeKakaoAccess();
          attempts++;
        }

        if (!kakao) {
          throw new Error('카카오 맵을 불러올 수 없습니다');
        }

        const { latitude, longitude, locationName, roadAddress } =
          location.marker;
        const zoomLevel = location.zoomLevel || 3;

        // 지도 옵션
        const options = {
          center: new kakao.maps.LatLng(latitude, longitude),
          level: zoomLevel,
        };

        // 지도 생성
        const map = new kakao.maps.Map(mapContainer.current, options);
        mapRef.current = map;

        // 마커 생성
        const markerPosition = new kakao.maps.LatLng(latitude, longitude);
        const marker = new kakao.maps.Marker({
          position: markerPosition,
        });
        marker.setMap(map);
        markerRef.current = marker;

        // 인포윈도우 생성
        const infowindowContent = `
          <div style="padding: 8px 12px; min-width: 150px;">
            <div style="font-weight: bold; color: #333; margin-bottom: 4px; font-size: 14px;">
              ${locationName || '위치 정보'}
            </div>
            <div style="color: #666; font-size: 12px; line-height: 1.4;">
              ${roadAddress || '주소 정보 없음'}
            </div>
          </div>
        `;

        const infowindow = new kakao.maps.InfoWindow({
          content: infowindowContent,
        });

        // 마커 클릭 이벤트
        kakao.maps.event.addListener(marker, 'click', () => {
          infowindow.open(map, marker);
        });

        // 지도 클릭 이벤트 (인포윈도우 닫기)
        kakao.maps.event.addListener(map, 'click', () => {
          infowindow.close();
        });

        setMapLoaded(true);
        setMapError(null);
      } catch (error) {
        console.error('지도 초기화 실패:', error);
        setMapError(error.message);
        setMapLoaded(false);
      }
    };

    initMap();

    // 컴포넌트 언마운트 시 정리
    return () => {
      if (markerRef.current) {
        try {
          markerRef.current.setMap(null);
        } catch (e) {}
        markerRef.current = null;
      }
      mapRef.current = null;
    };
  }, [location]);

  if (!location?.marker) {
    return (
      <div className="w-full h-48 bg-gray-800 rounded-lg flex items-center justify-center">
        <div className="text-center">
          <svg
            className="w-12 h-12 text-gray-500 mx-auto mb-2"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
            />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
            />
          </svg>
          <p className="text-gray-400 text-sm">위치 정보 없음</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full">
      {mapError ? (
        <div className="w-full h-48 bg-gray-800 rounded-lg flex items-center justify-center">
          <div className="text-center">
            <div className="text-red-400 text-sm mb-2">
              지도를 불러올 수 없습니다
            </div>
            <div className="text-xs text-gray-500">{mapError}</div>
          </div>
        </div>
      ) : !mapLoaded ? (
        <div className="w-full h-48 bg-gray-800 rounded-lg flex items-center justify-center">
          <div className="flex flex-col items-center">
            <div className="w-6 h-6 border-2 border-yellow-500 border-t-transparent rounded-full animate-spin mb-2"></div>
            <span className="text-sm text-gray-400">지도 로딩 중...</span>
          </div>
        </div>
      ) : (
        <div
          ref={mapContainer}
          className="w-full h-48 bg-gray-800 rounded-lg"
          style={{ height: '200px' }}
        />
      )}

      <div className="mt-3 text-sm">
        <p className="font-medium text-white flex items-center">
          <svg
            className="w-4 h-4 mr-2 text-yellow-500"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
            />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
            />
          </svg>
          {location.marker.locationName}
        </p>
        <p className="text-gray-400 ml-6">{location.marker.roadAddress}</p>
      </div>
    </div>
  );
}
