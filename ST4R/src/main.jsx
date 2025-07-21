import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import App from './App.jsx';
import './index.css';

// Axios 인터셉터 설정 (앱 시작 시 한 번만 실행)
import './utils/axiosConfig.js';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: (failureCount, error) => {
        // 401 에러는 재시도하지 않음
        if (error?.response?.status === 401 || error?.isAuthError) {
          return false;
        }
        return failureCount < 1;
      },
      refetchOnWindowFocus: false,
      staleTime: 1000 * 60 * 5, // 5분
    },
    mutations: {
      retry: (failureCount, error) => {
        // 401 에러는 재시도하지 않음
        if (error?.response?.status === 401 || error?.isAuthError) {
          return false;
        }
        return failureCount < 1;
      },
    },
  },
});

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <App />
    </QueryClientProvider>
  </StrictMode>
);

