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
        console.log('📍 kakao.maps.load() 호출');
        window.kakao.maps.load(() => {
          console.log('🎉 카카오 맵 사용 준비 완료');
          resolve(window.kakao);
        });
      } else {
        // kakao 객체가 없으면 대기
        let attempts = 0;
        const checkKakao = setInterval(() => {
          attempts++;

          if (window.kakao && window.kakao.maps) {
            clearInterval(checkKakao);
            console.log('📍 kakao.maps.load() 호출 (delayed)');
            window.kakao.maps.load(() => {
              console.log('🎉 카카오 맵 사용 준비 완료');
              resolve(window.kakao);
            });
          } else if (attempts > 50) {
            // 5초 대기
            clearInterval(checkKakao);
            console.error('❌ 카카오 객체를 찾을 수 없습니다');
            reject(new Error('카카오 맵 로드 타임아웃'));
          }
        }, 100);
      }
    };

    script.onerror = () => {
      reject(new Error('카카오 맵 스크립트 로드 실패'));
    };

    document.head.appendChild(script);
    console.log('📜 스크립트 태그 추가됨');
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

// 카카오 맵 강제 리로드 함수
export const forceReloadKakaoMap = () => {
  console.log('🔄 카카오 맵 강제 리로드');

  // 기존 스크립트 제거
  const existingScripts = document.querySelectorAll(
    'script[src*="dapi.kakao.com"]'
  );
  existingScripts.forEach((script) => script.remove());

  // 전역 객체 정리
  if (window.kakao) {
    delete window.kakao;
  }

  // Promise 초기화
  kakaoMapPromise = null;

  // 디버깅을 위한 추가 로그
  console.log('🧹 기존 카카오 맵 정리 완료');
  console.log('📍 현재 window.kakao:', window.kakao);

  return loadKakaoMapScript();
};
