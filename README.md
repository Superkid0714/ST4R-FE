# ST4R-FE

에코노베이션 25년 1학기 **ST4R 팀의 프론트엔드 레포지토리**입니다.  
**Vite + React + Tailwind CSS** 기반으로 구축되었으며,  
서버 상태 관리는 **React Query**, API 요청은 **Axios**를 통해 처리됩니다.

> 이 프로젝트는 Progressive Web App(PWA)으로 구성되어 있으며,  
> 사용자는 웹앱을 스마트폰 또는 데스크톱에 설치하여 앱처럼 사용할 수 있습니다.

---

## 🛠️ 기술 스택

| 항목            | 사용 도구                                        |
| --------------- | ------------------------------------------------ |
| 개발 프레임워크 | [React 19](https://reactjs.org/)                 |
| 빌드 도구       | [Vite](https://vitejs.dev/)                      |
| 스타일링        | [Tailwind CSS 4](https://tailwindcss.com/)       |
| 상태 관리       | [React Query](https://tanstack.com/query/latest) |
| HTTP 요청       | [Axios](https://axios-http.com/)                 |
| 코드 포매터     | [Prettier](https://prettier.io/)                 |
| 린터            | [ESLint (Flat Config)](https://eslint.org/)      |
| PWA             | [vite-plugin-pwa](https://vite-pwa-org.netlify.app/) |


## 📱 PWA 설치 방법

1. 브라우저에서 프로젝트에 접속합니다 
2. 주소창 또는 브라우저 메뉴에서 **"앱 설치" 또는 "홈 화면에 추가"** 선택
3. 설치된 앱은 독립적인 창에서 실행되며, 오프라인 시에도 일부 기능이 작동합니다

---

## 💻 로컬 개발 실행 방법

```bash
# 패키지 설치
npm install

# 개발 서버 실행
npm run dev

# 정적 빌드
npm run build

# 로컬 프리뷰 (PWA 테스트 가능)
npm run preview -- --host 0.0.0.0


