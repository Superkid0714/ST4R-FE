import React from 'react';

function NotFoundPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-black text-white p-4">
      <h1 className="text-3xl font-bold mb-4">404</h1>
      <p className="text-xl mb-6">페이지를 찾을 수 없습니다</p>
      <a
        href="/"
        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
      >
        홈으로 돌아가기
      </a>
    </div>
  );
}

export default NotFoundPage;

