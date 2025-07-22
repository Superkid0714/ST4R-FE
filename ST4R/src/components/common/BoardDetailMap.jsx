import { useEffect, useRef, useState } from 'react';
import {
  loadKakaoMapScript,
  safeKakaoAccess,
  checkKakaoMapStatus,
} from '../../utils/kakaoMapLoader';

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
        console.log('BoardDetailMap 초기화 시작');

        // 새로운 카카오 맵 로더 사용
        const kakao = await loadKakaoMapScript();
        console.log('카카오 맵 로드 완료');

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
        console.log('BoardDetailMap 초기화 완료');
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
        } catch (e) {
          console.log('마커 정리 중 에러:', e);
        }
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
          <div className="text-center p-4">
            <div className="text-red-400 text-sm mb-2">
              지도를 불러올 수 없습니다
            </div>
            <div className="text-xs text-gray-500 mb-3">{mapError}</div>

            <div className="flex flex-col gap-2">
              <button
                onClick={() => window.location.reload()}
                className="px-3 py-2 bg-yellow-500 text-black rounded text-xs hover:bg-yellow-400"
              >
                새로고침
              </button>

              {/* 디버그 정보 */}
              <details className="text-left">
                <summary className="cursor-pointer text-xs text-gray-400">
                  상태 정보
                </summary>
                <pre className="text-xs text-gray-500 mt-2">
                  도메인: {window.location.hostname}
                  {'\n'}상태: {JSON.stringify(checkKakaoMapStatus(), null, 2)}
                </pre>
              </details>
            </div>
          </div>
        </div>
      ) : !mapLoaded ? (
        <div className="w-full h-48 bg-gray-800 rounded-lg flex items-center justify-center">
          <div className="flex flex-col items-center">
            <div className="w-6 h-6 border-2 border-yellow-500 border-t-transparent rounded-full animate-spin mb-2"></div>
            <span className="text-sm text-gray-400">지도 로딩 중...</span>
            <div className="mt-1 text-xs text-gray-500">
              {checkKakaoMapStatus().retryCount > 0 && (
                <span>재시도 중... ({checkKakaoMapStatus().retryCount}/3)</span>
              )}
            </div>
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
