import { useState, useRef, useEffect, useCallback } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import BackButton from '../components/common/BackButton';
import {
  loadKakaoMapScript,
  safeKakaoAccess,
  checkKakaoMapStatus,
} from '../utils/kakaoMapLoader';

export default function MapSearchPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const mapContainer = useRef(null);
  const mapRef = useRef(null);
  const markerRef = useRef(null);
  const circleRef = useRef(null);
  const geocoderRef = useRef(null);
  const infowindowRef = useRef(null);
  const [isFirstLoad, setIsFirstLoad] = useState(true);

  // 상태 관리
  const [keyword, setKeyword] = useState('');
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [searchRadius, setSearchRadius] = useState(1000);
  const [placelist, setPlacelist] = useState([]);
  const [showPlaceList, setShowPlaceList] = useState(false);
  const [mapReady, setMapReady] = useState(false);
  const [mapError, setMapError] = useState(null);

  // URL 파라미터에서 초기 값 가져오기
  const initialLat = searchParams.get('lat');
  const initialLng = searchParams.get('lng');
  const initialLocationName = searchParams.get('locationName');
  const initialRoadAddress = searchParams.get('roadAddress');
  const initialRadius = searchParams.get('searchRadius');

  // 첫 로드 시 카카오 맵 강제 리로드
  useEffect(() => {
    if (isFirstLoad) {
      setIsFirstLoad(false);
      // 기존 카카오 스크립트가 있으면 제거
      const existingScript = document.querySelector(
        'script[src*="dapi.kakao.com"]'
      );
      if (existingScript) {
        existingScript.remove();
        if (window.kakao) {
          delete window.kakao;
        }
      }
    }
  }, [isFirstLoad]);

  useEffect(() => {
    if (initialRadius) {
      setSearchRadius(parseInt(initialRadius));
    }
  }, [initialRadius]);

  // 반경에 따른 지도 레벨 계산
  const getMapLevelForRadius = useCallback((radius) => {
    if (radius <= 200) return 4;
    if (radius <= 500) return 5;
    if (radius <= 1000) return 6;
    if (radius <= 2000) return 7;
    if (radius <= 3000) return 8;
    if (radius <= 5000) return 9;
    if (radius <= 7000) return 10;
    return 11;
  }, []);

  // 원 업데이트
  const updateCircle = useCallback(
    (locPosition, radius, kakao) => {
      if (!kakao || !mapRef.current) return;

      try {
        if (circleRef.current) {
          circleRef.current.setMap(null);
        }

        const circle = new kakao.maps.Circle({
          center: locPosition,
          radius: radius,
          strokeWeight: 2,
          strokeColor: '#FFBB02',
          strokeOpacity: 0.8,
          fillColor: '#FFBB02',
          fillOpacity: 0.1,
        });

        circle.setMap(mapRef.current);
        circleRef.current = circle;

        const newLevel = getMapLevelForRadius(radius);
        mapRef.current.setLevel(newLevel);
      } catch (error) {
        console.error('원 업데이트 실패:', error);
      }
    },
    [getMapLevelForRadius]
  );

  // 마커 표시
  const displayMarker = useCallback(
    (locPosition, locationData, radius, kakao) => {
      if (!kakao || !mapRef.current) return;

      try {
        if (markerRef.current) {
          markerRef.current.setPosition(locPosition);
        } else {
          const marker = new kakao.maps.Marker({
            map: mapRef.current,
            position: locPosition,
          });
          markerRef.current = marker;
        }

        mapRef.current.setCenter(locPosition);
        const newLevel = getMapLevelForRadius(radius);
        mapRef.current.setLevel(newLevel);

        setTimeout(() => {
          updateCircle(locPosition, radius, kakao);
        }, 300);

        if (infowindowRef.current && locationData) {
          const radiusText =
            radius >= 1000 ? `${radius / 1000}km` : `${radius}m`;
          const message = `
            <div style="padding: 8px 12px; min-width: 150px; text-align: center;">
              <div style="font-weight: bold; color: #333; margin-bottom: 4px; font-size: 14px;">
                ${locationData.locationName}
              </div>
              <div style="color: #666; font-size: 12px;">
                ${locationData.roadAddress}
              </div>
              <div style="color: #FFBB02; font-size: 11px; margin-top: 4px; font-weight: bold;">
                ${radiusText} 반경
              </div>
            </div>
          `;
          infowindowRef.current.setContent(message);
          infowindowRef.current.open(mapRef.current, markerRef.current);
        }
      } catch (error) {
        console.error('마커 표시 실패:', error);
      }
    },
    [updateCircle, getMapLevelForRadius]
  );

  // 지도 초기화
  useEffect(() => {
    const initMap = async () => {
      try {
        console.log('지도 초기화 시작');

        const kakao = await loadKakaoMapScript();
        console.log('카카오 맵 로드 완료');
        console.log('카카오 맵 상태:', checkKakaoMapStatus());

        if (!mapContainer.current) {
          console.error('맵 컨테이너를 찾을 수 없습니다');
          setMapError('맵 컨테이너를 찾을 수 없습니다');
          return;
        }

        console.log('맵 컨테이너 확인:', {
          exists: !!mapContainer.current,
          width: mapContainer.current.offsetWidth,
          height: mapContainer.current.offsetHeight,
        });

        const defaultLat = initialLat ? parseFloat(initialLat) : 35.1595454;
        const defaultLng = initialLng ? parseFloat(initialLng) : 126.8526012;

        console.log('지도 생성 시작:', { defaultLat, defaultLng });

        // 카카오 맵 객체 확인
        console.log('카카오 맵 상태:', {
          kakao: !!window.kakao,
          maps: !!window.kakao?.maps,
          Map: !!window.kakao?.maps?.Map,
          LatLng: !!window.kakao?.maps?.LatLng,
        });

        try {
          // 먼저 LatLng 생성
          const centerLatLng = new kakao.maps.LatLng(defaultLat, defaultLng);
          console.log('LatLng 생성 성공:', centerLatLng);

          // 지도 옵션
          const mapOptions = {
            center: centerLatLng,
            level: 6,
          };
          console.log('지도 옵션:', mapOptions);

          // 지도 생성
          const map = new kakao.maps.Map(mapContainer.current, mapOptions);
          console.log('지도 객체 생성 성공:', map);

          // 지도 타입 컨트롤 추가
          const mapTypeControl = new kakao.maps.MapTypeControl();
          map.addControl(mapTypeControl, kakao.maps.ControlPosition.TOPRIGHT);

          // 줌 컨트롤 추가
          const zoomControl = new kakao.maps.ZoomControl();
          map.addControl(zoomControl, kakao.maps.ControlPosition.RIGHT);

          const geocoder = new kakao.maps.services.Geocoder();
          const infowindow = new kakao.maps.InfoWindow({ zIndex: 1 });

          mapRef.current = map;
          geocoderRef.current = geocoder;
          infowindowRef.current = infowindow;

          console.log('지도 생성 완료');

          // 지도가 생성된 후 relayout 호출
          setTimeout(() => {
            if (mapRef.current) {
              console.log('지도 relayout 호출');
              mapRef.current.relayout();

              // 지도 중심 재설정
              mapRef.current.setCenter(centerLatLng);
              console.log('지도 중심 재설정 완료');
            }
          }, 500);
        } catch (mapError) {
          console.error('지도 생성 실패:', mapError);
          console.error('에러 상세:', {
            message: mapError.message,
            stack: mapError.stack,
          });
          throw mapError;
        }

        // 초기 위치 설정
        if (initialLat && initialLng) {
          const initLocation = {
            lat: parseFloat(initialLat),
            lng: parseFloat(initialLng),
            locationName: initialLocationName || '선택된 위치',
            roadAddress: initialRoadAddress || '주소 정보 없음',
          };
          setSelectedLocation(initLocation);

          const initPosition = new kakao.maps.LatLng(
            initLocation.lat,
            initLocation.lng
          );
          displayMarker(initPosition, initLocation, searchRadius, kakao);
        }

        // 지도 클릭 이벤트
        kakao.maps.event.addListener(mapRef.current, 'click', (mouseEvent) => {
          const clickedLatLng = mouseEvent.latLng;

          geocoderRef.current.coord2Address(
            clickedLatLng.getLng(),
            clickedLatLng.getLat(),
            (result, status) => {
              if (status === kakao.maps.services.Status.OK) {
                const road = result[0].road_address?.address_name;
                const jibun = result[0].address?.address_name;
                const addressText = road || jibun || '주소 정보 없음';

                const locationData = {
                  lat: clickedLatLng.getLat(),
                  lng: clickedLatLng.getLng(),
                  locationName: '선택한 위치',
                  roadAddress: addressText,
                };

                setSelectedLocation(locationData);
                displayMarker(clickedLatLng, locationData, searchRadius, kakao);
              }
            }
          );
        });

        // 현재 위치 설정 (초기 위치가 없을 때)
        if (!initialLat && !initialLng && navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(
            (position) => {
              const lat = position.coords.latitude;
              const lng = position.coords.longitude;
              const locPosition = new kakao.maps.LatLng(lat, lng);

              geocoderRef.current.coord2Address(lng, lat, (result, status) => {
                const road =
                  status === kakao.maps.services.Status.OK
                    ? result[0].road_address?.address_name
                    : null;
                const jibun =
                  status === kakao.maps.services.Status.OK
                    ? result[0].address?.address_name
                    : null;
                const addressText = road || jibun || '주소 정보 없음';

                const currentLocationData = {
                  lat,
                  lng,
                  locationName: '현재 위치',
                  roadAddress: addressText,
                };

                setSelectedLocation(currentLocationData);
                displayMarker(
                  locPosition,
                  currentLocationData,
                  searchRadius,
                  kakao
                );
              });
            },
            (error) => {
              console.log('현재 위치 조회 실패:', error);
            }
          );
        }

        setMapReady(true);
        console.log('지도 초기화 완료');
      } catch (error) {
        console.error('지도 초기화 실패:', error);
        setMapError(error.message);
      }
    };

    // 타이머로 실행
    const timer = setTimeout(initMap, 0);

    return () => {
      clearTimeout(timer);
      // 정리 작업
      if (markerRef.current) {
        try {
          markerRef.current.setMap(null);
        } catch (e) {}
      }
      if (circleRef.current) {
        try {
          circleRef.current.setMap(null);
        } catch (e) {}
      }
      if (infowindowRef.current) {
        try {
          infowindowRef.current.close();
        } catch (e) {}
      }
    };
  }, []); // 빈 배열로 한 번만 실행

  // 장소 검색
  const searchPlaces = useCallback(() => {
    const kakao = safeKakaoAccess();
    if (!keyword.trim() || !kakao) return;

    try {
      const ps = new kakao.maps.services.Places();
      ps.keywordSearch(keyword, (data, status) => {
        if (status === kakao.maps.services.Status.OK) {
          setPlacelist(data);
          setShowPlaceList(true);
        } else {
          setPlacelist([]);
          setShowPlaceList(false);
        }
      });
    } catch (error) {
      console.error('장소 검색 실패:', error);
      setPlacelist([]);
    }
  }, [keyword]);

  // 장소 선택
  const handlePlaceClick = useCallback(
    (place) => {
      const kakao = safeKakaoAccess();
      if (!kakao) return;

      try {
        const lat = parseFloat(place.y);
        const lng = parseFloat(place.x);
        const locPosition = new kakao.maps.LatLng(lat, lng);

        const locationData = {
          lat,
          lng,
          locationName: place.place_name,
          roadAddress: place.road_address_name || place.address_name,
        };

        setShowPlaceList(false);
        setKeyword('');
        setPlacelist([]);
        setSelectedLocation(locationData);

        displayMarker(locPosition, locationData, searchRadius, kakao);
      } catch (error) {
        console.error('장소 선택 실패:', error);
      }
    },
    [displayMarker, searchRadius]
  );

  // 반경 변경
  const handleRadiusChange = useCallback(
    (newRadius) => {
      setSearchRadius(newRadius);

      const kakao = safeKakaoAccess();
      if (selectedLocation && kakao && mapRef.current) {
        const locPosition = new kakao.maps.LatLng(
          selectedLocation.lat,
          selectedLocation.lng
        );

        mapRef.current.setCenter(locPosition);
        const newLevel = getMapLevelForRadius(newRadius);
        mapRef.current.setLevel(newLevel);

        updateCircle(locPosition, newRadius, kakao);

        if (infowindowRef.current && markerRef.current) {
          const radiusText =
            newRadius >= 1000 ? `${newRadius / 1000}km` : `${newRadius}m`;
          const message = `
            <div style="padding: 8px 12px; min-width: 150px; text-align: center;">
              <div style="font-weight: bold; color: #333; margin-bottom: 4px; font-size: 14px;">
                ${selectedLocation.locationName}
              </div>
              <div style="color: #666; font-size: 12px;">
                ${selectedLocation.roadAddress}
              </div>
              <div style="color: #FFBB02; font-size: 11px; margin-top: 4px; font-weight: bold;">
                ${radiusText} 반경
              </div>
            </div>
          `;
          infowindowRef.current.setContent(message);
          infowindowRef.current.open(mapRef.current, markerRef.current);
        }
      }
    },
    [selectedLocation, getMapLevelForRadius, updateCircle]
  );

  const from = searchParams.get('from') || 'home';

  const handleGoBack = () => {
    if (selectedLocation) {
      const params = new URLSearchParams({
        lat: selectedLocation.lat.toString(),
        lng: selectedLocation.lng.toString(),
        locationName: selectedLocation.locationName,
        roadAddress: selectedLocation.roadAddress,
        searchRadius: searchRadius.toString(),
      });
      navigate(`/${from}?${params.toString()}`);
    } else {
      navigate(`/${from}`);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      searchPlaces();
    }
    if (e.key === 'Escape') {
      setShowPlaceList(false);
      setKeyword('');
    }
  };

  const formatRadius = (radius) => {
    if (radius >= 1000) {
      const km = radius / 1000;
      return km % 1 === 0 ? `${km}km` : `${km.toFixed(1)}km`;
    }
    return `${radius}m`;
  };

  const sliderProgress = ((searchRadius - 100) / (10000 - 100)) * 100;

  return (
    <div className="h-screen bg-black text-white flex flex-col">
      {/* 헤더 */}
      <div className="p-4 flex-shrink-0">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <BackButton />
            <h1 className="text-xl font-bold">
              지도로 {from === 'groups' ? '모임' : '게시글'} 찾기
            </h1>
          </div>
          {selectedLocation && !mapError && (
            <button
              onClick={handleGoBack}
              className="bg-yellow-500 text-black px-4 py-2 rounded-lg font-medium hover:bg-yellow-400 transition-colors"
            >
              적용하기
            </button>
          )}
        </div>

        {/* 검색창 */}
        <div className="relative mb-4">
          <div className="flex space-x-2">
            <input
              type="text"
              placeholder="장소를 검색하세요"
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              onKeyDown={handleKeyDown}
              disabled={!mapReady || mapError}
              className="flex-1 bg-[#1A1A1A] rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-yellow-500 disabled:opacity-50"
            />
            <button
              onClick={searchPlaces}
              disabled={!mapReady || mapError}
              className="bg-yellow-500 text-black px-4 py-3 rounded-lg hover:bg-yellow-400 transition-colors disabled:opacity-50"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </button>
          </div>

          {/* 검색 결과 */}
          {showPlaceList && placelist.length > 0 && (
            <div className="absolute top-full left-0 right-0 bg-[#1A1A1A] border border-gray-700 rounded-lg mt-1 max-h-40 overflow-y-auto z-50">
              {placelist.map((place) => (
                <div
                  key={place.id}
                  onClick={() => handlePlaceClick(place)}
                  className="p-3 hover:bg-[#2A2A2A] transition-colors border-b border-gray-700 last:border-b-0 cursor-pointer"
                >
                  <div className="font-medium text-white">
                    {place.place_name}
                  </div>
                  <div className="text-sm text-gray-400 mt-1">
                    {place.road_address_name || place.address_name}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* 선택된 위치 정보 */}
        {selectedLocation && !mapError && (
          <div className="bg-[#1A1A1A] rounded-xl p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="text-sm text-yellow-500 font-medium">
                선택된 위치
              </div>
              <div className="text-sm font-medium text-yellow-400">
                {formatRadius(searchRadius)} 반경
              </div>
            </div>
            <div className="font-medium text-white mb-1">
              {selectedLocation.locationName}
            </div>
            <div className="text-sm text-gray-400">
              {selectedLocation.roadAddress}
            </div>
          </div>
        )}
      </div>

      {/* 지도 영역 */}
      <div className="flex-1 px-4 pb-2">
        <div className="relative w-full h-full">
          {/* 로딩 오버레이 */}
          {!mapReady && !mapError && (
            <div className="absolute inset-0 bg-[#1A1A1A] rounded-xl flex items-center justify-center z-10">
              <div className="flex flex-col items-center">
                <div className="w-8 h-8 border-2 border-yellow-500 border-t-transparent rounded-full animate-spin mb-2"></div>
                <span className="text-sm text-gray-400">지도 로딩 중...</span>
              </div>
            </div>
          )}

          {/* 에러 표시 */}
          {mapError && (
            <div className="absolute inset-0 bg-[#1A1A1A] rounded-xl flex items-center justify-center z-10">
              <div className="text-center p-4">
                <div className="text-red-400 text-sm mb-2">
                  지도를 불러올 수 없습니다
                </div>
                <div className="text-xs text-gray-500 mb-3">{mapError}</div>
                <button
                  onClick={() => window.location.reload()}
                  className="px-4 py-2 bg-yellow-500 text-black rounded-lg text-sm hover:bg-yellow-400"
                >
                  새로고침
                </button>
              </div>
            </div>
          )}

          {/* 지도 컨테이너 */}
          <div
            ref={mapContainer}
            id="kakao-map-container"
            className="w-full h-full rounded-xl overflow-hidden shadow-lg"
            style={{
              minHeight: '400px',
              height: '100%',
              position: 'relative',
              backgroundColor: '#1a1a1a',
            }}
          />
        </div>
      </div>

      {/* 검색 반경 슬라이더 */}
      <div className="p-4 pt-2 bg-black">
        <div className="bg-[#1A1A1A] rounded-xl p-4">
          <div className="flex items-center justify-between mb-3">
            <div className="text-sm font-medium text-white">검색 반경</div>
            <div className="text-lg font-bold text-yellow-500">
              {formatRadius(searchRadius)}
            </div>
          </div>

          <div className="relative">
            <input
              type="range"
              min="100"
              max="10000"
              step="100"
              value={searchRadius}
              onChange={(e) => handleRadiusChange(parseInt(e.target.value))}
              disabled={!mapReady || mapError}
              className="w-full h-3 bg-gray-700 rounded-lg appearance-none cursor-pointer range-slider disabled:opacity-50"
              style={{
                background: `linear-gradient(to right, #ffbb02 0%, #ffbb02 ${sliderProgress}%, #374151 ${sliderProgress}%, #374151 100%)`,
              }}
            />
            <div className="flex justify-between text-xs text-gray-500 mt-2">
              <span>100m</span>
              <span>1km</span>
              <span>5km</span>
              <span>10km</span>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        /* 카카오 맵 스타일 */
        .kakao-map {
          width: 100% !important;
          height: 100% !important;
        }
        
        /* 카카오 맵 내부 요소들 */
        div[class*="kakao"] {
          max-width: none !important;
        }
        
        .range-slider::-webkit-slider-thumb {
          appearance: none;
          height: 24px;
          width: 24px;
          border-radius: 50%;
          background: #ffbb02;
          cursor: pointer;
          border: 3px solid #000;
          box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
        }

        .range-slider::-moz-range-thumb {
          height: 24px;
          width: 24px;
          border-radius: 50%;
          background: #ffbb02;
          cursor: pointer;
          border: 3px solid #000;
          box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
        }

        .range-slider:focus {
          outline: none;
        }

        .range-slider:focus::-webkit-slider-thumb {
          box-shadow: 0 0 0 4px rgba(255, 187, 2, 0.3);
        }
      `}</style>
    </div>
  );
}
