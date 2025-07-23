// 전역 상태 관리
let kakaoMapPromise = null;

// 카카오 맵 스크립트 로드 함수
export const loadKakaoMapScript = () => {
  // 이미 로딩 중이거나 로드된 경우
  if (kakaoMapPromise) {
    return kakaoMapPromise;
  }

  kakaoMapPromise = new Promise((resolve, reject) => {
    // 이미 로드된 경우
    if (window.kakao && window.kakao.maps && window.kakao.maps.LatLng) {
      console.log('✅ 카카오 맵이 이미 로드되어 있습니다.');
      resolve(window.kakao);
      return;
    }

    // 기존 스크립트 제거
    const existingScript = document.querySelector(
      'script[src*="dapi.kakao.com"]'
    );
    if (existingScript) {
      existingScript.remove();
    }

    console.log('🚀 카카오 맵 로딩 시작');

    const script = document.createElement('script');
    const apiKey = '5efbd2f844cb3d8609377a11750272bb';

    // autoload=false로 명시적 설정
    script.src = `https://dapi.kakao.com/v2/maps/sdk.js?appkey=${apiKey}&libraries=services&autoload=false`;
    script.async = true;

    script.onload = () => {
      console.log('✅ 스크립트 태그 로드 완료');

      // autoload=false를 사용할 때는 kakao.maps.load()를 호출해야 함
      if (window.kakao && window.kakao.maps) {
        window.kakao.maps.load(() => {
          console.log('🎉 카카오 맵 사용 준비 완료');
          resolve(window.kakao);
        });
      } else {
        reject(new Error('카카오 맵 로드 실패'));
      }
    };

    script.onerror = () => {
      reject(new Error('카카오 맵 스크립트 로드 실패'));
    };

    document.head.appendChild(script);
  });

  return kakaoMapPromise;
};

// 카카오 맵 API 안전 접근 함수
export const safeKakaoAccess = () => {
  try {
    return window.kakao && window.kakao.maps && window.kakao.maps.LatLng
      ? window.kakao
      : null;
  } catch (error) {
    console.error('카카오 맵 접근 실패:', error);
    return null;
  }
};

// 카카오 맵 상태 확인 함수
export const checkKakaoMapStatus = () => {
  return {
    loaded: !!(window.kakao && window.kakao.maps && window.kakao.maps.LatLng),
    kakaoObject: !!window.kakao,
    mapsObject: !!window.kakao?.maps,
    latLngObject: !!window.kakao?.maps?.LatLng,
  };
};
