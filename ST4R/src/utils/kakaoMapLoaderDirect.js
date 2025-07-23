// 직접적인 카카오 맵 로더
export const loadKakaoMapDirect = () => {
  return new Promise((resolve, reject) => {
    // 이미 로드된 경우
    if (window.kakao && window.kakao.maps) {
      console.log('카카오 맵이 이미 존재합니다');
      resolve(window.kakao);
      return;
    }

    // 기존 스크립트 제거
    const existingScripts = document.querySelectorAll('script[src*="kakao"]');
    existingScripts.forEach((s) => s.remove());

    // 직접 스크립트 URL 사용
    const script = document.createElement('script');
    script.src =
      'https://dapi.kakao.com/v2/maps/sdk.js?appkey=5efbd2f844cb3d8609377a11750272bb&libraries=services';

    script.onload = () => {
      // 카카오 맵이 로드될 때까지 대기
      const waitForKakao = setInterval(() => {
        if (window.kakao && window.kakao.maps && window.kakao.maps.LatLng) {
          clearInterval(waitForKakao);
          console.log('카카오 맵 로드 성공!');
          resolve(window.kakao);
        }
      }, 100);

      // 10초 후 타임아웃
      setTimeout(() => {
        clearInterval(waitForKakao);
        reject(new Error('카카오 맵 로드 타임아웃'));
      }, 10000);
    };

    script.onerror = () => {
      reject(new Error('카카오 맵 스크립트 로드 실패'));
    };

    document.head.appendChild(script);
  });
};
