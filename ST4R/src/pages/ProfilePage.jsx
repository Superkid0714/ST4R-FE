import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLogoutMutation } from '../api/auth';

// 프로필 아이콘 컴포넌트
const ProfileIcon = ({ className = 'w-[18px] h-[18px]' }) => (
  <svg
    width="18"
    height="18"
    viewBox="0 0 18 18"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    <path
      d="M1.99988 15.4708C2.89988 14.5875 3.94571 13.8916 5.13738 13.3833C6.32904 12.875 7.61654 12.6208 8.99988 12.6208C10.3832 12.6208 11.6707 12.875 12.8624 13.3833C14.054 13.8916 15.0999 14.5875 15.9999 15.4708V2.73631C15.9999 2.65931 15.9678 2.58881 15.9036 2.52481C15.8396 2.46064 15.7691 2.42856 15.6921 2.42856H2.30763C2.23063 2.42856 2.16013 2.46064 2.09613 2.52481C2.03196 2.58881 1.99988 2.65931 1.99988 2.73631V15.4708ZM8.99988 10.4671C9.90238 10.4671 10.6697 10.1511 11.3019 9.51906C11.9339 8.88689 12.2499 8.11956 12.2499 7.21706C12.2499 6.31456 11.9339 5.54722 11.3019 4.91506C10.6697 4.28306 9.90238 3.96706 8.99988 3.96706C8.09738 3.96706 7.33004 4.28306 6.69788 4.91506C6.06588 5.54722 5.74988 6.31456 5.74988 7.21706C5.74988 8.11956 6.06588 8.88689 6.69788 9.51906C7.33004 10.1511 8.09738 10.4671 8.99988 10.4671ZM2.30763 17.9286C1.80246 17.9286 1.37488 17.7536 1.02488 17.4036C0.674878 17.0536 0.499878 16.626 0.499878 16.1208V2.73631C0.499878 2.23114 0.674878 1.80356 1.02488 1.45356C1.37488 1.10356 1.80246 0.928558 2.30763 0.928558H15.6921C16.1973 0.928558 16.6249 1.10356 16.9749 1.45356C17.3249 1.80356 17.4999 2.23114 17.4999 2.73631V16.1208C17.4999 16.626 17.3249 17.0536 16.9749 17.4036C16.6249 17.7536 16.1973 17.9286 15.6921 17.9286H2.30763ZM3.17688 16.4286H14.8229C13.9742 15.6504 13.049 15.0712 12.0471 14.6911C11.0451 14.3109 10.0294 14.1208 8.99988 14.1208C7.98321 14.1208 6.96554 14.3109 5.94688 14.6911C4.92838 15.0712 4.00504 15.6504 3.17688 16.4286ZM8.99988 8.96706C8.51904 8.96706 8.10721 8.79556 7.76438 8.45256C7.42138 8.10972 7.24988 7.69789 7.24988 7.21706C7.24988 6.73622 7.42138 6.32439 7.76438 5.98156C8.10721 5.63856 8.51904 5.46706 8.99988 5.46706C9.48071 5.46706 9.89254 5.63856 10.2354 5.98156C10.5784 6.32439 10.7499 6.73622 10.7499 7.21706C10.7499 7.69789 10.5784 8.10972 10.2354 8.45256C9.89254 8.79556 9.48071 8.96706 8.99988 8.96706Z"
      fill="#FFBB02"
    />
  </svg>
);

// 화살표 아이콘 컴포넌트
const ArrowIcon = () => (
  <svg
    width="13"
    height="12"
    viewBox="0 0 13 12"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M10.8558 6.62501H1.375C1.19764 6.62501 1.04917 6.56515 0.929583 6.44542C0.809861 6.32584 0.75 6.17737 0.75 6.00001C0.75 5.82265 0.809861 5.67417 0.929583 5.55459C1.04917 5.43487 1.19764 5.37501 1.375 5.37501H10.8558L6.54812 1.0673C6.42424 0.943408 6.36306 0.798408 6.36458 0.632297C6.36625 0.466186 6.43167 0.318479 6.56083 0.189173C6.69014 0.0684785 6.83653 0.00597852 7 0.00167296C7.16347 -0.0026326 7.30986 0.0598674 7.43917 0.189173L12.7227 5.47271C12.8008 5.55077 12.8558 5.33306 12.8877 5.71959C12.9198 5.80612 12.9358 5.89959 12.9358 6.00001C12.9358 6.10042 12.9198 6.19389 12.8877 6.28042C12.8558 6.36695 12.8008 6.44924 12.7227 6.5273L7.43917 11.8108C7.32375 11.9263 7.18083 11.9853 7.01042 11.9879C6.84 11.9906 6.69014 11.9315 6.56083 11.8108C6.43167 11.6815 6.36708 11.5331 6.36708 11.3654C6.36708 11.1976 6.43167 11.0491 6.56083 10.9198L10.8558 6.62501Z"
      fill="#D3D3D3"
    />
  </svg>
);

export default function ProfilePage() {
  const navigate = useNavigate();
  const logoutMutation = useLogoutMutation();

  // 사용자 정보 상태
  const [userInfo, setUserInfo] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // 컴포넌트 마운트 시 사용자 정보 로드
  useEffect(() => {
    const loadUserInfo = () => {
      try {
        const token = localStorage.getItem('token');
        const storedUser = localStorage.getItem('user');

        if (token && storedUser) {
          const user = JSON.parse(storedUser);
          setUserInfo(user);
        }
      } catch (error) {
        console.error('사용자 정보 로드 실패:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadUserInfo();
  }, []);

  // 로그아웃 핸들러
  const handleLogout = () => {
    if (window.confirm('정말로 로그아웃 하시겠습니까?')) {
      logoutMutation.mutate();
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-yellow-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!userInfo) {
    return (
      <div className="min-h-screen bg-black flex flex-col items-center justify-center px-4">
        <div className="text-center">
          <h2 className="text-xl font-bold text-white mb-2">
            사용자 정보를 불러올 수 없습니다
          </h2>
          <p className="text-gray-400 mb-4">다시 로그인해주세요.</p>
          <button
            onClick={() => navigate('/login')}
            className="bg-yellow-500 text-black px-6 py-2 rounded-lg font-medium hover:bg-yellow-400 transition-colors"
          >
            로그인
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white font-['Pretendard']">
      <div className="px-4 py-6">
        {/* 헤더 */}
        <h1 className="text-2xl font-normal mb-8">프로필</h1>

        {/* 사용자 정보 섹션 */}
        <div className="bg-[#1D1D1D] rounded-[10px] mb-4">
          <div className="flex items-center justify-between p-4">
            <div className="flex items-center space-x-3">
              <ProfileIcon />
              <span className="text-white text-lg">
                {userInfo.name || '안성준'}회원님
              </span>
            </div>
            <ArrowIcon />
          </div>
        </div>

        {/* 게시글 설정 섹션 */}
        <div className="bg-[#1D1D1D] rounded-[10px] mb-4">
          <h2 className="text-[#8F8F8F] text-sm p-4 pb-0">게시글 설정</h2>
          <div className="p-4 pt-4 space-y-4">
            <button
              className="w-full flex items-center justify-between hover:bg-[#2A2A2A] transition-colors"
              onClick={() => navigate('/profile/my-posts')}
            >
              <span className="text-[#D3D3D3]">내가 쓴 글 보기</span>
              <ArrowIcon />
            </button>
            <button
              className="w-full flex items-center justify-between hover:bg-[#2A2A2A] transition-colors"
              onClick={() => navigate('/profile/bookmarked-groups')}
            >
              <span className="text-[#D3D3D3]">내가 좋아한 글 보기</span>
              <ArrowIcon />
            </button>
            <button
              className="w-full flex items-center justify-between hover:bg-[#2A2A2A] transition-colors"
              onClick={() => navigate('/profile/created-groups')}
            >
              <span className="text-[#D3D3D3]">내가 찜한 모임 보기</span>
              <ArrowIcon />
            </button>
          </div>
        </div>

        {/* 계정 설정 섹션 */}
        <div className="bg-[#1D1D1D] rounded-[10px] mb-4">
          <h2 className="text-[#8F8F8F] text-sm p-4 pb-0">계정 설정</h2>
          <div className="p-4 pt-4 space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-[#D3D3D3]">닉네임</span>
              <span className="text-[#8F8F8F]">에코노베이션</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-[#D3D3D3]">이메일</span>
              <span className="text-[#8F8F8F]">
                {userInfo.email || 'newkid0714@jnu.ac.kr'}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-[#D3D3D3]">생년월일</span>
              <span className="text-[#8F8F8F]">2000.07.14</span>
            </div>
          </div>
        </div>

        {/* 법적 정보 및 기타 섹션 */}
        <div className="bg-[#1D1D1D] rounded-[10px] mb-4">
          <h2 className="text-[#8F8F8F] text-sm p-4 pb-0">법적 정보 및 기타</h2>
          <div className="p-4 pt-4 space-y-4">
            <button
              className="w-full flex items-center justify-between hover:bg-[#2A2A2A] transition-colors"
              onClick={() => navigate('/legal/terms')}
            >
              <span className="text-[#D3D3D3]">약관 및 개인정보 처리 동의</span>
              <ArrowIcon />
            </button>
            <button
              className="w-full flex items-center justify-between hover:bg-[#2A2A2A] transition-colors"
              onClick={() => navigate('/legal/privacy')}
            >
              <span className="text-[#D3D3D3]">개인정보 처리방침</span>
              <ArrowIcon />
            </button>
          </div>
        </div>

        {/* 로그아웃 버튼 */}
        <div className="bg-[#1D1D1D] rounded-[10px] mb-4">
          <button
            onClick={handleLogout}
            disabled={logoutMutation.isLoading}
            className="w-full flex items-center justify-between p-4 hover:bg-[#2A2A2A] transition-colors disabled:opacity-50"
          >
            <span className="text-[#D3D3D3]">로그아웃하기</span>
            <ArrowIcon />
          </button>
        </div>

        {/* 하단 여백 (네비게이션 바 공간) */}
        <div className="h-10"></div>
      </div>
    </div>
  );
}
