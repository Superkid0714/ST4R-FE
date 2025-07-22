import search from '../../assets/icons/search.svg';
import { useEffect, useRef, useState } from 'react';

// 카카오 맵 스크립트 로딩 상태 관리
let kakaoMapLoaded = false;
let kakaoMapLoading = false;
let kakaoMapLoadPromise = null;

// 카카오 맵 API 동적 로드 함수
const loadKakaoMapScript = () => {
  return new Promise((resolve, reject) => {
    // 이미 로드됐다면 바로 resolve
    if (window.kakao && window.kakao.maps) {
      kakaoMapLoaded = true;
      resolve(window.kakao);
      return;
    }

    // 이미 로딩 중이라면 기존 Promise 반환
    if (kakaoMapLoading && kakaoMapLoadPromise) {
      return kakaoMapLoadPromise;
    }

    kakaoMapLoading = true;
    kakaoMapLoadPromise = new Promise((res, rej) => {
      const script = document.createElement('script');
      script.src =
        '//dapi.kakao.com/v2/maps/sdk.js?appkey=5efbd2f844cb3d8609377a11750272bb&libraries=services&autoload=false';
      script.async = true;

      script.onload = () => {
        // autoload=false로 설정했으므로 수동으로 로드
        window.kakao.maps.load(() => {
          kakaoMapLoaded = true;
          kakaoMapLoading = false;
          res(window.kakao);
        });
      };

      script.onerror = () => {
        kakaoMapLoading = false;
        kakaoMapLoadPromise = null;
        rej(new Error('카카오 맵 스크립트 로드 실패'));
      };

      document.head.appendChild(script);
    });

    return kakaoMapLoadPromise.then(resolve).catch(reject);
  });
};

function Kakaomap({
  onChange,
  initialLat,
  initialLng,
  initialRoadAddress,
  initialMap = false,
  initialLocation,
}) {
  const container = useRef(null); // 지도 컨테이너 접근
  const markerRef = useRef(null); // 전역 함수설정
  const mapRef = useRef(null);
  const geocoderRef = useRef(null);
  const infowindowRef = useRef(null);

  const [keyword, setKeyword] = useState(''); // 검색 키워드
  const [selectedPlace, setSelectedPlace] = useState(null); // 검색한 곳의 장소명 + 클릭한 곳의 주소 정보
  const [placelist, setPlacelist] = useState([]); // 검색 결과 리스트

  // 카카오 맵 로딩 상태 추가
  const [isKakaoLoaded, setIsKakaoLoaded] = useState(false);
  const [kakaoError, setKakaoError] = useState(null);

  // 카카오 맵 API 로드
  useEffect(() => {
    const initKakaoMap = async () => {
      try {
        // 이미 로드된 경우 바로 사용
        if (window.kakao && window.kakao.maps && kakaoMapLoaded) {
          setIsKakaoLoaded(true);
          return;
        }

        // 카카오 맵 스크립트 로드
        await loadKakaoMapScript();
        setIsKakaoLoaded(true);
        setKakaoError(null);
      } catch (error) {
        console.error('카카오 맵 초기화 실패:', error);
        setKakaoError(error.message);
      }
    };

    initKakaoMap();
  }, []);

  // 마커와 인포윈도우를 생성하는 함수
  const displayMarker = (locPosition, message = null) => {
    if (!window.kakao || !window.kakao.maps) return;

    const map = mapRef.current;
    const infowindow = infowindowRef.current;

    // 이미 생성된 마커가 있으면
    if (markerRef.current) {
      markerRef.current.setPosition(locPosition);
      markerRef.current.setMap(map);
    } else {
      // 생성된 마크가 없으면
      const marker = new window.kakao.maps.Marker({
        map: map,
        position: locPosition,
      });
      markerRef.current = marker;
    }

    // 인포윈도우 생성
    if (message && infowindow) {
      infowindow.setContent(message);
      infowindow.open(map, markerRef.current);
    }

    // 지도 중심 이동
    if (map) {
      map.setCenter(locPosition);
    }
  };

  // 초기 위치 설정 함수
  const setInitialLocationOnMap = (location) => {
    if (!window.kakao || !window.kakao.maps) return;

    if (location && location.lat && location.lng) {
      const locPosition = new window.kakao.maps.LatLng(
        location.lat,
        location.lng
      );

      const message = `
        <div class="p-2 h-4 whitespace-nowrap text-sm text-[#000000]">
          ${location.locationName || '위치 정보'}
        </div>
      `;

      displayMarker(locPosition, message);

      // state 설정
      setSelectedPlace({
        name: location.locationName,
        address: location.roadAddress,
      });

      // 부모에게 데이터 전달
      if (onChange) {
        onChange({
          locationName: location.locationName,
          roadAddress: location.roadAddress,
          lat: location.lat,
          lng: location.lng,
        });
      }
    }
  };

  // 지도 초기화 - 카카오 맵이 로드된 후에만 실행
  useEffect(() => {
    if (
      !isKakaoLoaded ||
      !window.kakao ||
      !window.kakao.maps ||
      !container.current
    ) {
      return;
    }

    const kakao = window.kakao;

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

    // 초기 위치 설정
    if (initialMap && initialLat && initialLng && initialRoadAddress) {
      const locPosition = new kakao.maps.LatLng(initialLat, initialLng);
      const message = `
        <div class="p-2 h-4 whitespace-nowrap text-sm text-[#000000]">
          주소: ${initialRoadAddress}
        </div>
      `;
      displayMarker(locPosition, message);
    } else if (initialLocation) {
      setInitialLocationOnMap(initialLocation);
    } else {
      // 현재 위치 가져오기
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition((position) => {
          const lat = position.coords.latitude;
          const lon = position.coords.longitude;
          const locPosition = new kakao.maps.LatLng(lat, lon);
          const message =
            '<div style="padding:5px; color:black;">현재위치</div>';
          displayMarker(locPosition, message);
        });
      } else {
        const locPosition = new kakao.maps.LatLng(
          35.30019091752179,
          127.37915975896176
        );
        const message =
          '<div style="padding:4px; color:black;">현재위치를 가져올 수 없어요</div>';
        displayMarker(locPosition, message);
      }
    }

    // 마우스 클릭 시 이벤트 등록
    kakao.maps.event.addListener(map, 'click', (mouseEvent) => {
      const clickedlatlng = mouseEvent.latLng;

      geocoder.coord2Address(
        clickedlatlng.getLng(),
        clickedlatlng.getLat(),
        (result, status) => {
          if (status === kakao.maps.services.Status.OK) {
            const road = result[0].road_address?.address_name;
            const jibun = result[0].address?.address_name;
            const addressText = road || jibun || '주소 정보 없음';

            const message = `
              <div class="p-2 h-10 whitespace-nowrap text-sm text-[#000000]">주소: ${addressText}</div>
            `;

            displayMarker(clickedlatlng, message);

            setSelectedPlace({
              name: null,
              address: road || jibun || null,
            });

            if (onChange) {
              onChange({
                locationName: null,
                roadAddress: road || jibun || null,
                lat: clickedlatlng.getLat(),
                lng: clickedlatlng.getLng(),
              });
            }
          }
        }
      );
    });

    // cleanup 함수
    return () => {
      if (markerRef.current) {
        markerRef.current.setMap(null);
        markerRef.current = null;
      }
    };
  }, [
    isKakaoLoaded,
    initialLat,
    initialLng,
    initialRoadAddress,
    initialMap,
    initialLocation,
    onChange,
  ]);

  // 장소 검색 함수
  function searchPlaces() {
    if (!keyword.trim() || !window.kakao || !window.kakao.maps) return;

    const ps = new window.kakao.maps.services.Places();

    ps.keywordSearch(keyword, (data, status) => {
      if (status === window.kakao.maps.services.Status.OK) {
        setPlacelist(data);
      } else {
        setPlacelist([]);
      }
    });
  }

  // 장소 리스트 클릭했을 때 마커 표시 함수
  const handlePlaceClick = (place) => {
    if (!window.kakao || !window.kakao.maps) return;

    const lat = parseFloat(place.y);
    const lng = parseFloat(place.x);
    const locPosition = new window.kakao.maps.LatLng(lat, lng);

    displayMarker(locPosition);

    // state에 저장
    setSelectedPlace({
      name: place.place_name,
      address: place.road_address_name || place.address_name,
    });

    const newPlace = {
      name: place.place_name,
      address: place.road_address_name || place.address_name,
    };
    const newLatlng = {
      lat: lat,
      lng: lng,
    };

    if (onChange) {
      onChange({
        locationName: newPlace.name,
        roadAddress: newPlace.address,
        lat: newLatlng.lat,
        lng: newLatlng.lng,
      });
    }
  };

  // 키보드 이벤트 핸들러 (Enter 키로 검색)
  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      searchPlaces();
    }
  };

  // 카카오 맵이 아직 로드되지 않은 경우
  if (!isKakaoLoaded) {
    return (
      <div className="flex flex-col gap-2">
        <div className="flex gap-2">
          <input
            disabled
            placeholder="카카오 맵 로딩 중..."
            className="h-10 w-3/4 px-2 bg-[#1D1D1D] font-['Pretendard'] placeholder:text-[#565656] rounded-[10px] focus:outline-none text-sm opacity-50"
          />
          <button disabled>
            <img src={search} alt="검색" className="w-7 h-7 opacity-50" />
          </button>
        </div>

        <div className="h-[200px] bg-[#1D1D1D] rounded-[10px] flex items-center justify-center">
          {kakaoError ? (
            <div className="text-red-400 text-sm text-center">
              <div>지도를 불러올 수 없습니다</div>
              <div className="text-xs mt-1">{kakaoError}</div>
            </div>
          ) : (
            <div className="flex flex-col items-center">
              <div className="w-6 h-6 border-2 border-yellow-500 border-t-transparent rounded-full animate-spin mb-2"></div>
              <span className="text-sm text-gray-400">지도 로딩 중...</span>
            </div>
          )}
        </div>
      </div>
    );
  }

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
            className="h-10 w-3/4 px-2 bg-[#1D1D1D] font-['Pretendard'] placeholder:text-[#565656] rounded-[10px] focus:outline-none text-sm"
          />
          <button onClick={searchPlaces}>
            <img src={search} alt="검색" className="w-7 h-7" />
          </button>
        </div>

        <div
          id="map"
          ref={container}
          style={{ height: '200px', borderRadius: '10px', margin: '8px 0' }}
        />
      </div>

      {/* 검색 결과 리스트 */}
      {placelist.length > 0 && (
        <ul className="border rounded p-2 text-sm bg-white max-h-40 overflow-y-auto mb-[8px]">
          {placelist.map((place) => (
            <li
              key={place.id}
              onClick={() => handlePlaceClick(place)}
              className="cursor-pointer hover:bg-gray-100 p-1 border-b"
            >
              <div className="font-semibold text-black">{place.place_name}</div>
              <div className="text-gray-500 text-xs">
                {place.road_address_name || place.address_name}
              </div>
            </li>
          ))}
        </ul>
      )}

      {/* 화면에 선택한 장소 표시 */}
      {selectedPlace && (
        <div className="flex flex-col gap-0.5 p-3 bg-[#1D1D1D] rounded-[10px] justify-start">
          {selectedPlace.name && (
            <div className="flex-1 font-light text-sm font-['Pretendard']">
              📍 {selectedPlace.name}
            </div>
          )}
          {selectedPlace.address && (
            <div className="flex-1 font-light text-sm font-['Pretendard']">
              🗺️ {selectedPlace.address}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default Kakaomap;
