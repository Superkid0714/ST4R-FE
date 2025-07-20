import { useLogoutMutation } from '../../api/auth';

// 로그아웃 모달 컴포넌트
export default function LogoutModal({ onClose }) {
  const logoutMutation = useLogoutMutation();

  const handleLogout = () => {
    logoutMutation.mutate();
  };

  return (
    <div className="relative w-96 font-['Pretendard'] p-5 flex flex-col text-center gap-6 bg-[#1D1D1D] rounded-2xl">
      <div className="flex flex-col gap-2">
        <div className="text-xl ">정말로 로그아웃 하시겠어요?</div>
        <div className="text-sm text-[#8F8F8F]">
          로그아웃 후 일부 기능 이용이 제한됩니다
        </div>
      </div>
      <div className="flex gap-2">
        <button
          className="w-full h-14 hover:cursor-pointer leading-14 bg-[#2F2F2F] rounded-xl transition-colors hover:bg-[#3F3F3F]"
          onClick={onClose}
        >
          취소하기
        </button>
        <button
          className="w-full h-14 hover:cursor-pointer leading-14 bg-[#FFBB02] text-black rounded-xl transition-colors hover:bg-[#E6A500] disabled:opacity-50"
          onClick={handleLogout}
          disabled={logoutMutation.isLoading}
        >
          {logoutMutation.isLoading ? '로그아웃 중...' : '로그아웃'}
        </button>
      </div>
    </div>
  );
}
