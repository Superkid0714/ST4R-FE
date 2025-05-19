import {
  createBrowserRouter,
  RouterProvider,
  Navigate,
} from 'react-router-dom';

// 레이아웃
import MobileLayout from '../layouts/MobileLayout';
                             
// 페이지 컴포넌트
import LoginPage from '../pages/login/LoginPage';
import LoginAlertPage from '../pages/login/LoginAlertPage';

// 로비 페이지
import HomePage from '../pages/HomePage';

// 게시판 관련 페이지
import BoardPage from '../pages/board/BoardPage';
import BoardDetailPage from '../pages/board/BoardDetailPage';
import BoardEditPage from '../pages/board/BoardEditPage';
import BoardWritePage from '../pages/board/BoardWritePage';

// 모임 관련 페이지
import GroupPage from '../pages/group/GroupPage';
import GroupDetailPage from '../pages/group/GroupDetailPage';
import GroupEditPage from '../pages/group/GroupEditPage';
import GroupWritePage from '../pages/group/GroupWritePage';

// 기타 페이지
import NotFoundPage from '../pages/NotFoundPage';

// 라우트 가드
import AuthGuard from '../guards/AuthGuard';

const router = createBrowserRouter([
  //<모바일 레이아웃이 없는 경로>-네비바가 필요없는 페이지

  // 로그인 페이지
  { path: 'login', element: <LoginPage /> },
  { path:'login-alert', element: <LoginAlertPage/> },

  //게시판 관련 페이지
  {
    path: 'boards/write',
    element: (
      <AuthGuard>
        <BoardWritePage />
      </AuthGuard>
    ),
  },
  {
    path: 'boards/edit/:id',
    element: (
      <AuthGuard>
        <BoardEditPage />
      </AuthGuard>
    ),
  },
  {
    path: 'boards/:id',
    element: <BoardDetailPage />,
  },

  // 모임 관련 페이지
  {
    path: 'groups/write',
    element: (
      <AuthGuard>
        <GroupWritePage />
      </AuthGuard>
    ),
  },
  {
    path: 'groups/edit/:id',
    element: (
      <AuthGuard>
        <GroupEditPage />
      </AuthGuard>
    ),
  },
  {
    path: 'groups/:id',
    element: <GroupDetailPage />,
  },

  // <모바일 레이아웃이 적용된 경로>-네비바 필요한 페이지
  {
    path: '/',
    element: <MobileLayout />,
    errorElement: <NotFoundPage />,
    children: [
      // 기본 경로를 홈으로 리다이렉트트
      { index: true, element: <Navigate to="/home" replace /> },

      // 홈/게시판 관련 라우트
      {
        path: 'home',
        element: <HomePage/>,
        children: [
          // 홈 기본 경로를 boards로 리다이렉트
          { index: true, element: <Navigate to="/home/boards" replace /> },
          // 게시판 조회 페이지
          {
            path: 'boards',
            element: <BoardPage />,
          },
        ],
      },

      // 모임 목록 조회 페이지
      {
        path: 'groups',
        element: <GroupPage />,
      },
    ],
  },
]);

export default function Routes() {
  return <RouterProvider router={router} />;
}
