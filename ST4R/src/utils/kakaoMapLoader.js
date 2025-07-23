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

// CSP 호환 카카오 맵 로더
const loadKakaoMapWithCSP = (apiKey) => {
  return new Promise((resolve, reject) => {
    const env = detectEnvironment();
    console.log('🌍 환경 정보:', env);

    // 다양한 로딩 방식 시도
    const loadingStrategies = [
      // 전략 1: 기본 스크립트 로드
      () => {
        console.log('📥 전략 1: 기본 스크립트 로드');
        const script = document.createElement('script');
        script.type = 'text/javascript';
        script.async = true;
        script.src = `/api/kakao-sdk.js`;

        return new Promise((resolve, reject) => {
          script.onload = () => {
            console.log('✅ 기본 스크립트 로드 성공');
            resolve();
          };
          script.onerror = reject;
          document.head.appendChild(script);
        });
      },

      // 전략 2: defer 속성 사용
      () => {
        console.log('📥 전략 2: defer 속성 사용');
        const script = document.createElement('script');
        script.type = 'text/javascript';
        script.defer = true;
        script.src = `https://dapi.kakao.com/v2/maps/sdk.js?appkey=${apiKey}&libraries=services&autoload=false`;

        return new Promise((resolve, reject) => {
          script.onload = resolve;
          script.onerror = reject;
          document.head.appendChild(script);
        });
      },

      // 전략 3: 동적 import 시도
      () => {
        console.log('📥 전략 3: 동적 import 시도');
        return import(
          `https://dapi.kakao.com/v2/maps/sdk.js?appkey=${apiKey}&libraries=services&autoload=false`
        ).then(() => {
          console.log('✅ 동적 import 성공');
        });
      },

      // 전략 4: fetch + eval (최후의 수단)
      () => {
        console.log('📥 전략 4: fetch + eval');
        return fetch(
          `https://dapi.kakao.com/v2/maps/sdk.js?appkey=${apiKey}&libraries=services&autoload=false`
        )
          .then((response) => response.text())
          .then((scriptContent) => {
            // eval 사용 (CSP에서 'unsafe-eval' 허용 필요)
            eval(scriptContent);
            console.log('✅ fetch + eval 성공');
          });
      },
    ];

    let currentStrategy = 0;

    const tryNextStrategy = async () => {
      if (currentStrategy >= loadingStrategies.length) {
        reject(new Error('모든 로딩 전략 실패'));
        return;
      }

      try {
        await loadingStrategies[currentStrategy]();

        // 로드 완료 후 초기화 확인
        const checkAndResolve = () => {
          if (window.kakao && window.kakao.maps) {
            if (window.kakao.maps.load) {
              window.kakao.maps.load(() => {
                const kakao = safeKakaoAccess();
                if (kakao) {
                  console.log('🎉 카카오 맵 초기화 성공');
                  resolve(kakao);
                } else {
                  setTimeout(checkAndResolve, 100);
                }
              });
            } else {
              const kakao = safeKakaoAccess();
              if (kakao) {
                console.log('✅ 카카오 맵 즉시 사용 가능');
                resolve(kakao);
              } else {
                setTimeout(checkAndResolve, 100);
              }
            }
          } else {
            setTimeout(checkAndResolve, 100);
          }
        };

        setTimeout(checkAndResolve, 100);
      } catch (error) {
        console.warn(`❌ 전략 ${currentStrategy + 1} 실패:`, error);
        currentStrategy++;
        setTimeout(tryNextStrategy, 500);
      }
    };

    tryNextStrategy();
  });
};

// 카카오 맵 스크립트 로드 함수 - 개선된 버전
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

    try {
      const apiKey = '5efbd2f844cb3d8609377a11750272bb';

      // 환경별 타임아웃 설정
      const env = detectEnvironment();
      const timeout = env.isVercel ? 20000 : 15000; // Vercel에서는 더 긴 타임아웃

      // 타임아웃과 함께 로드
      const kakao = await Promise.race([
        loadKakaoMapWithCSP(apiKey),
        new Promise((_, reject) =>
          setTimeout(
            () =>
              reject(
                new Error(`카카오 맵 로드 타임아웃 (${timeout / 1000}초)`)
              ),
            timeout
          )
        ),
      ]);

      kakaoMapLoaded = true;
      kakaoMapLoading = false;
      retryCount = 0;
      resolve(kakao);
    } catch (error) {
      console.error('❌ 카카오 맵 로드 실패:', error);
      kakaoMapLoading = false;
      kakaoMapLoadPromise = null;

      // 최대 재시도 횟수에 도달하지 않았다면 재시도
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

      // 구체적인 에러 메시지 생성
      let errorMessage = '카카오 맵을 불러올 수 없습니다.';

      if (
        error.message.includes('타임아웃') ||
        error.message.includes('timeout')
      ) {
        errorMessage =
          '카카오 맵 로딩 시간이 초과되었습니다. 페이지를 새로고침해주세요.';
      } else if (
        error.message.includes('CSP') ||
        error.message.includes('Content Security Policy')
      ) {
        errorMessage =
          'CSP 정책으로 인해 카카오 맵을 로드할 수 없습니다. 관리자에게 문의해주세요.';
      } else if (
        error.message.includes('네트워크') ||
        error.message.includes('network')
      ) {
        errorMessage = '네트워크 연결을 확인하고 새로고침해주세요.';
      } else if (error.message.includes('모든 로딩 전략 실패')) {
        errorMessage =
          '카카오 맵 서비스에 접근할 수 없습니다. 잠시 후 다시 시도해주세요.';
      }

      const finalError = new Error(errorMessage);
      finalError.originalError = error;
      reject(finalError);
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
