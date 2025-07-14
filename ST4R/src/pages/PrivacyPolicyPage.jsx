import BackButton from '../components/common/BackButton';

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-black text-white font-['Pretendard']">
      <div className="px-4 py-6">
        {/* 헤더 */}
        <div className="flex items-center gap-3 mb-8">
          <BackButton className="hover:cursor-pointer" />
          <h1 className="text-[#8F8F8F] text-2xl font-normal">
            개인정보 처리방침
          </h1>
        </div>

        {/* 컨텐츠 */}
        <div className="space-y-6">
          {/* 개요 */}
          <section className="bg-[#1D1D1D] rounded-[10px] p-6">
            <h2 className="text-xl font-bold text-white mb-4">
              개인정보 처리방침
            </h2>
            <div className="text-[#D3D3D3] text-sm leading-relaxed space-y-3">
              <p>
                에코노베이션(이하 "회사")은 「개인정보 보호법」 제30조에 따라
                정보주체의 개인정보를 보호하고 이와 관련한 고충을 신속하고
                원활하게 처리할 수 있도록 하기 위하여 다음과 같이 개인정보
                처리방침을 수립·공개합니다.
              </p>
              <p className="text-[#8F8F8F] text-xs">
                최종 수정일: 2025년 1월 15일 | 시행일: 2025년 1월 1일
              </p>
            </div>
          </section>

          {/* 제1조 */}
          <section className="bg-[#1D1D1D] rounded-[10px] p-6">
            <h3 className="text-lg font-bold text-white mb-4">
              제1조 (개인정보의 처리목적)
            </h3>
            <div className="text-[#D3D3D3] text-sm leading-relaxed space-y-4">
              <p>
                회사는 다음의 목적을 위하여 개인정보를 처리합니다. 처리하고 있는
                개인정보는 다음의 목적 이외의 용도로는 이용되지 않으며, 이용
                목적이 변경되는 경우에는 「개인정보 보호법」 제18조에 따라
                별도의 동의를 받는 등 필요한 조치를 이행할 예정입니다.
              </p>

              <div className="space-y-3">
                <div>
                  <h4 className="text-white font-semibold mb-2">
                    1. 홈페이지 회원가입 및 관리
                  </h4>
                  <p>
                    회원 가입의사 확인, 회원제 서비스 제공에 따른 본인
                    식별·인증, 회원자격 유지·관리, 서비스 부정이용 방지, 만14세
                    미만 아동의 개인정보 처리 시 법정대리인의 동의여부 확인,
                    각종 고지·통지, 고충처리 목적으로 개인정보를 처리합니다.
                  </p>
                </div>

                <div>
                  <h4 className="text-white font-semibold mb-2">
                    2. 재화 또는 서비스 제공
                  </h4>
                  <p>
                    서비스 제공, 콘텐츠 제공, 맞춤서비스 제공, 본인인증,
                    연령인증, 요금결제·정산을 목적으로 개인정보를 처리합니다.
                  </p>
                </div>

                <div>
                  <h4 className="text-white font-semibold mb-2">3. 고충처리</h4>
                  <p>
                    민원인의 신원 확인, 민원사항 확인, 사실조사를 위한
                    연락·통지, 처리결과 통보 목적으로 개인정보를 처리합니다.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* 제2조 */}
          <section className="bg-[#1D1D1D] rounded-[10px] p-6">
            <h3 className="text-lg font-bold text-white mb-4">
              제2조 (개인정보의 처리 및 보유기간)
            </h3>
            <div className="text-[#D3D3D3] text-sm leading-relaxed space-y-4">
              <p>
                ① 회사는 법령에 따른 개인정보 보유·이용기간 또는 정보주체로부터
                개인정보를 수집 시에 동의받은 개인정보 보유·이용기간 내에서
                개인정보를 처리·보유합니다.
              </p>

              <p>② 각각의 개인정보 처리 및 보유 기간은 다음과 같습니다.</p>

              <div className="bg-[#0F0F0F] rounded-lg p-4 space-y-3">
                <div>
                  <h4 className="text-white font-semibold mb-2">
                    1. 홈페이지 회원가입 및 관리
                  </h4>
                  <p>
                    <span className="text-white">보유근거:</span> 정보주체의
                    동의
                  </p>
                  <p>
                    <span className="text-white">보유기간:</span> 회원 탈퇴
                    시까지
                  </p>
                  <p>
                    <span className="text-white">예외:</span> 관계법령 위반에
                    따른 수사·조사 등이 진행중인 경우에는 해당 수사·조사 종료
                    시까지
                  </p>
                </div>

                <div>
                  <h4 className="text-white font-semibold mb-2">
                    2. 재화 또는 서비스 제공
                  </h4>
                  <p>
                    <span className="text-white">보유근거:</span> 계약 또는
                    청약철회 등에 관한 기록
                  </p>
                  <p>
                    <span className="text-white">보유기간:</span> 5년
                    (전자상거래법)
                  </p>
                </div>

                <div>
                  <h4 className="text-white font-semibold mb-2">3. 민원처리</h4>
                  <p>
                    <span className="text-white">보유근거:</span> 소비자의 불만
                    또는 분쟁처리에 관한 기록
                  </p>
                  <p>
                    <span className="text-white">보유기간:</span> 3년
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* 제3조 */}
          <section className="bg-[#1D1D1D] rounded-[10px] p-6">
            <h3 className="text-lg font-bold text-white mb-4">
              제3조 (개인정보의 제3자 제공)
            </h3>
            <div className="text-[#D3D3D3] text-sm leading-relaxed space-y-4">
              <p>
                ① 회사는 개인정보를 제1조(개인정보의 처리목적)에서 명시한 범위
                내에서만 처리하며, 정보주체의 동의, 법률의 특별한 규정 등
                「개인정보 보호법」 제17조 및 제18조에 해당하는 경우에만
                개인정보를 제3자에게 제공합니다.
              </p>

              <p>
                ② 회사는 다음과 같이 개인정보를 제3자에게 제공하고 있습니다.
              </p>

              <div className="bg-[#0F0F0F] rounded-lg p-4 space-y-3">
                <div>
                  <h4 className="text-white font-semibold mb-2">
                    카카오톡 (소셜 로그인)
                  </h4>
                  <p>
                    <span className="text-white">제공받는자:</span> 카카오
                  </p>
                  <p>
                    <span className="text-white">제공목적:</span> 소셜 로그인
                    서비스 제공
                  </p>
                  <p>
                    <span className="text-white">제공항목:</span> 이메일,
                    닉네임, 프로필 정보
                  </p>
                  <p>
                    <span className="text-white">보유·이용기간:</span> 회원 탈퇴
                    시 또는 제공 동의 철회 시까지
                  </p>
                </div>

                <div>
                  <h4 className="text-white font-semibold mb-2">
                    AWS (클라우드 서비스)
                  </h4>
                  <p>
                    <span className="text-white">제공받는자:</span> Amazon Web
                    Services
                  </p>
                  <p>
                    <span className="text-white">제공목적:</span> 클라우드 서버
                    운영 및 데이터 저장
                  </p>
                  <p>
                    <span className="text-white">제공항목:</span> 서비스 이용
                    과정에서 생성되는 모든 정보
                  </p>
                  <p>
                    <span className="text-white">보유·이용기간:</span> 서비스
                    종료 시까지
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* 제4조 */}
          <section className="bg-[#1D1D1D] rounded-[10px] p-6">
            <h3 className="text-lg font-bold text-white mb-4">
              제4조 (개인정보처리 위탁)
            </h3>
            <div className="text-[#D3D3D3] text-sm leading-relaxed space-y-4">
              <p>
                ① 회사는 원활한 개인정보 업무처리를 위하여 다음과 같이 개인정보
                처리업무를 위탁하고 있습니다.
              </p>

              <div className="bg-[#0F0F0F] rounded-lg p-4 space-y-3">
                <div>
                  <h4 className="text-white font-semibold mb-2">
                    1. 클라우드 서비스 운영
                  </h4>
                  <p>
                    <span className="text-white">위탁받는자:</span> Amazon Web
                    Services Korea LLC
                  </p>
                  <p>
                    <span className="text-white">위탁업무:</span> 클라우드 서버
                    운영, 데이터 저장 및 관리
                  </p>
                  <p>
                    <span className="text-white">위탁기간:</span> 서비스 제공
                    계약 종료 시까지
                  </p>
                </div>

                <div>
                  <h4 className="text-white font-semibold mb-2">
                    2. 소셜 로그인 서비스
                  </h4>
                  <p>
                    <span className="text-white">위탁받는자:</span> 카카오
                  </p>
                  <p>
                    <span className="text-white">위탁업무:</span> 카카오톡
                    계정을 통한 로그인 인증
                  </p>
                  <p>
                    <span className="text-white">위탁기간:</span> 회원 탈퇴
                    시까지
                  </p>
                </div>
              </div>

              <p>
                ② 회사는 위탁계약 체결시 「개인정보 보호법」 제26조에 따라
                위탁업무 수행목적 외 개인정보 처리금지, 기술적․관리적 보호조치,
                재위탁 제한, 수탁자에 대한 관리․감독, 손해배상 등 책임에 관한
                사항을 계약서 등 문서에 명시하고, 수탁자가 개인정보를 안전하게
                처리하는지를 감독하고 있습니다.
              </p>
            </div>
          </section>

          {/* 제5조 */}
          <section className="bg-[#1D1D1D] rounded-[10px] p-6">
            <h3 className="text-lg font-bold text-white mb-4">
              제5조 (정보주체의 권리·의무 및 그 행사방법)
            </h3>
            <div className="text-[#D3D3D3] text-sm leading-relaxed space-y-4">
              <p>
                ① 정보주체는 회사에 대해 언제든지 다음 각 호의 개인정보 보호
                관련 권리를 행사할 수 있습니다.
              </p>

              <div className="space-y-2 ml-4">
                <p>1. 개인정보 처리현황 통지요구</p>
                <p>2. 오류 등이 있을 경우 정정·삭제 요구</p>
                <p>3. 처리정지 요구</p>
              </div>

              <p>
                ② 제1항에 따른 권리 행사는 회사에 대해 「개인정보 보호법」
                시행령 제41조제1항에 따라 서면, 전자우편, 모사전송(FAX) 등을
                통하여 하실 수 있으며 회사는 이에 대해 지체 없이 조치하겠습니다.
              </p>

              <p>
                ③ 정보주체가 개인정보의 오류 등에 대한 정정 또는 삭제를 요구한
                경우에는 회사는 정정 또는 삭제를 완료할 때까지 당해 개인정보를
                이용하거나 제공하지 않습니다.
              </p>

              <p>
                ④ 제1항에 따른 권리 행사는 정보주체의 법정대리인이나 위임을 받은
                자 등 대리인을 통하여 하실 수 있습니다. 이 경우 "개인정보 처리
                방법에 관한 고시(제2020-7호)" 별지 제11호 서식에 따른 위임장을
                제출하셔야 합니다.
              </p>
            </div>
          </section>

          {/* 제6조 */}
          <section className="bg-[#1D1D1D] rounded-[10px] p-6">
            <h3 className="text-lg font-bold text-white mb-4">
              제6조 (처리하는 개인정보의 항목)
            </h3>
            <div className="text-[#D3D3D3] text-sm leading-relaxed space-y-4">
              <p>① 회사는 다음의 개인정보 항목을 처리하고 있습니다.</p>

              <div className="bg-[#0F0F0F] rounded-lg p-4 space-y-3">
                <div>
                  <h4 className="text-white font-semibold mb-2">
                    1. 홈페이지 회원가입 및 관리
                  </h4>
                  <p>
                    <span className="text-white">필수항목:</span> 이메일,
                    닉네임, 카카오톡 계정 정보
                  </p>
                  <p>
                    <span className="text-white">선택항목:</span> 프로필 사진,
                    관심 별자리, 지역 정보
                  </p>
                </div>

                <div>
                  <h4 className="text-white font-semibold mb-2">
                    2. 인터넷 서비스 이용과정에서 자동 수집되는 정보
                  </h4>
                  <p>
                    <span className="text-white">수집항목:</span> IP주소, 쿠키,
                    MAC주소, 서비스 이용 기록, 방문 기록, 불량 이용 기록 등
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* 제7조 */}
          <section className="bg-[#1D1D1D] rounded-[10px] p-6">
            <h3 className="text-lg font-bold text-white mb-4">
              제7조 (개인정보의 파기)
            </h3>
            <div className="text-[#D3D3D3] text-sm leading-relaxed space-y-4">
              <p>
                ① 회사는 개인정보 보유기간의 경과, 처리목적 달성 등 개인정보가
                불필요하게 되었을 때에는 지체없이 해당 개인정보를 파기합니다.
              </p>

              <p>
                ② 정보주체로부터 동의받은 개인정보 보유기간이 경과하거나
                처리목적이 달성되었음에도 불구하고 다른 법령에 따라 개인정보를
                계속 보존하여야 하는 경우에는, 해당 개인정보를 별도의
                데이터베이스(DB)로 옮기거나 보관장소를 달리하여 보존합니다.
              </p>

              <p>③ 개인정보 파기의 절차 및 방법은 다음과 같습니다.</p>

              <div className="space-y-3 ml-4">
                <div>
                  <h4 className="text-white font-semibold mb-2">1. 파기절차</h4>
                  <p>
                    회사는 파기 사유가 발생한 개인정보를 선정하고, 회사의
                    개인정보 보호책임자의 승인을 받아 개인정보를 파기합니다.
                  </p>
                </div>

                <div>
                  <h4 className="text-white font-semibold mb-2">2. 파기방법</h4>
                  <p>
                    - 전자적 파일 형태의 정보는 기록을 재생할 수 없는 기술적
                    방법을 사용합니다.
                  </p>
                  <p>
                    - 종이에 출력된 개인정보는 분쇄기로 분쇄하거나 소각을 통하여
                    파기합니다.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* 연락처 정보 */}
          <section className="bg-[#1D1D1D] rounded-[10px] p-6">
            <h3 className="text-lg font-bold text-white mb-4">문의하기</h3>
            <div className="text-[#D3D3D3] text-sm leading-relaxed space-y-3">
              <p>
                개인정보 처리방침에 대한 문의사항이 있으시면 아래 연락처로
                문의해 주세요.
              </p>

              <div className="bg-[#0F0F0F] rounded-lg p-4">
                <p>
                  <span className="text-white font-semibold">이메일:</span>{' '}
                  privacy@econovation.kr
                </p>
                <p>
                  <span className="text-white font-semibold">전화:</span>{' '}
                  062-530-1234
                </p>
                <p>
                  <span className="text-white font-semibold">운영시간:</span>{' '}
                  평일 09:00 ~ 18:00 (주말, 공휴일 제외)
                </p>
              </div>
            </div>
          </section>

          {/* 하단 여백 */}
          <div className="h-20"></div>
        </div>
      </div>
    </div>
  );
}
