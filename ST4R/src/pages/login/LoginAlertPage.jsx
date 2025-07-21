import kakaotalk from '../../assets/icons/kakaotalk.svg';
import error from '../../assets/icons/error.svg';
import west from '../../assets/icons/west.svg';
import { useNavigate } from 'react-router-dom';

export default function LoginAlertPage() {
  const navigate = useNavigate();

  // 개발환경과 배포환경에 따라 리다이렉트 URL 설정
  const isDevelopment = window.location.hostname === 'localhost';
  const redirectUrl = isDevelopment
    ? 'http://localhost:5173'
    : window.location.origin;

  const loginUrl = `https://eridanus.econo.mooo.com/oauth/kakao?redirect=${redirectUrl}`;

  const kakaologinbutton = () => {
    window.location.href = loginUrl; // 카카오 로그인 창으로 이동
  };

  const handleBack = () => {
    navigate(-1);
  };

  return (
    <div>
      <div className="absolute left-[12px] inline-flex justify-start items-center gap-[12px]">
        <div
          className="p-2 bg-[#1D1D1D] rounded-[60px] cursor-pointer hover:bg-[#2A2A2A] transition-colors"
          onClick={handleBack}
        >
          <img src={west} className="w-6 h-6" />
        </div>
      </div>

      <div className="absolute w-full top-[20%] left-1/2 transform -translate-x-1/2 flex flex-col justify-center items-center gap-5">
        <img src={error} alt="error" />
        <div className="flex flex-col justify-start items-center gap-3">
          <div className="self-stretch text-center justify-start text-[#FFFFFF] text-2xl font-bold font-['Pretendard'] leading-7">
            로그인이 되어있지 않아요!
          </div>
          <div className="self-stretch text-center">
            <span className="text-[#8F8F8F] text-base font-normal font-['Pretendard'] leading-normal">
              해당 기능은{' '}
            </span>
            <span className="text-[#8F8F8F] text-base font-normal font-['Pretendard'] underline leading-normal">
              로그인한 회원
            </span>
            <span className="text-[#8F8F8F] text-base font-normal font-['Pretendard'] leading-normal">
              만 사용할 수 있어요.
              <br />
              서비스에 로그인해서 사용해보세요!
            </span>
          </div>
        </div>
      </div>

      <div className=" absolute w-full flex gap-[2px] justify-center bottom-[110px] ">
        <span className=" text-[#8F8F8F] text-base font-normal font-['Pretendard'] ">
          카카오톡으로{' '}
        </span>
        <span className="text-[#8F8F8F] text-base font-bold font-['Pretendard'] underline ">
          한번에 로그인
        </span>
        <span className="text-[#8F8F8F] text-base font-normal font-['Pretendard'] ">
          하세요!
        </span>
      </div>

      {/* 카카오톡 로그인 버튼 */}
      <div
        onClick={kakaologinbutton}
        className="absolute left-[12px] right-[12px] bottom-[40px] h-[60px] bg-[#FFBB02] rounded-[10px] cursor-pointer hover:bg-[#E6A500] transition-colors"
      >
        <div className="absolute flex gap-[12px] left-[20px] top-[18px] text-base font-extrabold font-['Pretendard']">
          <img
            src={kakaotalk}
            alt="카카오톡 아이콘"
            className="w-6 h-6 inline-block"
          />
          <span className="text-[#000000]">카카오톡으로 로그인</span>
        </div>
      </div>
    </div>
  );
}

