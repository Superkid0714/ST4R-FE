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

  // 상태 관리
  const [loadingState, setLoadingState] = useState('loading');
  const [errorMessage, setErrorMessage] = useState('');
  const [isMapReady, setIsMapReady] = useState(false);

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

  // 현재 위치 처리
  const handleCurrentLocation = useCallback(
    (kakao) => {
      if (!mapRef.current) return;

      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const lat = position.coords.latitude;
            const lon = position.coords.longitude;
            const locPosition = new kakao.maps.LatLng(lat, lon);
            displayMarker(
              locPosition,
              '<div style="padding:5px; color:black;">현재위치</div>'
            );
          },
          (error) => {
            console.log('현재 위치 조회 실패:', error);
            const locPosition = new kakao.maps.LatLng(35.1595454, 126.8526012);
            displayMarker(
              locPosition,
              '<div style="padding:4px; color:black;">기본 위치</div>'
            );
          }
        );
      } else {
        console.log('Geolocation을 지원하지 않습니다.');
        const locPosition = new kakao.maps.LatLng(35.1595454, 126.8526012);
        displayMarker(
          locPosition,
          '<div style="padding:4px; color:black;">기본 위치</div>'
        );
      }
    },
    [displayMarker]
  );

  // 지도 클릭 처리
  const handleMapClick = useCallback(
    (mouseEvent) => {
      if (!geocoderRef.current || !window.kakao) return;

      const clickedlatlng = mouseEvent.latLng;

      geocoderRef.current.coord2Address(
        clickedlatlng.getLng(),
        clickedlatlng.getLat(),
        (result, status) => {
          if (status === window.kakao.maps.services.Status.OK) {
            const road = result[0].road_address?.address_name;
            const jibun = result[0].address?.address_name;
            const addressText = road || jibun || '주소 정보 없음';

            displayMarker(
              clickedlatlng,
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
                lat: clickedlatlng.getLat(),
                lng: clickedlatlng.getLng(),
              });
            }
          }
        }
      );
    },
    [displayMarker, onChange]
  );

  // 초기 위치 설정
  const setInitialLocationOnMap = useCallback(
    (location) => {
      if (!window.kakao || !location?.lat || !location?.lng || !mapRef.current)
        return;

      try {
        const locPosition = new window.kakao.maps.LatLng(
          location.lat,
          location.lng
        );
        displayMarker(
          locPosition,
          `<div style="padding: 8px 12px; color: #000;">${location.locationName || '위치 정보'}</div>`
        );

        setSelectedPlace({
          name: location.locationName,
          address: location.roadAddress,
        });

        if (onChange) {
          onChange({
            locationName: location.locationName,
            roadAddress: location.roadAddress,
            lat: location.lat,
            lng: location.lng,
          });
        }
      } catch (error) {
        console.error('초기 위치 설정 실패:', error);
      }
    },
    [displayMarker, onChange]
  );

  // 카카오 맵 로드 및 초기화
  useEffect(() => {
    let isCleanup = false;

    const initializeMap = async () => {
      try {
        setLoadingState('loading');
        setErrorMessage('');

        // 카카오 맵 스크립트 로드
        await new Promise((resolve, reject) => {
          if (window.kakao && window.kakao.maps && window.kakao.maps.Map) {
            console.log('카카오 맵이 이미 로드되어 있습니다.');
            resolve();
            return;
          }

          const existingScript = document.querySelector(
            'script[src*="dapi.kakao.com"]'
          );

          if (existingScript) {
            const checkKakaoLoaded = () => {
              if (window.kakao && window.kakao.maps) {
                window.kakao.maps.load(() => {
                  resolve();
                });
              } else {
                setTimeout(checkKakaoLoaded, 100);
              }
            };
            checkKakaoLoaded();
            return;
          }

          const script = document.createElement('script');
          script.src = `//dapi.kakao.com/v2/maps/sdk.js?appkey=5efbd2f844cb3d8609377a11750272bb&libraries=services&autoload=false`;
          script.async = true;

          script.onload = () => {
            console.log('카카오 맵 스크립트 로드 완료');
            window.kakao.maps.load(() => {
              console.log('카카오 맵 초기화 완료');
              resolve();
            });
          };

          script.onerror = () => {
            console.error('카카오 맵 스크립트 로드 실패');
            reject(new Error('카카오 맵 스크립트 로드 실패'));
          };

          document.head.appendChild(script);
        });

        if (isCleanup) return;

        // 컨테이너 확인
        if (!container.current) {
          console.error('지도 컨테이너가 없습니다.');
          throw new Error('지도 컨테이너를 찾을 수 없습니다');
        }

        console.log('컨테이너 찾음:', container.current);

        const kakao = window.kakao;

        // 지도 초기화
        const options = {
          center: new kakao.maps.LatLng(35.1595454, 126.8526012),
          level: 3,
        };

        console.log('지도 생성 시작');
        const map = new kakao.maps.Map(container.current, options);
        const geocoder = new kakao.maps.services.Geocoder();
        const infowindow = new kakao.maps.InfoWindow({ zIndex: 1 });

        if (isCleanup) {
          map.destroy();
          return;
        }

        mapRef.current = map;
        geocoderRef.current = geocoder;
        infowindowRef.current = infowindow;

        // 지도 클릭 이벤트
        kakao.maps.event.addListener(map, 'click', handleMapClick);

        setIsMapReady(true);
        setLoadingState('loaded');
        console.log('지도 초기화 성공');

        // 초기 위치 설정
        if (initialMap && initialLat && initialLng && initialRoadAddress) {
          const locPosition = new kakao.maps.LatLng(initialLat, initialLng);
          displayMarker(
            locPosition,
            `<div style="padding: 8px 12px; color: #000;">주소: ${initialRoadAddress}</div>`
          );
        } else if (initialLocation) {
          setInitialLocationOnMap(initialLocation);
        } else {
          handleCurrentLocation(kakao);
        }
      } catch (error) {
        if (!isCleanup) {
          console.error('카카오 맵 초기화 실패:', error);
          setErrorMessage(error.message);
          setLoadingState('error');
        }
      }
    };

    initializeMap();

    return () => {
      isCleanup = true;
      if (mapRef.current) {
        try {
          // 이벤트 리스너 제거
          if (window.kakao && window.kakao.maps) {
            window.kakao.maps.event.removeListener(mapRef.current, 'click');
          }
          // 마커 제거
          if (markerRef.current) {
            markerRef.current.setMap(null);
          }
          // 인포윈도우 닫기
          if (infowindowRef.current) {
            infowindowRef.current.close();
          }
        } catch (e) {
          console.log('지도 정리 중 에러:', e);
        }
      }
    };
  }, []); // 빈 의존성 배열

  // 장소 검색
  const searchPlaces = useCallback(() => {
    if (!keyword.trim() || !window.kakao || !isMapReady) return;

    try {
      const ps = new window.kakao.maps.services.Places();
      ps.keywordSearch(keyword, (data, status) => {
        if (status === window.kakao.maps.services.Status.OK) {
          setPlacelist(data);
        } else {
          setPlacelist([]);
        }
      });
    } catch (error) {
      console.error('장소 검색 실패:', error);
      setPlacelist([]);
    }
  }, [keyword, isMapReady]);

  // 장소 선택
  const handlePlaceClick = useCallback(
    (place) => {
      if (!window.kakao || !mapRef.current) return;

      try {
        const lat = parseFloat(place.y);
        const lng = parseFloat(place.x);
        const locPosition = new window.kakao.maps.LatLng(lat, lng);

        displayMarker(locPosition);

        const placeData = {
          name: place.place_name,
          address: place.road_address_name || place.address_name,
        };

        setSelectedPlace(placeData);
        setPlacelist([]);

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

  // 로딩 중
  if (loadingState === 'loading') {
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
  if (loadingState === 'error') {
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
            <div className="text-xs text-gray-500 mb-3">{errorMessage}</div>

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
            onKeyDown={(e) => e.key === 'Enter' && searchPlaces()}
            className="h-10 w-3/4 px-2 bg-[#1D1D1D] font-['Pretendard'] placeholder:text-[#565656] rounded-[10px] focus:outline-none text-sm"
          />
          <button onClick={searchPlaces}>
            <img src={search} alt="검색" className="w-7 h-7" />
          </button>
        </div>

        <div
          ref={container}
          id="kakao-map-container"
          className="kakao-map-container"
          style={{
            width: '100%',
            height: '200px',
            borderRadius: '10px',
            margin: '8px 0',
            backgroundColor: '#1D1D1D',
            position: 'relative',
          }}
        />
      </div>

      {/* 검색 결과 */}
      {placelist.length > 0 && (
        <ul className="border rounded p-2 text-sm bg-white max-h-40 overflow-y-auto mb-[8px]">
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
      )}

      {/* 선택된 장소 */}
      {selectedPlace && (
        <div className="flex flex-col gap-0.5 p-3 bg-[#1D1D1D] rounded-[10px]">
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
