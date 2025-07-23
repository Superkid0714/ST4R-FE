// 전역 상태 관리
let kakaoMapLoaded = false;
let kakaoMapLoading = false;
let kakaoMapLoadPromise = null;
let retryCount = 0;
const MAX_RETRY = 3;

// 카카오 맵 API 안전 접근 함수
export const safeKakaoAccess = () => {
  try {
    return typeof window !== 'undefined' &&
      window.kakao &&
      window.kakao.maps &&
      typeof window.kakao.maps.Map === 'function'
      ? window.kakao
      : null;
  } catch (error) {
    console.error('카카오 맵 접근 실패:', error);
    return null;
  }
};

// 기존 스크립트 제거 함수
const removeExistingScript = () => {
  const existingScripts = document.querySelectorAll(
    'script[src*="dapi.kakao.com"]'
  );
  existingScripts.forEach((script) => {
    console.log('기존 카카오 스크립트 제거');
    script.remove();
  });
};

// 카카오 맵 스크립트 로드 함수
export const loadKakaoMapScript = () => {
  // 이미 로드된 경우
  if (kakaoMapLoaded && safeKakaoAccess()) {
    console.log('카카오 맵이 이미 로드되어 있습니다.');
    return Promise.resolve(window.kakao);
  }

  // 이미 로딩 중인 경우
  if (kakaoMapLoadPromise) {
    console.log('카카오 맵 로딩이 이미 진행 중입니다.');
    return kakaoMapLoadPromise;
  }

  kakaoMapLoadPromise = new Promise((resolve, reject) => {
    // 현재 환경 확인
    const currentDomain = window.location.hostname;
    console.log('현재 도메인:', currentDomain);

    // 재시도 카운터 증가
    retryCount++;
    console.log(`카카오 맵 로딩 시도 #${retryCount}`);

    // 기존 스크립트가 있다면 제거
    if (retryCount > 1) {
      removeExistingScript();
      // 전역 객체도 정리
      if (window.kakao) {
        delete window.kakao;
      }
    }

    kakaoMapLoading = true;

    // 새 스크립트 생성
    const script = document.createElement('script');
    script.type = 'text/javascript';
    script.async = true; // async로 변경하여 더 안정적으로 로드
    script.crossOrigin = 'anonymous'; // CORS 설정 추가

    // API 키와 함께 스크립트 URL 생성
    const apiKey =
      import.meta.env.VITE_KAKAO_API_KEY || '5efbd2f844cb3d8609377a11750272bb';
    script.src = `https://dapi.kakao.com/v2/maps/sdk.js?appkey=${apiKey}&libraries=services&autoload=false`;

    let timeoutId;
    let loadCheckInterval;

    // 로딩 성공 핸들러
    script.onload = () => {
      console.log('카카오 맵 스크립트 로드 완료');
      clearTimeout(timeoutId);
      clearInterval(loadCheckInterval);

      // autoload=false이므로 수동으로 로드
      if (window.kakao && window.kakao.maps && window.kakao.maps.load) {
        window.kakao.maps.load(() => {
          const kakao = safeKakaoAccess();
          if (kakao) {
            console.log('카카오 맵 초기화 성공');
            kakaoMapLoaded = true;
            kakaoMapLoading = false;
            retryCount = 0; // 성공 시 재시도 카운터 리셋
            resolve(kakao);
          } else {
            console.error('카카오 맵 객체 접근 실패');
            handleLoadError(new Error('카카오 맵 초기화 실패'), reject);
          }
        });
      } else {
        // window.kakao.maps.load가 없는 경우의 fallback
        console.log('kakao.maps.load가 없음, 직접 확인 시도');
        let checkCount = 0;
        const maxChecks = 20;

        const checkLoaded = () => {
          checkCount++;
          const kakao = safeKakaoAccess();
          if (kakao) {
            console.log(`카카오 맵 사용 가능 (체크 #${checkCount})`);
            kakaoMapLoaded = true;
            kakaoMapLoading = false;
            retryCount = 0;
            resolve(kakao);
          } else if (checkCount < maxChecks) {
            setTimeout(checkLoaded, 100);
          } else {
            console.error('카카오 맵 로드 확인 시간 초과');
            handleLoadError(new Error('카카오 맵 로드 확인 타임아웃'), reject);
          }
        };

        setTimeout(checkLoaded, 100);
      }
    };

    // 로딩 실패 핸들러
    script.onerror = (event) => {
      console.error('카카오 맵 스크립트 로드 실패:', event);
      clearTimeout(timeoutId);
      clearInterval(loadCheckInterval);

      const error = new Error(
        `카카오 맵 스크립트 로드 실패 (시도 #${retryCount})`
      );
      error.event = event;
      handleLoadError(error, reject);
    };

    // 에러 처리 함수
    const handleLoadError = (error, rejectFn) => {
      kakaoMapLoading = false;
      kakaoMapLoadPromise = null;

      // 최대 재시도 횟수에 도달하지 않았다면 재시도
      if (retryCount < MAX_RETRY) {
        console.log(`재시도 예정 (${retryCount}/${MAX_RETRY})`);
        setTimeout(() => {
          console.log('카카오 맵 로딩 재시도');
          loadKakaoMapScript().then(resolve).catch(rejectFn);
        }, 1000 * retryCount); // 재시도 간격을 점진적으로 증가
        return;
      }

      // 최대 재시도 횟수 도달
      console.error('카카오 맵 로드 최종 실패:', error);
      retryCount = 0; // 리셋
      rejectFn(error);
    };

    // 타임아웃 설정 (15초로 증가)
    timeoutId = setTimeout(() => {
      console.error('카카오 맵 로드 타임아웃');
      const error = new Error(`카카오 맵 로드 타임아웃 (시도 #${retryCount})`);
      handleLoadError(error, reject);
    }, 15000);

    // 스크립트를 DOM에 추가
    console.log('카카오 맵 스크립트 DOM 추가:', script.src);
    document.head.appendChild(script);

    // 주기적으로 로드 상태 확인 (fallback)
    loadCheckInterval = setInterval(() => {
      if (safeKakaoAccess()) {
        console.log('주기적 체크에서 카카오 맵 발견');
        clearTimeout(timeoutId);
        clearInterval(loadCheckInterval);
        kakaoMapLoaded = true;
        kakaoMapLoading = false;
        retryCount = 0;
        resolve(window.kakao);
      }
    }, 500);
  });

  return kakaoMapLoadPromise;
};

// 카카오 맵 상태 확인 함수
export const checkKakaoMapStatus = () => {
  return {
    loaded: kakaoMapLoaded,
    loading: kakaoMapLoading,
    available: !!safeKakaoAccess(),
    retryCount,
  };
};

// 카카오 맵 강제 리로드 함수
export const forceReloadKakaoMap = () => {
  console.log('카카오 맵 강제 리로드');
  kakaoMapLoaded = false;
  kakaoMapLoading = false;
  kakaoMapLoadPromise = null;
  retryCount = 0;

  // 기존 스크립트 제거
  removeExistingScript();

  // 전역 객체 정리
  if (window.kakao) {
    delete window.kakao;
  }

  return loadKakaoMapScript();
};
