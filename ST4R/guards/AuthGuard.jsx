// guards/AuthGuard.jsx
import PropTypes from 'prop-types';
import { Navigate } from 'react-router-dom';

function AuthGuard({ children }) {
  // 여기서는 간단한 예제로 로그인 상태를 확인합니다.
  // 실제 애플리케이션에서는 토큰이나 사용자 상태를 확인하는 로직이 필요합니다.
  const isAuthenticated = true; // 임시로 로그인 상태를 true로 설정

  // 로그인되지 않은 경우 로그인 페이지로 리다이렉트
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // 로그인된 경우 자식 컴포넌트 렌더링
  return children;
}

// props 유효성 검사 추가
AuthGuard.propTypes = {
  children: PropTypes.node.isRequired,
};

export default AuthGuard;
