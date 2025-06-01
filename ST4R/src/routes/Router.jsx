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
import BoardDetailPage from '../pages/board/BoardDetailPage';
import BoardEditPage from '../pages/board/BoardEditPage';
import BoardWritePage from '../pages/board/BoardWritePage';

// 모임 관련 페이지
import GroupPage from '../pages/group/GroupPage';
import GroupDetailPage from '../pages/group/GroupDetailPage';
import GroupEditPage from '../pages/group/GroupEditPage';
import GroupWritePage from '../pages/group/GroupWritePage';

// 잘못된 경로 페이지
import NotFoundPage from '../pages/NotFoundPage';

// 글쓰기 선택 페이지
import WriteChoicePage from '../pages/WriteChoicePage';

// 프로필 관련 페이지
import ProfilePage from '../pages/ProfilePage';

// 라우트 가드
import AuthGuard from '../guards/AuthGuard';

const router = createBrowserRouter([
  //<모바일 레이아웃이 없는 경로>-네비바가 필요없는 페이지

  // 로그인 페이지
  { path: 'login', element: <LoginPage /> },
  { path: 'login-alert', element: <LoginAlertPage /> },

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
  // 선택창 페이지
  {
    path: '/writechoice',
    element: (
      <AuthGuard>
        <WriteChoicePage />
      </AuthGuard>
    ),
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
        element: <HomePage />,
        children: [
          // *** /home/boards로 오면 /home으로 리다이렉트 ***
          {
            path: 'boards',
            element: <Navigate to="/home" replace />,
          },
        ],
      },

      // 모임 목록 조회 페이지
      {
        path: 'groups',
        element: <GroupPage />,
      },

      // 프로필 조회 페이지
      {
        path: 'profile',
        element: (
          <AuthGuard>
            <ProfilePage />
          </AuthGuard>
        ),
      },
    ],
  },
]);

export default function Routes() {
  return <RouterProvider router={router} />;
}
