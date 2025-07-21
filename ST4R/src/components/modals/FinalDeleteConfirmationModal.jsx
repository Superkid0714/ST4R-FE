// 최종 회원탈퇴 확인 모달 컴포넌트 (2단계)
export default function FinalDeleteConfirmationModal({
  onClose,
  onConfirm,
  isLoading,
}) {
  return (
    <div className="relative w-96 font-['Pretendard'] p-5 flex flex-col text-center gap-6 bg-[#1D1D1D] rounded-2xl">
      <div className="flex flex-col gap-2">
        <div className="text-xl ">정말로 진행하시겠습니까?</div>
        <div className="text-sm text-[#8F8F8F]">
          이 작업은 되돌릴 수 없으며, 모든 데이터가 즉시 삭제됩니다.
        </div>
      </div>
      <div className="flex gap-2">
        <button
          className="w-full h-14 hover:cursor-pointer leading-14 bg-[#2F2F2F] rounded-xl transition-colors hover:bg-[#3F3F3F]"
          onClick={onClose}
          disabled={isLoading}
        >
          이전으로
        </button>
        <button
          className="w-full h-14 hover:cursor-pointer leading-14 bg-[#FF4343] text-white rounded-xl transition-colors hover:bg-[#E63939] disabled:opacity-50"
          onClick={onConfirm}
          disabled={isLoading}
        >
          {isLoading ? '탈퇴 처리 중...' : '최종 확인'}
        </button>
      </div>
    </div>
  );
}

