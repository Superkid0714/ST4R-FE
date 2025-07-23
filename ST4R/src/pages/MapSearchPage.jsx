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
  const isInitialized = useRef(false);

  // 상태 관리
  const [keyword, setKeyword] = useState('');
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [searchRadius, setSearchRadius] = useState(1000);
  const [placelist, setPlacelist] = useState([]);
  const [showPlaceList, setShowPlaceList] = useState(false);
  const [mapLoading, setMapLoading] = useState(true);
  const [mapError, setMapError] = useState(null);
  const [loadingMessage, setLoadingMessage] =
    useState('카카오 지도 준비 중...');

  const selectedLocationRef = useRef(null);

  // URL 파라미터에서 초기 값 가져오기
  const initialLat = searchParams.get('lat');
  const initialLng = searchParams.get('lng');
  const initialLocationName = searchParams.get('locationName');
  const initialRoadAddress = searchParams.get('roadAddress');
  const initialRadius = searchParams.get('searchRadius');

  useEffect(() => {
    if (initialRadius) {
      setSearchRadius(parseInt(initialRadius));
    }
  }, [initialRadius]);

  useEffect(() => {
    selectedLocationRef.current = selectedLocation;
  }, [selectedLocation]);

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
        // 기존 원 제거
        if (circleRef.current) {
          circleRef.current.setMap(null);
        }

        // 새로운 원 생성
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

        // 지도 레벨 조정
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
        // 마커 생성 또는 업데이트
        if (markerRef.current) {
          markerRef.current.setPosition(locPosition);
        } else {
          const marker = new kakao.maps.Marker({
            map: mapRef.current,
            position: locPosition,
          });
          markerRef.current = marker;
        }

        // 지도 중심 설정
        mapRef.current.setCenter(locPosition);
        const newLevel = getMapLevelForRadius(radius);
        mapRef.current.setLevel(newLevel);

        // 원 업데이트
        setTimeout(() => {
          updateCircle(locPosition, radius, kakao);
        }, 300);

        // 인포윈도우
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
    // 컨테이너가 없으면 실행하지 않음
    if (!mapContainer.current) {
      console.log('🚫 컨테이너가 아직 준비되지 않음');
      return;
    }

    let mounted = true;

    const initializeMap = async () => {
      if (isInitialized.current) {
        console.log('지도가 이미 초기화됨');
        return;
      }

      try {
        setMapLoading(true);
        setMapError(null);
        setLoadingMessage('카카오 지도 스크립트 로딩 중...');

        console.log('🚀 지도 초기화 시작');
        console.log('📦 컨테이너 상태:', {
          exists: !!mapContainer.current,
          width: mapContainer.current?.offsetWidth,
          height: mapContainer.current?.offsetHeight,
        });

        // 카카오 맵 스크립트 로드
        const kakao = await loadKakaoMapScript();
        console.log('✅ 카카오 맵 스크립트 로드 완료, kakao 객체:', !!kakao);

        // 컴포넌트가 여전히 마운트되어 있는지 확인
        if (!mounted || !mapContainer.current) {
          console.log('컴포넌트가 언마운트됨 - 초기화 중단');
          return;
        }

        setLoadingMessage('지도 생성 중...');
        console.log('🗺️ 지도 생성 시작, 컨테이너:', mapContainer.current);

        // 초기 좌표 설정
        const defaultLat = initialLat ? parseFloat(initialLat) : 35.1595454;
        const defaultLng = initialLng ? parseFloat(initialLng) : 126.8526012;

        // 지도 생성
        const mapOptions = {
          center: new kakao.maps.LatLng(defaultLat, defaultLng),
          level: 6,
        };

        console.log('📍 지도 옵션:', mapOptions);
        console.log('📍 컨테이너 크기:', {
          width: mapContainer.current.offsetWidth,
          height: mapContainer.current.offsetHeight,
        });

        const map = new kakao.maps.Map(mapContainer.current, mapOptions);
        console.log('✅ 지도 객체 생성됨:', !!map);

        const geocoder = new kakao.maps.services.Geocoder();
        const infowindow = new kakao.maps.InfoWindow({ zIndex: 1 });

        // 참조 저장
        mapRef.current = map;
        geocoderRef.current = geocoder;
        infowindowRef.current = infowindow;
        isInitialized.current = true;

        console.log('✅ 지도 생성 완료, isInitialized:', isInitialized.current);

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
                displayMarker(clickedLatLng, locationData, searchRadius, kakao);
              }
            }
          );
        });

        // 현재 위치 가져오기 (초기 위치가 없을 때만)
        if (!initialLat && !initialLng && navigator.geolocation) {
          setLoadingMessage('현재 위치 확인 중...');
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
                  displayMarker(
                    locPosition,
                    currentLocationData,
                    searchRadius,
                    kakao
                  );
                } else {
                  const currentLocationData = {
                    lat,
                    lng,
                    locationName: '현재 위치',
                    roadAddress: '주소 정보 없음',
                  };
                  setSelectedLocation(currentLocationData);
                  displayMarker(
                    locPosition,
                    currentLocationData,
                    searchRadius,
                    kakao
                  );
                }
              });
            },
            (error) => {
              console.log('현재 위치 조회 실패:', error);
              const defaultPosition = new kakao.maps.LatLng(
                35.1595454,
                126.8526012
              );
              map.setCenter(defaultPosition);
              map.setLevel(getMapLevelForRadius(searchRadius));
            }
          );
        }

        setMapLoading(false);
        console.log('🎉 지도 초기화 완전 완료, mapLoading:', false);
      } catch (error) {
        console.error('❌ 지도 초기화 실패:', error);
        console.error('에러 스택:', error.stack);
        if (mounted) {
          setMapLoading(false);
          setMapError(error.message);
          console.log('❌ 에러 상태 설정됨');
        }
      }
    };

    // 약간의 지연 후 초기화 시작 (DOM이 준비될 시간 확보)
    console.log('⏰ 초기화 타이머 설정');
    initTimeout = setTimeout(() => {
      if (mounted) {
        console.log('⏰ 타이머 실행 - 초기화 시작');
        initializeMap();
      }
    }, 100);

    return () => {
      mounted = false;

      // 타임아웃 클리어
      if (initTimeout) {
        clearTimeout(initTimeout);
      }

      // 지도 정리
      if (isInitialized.current) {
        console.log('지도 정리 시작');

        // 마커 정리
        if (markerRef.current) {
          try {
            markerRef.current.setMap(null);
          } catch (e) {
            console.log('마커 정리 실패:', e);
          }
          markerRef.current = null;
        }

        // 원 정리
        if (circleRef.current) {
          try {
            circleRef.current.setMap(null);
          } catch (e) {
            console.log('원 정리 실패:', e);
          }
          circleRef.current = null;
        }

        // 인포윈도우 정리
        if (infowindowRef.current) {
          try {
            infowindowRef.current.close();
          } catch (e) {
            console.log('인포윈도우 정리 실패:', e);
          }
          infowindowRef.current = null;
        }

        // 참조 초기화
        mapRef.current = null;
        geocoderRef.current = null;
        isInitialized.current = false;
      }
    };
  }, []);

  // 초기 위치 설정을 위한 별도 useEffect
  useEffect(() => {
    if (!isInitialized.current || !mapRef.current) return;

    const kakao = safeKakaoAccess();
    if (!kakao) return;

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
  }, [
    initialLat,
    initialLng,
    initialLocationName,
    initialRoadAddress,
    searchRadius,
    displayMarker,
  ]);

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

  // 반경 변경 핸들러
  const radiusUpdateTimer = useRef(null);

  const handleRadiusChange = useCallback(
    (newRadius) => {
      setSearchRadius(newRadius);

      if (radiusUpdateTimer.current) {
        clearTimeout(radiusUpdateTimer.current);
      }

      radiusUpdateTimer.current = setTimeout(() => {
        const currentLocation = selectedLocationRef.current;
        const kakao = safeKakaoAccess();

        if (
          currentLocation &&
          currentLocation.lat &&
          currentLocation.lng &&
          kakao
        ) {
          try {
            const locPosition = new kakao.maps.LatLng(
              currentLocation.lat,
              currentLocation.lng
            );

            if (mapRef.current) {
              mapRef.current.setCenter(locPosition);
              const newLevel = getMapLevelForRadius(newRadius);
              mapRef.current.setLevel(newLevel);

              if (markerRef.current) {
                markerRef.current.setPosition(locPosition);
              }

              updateCircle(locPosition, newRadius, kakao);

              if (infowindowRef.current && markerRef.current) {
                const radiusText =
                  newRadius >= 1000 ? newRadius / 1000 + 'km' : newRadius + 'm';
                const message = `
                  <div style="padding: 8px 12px; min-width: 150px; text-align: center;">
                    <div style="font-weight: bold; color: #333; margin-bottom: 4px; font-size: 14px;">
                      ${currentLocation.locationName}
                    </div>
                    <div style="color: #666; font-size: 12px;">
                      ${currentLocation.roadAddress}
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
          } catch (error) {
            console.error('반경 변경 실패:', error);
          }
        }
      }, 200);
    },
    [getMapLevelForRadius, updateCircle]
  );

  useEffect(() => {
    return () => {
      if (radiusUpdateTimer.current) {
        clearTimeout(radiusUpdateTimer.current);
      }
    };
  }, []);

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

  const handleInputBlur = () => {
    setTimeout(() => {
      setShowPlaceList(false);
    }, 150);
  };

  const formatRadius = (radius) => {
    if (radius >= 1000) {
      const km = radius / 1000;
      return km % 1 === 0 ? `${km}km` : `${km.toFixed(1)}km`;
    }
    return `${radius}m`;
  };

  // 새로고침 핸들러
  const handleRefresh = () => {
    window.location.reload();
  };

  // 슬라이더 스타일 계산
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
              onBlur={handleInputBlur}
              onFocus={() => {
                if (keyword.trim() && placelist.length > 0) {
                  setShowPlaceList(true);
                }
              }}
              disabled={mapLoading || mapError}
              className="flex-1 bg-[#1A1A1A] rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-yellow-500 disabled:opacity-50"
            />
            <button
              onClick={searchPlaces}
              disabled={mapLoading || mapError}
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
      <div className="flex-1 px-4">
        {mapLoading ? (
          <div className="w-full h-full rounded-xl bg-[#1A1A1A] flex items-center justify-center">
            <div className="flex flex-col items-center">
              <div className="w-8 h-8 border-2 border-yellow-500 border-t-transparent rounded-full animate-spin mb-2"></div>
              <span className="text-sm text-gray-400">{loadingMessage}</span>
              <div className="text-xs text-gray-500 mt-2">
                {checkKakaoMapStatus().kakaoObject === 'exists' && (
                  <span className="text-green-400">✓ 카카오 API 로드됨</span>
                )}
              </div>
            </div>
          </div>
        ) : mapError ? (
          <div className="w-full h-full rounded-xl bg-[#1A1A1A] flex items-center justify-center">
            <div className="text-center p-4">
              <div className="text-red-400 text-sm mb-2">
                지도를 불러올 수 없습니다
              </div>
              <div className="text-xs text-gray-500 mb-3">{mapError}</div>

              <div className="space-y-2">
                <button
                  onClick={handleRefresh}
                  className="px-4 py-2 bg-yellow-500 text-black rounded-lg text-sm hover:bg-yellow-400 block mx-auto"
                >
                  새로고침
                </button>

                <div className="text-xs text-gray-400 text-left">
                  <p className="font-medium mb-1">문제 해결 방법:</p>
                  <p>• 브라우저 새로고침 (Ctrl+F5)</p>
                  <p>• 브라우저 캐시 삭제</p>
                  <p>• 네트워크 연결 확인</p>
                  <p>• 다른 브라우저로 시도</p>
                  <p>• 개발자 도구 콘솔 확인</p>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div
            ref={setMapContainerRef}
            className="w-full h-full rounded-xl overflow-hidden shadow-lg bg-gray-900"
            style={{ minHeight: '300px' }}
          />
        )}
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
              disabled={mapLoading || mapError}
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

      {/* 커스텀 슬라이더 스타일 */}
      <style>{`
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
