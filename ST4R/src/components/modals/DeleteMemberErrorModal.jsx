// 회원탈퇴 에러 모달 컴포넌트
export default function DeleteMemberErrorModal({
  onClose,
  errorMessage,
  managedGroups = [],
}) {
  return (
    <div className="relative w-96 font-['Pretendard'] p-5 flex flex-col gap-6 bg-[#1D1D1D] rounded-2xl">
      <div className="flex flex-col gap-4">
        <div className="text-xl font-medium text-center">
          회원 탈퇴 요청이 거부되었습니다
        </div>

        <div className="text-sm text-[#8F8F8F] leading-relaxed">
          {errorMessage ||
            '모임장은 회원 탈퇴할 수 없습니다. 모임장을 위임한 후에 탈퇴를 나가시거나, 모임장 권한으로 탈퇴를 삭제해주세요.'}
        </div>

        {managedGroups.length > 0 ? (
          <div className="text-sm text-[#D3D3D3] mt-2">
            <span className="font-medium">해당 모임:</span>{' '}
            {managedGroups.join(', ')}
          </div>
        ) : (
          <div className="text-sm text-[#D3D3D3] mt-2">
            <span className="font-medium">해당 모임:</span> 내 모임
          </div>
        )}
      </div>

      <div className="flex gap-2">
        <button
          className="flex-1 h-14 hover:cursor-pointer flex items-center justify-center bg-[#FFBB02] text-black rounded-xl transition-colors hover:bg-[#E6A500]"
          onClick={onClose}
        >
          <span className="font-medium">확인</span>
        </button>
      </div>
    </div>
  );
}
