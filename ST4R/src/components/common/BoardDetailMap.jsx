import { useEffect, useRef } from 'react';

const { kakao } = window;

export default function BoardDetailMap({ location }) {
  const mapContainer = useRef(null);
  const mapRef = useRef(null);
  const markerRef = useRef(null);

  useEffect(() => {
    if (!location?.marker || !kakao || !mapContainer.current) return;

    const { latitude, longitude, locationName, roadAddress } = location.marker;
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

    // 컴포넌트 언마운트 시 정리
    return () => {
      if (mapRef.current) {
        // 카카오맵 이벤트 정리는 자동으로 처리됨
      }
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
      <div
        ref={mapContainer}
        className="w-full h-48 bg-gray-800 rounded-lg"
        style={{ height: '200px' }}
      />
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
