import search from '../../assets/icons/search.svg';
import { useEffect, useRef, useState, useCallback } from 'react';
import {
  loadKakaoMapScript,
  safeKakaoAccess,
  checkKakaoMapStatus,
  forceReloadKakaoMap,
} from '../../utils/kakaoMapLoader';

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
  const isInitialized = useRef(false);

  const [keyword, setKeyword] = useState('');
  const [selectedPlace, setSelectedPlace] = useState(null);
  const [placelist, setPlacelist] = useState([]);

  // 상태 관리
  const [loadingState, setLoadingState] = useState('loading'); // loading, loaded, error
  const [errorMessage, setErrorMessage] = useState('');
  const [debugInfo, setDebugInfo] = useState('');

  // 디버깅 정보 업데이트
  const updateDebugInfo = (info) => {
    setDebugInfo(
      (prev) => prev + '\n' + new Date().toLocaleTimeString() + ': ' + info
    );
    console.log('카카오맵 디버그:', info);
  };

  // 카카오 맵 로드 및 초기화
  useEffect(() => {
    let mounted = true;

    const initializeMap = async () => {
      try {
        setLoadingState('loading');
        setErrorMessage('');
        updateDebugInfo('지도 초기화 시작');
        updateDebugInfo(`현재 도메인: ${window.location.hostname}`);

        // 카카오 맵 스크립트 로드
        updateDebugInfo('카카오 맵 스크립트 로딩 중...');
        const kakao = await loadKakaoMapScript();

        // 컴포넌트가 언마운트되었다면 중단
        if (!mounted) {
          updateDebugInfo('컴포넌트 언마운트됨, 초기화 중단');
          return;
        }

        // 컨테이너 확인
        if (!container.current) {
          throw new Error('지도 컨테이너를 찾을 수 없습니다');
        }

        // 이미 초기화되었다면 스킵
        if (isInitialized.current) {
          updateDebugInfo('이미 초기화됨');
          return;
        }

        updateDebugInfo('지도 객체 생성 중...');

        // 지도 초기화
        const options = {
          center: new kakao.maps.LatLng(35.1757875820353, 126.90820322250839),
          level: 3,
        };

        const map = new kakao.maps.Map(container.current, options);
        const geocoder = new kakao.maps.services.Geocoder();
        const infowindow = new kakao.maps.InfoWindow({ zIndex: 1 });

        mapRef.current = map;
        geocoderRef.current = geocoder;
        infowindowRef.current = infowindow;

        updateDebugInfo('지도 객체 생성 완료');

        // 초기화 완료 표시
        isInitialized.current = true;

        // 초기 위치 설정
        if (initialMap && initialLat && initialLng && initialRoadAddress) {
          updateDebugInfo('초기 위치 설정 중...');
          const locPosition = new kakao.maps.LatLng(initialLat, initialLng);
          displayMarker(
            locPosition,
            `<div style="padding: 8px 12px; color: #000;">주소: ${initialRoadAddress}</div>`
          );
        } else if (initialLocation) {
          updateDebugInfo('초기 위치 객체 설정 중...');
          setInitialLocationOnMap(initialLocation);
        } else {
          updateDebugInfo('현재 위치 확인 중...');
          // 현재 위치 설정
          handleCurrentLocation(kakao, map);
        }

        // 지도 클릭 이벤트
        kakao.maps.event.addListener(map, 'click', (mouseEvent) => {
          handleMapClick(mouseEvent, geocoder, kakao);
        });

        updateDebugInfo('지도 초기화 완료');
        setLoadingState('loaded');
      } catch (error) {
        console.error('카카오 맵 초기화 실패:', error);
        updateDebugInfo(`초기화 실패: ${error.message}`);

        if (mounted) {
          setErrorMessage(error.message);
          setLoadingState('error');
        }
      }
    };

    initializeMap();

    return () => {
      mounted = false;
      // cleanup
      if (markerRef.current) {
        try {
          markerRef.current.setMap(null);
        } catch (e) {
          console.log('마커 정리 중 에러:', e);
        }
        markerRef.current = null;
      }
    };
  }, []); // 빈 의존성 배열로 한 번만 실행

  // 마커 표시 함수
  const displayMarker = useCallback((locPosition, message = null) => {
    const kakao = safeKakaoAccess();
    if (!kakao || !mapRef.current) return;

    try {
      // 기존 마커 처리
      if (markerRef.current) {
        markerRef.current.setPosition(locPosition);
      } else {
        const marker = new kakao.maps.Marker({
          map: mapRef.current,
          position: locPosition,
        });
        markerRef.current = marker;
      }

      // 인포윈도우 처리
      if (message && infowindowRef.current) {
        infowindowRef.current.setContent(message);
        infowindowRef.current.open(mapRef.current, markerRef.current);
      }

      // 지도 중심 이동
      mapRef.current.setCenter(locPosition);
    } catch (error) {
      console.error('마커 표시 실패:', error);
      updateDebugInfo(`마커 표시 실패: ${error.message}`);
    }
  }, []);

  // 현재 위치 처리
  const handleCurrentLocation = (kakao, map) => {
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
          updateDebugInfo('현재 위치 설정 완료');
        },
        (error) => {
          updateDebugInfo(`현재 위치 조회 실패: ${error.message}`);
          // 실패 시 기본 위치
          const locPosition = new kakao.maps.LatLng(
            35.30019091752179,
            127.37915975896176
          );
          displayMarker(
            locPosition,
            '<div style="padding:4px; color:black;">기본 위치</div>'
          );
        }
      );
    } else {
      updateDebugInfo('위치 정보를 지원하지 않는 브라우저');
    }
  };

  // 지도 클릭 처리
  const handleMapClick = (mouseEvent, geocoder, kakao) => {
    const clickedlatlng = mouseEvent.latLng;

    geocoder.coord2Address(
      clickedlatlng.getLng(),
      clickedlatlng.getLat(),
      (result, status) => {
        if (status === kakao.maps.services.Status.OK) {
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
  };

  // 초기 위치 설정
  const setInitialLocationOnMap = (location) => {
    const kakao = safeKakaoAccess();
    if (!kakao || !location?.lat || !location?.lng) return;

    try {
      const locPosition = new kakao.maps.LatLng(location.lat, location.lng);
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
      updateDebugInfo(`초기 위치 설정 실패: ${error.message}`);
    }
  };

  // 장소 검색
  const searchPlaces = () => {
    const kakao = safeKakaoAccess();
    if (!keyword.trim() || !kakao) return;

    try {
      const ps = new kakao.maps.services.Places();
      ps.keywordSearch(keyword, (data, status) => {
        if (status === kakao.maps.services.Status.OK) {
          setPlacelist(data);
          updateDebugInfo(`검색 결과: ${data.length}개`);
        } else {
          setPlacelist([]);
          updateDebugInfo('검색 결과 없음');
        }
      });
    } catch (error) {
      console.error('장소 검색 실패:', error);
      updateDebugInfo(`장소 검색 실패: ${error.message}`);
      setPlacelist([]);
    }
  };

  // 장소 선택
  const handlePlaceClick = (place) => {
    const kakao = safeKakaoAccess();
    if (!kakao) return;

    try {
      const lat = parseFloat(place.y);
      const lng = parseFloat(place.x);
      const locPosition = new kakao.maps.LatLng(lat, lng);

      displayMarker(locPosition);

      const placeData = {
        name: place.place_name,
        address: place.road_address_name || place.address_name,
      };

      setSelectedPlace(placeData);

      if (onChange) {
        onChange({
          locationName: placeData.name,
          roadAddress: placeData.address,
          lat: lat,
          lng: lng,
        });
      }

      updateDebugInfo(`장소 선택: ${placeData.name}`);
    } catch (error) {
      console.error('장소 선택 실패:', error);
      updateDebugInfo(`장소 선택 실패: ${error.message}`);
    }
  };

  // 강제 재로드 핸들러
  const handleForceReload = async () => {
    updateDebugInfo('강제 재로드 시작');
    setLoadingState('loading');
    setErrorMessage('');
    isInitialized.current = false;

    try {
      await forceReloadKakaoMap();
      updateDebugInfo('강제 재로드 성공');
      // 페이지 새로고침으로 완전히 초기화
      window.location.reload();
    } catch (error) {
      updateDebugInfo(`강제 재로드 실패: ${error.message}`);
      setErrorMessage(error.message);
      setLoadingState('error');
    }
  };

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
            <div className="mt-2 text-xs text-gray-500">
              {checkKakaoMapStatus().retryCount > 0 && (
                <span>재시도 중... ({checkKakaoMapStatus().retryCount}/3)</span>
              )}
            </div>
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

              <button
                onClick={handleForceReload}
                className="px-3 py-2 bg-red-500 text-white rounded text-xs hover:bg-red-400"
              >
                강제 재로드
              </button>
            </div>

            {/* 디버그 정보 (개발 환경에서만) */}
            {process.env.NODE_ENV === 'development' && debugInfo && (
              <details className="mt-3 text-left">
                <summary className="cursor-pointer text-xs text-gray-400">
                  디버그 정보
                </summary>
                <pre className="text-xs text-gray-500 mt-2 whitespace-pre-wrap">
                  {debugInfo}
                </pre>
              </details>
            )}
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
          style={{ height: '200px', borderRadius: '10px', margin: '8px 0' }}
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
