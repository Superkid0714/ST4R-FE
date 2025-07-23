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
    'script[src*="dapi.kakao.com"], script[src*="/api/kakao-sdk.js"]'
  );
  existingScripts.forEach((script) => {
    console.log('기존 카카오 스크립트 제거:', script.src);
    script.remove();
  });
};

// 환경 감지 함수
const detectEnvironment = () => {
  const hostname = window.location.hostname;
  const isLocalhost = hostname === 'localhost' || hostname === '127.0.0.1';
  const isVercel =
    hostname.includes('vercel.app') || hostname.includes('.vercel.app');
  const isDevelopment = process.env.NODE_ENV === 'development';

  return {
    isLocalhost,
    isVercel,
    isDevelopment,
    hostname,
  };
};

// 카카오 맵 스크립트 로드 함수
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

  kakaoMapLoadPromise = new Promise(async (resolve, reject) => {
    retryCount++;
    console.log(`🚀 카카오 맵 로딩 시도 #${retryCount}`);

    // 기존 스크립트가 있다면 제거
    if (retryCount > 1) {
      removeExistingScript();
      if (window.kakao) {
        delete window.kakao;
      }
    }

    kakaoMapLoading = true;

    try {
      const apiKey = '5efbd2f844cb3d8609377a11750272bb';
      const env = detectEnvironment();
      console.log('🌍 환경 정보:', env);

      // 스크립트 생성
      const script = document.createElement('script');
      script.type = 'text/javascript';
      script.async = false; // 동기 로드로 변경

      // Vercel에서는 proxy URL 사용, 로컬에서는 직접 로드
      if (env.isVercel) {
        script.src = '/api/kakao-sdk.js';
      } else {
        script.src = `https://dapi.kakao.com/v2/maps/sdk.js?appkey=${apiKey}&libraries=services&autoload=false`;
      }

      // 로드 완료 핸들러
      script.onload = () => {
        console.log('✅ 스크립트 로드 완료');

        // kakao 객체 확인 및 초기화
        let checkCount = 0;
        const checkInterval = setInterval(() => {
          checkCount++;

          if (window.kakao && window.kakao.maps) {
            clearInterval(checkInterval);

            // autoload=false인 경우 명시적으로 로드
            if (window.kakao.maps.load) {
              console.log('📍 카카오 맵 명시적 로드 시작');
              window.kakao.maps.load(() => {
                console.log('🎉 카카오 맵 초기화 완료');
                kakaoMapLoaded = true;
                kakaoMapLoading = false;
                retryCount = 0;
                resolve(window.kakao);
              });
            } else {
              console.log('✅ 카카오 맵 즉시 사용 가능');
              kakaoMapLoaded = true;
              kakaoMapLoading = false;
              retryCount = 0;
              resolve(window.kakao);
            }
          } else if (checkCount > 100) {
            // 10초 타임아웃
            clearInterval(checkInterval);
            throw new Error('카카오 맵 객체를 찾을 수 없습니다');
          }
        }, 100);
      };

      // 에러 핸들러
      script.onerror = (error) => {
        console.error('❌ 스크립트 로드 실패:', error);
        throw new Error('카카오 맵 스크립트 로드 실패');
      };

      // 스크립트 추가
      document.head.appendChild(script);

      // 전체 타임아웃 설정
      const timeout = env.isVercel ? 30000 : 20000;
      setTimeout(() => {
        if (!kakaoMapLoaded) {
          removeExistingScript();
          throw new Error(`카카오 맵 로드 타임아웃 (${timeout / 1000}초)`);
        }
      }, timeout);
    } catch (error) {
      console.error('❌ 카카오 맵 로드 실패:', error);
      kakaoMapLoading = false;
      kakaoMapLoadPromise = null;

      // 재시도
      if (retryCount < MAX_RETRY) {
        console.log(`🔄 재시도 예정 (${retryCount}/${MAX_RETRY})`);
        setTimeout(() => {
          loadKakaoMapScript().then(resolve).catch(reject);
        }, 2000 * retryCount);
        return;
      }

      // 최대 재시도 횟수 도달
      console.error('💥 카카오 맵 로드 최종 실패');
      retryCount = 0;

      let errorMessage = '카카오 맵을 불러올 수 없습니다.';
      if (error.message.includes('타임아웃')) {
        errorMessage =
          '카카오 맵 로딩 시간이 초과되었습니다. 페이지를 새로고침해주세요.';
      } else if (error.message.includes('스크립트 로드 실패')) {
        errorMessage = '네트워크 연결을 확인하고 새로고침해주세요.';
      }

      reject(new Error(errorMessage));
    }
  });

  return kakaoMapLoadPromise;
};

// 카카오 맵 상태 확인 함수
export const checkKakaoMapStatus = () => {
  const env = detectEnvironment();
  return {
    loaded: kakaoMapLoaded,
    loading: kakaoMapLoading,
    available: !!safeKakaoAccess(),
    retryCount,
    environment: env,
    kakaoObject: window.kakao ? 'exists' : 'not found',
    kakaoMaps: window.kakao?.maps ? 'exists' : 'not found',
  };
};

// 카카오 맵 강제 리로드 함수
export const forceReloadKakaoMap = () => {
  console.log('🔄 카카오 맵 강제 리로드');
  kakaoMapLoaded = false;
  kakaoMapLoading = false;
  kakaoMapLoadPromise = null;
  retryCount = 0;

  removeExistingScript();

  if (window.kakao) {
    delete window.kakao;
  }

  return loadKakaoMapScript();
};
