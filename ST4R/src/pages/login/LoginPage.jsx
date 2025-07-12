import kakaotalk from '../../assets/icons/kakaotalk.svg';
import west from '../../assets/icons/west.svg';

export default function LoginPage() {
  const loginUrl = `http://eridanus.econo.mooo.com:8080/oauth/kakao?redirect=http://localhost:5173`;

  const kakaologinbutton = () => {
    window.location.href = loginUrl; // 카카오 로그인 창으로 이동
  };

  return (
    <div>
      <div className="absolute left-[12px] inline-flex justify-start items-center gap-[12px]">
        <div className="p-2 bg-[#1D1D1D] rounded-[60px]">
          <img src={west} alt="화살표" className="w-6 h-6" />
        </div>
        <div className="text-[#8F8F8F] text-3xl font-normal font-['Pretendard'] leading-loose">
          로그인
        </div>
      </div>

      <div className="absolute left-[12px] top-[20%] flex flex-col justify-center">
        <span className="text-[#FFFFFF] text-5xl font-extrabold font-['Shinier'] leading-[52px]">
          Star,
          <br />
          Romace,
          <br />
          Freinds,
          <br />
          All in one.
          <br />
        </span>
        <span>
          <span className="text-[#FFBB02] text-5xl font-extrabold font-['Shinier'] leading-[52px]">
            It’s{' '}
          </span>
          <span className="text-[#FFBB02] text-5xl font-extrabold font-['Shinier'] underline leading-[52px]">
            Stargazer.
          </span>
        </span>
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
        className="absolute left-[12px] right-[12px] bottom-[40px] h-[60px] bg-[#FFBB02] rounded-[10px]"
      >
        <div
          className="absolute flex gap-[12px] left-[20px] top-[18px] text-base font-extrabold font-['Pretendard']"
        >
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
