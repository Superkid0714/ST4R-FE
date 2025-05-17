// guards/AuthGuard.jsx
import { Navigate } from 'react-router-dom';

export default function AuthGuard({ children }) {
  // 로그인 상태 확인 (예시)
  const isAuthenticated = true; // 실제로는 로그인 상태 확인 로직이 들어가야 함

  if (!isAuthenticated) {
    // 로그인 페이지로 리다이렉트
    return <Navigate to="/login" replace />;
  }

  // 인증된 경우 자식 컴포넌트 렌더링
  return children;
}
