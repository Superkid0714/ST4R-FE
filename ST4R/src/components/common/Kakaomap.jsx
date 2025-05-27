import React from 'react';
import search from '../../assets/icons/search.svg';
import { useEffect, useRef, useState } from 'react';

const { kakao } = window;

function Kakaomap(props) {
  const container = useRef(null); // 지도 컨테이너 접근

  const markerRef = useRef(null); // 전역 함수설정
  const mapRef = useRef(null);
  const geocoderRef = useRef(null);
  const infowindowRef = useRef(null);

  const [latlng, setLatlng] = useState(null); //클릭한 곳의 위도,경도
  const [keyword, setKeyword] = useState(null); // 클릭한 곳의 주소 정보
  const [selectedPlace, setSelectedPlace] = useState(null); // 검색한 곳의 장소명 + 클릭한 곳의 주소 정보 합쳐진 변수
  const [placelist, setPlacelist] = useState([]); // 검색 결과 리스트

  //📌마커와 인포윈도우를 생성하는 함수(여러곳에서 사용하므로 useeffect밖으로 뺌)
  const displayMarker = (locPosition, message = null) => {
    const map = mapRef.current;
    const infowindow = infowindowRef.current;

    // 이미 생성된 마커가 있으면
    if (markerRef.current) {
      markerRef.current.setPosition(locPosition);
      markerRef.current.setMap(map);
    } else {
      // 생성된 마크가 없으면
      const marker = new kakao.maps.Marker({
        map: map,
        position: locPosition,
      });
      markerRef.current = marker;
    }

    // 인포윈도우 생성
    if (message) {
      infowindow.setContent(message);
      infowindow.open(map, markerRef.current);
    }

    // 지도 중심 이동
    map.setCenter(locPosition);
  };

  //외부 라이브러리 초기화, 브라우저 api호출, 이벤트 등록 함수들은 useeffect안에 넣음
  useEffect(() => {
    const options = {
      //지도를 생성할 때 필요한 기본 옵션
      center: new kakao.maps.LatLng(35.1757875820353, 126.90820322250839), //지도의 중심좌표.
      level: 3, //지도의 레벨(확대, 축소 정도)
    };

    const map = new kakao.maps.Map(container.current, options); //지도 객체 생성
    const geocoder = new kakao.maps.services.Geocoder(); // 주소-좌표 변환 객체 생성
    const infowindow = new kakao.maps.InfoWindow({ zIndex: 1 }); //인포윈도우 객체 생성

    mapRef.current = map;
    geocoderRef.current = geocoder;
    infowindowRef.current = infowindow;

    //📌현재 위치 표시(마커를 찍기 전)
    if (navigator.geolocation) {
      // GeoLocation을 이용해서 접속 위치를 얻어오기
      navigator.geolocation.getCurrentPosition((position) => {
        const lat = position.coords.latitude; // 위도
        const lon = position.coords.longitude; // 경도
        const locPosition = new kakao.maps.LatLng(lat, lon); // 마커가 표시될 위치를 geolocation으로 얻어온 좌표로 생성

        const message = '<div style="padding:5px; color:black;">현재위치</div>'; // 인포윈도우에 표시될 내용

        displayMarker(locPosition, message);
      });
    } else {
      // HTML5의 GeoLocation을 사용할 수 없을때 마커 표시 위치와 인포윈도우 내용을 설정

      const locPosition = new kakao.maps.LatLng(
        35.30019091752179,
        127.37915975896176 // 기본 지도 초기화면을 전남대로 설정함
      );
      const message =
        '<div style="padding:5px; color:black;">현재위치를 가져올 수 없어요</div>';

      displayMarker(locPosition, message);
    }

    //📌마우스 클릭하면 마커 생성 + 주소 표시
    kakao.maps.event.addListener(map, 'click', (mouseEvent) => {
      const clickedlatlng = mouseEvent.latLng;

      //주소 변환
      geocoder.coord2Address(
        clickedlatlng.getLng(),
        clickedlatlng.getLat(),
        (result, status) => {
          if (status === kakao.maps.services.Status.OK) {
            const road = result[0].road_address?.address_name; //도로명주소
            const jibun = result[0].address?.address_name; // 지번주소
            const addressText = road || jibun || '주소 정보 없음';

            const message = `
              <div class="flex flex-col items-start gap-1 p-2 w-full whitespace-nowrap">
                ${selectedPlace ? `<div class="text-sm text-[#000000]">주소: ${addressText}</div>` : ''}
              </div>
            `;

            displayMarker(clickedlatlng, message);

            //state설정
            setSelectedPlace({
              name: null, // 장소명은 없으니까 null
              address: road || jibun || null,
            });

            setLatlng({
              lat: clickedlatlng.getLat(),
              lng: clickedlatlng.getLng(),
            });
          }
        }
      );
    });
  }, []);

  //장소 검색 함수
  function searchPlaces() {
    const ps = new kakao.maps.services.Places(); // 장소 검색 객체를 생성

    // 장소검색 객체를 통해 키워드로 장소검색을 요청
    ps.keywordSearch(keyword, (data, status) => {
      if (status === kakao.maps.services.Status.OK) {
        // 정상적으로 검색이 완료됐으면
        // 검색 목록과 마커를 표출합니다
        setPlacelist(data);
      } else {
        setPlacelist([]);
      }
    });
  }

  // 장소 리스트 클릭했을 때 마커 표시 함수
  const handlePlaceClick = (place) => {
    const lat = parseFloat(place.y);
    const lng = parseFloat(place.x);
    const locPosition = new window.kakao.maps.LatLng(lat, lng);

    displayMarker(locPosition);

    // state에 저장
    setSelectedPlace({
      name: place.place_name,
      address: place.road_address_name || place.address_name,
    });

    setLatlng({
      lat: lat,
      lng: lng,
    });
  };

  return (
    <div>
      <div className="flex flex-col gap-2">
        {/* 검색창 */}
        <div className="flex gap-2">
          <input
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            placeholder="장소를 검색하세요"
            onKeyDown={searchPlaces}
            className="h-10 w-3/4 px-2 bg-[#1D1D1D] font-['Pretendard'] placeholder:text-[#565656] rounded-[10px] focus:outline-none text-sm"
          />
          <button
            onClick={() => {
              searchPlaces();
            }}
          >
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
              onClick={() => {
                handlePlaceClick(place);
              }}
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
        <div className="flex flex-col gap-0.5 p-3 2 bg-[#1D1D1D] rounded-[10px] justify-start">
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
