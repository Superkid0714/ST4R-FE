export function LoginRequiredModal({
  onClose,
  onLogin,
  message = '로그인이 필요합니다.',
}) {
  return (
    <div className="relative w-96 font-['Pretendard'] p-5 flex flex-col text-center gap-6 bg-[#1D1D1D] rounded-2xl">
      {/* 로그인 아이콘 */}
      <div className="flex justify-center">
        <div className="w-16 h-16 bg-yellow-500/20 rounded-full flex items-center justify-center">
          <svg
            className="w-8 h-8 text-yellow-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
            />
          </svg>
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <div className="text-xl text-white">로그인이 필요해요</div>
        <div className="text-sm text-[#8F8F8F]">
          {message}
          <br />
          로그인 페이지로 이동하시겠어요?
        </div>
      </div>

      <div className="flex gap-2">
        <button
          className="w-full h-14 hover:cursor-pointer leading-14 bg-[#2F2F2F] rounded-xl transition-colors hover:bg-[#3F3F3F]"
          onClick={onClose}
        >
          취소
        </button>
        <button
          className="w-full h-14 hover:cursor-pointer leading-14 bg-[#FFBB02] text-black rounded-xl transition-colors hover:bg-[#E6A500]"
          onClick={onLogin}
        >
          로그인하기
        </button>
      </div>
    </div>
  );
}

