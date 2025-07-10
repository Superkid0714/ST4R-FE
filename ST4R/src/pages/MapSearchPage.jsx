import { useState, useRef, useEffect, useCallback } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import BackButton from '../components/common/BackButton';

const { kakao } = window;

export default function MapSearchPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const mapContainer = useRef(null);
  const mapRef = useRef(null);
  const markerRef = useRef(null);
  const circleRef = useRef(null);
  const geocoderRef = useRef(null);
  const infowindowRef = useRef(null);

  // 상태 관리
  const [keyword, setKeyword] = useState('');
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [searchRadius, setSearchRadius] = useState(1000);
  const [placelist, setPlacelist] = useState([]);
  const [showPlaceList, setShowPlaceList] = useState(false);

  // URL 파라미터에서 초기 위치 정보 가져오기
  const initialLat = searchParams.get('lat');
  const initialLng = searchParams.get('lng');
  const initialLocationName = searchParams.get('locationName');
  const initialRoadAddress = searchParams.get('roadAddress');

  // 원만 업데이트하는 별도 함수
  const updateCircle = useCallback((locPosition, radius) => {
    const map = mapRef.current;

    // 기존 원 제거
    if (circleRef.current) {
      circleRef.current.setMap(null);
    }

    // 새로운 원 생성 (범위 표시)
    const circle = new kakao.maps.Circle({
      center: locPosition,
      radius: radius,
      strokeWeight: 3,
      strokeColor: '#FFBB02',
      strokeOpacity: 1,
      fillColor: '#FFBB02',
      fillOpacity: 0.15,
    });

    circle.setMap(map);
    circleRef.current = circle;

    // 원이 잘 보이도록 지도 레벨 조정
    const bounds = new kakao.maps.LatLngBounds();
    const center = locPosition;

    // 원의 경계 계산
    const earthRadius = 6371000;
    const lat = center.getLat();
    const lng = center.getLng();

    const latOffset = (radius / earthRadius) * (180 / Math.PI);
    const lngOffset =
      ((radius / earthRadius) * (180 / Math.PI)) /
      Math.cos((lat * Math.PI) / 180);

    bounds.extend(new kakao.maps.LatLng(lat + latOffset, lng + lngOffset));
    bounds.extend(new kakao.maps.LatLng(lat - latOffset, lng - lngOffset));
    bounds.extend(new kakao.maps.LatLng(lat + latOffset, lng - lngOffset));
    bounds.extend(new kakao.maps.LatLng(lat - latOffset, lng + lngOffset));

    map.setBounds(bounds, 50, 50, 50, 50);
  }, []);

  // 마커와 범위 원 표시 함수
  const displayMarker = useCallback(
    (locPosition, locationData, radius = 1000) => {
      const map = mapRef.current;
      const infowindow = infowindowRef.current;

      if (markerRef.current) {
        markerRef.current.setPosition(locPosition);
      } else {
        const marker = new kakao.maps.Marker({
          map: map,
          position: locPosition,
        });
        markerRef.current = marker;
      }

      // 원 업데이트
      updateCircle(locPosition, radius);

      const message = `
      <div style="padding: 8px 12px; min-width: 150px; text-align: center;">
        <div style="font-weight: bold; color: #333; margin-bottom: 4px; font-size: 14px;">
          ${locationData.locationName}
        </div>
        <div style="color: #666; font-size: 12px;">
          ${locationData.roadAddress}
        </div>
        <div style="color: #FFBB02; font-size: 11px; margin-top: 4px; font-weight: bold;">
          ${radius >= 1000 ? `${radius / 1000}km` : `${radius}m`} 반경
        </div>
      </div>
    `;

      infowindow.setContent(message);
      infowindow.open(map, markerRef.current);
    },
    [updateCircle]
  );

  // 지도 초기화
  useEffect(() => {
    if (!kakao || !mapContainer.current) return;

    // 초기 좌표 설정 (URL 파라미터 우선, 없으면 광주광역시)
    const defaultLat = initialLat ? parseFloat(initialLat) : 35.1595454;
    const defaultLng = initialLng ? parseFloat(initialLng) : 126.8526012;

    const options = {
      center: new kakao.maps.LatLng(defaultLat, defaultLng),
      level: 3,
    };

    const map = new kakao.maps.Map(mapContainer.current, options);
    const geocoder = new kakao.maps.services.Geocoder();
    const infowindow = new kakao.maps.InfoWindow({ zIndex: 1 });

    mapRef.current = map;
    geocoderRef.current = geocoder;
    infowindowRef.current = infowindow;

    // 초기 위치가 있으면 마커 표시
    if (initialLat && initialLng) {
      const initLocation = {
        lat: parseFloat(initialLat),
        lng: parseFloat(initialLng),
        locationName: initialLocationName || '선택된 위치',
        roadAddress: initialRoadAddress || '주소 정보 없음',
      };
      setSelectedLocation(initLocation);
      displayMarker(
        new kakao.maps.LatLng(initLocation.lat, initLocation.lng),
        initLocation,
        searchRadius
      );
    } else {
      // 현재 위치 가져오기
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const lat = position.coords.latitude;
            const lng = position.coords.longitude;
            const locPosition = new kakao.maps.LatLng(lat, lng);

            // 현재 위치의 주소 정보 가져오기
            geocoder.coord2Address(lng, lat, (result, status) => {
              if (status === kakao.maps.services.Status.OK) {
                const road = result[0].road_address?.address_name;
                const jibun = result[0].address?.address_name;
                const addressText = road || jibun || '주소 정보 없음';

                const currentLocationData = {
                  lat,
                  lng,
                  locationName: '현재 위치',
                  roadAddress: addressText,
                };

                setSelectedLocation(currentLocationData);
                displayMarker(locPosition, currentLocationData, searchRadius);
              } else {
                // 주소를 가져올 수 없는 경우
                const currentLocationData = {
                  lat,
                  lng,
                  locationName: '현재 위치',
                  roadAddress: '주소 정보 없음',
                };

                setSelectedLocation(currentLocationData);
                displayMarker(locPosition, currentLocationData, searchRadius);
              }
            });

            map.setCenter(locPosition);
          },
          () => {
            const defaultPosition = new kakao.maps.LatLng(
              35.1595454,
              126.8526012
            );
            map.setCenter(defaultPosition);
          }
        );
      } else {
        const defaultPosition = new kakao.maps.LatLng(35.1595454, 126.8526012);
        map.setCenter(defaultPosition);
      }
    }

    // 지도 클릭 이벤트
    kakao.maps.event.addListener(map, 'click', (mouseEvent) => {
      const clickedLatLng = mouseEvent.latLng;

      geocoder.coord2Address(
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
            displayMarker(clickedLatLng, locationData, searchRadius);
          }
        }
      );
    });

    // 컴포넌트 언마운트 시 정리
    return () => {
      if (markerRef.current) {
        markerRef.current.setMap(null);
      }
      if (circleRef.current) {
        circleRef.current.setMap(null);
      }
    };
  }, [
    initialLat,
    initialLng,
    initialLocationName,
    initialRoadAddress,
    displayMarker,
    searchRadius,
  ]);

  // 장소 검색 함수
  const searchPlaces = useCallback(() => {
    if (!keyword.trim()) return;

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
  }, [keyword]);

  // 장소 선택 핸들러
  const handlePlaceClick = useCallback(
    (place) => {
      const lat = parseFloat(place.y);
      const lng = parseFloat(place.x);
      const locPosition = new kakao.maps.LatLng(lat, lng);

      const locationData = {
        lat,
        lng,
        locationName: place.place_name,
        roadAddress: place.road_address_name || place.address_name,
      };

      setSelectedLocation(locationData);
      displayMarker(locPosition, locationData);
      setShowPlaceList(false);
      setKeyword('');
    },
    [displayMarker]
  );

  // 검색 반경 변경 핸들러
  const handleRadiusChange = (newRadius) => {
    setSearchRadius(newRadius);

    // 기존 위치가 있으면 원만 업데이트
    if (selectedLocation && mapRef.current) {
      const map = mapRef.current;
      const locPosition = new kakao.maps.LatLng(
        selectedLocation.lat,
        selectedLocation.lng
      );

      // 기존 원 완전 제거
      if (circleRef.current) {
        try {
          circleRef.current.setMap(null);
        } catch (e) {
          // 오류 무시
        }
        circleRef.current = null;
      }

      // 잠시 대기 후 새로운 원 생성
      setTimeout(() => {
        try {
          const circle = new kakao.maps.Circle({
            center: locPosition,
            radius: newRadius,
            strokeWeight: 3,
            strokeColor: '#FFBB02',
            strokeOpacity: 1,
            fillColor: '#FFBB02',
            fillOpacity: 0.15,
          });

          circle.setMap(map);
          circleRef.current = circle;

          // 지도 줌 조정
          const bounds = new kakao.maps.LatLngBounds();
          const lat = locPosition.getLat();
          const lng = locPosition.getLng();

          const earthRadius = 6371000;
          const latOffset = (newRadius / earthRadius) * (180 / Math.PI);
          const lngOffset =
            ((newRadius / earthRadius) * (180 / Math.PI)) /
            Math.cos((lat * Math.PI) / 180);

          bounds.extend(
            new kakao.maps.LatLng(lat + latOffset, lng + lngOffset)
          );
          bounds.extend(
            new kakao.maps.LatLng(lat - latOffset, lng - lngOffset)
          );
          bounds.extend(
            new kakao.maps.LatLng(lat + latOffset, lng - lngOffset)
          );
          bounds.extend(
            new kakao.maps.LatLng(lat - latOffset, lng + lngOffset)
          );

          map.setBounds(bounds, 50, 50, 50, 50);
        } catch (e) {
          // 오류 무시
        }
      }, 100);

      // 인포윈도우 업데이트
      const infowindow = infowindowRef.current;
      if (infowindow) {
        const message = `
          <div style="padding: 8px 12px; min-width: 150px; text-align: center;">
            <div style="font-weight: bold; color: #333; margin-bottom: 4px; font-size: 14px;">
              ${selectedLocation.locationName}
            </div>
            <div style="color: #666; font-size: 12px;">
              ${selectedLocation.roadAddress}
            </div>
            <div style="color: #FFBB02; font-size: 11px; margin-top: 4px; font-weight: bold;">
              ${newRadius >= 1000 ? `${newRadius / 1000}km` : `${newRadius}m`} 반경
            </div>
          </div>
        `;
        infowindow.setContent(message);
      }
    }
  };

  // 홈으로 돌아가기 (선택된 위치 정보와 함께)
  const handleGoHome = () => {
    if (selectedLocation) {
      const params = new URLSearchParams({
        lat: selectedLocation.lat.toString(),
        lng: selectedLocation.lng.toString(),
        locationName: selectedLocation.locationName,
        roadAddress: selectedLocation.roadAddress,
        searchRadius: searchRadius.toString(),
      });
      navigate(`/home?${params.toString()}`);
    } else {
      navigate('/home');
    }
  };

  // 키보드 이벤트 핸들러
  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      searchPlaces();
    }
  };

  return (
    <div className="h-screen bg-black text-white flex flex-col">
      {/* 헤더 */}
      <div className="p-4 border-b border-gray-800 flex-shrink-0">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <BackButton />
            <h1 className="text-xl font-bold">지도로 게시글 찾기</h1>
          </div>
          {selectedLocation && (
            <button
              onClick={handleGoHome}
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
              className="flex-1 bg-[#1A1A1A] rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-yellow-500"
            />
            <button
              onClick={searchPlaces}
              className="bg-yellow-500 text-black px-4 py-3 rounded-lg hover:bg-yellow-400 transition-colors"
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

          {/* 검색 결과 리스트 */}
          {showPlaceList && placelist.length > 0 && (
            <div className="absolute top-full left-0 right-0 bg-[#1A1A1A] border border-gray-700 rounded-lg mt-1 max-h-40 overflow-y-auto z-50">
              {placelist.map((place) => (
                <button
                  key={place.id}
                  onClick={() => handlePlaceClick(place)}
                  className="w-full text-left p-3 hover:bg-[#2A2A2A] transition-colors border-b border-gray-700 last:border-b-0"
                >
                  <div className="font-medium text-white">
                    {place.place_name}
                  </div>
                  <div className="text-sm text-gray-400 mt-1">
                    {place.road_address_name || place.address_name}
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* 검색 반경 설정 */}
        <div className="mb-4">
          <div className="text-sm text-gray-400 mb-2">검색 반경</div>
          <div className="flex space-x-2">
            {[500, 1000, 2000, 5000].map((radius) => (
              <button
                key={radius}
                onClick={() => handleRadiusChange(radius)}
                className={`px-3 py-2 rounded-lg text-sm transition-colors ${
                  searchRadius === radius
                    ? 'bg-yellow-500 text-black'
                    : 'bg-[#1A1A1A] text-white hover:bg-[#2A2A2A]'
                }`}
              >
                {radius >= 1000 ? `${radius / 1000}km` : `${radius}m`}
              </button>
            ))}
          </div>
        </div>

        {/* 선택된 위치 정보 */}
        {selectedLocation && (
          <div className="bg-[#1A1A1A] rounded-lg p-3">
            <div className="text-sm text-yellow-500 mb-1">선택된 위치</div>
            <div className="font-medium">{selectedLocation.locationName}</div>
            <div className="text-sm text-gray-400">
              {selectedLocation.roadAddress}
            </div>
          </div>
        )}
      </div>

      {/* 지도 */}
      <div className="relative flex-1">
        <div ref={mapContainer} className="w-full h-full" />

        {/* 지도 안내 텍스트 */}
        <div className="absolute top-4 left-4 bg-black/70 backdrop-blur-sm rounded-lg px-3 py-2 text-sm">
          지도를 클릭하여 위치를 선택하세요
        </div>
      </div>
    </div>
  );
}
