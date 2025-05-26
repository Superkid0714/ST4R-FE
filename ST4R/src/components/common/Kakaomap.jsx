import React from 'react';
import { useEffect, useRef, useState } from 'react';

const { kakao } = window;

function Kakaomap(props) {
  const container = useRef(null); // 지도 컨테이너 접근
  const markerRef = useRef(null); // 전역 마크 설정
  const [latlng, setLatlng] = useState(null); //클릭한 곳의 위도,경도
  const [address, setAddress] = useState(null); // 클릭한 곳의 주소 정보

  useEffect(() => {
    const options = {
      //지도를 생성할 때 필요한 기본 옵션
      center: new kakao.maps.LatLng(35.1757875820353, 126.90820322250839), //지도의 중심좌표.
      level: 3, //지도의 레벨(확대, 축소 정도)
    };

    const map = new kakao.maps.Map(container.current, options); //지도 생성 및 객체 리턴
    const geocoder = new kakao.maps.services.Geocoder(); // 주소-좌표 변환 객체를 생성합니다
    const infowindow = new kakao.maps.InfoWindow({ zIndex: 1 });

    //📌마커와 인포윈도우를 생성하는 함수
    const displayMarker = (locPosition, message = null) => {
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

    // 📍 현재 위치 표시
    if (navigator.geolocation) {
      // GeoLocation을 이용해서 접속 위치를 얻어옵니다
      navigator.geolocation.getCurrentPosition((position) => {
        const lat = position.coords.latitude; // 위도
        const lon = position.coords.longitude; // 경도
        const locPosition = new kakao.maps.LatLng(lat, lon); // 마커가 표시될 위치를 geolocation으로 얻어온 좌표로 생성합니다

        const message = '<div style="padding:5px; color:black;">현재위치</div>'; // 인포윈도우에 표시될 내용입니다

        displayMarker(locPosition, message);
      });
    } else {
      // HTML5의 GeoLocation을 사용할 수 없을때 마커 표시 위치와 인포윈도우 내용을 설정합니다

      const locPosition = new kakao.maps.LatLng(
        35.30019091752179,
        127.37915975896176
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

            const message = `
              <div class="flex flex-col items-start gap-1 p-2 w-full whitespace-nowrap">
                ${jibun ? `<div class="text-sm text-[#000000]">지번 주소: ${jibun}</div>` : ''}
                ${road ? `<div class="text-sm text-[#000000]">도로명 주소: ${road}</div>` : ''}
              </div>
            `;

            displayMarker(clickedlatlng, message);

            // state에 저장
            setAddress({
              road: road || null,
              jibun: jibun || null,
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

  return (
    <div>
      <div
        id="map"
        ref={container}
        style={{ width: '500px', height: '400px' }}
      />
    </div>
  );
}

export default Kakaomap;
