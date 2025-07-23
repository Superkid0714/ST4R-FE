import search from '../../assets/icons/search.svg';
import { useEffect, useRef, useState, useCallback } from 'react';

function Kakaomap({
  onChange,
  initialLat,
  initialLng,
  initialRoadAddress,
  initialMap = false,
  initialLocation,
}) {
  const container = useRef(null);
  const markerRef = useRef(null);
  const mapRef = useRef(null);
  const geocoderRef = useRef(null);
  const infowindowRef = useRef(null);

  const [keyword, setKeyword] = useState('');
  const [selectedPlace, setSelectedPlace] = useState(null);
  const [placelist, setPlacelist] = useState([]);
  const [showPlaceList, setShowPlaceList] = useState(false);
  const [mapReady, setMapReady] = useState(false);
  const [mapError, setMapError] = useState(null);

  // 마커 표시 함수
  const displayMarker = useCallback((locPosition, message = null) => {
    if (!window.kakao || !mapRef.current) return;

    try {
      if (markerRef.current) {
        markerRef.current.setPosition(locPosition);
      } else {
        const marker = new window.kakao.maps.Marker({
          map: mapRef.current,
          position: locPosition,
        });
        markerRef.current = marker;
      }

      if (message && infowindowRef.current) {
        infowindowRef.current.setContent(message);
        infowindowRef.current.open(mapRef.current, markerRef.current);
      }

      mapRef.current.setCenter(locPosition);
    } catch (error) {
      console.error('마커 표시 실패:', error);
    }
  }, []);

  // 지도 초기화
  useEffect(() => {
    let mounted = true;

    const initMap = async () => {
      try {
        console.log('지도 초기화 시작');

        // 기존 스크립트 강제 제거
        const existingScripts = document.querySelectorAll(
          'script[src*="dapi.kakao.com"]'
        );
        existingScripts.forEach((s) => s.remove());
        if (window.kakao) {
          delete window.kakao;
        }

        // 직접 스크립트 로드
        const script = document.createElement('script');
        script.src = `https://dapi.kakao.com/v2/maps/sdk.js?appkey=5efbd2f844cb3d8609377a11750272bb&libraries=services&autoload=false`;

        script.onload = () => {
          console.log('스크립트 로드 완료');

          window.kakao.maps.load(() => {
            console.log('카카오 맵 API 로드 완료');

            if (!mounted || !container.current) return;

            const options = {
              center: new window.kakao.maps.LatLng(35.1595454, 126.8526012),
              level: 3,
            };

            console.log('지도 생성 시작');
            const map = new window.kakao.maps.Map(container.current, options);
            const geocoder = new window.kakao.maps.services.Geocoder();
            const infowindow = new window.kakao.maps.InfoWindow({ zIndex: 1 });

            mapRef.current = map;
            geocoderRef.current = geocoder;
            infowindowRef.current = infowindow;

            // 초기 위치 설정
            if (initialMap && initialLat && initialLng && initialRoadAddress) {
              const locPosition = new window.kakao.maps.LatLng(
                initialLat,
                initialLng
              );
              displayMarker(
                locPosition,
                `<div style="padding: 8px 12px; color: #000;">주소: ${initialRoadAddress}</div>`
              );
            } else if (initialLocation) {
              const locPosition = new window.kakao.maps.LatLng(
                initialLocation.lat,
                initialLocation.lng
              );
              displayMarker(
                locPosition,
                `<div style="padding: 8px 12px; color: #000;">${initialLocation.locationName || '위치 정보'}</div>`
              );

              setSelectedPlace({
                name: initialLocation.locationName,
                address: initialLocation.roadAddress,
              });

              if (onChange) {
                onChange({
                  locationName: initialLocation.locationName,
                  roadAddress: initialLocation.roadAddress,
                  lat: initialLocation.lat,
                  lng: initialLocation.lng,
                });
              }
            } else {
              // 현재 위치 또는 기본 위치 설정
              if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(
                  (position) => {
                    const lat = position.coords.latitude;
                    const lng = position.coords.longitude;
                    const locPosition = new window.kakao.maps.LatLng(lat, lng);
                    displayMarker(
                      locPosition,
                      '<div style="padding:5px; color:black;">현재위치</div>'
                    );
                  },
                  (error) => {
                    console.log('현재 위치 조회 실패:', error);
                    // 기본 위치로 설정
                    const locPosition = new window.kakao.maps.LatLng(
                      35.1595454,
                      126.8526012
                    );
                    displayMarker(
                      locPosition,
                      '<div style="padding:4px; color:black;">기본 위치</div>'
                    );
                  }
                );
              } else {
                // 기본 위치로 설정
                const locPosition = new window.kakao.maps.LatLng(
                  35.1595454,
                  126.8526012
                );
                displayMarker(
                  locPosition,
                  '<div style="padding:4px; color:black;">기본 위치</div>'
                );
              }
            }

            // 지도 클릭 이벤트
            window.kakao.maps.event.addListener(map, 'click', (mouseEvent) => {
              const clickedLatLng = mouseEvent.latLng;

              geocoder.coord2Address(
                clickedLatLng.getLng(),
                clickedLatLng.getLat(),
                (result, status) => {
                  if (status === window.kakao.maps.services.Status.OK) {
                    const road = result[0].road_address?.address_name;
                    const jibun = result[0].address?.address_name;
                    const addressText = road || jibun || '주소 정보 없음';

                    displayMarker(
                      clickedLatLng,
                      `<div style="padding: 8px 12px; color: #000;">주소: ${addressText}</div>`
                    );

                    setSelectedPlace({
                      name: null,
                      address: addressText,
                    });

                    if (onChange) {
                      onChange({
                        locationName: null,
                        roadAddress: addressText,
                        lat: clickedLatLng.getLat(),
                        lng: clickedLatLng.getLng(),
                      });
                    }
                  }
                }
              );
            });

            setMapReady(true);
            setMapError(null);
            console.log('지도 초기화 완료');
          });
        };

        script.onerror = () => {
          console.error('스크립트 로드 실패');
          setMapError('카카오 맵을 불러올 수 없습니다');
        };

        document.head.appendChild(script);
      } catch (error) {
        console.error('지도 초기화 실패:', error);
        setMapError(error.message);
      }
    };

    const timer = setTimeout(initMap, 0);

    return () => {
      mounted = false;
      clearTimeout(timer);
      // 정리 작업
      if (markerRef.current) {
        try {
          markerRef.current.setMap(null);
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
    if (!keyword.trim() || !window.kakao) return;

    try {
      const ps = new window.kakao.maps.services.Places();
      ps.keywordSearch(keyword, (data, status) => {
        if (status === window.kakao.maps.services.Status.OK) {
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
      if (!window.kakao) return;

      try {
        const lat = parseFloat(place.y);
        const lng = parseFloat(place.x);
        const locPosition = new window.kakao.maps.LatLng(lat, lng);

        displayMarker(locPosition);

        const placeData = {
          name: place.place_name,
          address: place.road_address_name || place.address_name,
        };

        setShowPlaceList(false);
        setKeyword('');
        setPlacelist([]);
        setSelectedPlace(placeData);

        if (onChange) {
          onChange({
            locationName: placeData.name,
            roadAddress: placeData.address,
            lat: lat,
            lng: lng,
          });
        }
      } catch (error) {
        console.error('장소 선택 실패:', error);
      }
    },
    [displayMarker, onChange]
  );

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      searchPlaces();
    }
    if (e.key === 'Escape') {
      setShowPlaceList(false);
      setKeyword('');
    }
  };

  // 로딩 중
  if (!mapReady && !mapError) {
    return (
      <div className="flex flex-col gap-2">
        <div className="flex gap-2">
          <input
            disabled
            placeholder="지도 로딩 중..."
            className="h-10 w-3/4 px-2 bg-[#1D1D1D] font-['Pretendard'] placeholder:text-[#565656] rounded-[10px] text-sm opacity-50"
          />
          <button disabled className="opacity-50">
            <img src={search} alt="검색" className="w-7 h-7" />
          </button>
        </div>

        <div className="h-[200px] bg-[#1D1D1D] rounded-[10px] flex items-center justify-center">
          <div className="flex flex-col items-center">
            <div className="w-6 h-6 border-2 border-yellow-500 border-t-transparent rounded-full animate-spin mb-2"></div>
            <span className="text-sm text-gray-400">
              카카오 지도 로딩 중...
            </span>
          </div>
        </div>
      </div>
    );
  }

  // 에러 상태
  if (mapError) {
    return (
      <div className="flex flex-col gap-2">
        <div className="flex gap-2">
          <input
            disabled
            placeholder="지도를 사용할 수 없습니다"
            className="h-10 w-3/4 px-2 bg-[#1D1D1D] font-['Pretendard'] placeholder:text-red-400 rounded-[10px] text-sm opacity-50"
          />
          <button disabled className="opacity-50">
            <img src={search} alt="검색" className="w-7 h-7" />
          </button>
        </div>

        <div className="h-[200px] bg-[#1D1D1D] rounded-[10px] flex items-center justify-center">
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
            </div>
          </div>
        </div>
      </div>
    );
  }

  // 정상 렌더링
  return (
    <div>
      <div className="flex flex-col gap-2">
        {/* 검색창 */}
        <div className="flex gap-2">
          <input
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            placeholder="장소를 검색하세요"
            onKeyDown={handleKeyDown}
            disabled={!mapReady || mapError}
            className="h-10 w-3/4 px-2 bg-[#1D1D1D] font-['Pretendard'] placeholder:text-[#565656] rounded-[10px] focus:outline-none text-sm"
          />
          <button onClick={searchPlaces} disabled={!mapReady || mapError}>
            <img src={search} alt="검색" className="w-7 h-7" />
          </button>
        </div>

        {/* 지도 컨테이너 */}
        <div className="relative">
          <div
            ref={container}
            id="kakao-map-container"
            className="kakao-map-container"
            style={{
              width: '100%',
              height: '200px',
              borderRadius: '10px',
              backgroundColor: '#1D1D1D',
              position: 'relative',
            }}
          />
        </div>
      </div>

      {/* 검색 결과 */}
      {showPlaceList && placelist.length > 0 && (
        <div className="relative">
          <ul className="absolute top-0 left-0 right-0 border rounded p-2 text-sm bg-white max-h-40 overflow-y-auto z-50 shadow-lg">
            {placelist.map((place) => (
              <li
                key={place.id}
                onClick={() => handlePlaceClick(place)}
                className="cursor-pointer hover:bg-gray-100 p-1 border-b text-black"
              >
                <div className="font-semibold">{place.place_name}</div>
                <div className="text-gray-500 text-xs">
                  {place.road_address_name || place.address_name}
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* 선택된 장소 */}
      {selectedPlace && (
        <div className="flex flex-col gap-0.5 p-3 bg-[#1D1D1D] rounded-[10px] mt-2">
          {selectedPlace.name && (
            <div className="text-sm font-['Pretendard']">
              📍 {selectedPlace.name}
            </div>
          )}
          {selectedPlace.address && (
            <div className="text-sm font-['Pretendard']">
              🗺️ {selectedPlace.address}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default Kakaomap;
