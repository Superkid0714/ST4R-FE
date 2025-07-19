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
  const initialRadius = searchParams.get('searchRadius');

  // 초기 반경 설정
  useEffect(() => {
    if (initialRadius) {
      setSearchRadius(parseInt(initialRadius));
    }
  }, [initialRadius]);

  // 반경에 따른 적절한 지도 레벨 계산 함수
  const getMapLevelForRadius = useCallback((radius) => {
    // 원이 화면에서 벗어나지 않도록 최소한의 레벨 조정
    // 반경에 따른 적절한 지도 레벨 반환
    if (radius <= 200) return 4; // 200m 이하
    if (radius <= 500) return 5; // 500m 이하
    if (radius <= 1000) return 6; // 1km 이하
    if (radius <= 2000) return 7; // 2km 이하
    if (radius <= 3000) return 8; // 3km 이하
    if (radius <= 5000) return 9; // 5km 이하
    if (radius <= 7000) return 10; // 7km 이하
    return 11; // 7km 초과
  }, []);
  // 원만 업데이트하는 별도 함수
  const updateCircle = useCallback(
    (locPosition, radius) => {
      const map = mapRef.current;

      // 기존 원 제거
      if (circleRef.current) {
        circleRef.current.setMap(null);
      }

      // 새로운 원 생성 (범위 표시)
      const circle = new kakao.maps.Circle({
        center: locPosition,
        radius: radius,
        strokeWeight: 2,
        strokeColor: '#FFBB02',
        strokeOpacity: 0.8,
        fillColor: '#FFBB02',
        fillOpacity: 0.1,
      });

      circle.setMap(map);
      circleRef.current = circle;

      // 반경에 따라 지도 레벨 자동 조정
      const newLevel = getMapLevelForRadius(radius);
      map.setLevel(newLevel);
    },
    [getMapLevelForRadius]
  );

  // 마커와 범위 원 표시 함수
  const displayMarker = useCallback(
    (locPosition, locationData, radius) => {
      const map = mapRef.current;
      const infowindow = infowindowRef.current;

      if (!map || !infowindow) return;

      // 마커 생성 또는 위치 업데이트
      if (markerRef.current) {
        markerRef.current.setPosition(locPosition);
      } else {
        const marker = new kakao.maps.Marker({
          map: map,
          position: locPosition,
        });
        markerRef.current = marker;
      }

      // 지도 중심을 마커 위치로 설정
      map.setCenter(locPosition);

      // 적절한 줌 레벨 설정
      const newLevel = getMapLevelForRadius(radius);
      map.setLevel(newLevel);

      // 원 업데이트 (줌 레벨 설정 후에)
      setTimeout(() => {
        updateCircle(locPosition, radius);
      }, 300); // 지도 레벨 변경 후 원 그리기

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
    [updateCircle, getMapLevelForRadius]
  );

  // 지도 초기화
  useEffect(() => {
    if (!kakao || !mapContainer.current) return;

    // 초기 좌표 설정
    const defaultLat = initialLat ? parseFloat(initialLat) : 35.1595454;
    const defaultLng = initialLng ? parseFloat(initialLng) : 126.8526012;

    const options = {
      center: new kakao.maps.LatLng(defaultLat, defaultLng),
      level: 6,
    };

    const map = new kakao.maps.Map(mapContainer.current, options);
    const geocoder = new kakao.maps.services.Geocoder();
    const infowindow = new kakao.maps.InfoWindow({ zIndex: 1 });

    mapRef.current = map;
    geocoderRef.current = geocoder;
    infowindowRef.current = infowindow;

    // 초기 위치가 있으면 마커 표시하고 해당 위치로 이동
    if (initialLat && initialLng) {
      const initLocation = {
        lat: parseFloat(initialLat),
        lng: parseFloat(initialLng),
        locationName: initialLocationName || '선택된 위치',
        roadAddress: initialRoadAddress || '주소 정보 없음',
      };
      setSelectedLocation(initLocation);

      // 지도 중심을 초기 위치로 이동하고 적절한 레벨 설정
      const initPosition = new kakao.maps.LatLng(
        initLocation.lat,
        initLocation.lng
      );
      map.setCenter(initPosition);
      const initLevel = getMapLevelForRadius(searchRadius);
      map.setLevel(initLevel);

      // 마커와 원 표시
      displayMarker(initPosition, initLocation, searchRadius);
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

            console.log('지도 클릭 - 새로운 위치:', locationData); // 디버그용

            // 위치 정보 업데이트 (강제로 새 객체 생성)
            setSelectedLocation({ ...locationData });

            // 새로운 위치를 중심으로 마커와 원 표시
            setTimeout(() => {
              displayMarker(clickedLatLng, locationData, searchRadius);
            }, 100);
          }
        }
      );
    });

    // 현재 위치 가져오기 (초기화 시 한 번만)
    if (!initialLat && !initialLng) {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const lat = position.coords.latitude;
            const lng = position.coords.longitude;
            const locPosition = new kakao.maps.LatLng(lat, lng);

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

                // displayMarker 함수 사용
                displayMarker(locPosition, currentLocationData, searchRadius);
              } else {
                // 주소 조회 실패 시에도 현재 위치로 이동
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
          },
          (error) => {
            console.log('현재 위치를 가져올 수 없습니다:', error);
            // 현재 위치 조회 실패 시 기본 위치(광주)로 설정
            const defaultPosition = new kakao.maps.LatLng(
              35.1595454,
              126.8526012
            );
            map.setCenter(defaultPosition);
            map.setLevel(getMapLevelForRadius(searchRadius));
          }
        );
      }
    }

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
    getMapLevelForRadius,
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
      console.log('장소 선택:', place.place_name); // 디버그용

      const lat = parseFloat(place.y);
      const lng = parseFloat(place.x);
      const locPosition = new kakao.maps.LatLng(lat, lng);

      const locationData = {
        lat,
        lng,
        locationName: place.place_name,
        roadAddress: place.road_address_name || place.address_name,
      };

      console.log('새로운 위치 데이터:', locationData); // 디버그용

      // 검색 결과 창 즉시 닫기
      setShowPlaceList(false);
      setKeyword('');
      setPlacelist([]);

      // 위치 정보 업데이트 (강제로 새 객체 생성)
      setSelectedLocation({ ...locationData });

      // 지도에 마커 표시 (새로운 위치를 중심으로)
      setTimeout(() => {
        displayMarker(locPosition, locationData, searchRadius);
      }, 100); // 상태 업데이트 후 마커 표시
    },
    [displayMarker, searchRadius]
  );

  // 검색 반경 변경 핸들러
  const handleRadiusChange = useCallback(
    (newRadius) => {
      console.log('반경 변경:', newRadius, '선택된 위치:', selectedLocation); // 디버그용
      setSearchRadius(newRadius);

      // 현재 선택된 위치가 있는지 확인
      if (selectedLocation && selectedLocation.lat && selectedLocation.lng) {
        const locPosition = new kakao.maps.LatLng(
          selectedLocation.lat,
          selectedLocation.lng
        );

        // 지도 레벨 조정
        const newLevel = getMapLevelForRadius(newRadius);
        if (mapRef.current) {
          mapRef.current.setLevel(newLevel);

          // 원 업데이트 (즉시 실행)
          updateCircle(locPosition, newRadius);

          // 인포윈도우 업데이트
          const infowindow = infowindowRef.current;
          if (infowindow && markerRef.current) {
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
            infowindow.open(mapRef.current, markerRef.current);
          }
        }
      } else {
        console.log('선택된 위치가 없습니다.'); // 디버그용
      }
    },
    [selectedLocation, updateCircle, getMapLevelForRadius]
  );

  // 홈으로 돌아가기
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
    // ESC 키로 검색 결과 창 닫기
    if (e.key === 'Escape') {
      setShowPlaceList(false);
      setKeyword('');
    }
  };

  // 검색창 외부 클릭 시 검색 결과 창 닫기
  const handleInputBlur = () => {
    // 약간의 지연을 두어 클릭 이벤트가 먼저 처리되도록 함
    setTimeout(() => {
      setShowPlaceList(false);
    }, 150);
  };

  // 반경 값을 적절한 단위로 표시하는 함수
  const formatRadius = (radius) => {
    if (radius >= 1000) {
      const km = radius / 1000;
      return km % 1 === 0 ? `${km}km` : `${km.toFixed(1)}km`;
    }
    return `${radius}m`;
  };

  return (
    <div className="h-screen bg-black text-white flex flex-col">
      {/* 헤더 */}
      <div className="p-4 flex-shrink-0">
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
              onBlur={handleInputBlur}
              onFocus={() => {
                // 검색어가 있고 결과가 있으면 다시 보여주기
                if (keyword.trim() && placelist.length > 0) {
                  setShowPlaceList(true);
                }
              }}
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
                <div
                  key={place.id}
                  onClick={() => handlePlaceClick(place)}
                  className="w-full text-left p-3 hover:bg-[#2A2A2A] transition-colors border-b border-gray-700 last:border-b-0 cursor-pointer"
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
        {selectedLocation && (
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
      <div className="flex-1 px-4">
        <div
          ref={mapContainer}
          className="w-full h-full rounded-xl overflow-hidden shadow-lg"
          style={{ minHeight: '300px' }}
        />
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

          {/* 슬라이더 */}
          <div className="relative">
            <input
              type="range"
              min="100"
              max="10000"
              step="100"
              value={searchRadius}
              onChange={(e) => handleRadiusChange(parseInt(e.target.value))}
              className="w-full h-3 bg-gray-700 rounded-lg appearance-none cursor-pointer range-slider"
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

      {/* 커스텀 슬라이더 스타일 */}
      <style>
        {`
        .range-slider {
          background: linear-gradient(
            to right,
            #ffbb02 0%,
            #ffbb02 ${((searchRadius - 100) / (10000 - 100)) * 100}%,
            #374151 ${((searchRadius - 100) / (10000 - 100)) * 100}%,
            #374151 100%
          );
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
        `}
      </style>
    </div>
  );
}
