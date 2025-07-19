export function BoardCreateSuccessModal({ onClose }) {
  return (
    <div className="relative w-96 font-['Pretendard'] p-5 flex flex-col text-center gap-6 bg-[#1D1D1D] rounded-2xl">
      {/* 성공 아이콘 */}
      <div className="flex justify-center">
        <div className="w-16 h-16 bg-blue-500/20 rounded-full flex items-center justify-center">
          <svg
            className="w-8 h-8 text-blue-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
            />
          </svg>
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <div className="text-xl font-medium text-white">게시글 작성 완료!</div>
        <div className="text-sm text-[#8F8F8F]">
          새로운 게시글이 성공적으로 등록되었습니다.
        </div>
      </div>

      <button
        className="w-full h-14 hover:cursor-pointer flex items-center justify-center bg-[#FFBB02] text-black rounded-xl transition-colors hover:bg-[#E6A500]"
        onClick={onClose}
      >
        <span className="font-medium">홈으로 돌아가기</span>
      </button>
    </div>
  );
}
