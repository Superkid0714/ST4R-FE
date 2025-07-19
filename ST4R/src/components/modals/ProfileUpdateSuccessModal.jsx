// 프로필 수정 성공 모달 컴포넌트
export default function ProfileUpdateSuccessModal({ onNavigateToProfile }) {
  return (
    <div className="relative w-96 font-['Pretendard'] p-5 flex flex-col text-center gap-6 bg-[#1D1D1D] rounded-2xl">
      {/* 아이콘 */}
      <div className="flex justify-center">
        <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center">
          <svg
            className="w-8 h-8 text-green-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5 13l4 4L19 7"
            />
          </svg>
        </div>
      </div>

      {/* 메시지 */}
      <div className="flex flex-col gap-2">
        <div className="text-xl font-medium text-white">
          프로필이 수정되었습니다!
        </div>
        <div className="text-sm text-[#8F8F8F]">
          변경된 프로필 정보가 성공적으로 저장되었습니다.
        </div>
      </div>

      {/* 버튼 */}
      <button
        className="w-full h-14 hover:cursor-pointer flex items-center justify-center bg-[#FFBB02] text-black rounded-xl transition-colors hover:bg-[#E6A500]"
        onClick={onNavigateToProfile}
      >
        <span className="font-medium">프로필로 돌아가기</span>
      </button>
    </div>
  );
}
