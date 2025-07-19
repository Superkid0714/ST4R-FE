export function BoardDeleteModal({ onClose, onConfirm, isLoading }) {
  return (
    <div className="relative w-96 font-['Pretendard'] p-5 flex flex-col text-center gap-6 bg-[#1D1D1D] rounded-2xl">
      <div className="flex flex-col gap-2">
        <div className="text-xl text-white">
          정말로 이 게시글을 삭제하시겠어요?
        </div>
        <div className="text-sm text-[#8F8F8F]">
          삭제된 게시글은 복구할 수 없습니다.
        </div>
      </div>
      <div className="flex gap-2">
        <button
          className="w-full h-14 hover:cursor-pointer leading-14 bg-[#2F2F2F] rounded-xl transition-colors hover:bg-[#3F3F3F]"
          onClick={onClose}
          disabled={isLoading}
        >
          취소
        </button>
        <button
          className="w-full h-14 hover:cursor-pointer leading-14 bg-[#FF4343] rounded-xl transition-colors hover:bg-[#E63939] disabled:opacity-50"
          onClick={onConfirm}
          disabled={isLoading}
        >
          {isLoading ? '삭제 중...' : '삭제하기'}
        </button>
      </div>
    </div>
  );
}
