import {
  createBrowserRouter,
  RouterProvider,
  Navigate,
} from 'react-router-dom';

// 레이아웃
import MobileLayout from './layouts/MobileLayout';

// 페이지 컴포넌트
import LoginPage from './pages/LoginPage';

// 게시판 관련 페이지
import BoardPage from './pages/board/BoardPage';
import BoardDetailPage from './pages/board/BoardDetailPage';
import BoardEditPage from './pages/board/BoardEditPage';
import BoardWritePage from './pages/board/BoardWritePage';

// 모임 관련 페이지
import GroupPage from './pages/group/GroupPage';
import GroupDetailPage from './pages/group/GroupDetailPage';
import GroupEditPage from './pages/group/GroupEditPage';
import GroupWritePage from './pages/group/GroupWritePage';

// 기타 페이지
import NotFoundPage from './pages/NotFoundPage';

// 라우트 가드
import AuthGuard from './guards/AuthGuard';

const router = createBrowserRouter([
  {
    path: '/',
    element: <MobileLayout />,
    errorElement: <NotFoundPage />,
    children: [
      // 기본 경로를 홈/게시판으로 리다이렉트트
      { index: true, element: <Navigate to="/home/boards" replace /> },

      // 로그인 페이지
      { path: 'login', element: <LoginPage /> },

      // 홈/게시판 관련 라우트
      {
        path: 'home',
        children: [
          // 홈 경로도 게시판으로 리다이렉트
          { index: true, element: <Navigate to="/home/boards" replace /> },

          // 게시판 라우트
          {
            path: 'boards',
            element: <BoardPage />,
          },
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
        ],
      },
      // 모임 관련 라우트
      {
        path: 'groups',
        element: <GroupPage />,
      },
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
    ],
  },
]);

export default function Routes() {
  return <RouterProvider router={router} />;
}
