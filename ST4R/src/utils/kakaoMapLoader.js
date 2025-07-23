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

// 카카오 맵 스크립트 로드 함수 - 단순화
export const loadKakaoMapScript = () => {
  // 이미 로드된 경우
  if (kakaoMapLoaded && safeKakaoAccess()) {
    console.log('✅ 카카오 맵이 이미 로드되어 있습니다.');
    return Promise.resolve(window.kakao);
  }

  // 이미 로딩 중인 경우
  if (kakaoMapLoadPromise) {
    console.log('⏳ 카카오 맵 로딩이 이미 진행 중입니다.');
    return kakaoMapLoadPromise;
  }

  kakaoMapLoadPromise = new Promise((resolve, reject) => {
    // 재시도 카운터 증가
    retryCount++;
    console.log(`🚀 카카오 맵 로딩 시도 #${retryCount}`);

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
    script.async = true;
    // script.crossOrigin = 'anonymous';

    // API 키와 함께 스크립트 URL 생성
    const apiKey = '5efbd2f844cb3d8609377a11750272bb';
    script.src = `https://dapi.kakao.com/v2/maps/sdk.js?appkey=${apiKey}&libraries=services&autoload=false`;

    let timeoutId;

    // 성공 핸들러
    const handleSuccess = () => {
      console.log('✅ 카카오 맵 스크립트 로드 완료');
      clearTimeout(timeoutId);

      // autoload=false이므로 수동으로 로드
      const checkAndLoad = () => {
        if (window.kakao && window.kakao.maps) {
          if (window.kakao.maps.load) {
            console.log('🔄 window.kakao.maps.load() 실행');
            window.kakao.maps.load(() => {
              const kakao = safeKakaoAccess();
              if (kakao) {
                console.log('🎉 카카오 맵 초기화 성공');
                kakaoMapLoaded = true;
                kakaoMapLoading = false;
                retryCount = 0;
                resolve(kakao);
              } else {
                handleError(new Error('카카오 맵 객체 접근 실패'));
              }
            });
          } else {
            // maps.load가 없는 경우 직접 확인
            const kakao = safeKakaoAccess();
            if (kakao) {
              console.log('✅ 카카오 맵 즉시 사용 가능');
              kakaoMapLoaded = true;
              kakaoMapLoading = false;
              retryCount = 0;
              resolve(kakao);
            } else {
              setTimeout(checkAndLoad, 100);
            }
          }
        } else {
          setTimeout(checkAndLoad, 100);
        }
      };

      checkAndLoad();
    };

    // 에러 핸들러
    const handleError = (error) => {
      console.error('❌ 카카오 맵 로드 실패:', error);
      clearTimeout(timeoutId);
      kakaoMapLoading = false;
      kakaoMapLoadPromise = null;

      // 최대 재시도 횟수에 도달하지 않았다면 재시도
      if (retryCount < MAX_RETRY) {
        console.log(`🔄 재시도 예정 (${retryCount}/${MAX_RETRY})`);
        setTimeout(() => {
          loadKakaoMapScript().then(resolve).catch(reject);
        }, 1000 * retryCount);
        return;
      }

      // 최대 재시도 횟수 도달
      console.error('💥 카카오 맵 로드 최종 실패');
      retryCount = 0;

      // 구체적인 에러 메시지 생성
      let errorMessage = '카카오 맵을 불러올 수 없습니다.';

      if (
        error.message.includes('타임아웃') ||
        error.message.includes('timeout')
      ) {
        errorMessage =
          '카카오 맵 로딩 시간이 초과되었습니다. 인터넷 연결을 확인하고 새로고침해주세요.';
      } else if (
        error.message.includes('네트워크') ||
        error.message.includes('network')
      ) {
        errorMessage = '네트워크 연결을 확인하고 새로고침해주세요.';
      } else if (
        error.message.includes('CSP') ||
        error.message.includes('security')
      ) {
        errorMessage =
          '보안 정책으로 인해 카카오 맵을 로드할 수 없습니다. 새로고침을 시도해주세요.';
      }

      const finalError = new Error(errorMessage);
      finalError.originalError = error;
      reject(finalError);
    };

    // 스크립트 이벤트 리스너
    script.onload = handleSuccess;
    script.onerror = (event) => {
      const error = new Error('카카오 맵 스크립트 다운로드 실패');
      error.event = event;
      handleError(error);
    };

    // 타임아웃 설정 (15초)
    timeoutId = setTimeout(() => {
      handleError(new Error('카카오 맵 로드 타임아웃 (15초)'));
    }, 15000);

    // 스크립트를 DOM에 추가
    try {
      document.head.appendChild(script);
      console.log('📥 카카오 맵 스크립트 DOM에 추가됨');
    } catch (e) {
      handleError(new Error(`스크립트 추가 실패: ${e.message}`));
    }
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
  console.log('🔄 카카오 맵 강제 리로드');
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
