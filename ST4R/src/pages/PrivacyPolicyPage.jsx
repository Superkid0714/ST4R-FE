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
                에코노베이션은 정보주체의 개인정보를 보호하고 이와 관련한 고충을
                신속하고 원활하게 처리할 수 있도록 다음과 같이 개인정보
                처리방침을 수립·공개합니다.
              </p>
              <p className="text-[#8F8F8F] text-xs">
                최종 수정일: 2025년 7월 25일 | 시행일: 2025년 7월 25일
              </p>
            </div>
          </section>

          {/* 제1조 - 처리목적 */}
          <section className="bg-[#1D1D1D] rounded-[10px] p-6">
            <h3 className="text-lg font-bold text-white mb-4">
              제1조 개인정보의 처리목적
            </h3>
            <div className="text-[#D3D3D3] text-sm leading-relaxed space-y-3">
              <p>회사는 다음의 목적을 위하여 개인정보를 처리합니다:</p>

              <div className="space-y-3">
                <div>
                  <h4 className="text-white font-semibold mb-2">
                    1. 회원가입 및 관리
                  </h4>
                  <p>
                    회원 가입의사 확인, 본인 식별·인증, 회원자격 유지·관리,
                    서비스 부정이용 방지
                  </p>
                </div>

                <div>
                  <h4 className="text-white font-semibold mb-2">
                    2. 서비스 제공
                  </h4>
                  <p>
                    별자리 관찰 정보 제공, 모임 매칭 서비스, 맞춤형 콘텐츠 추천
                  </p>
                </div>

                <div>
                  <h4 className="text-white font-semibold mb-2">3. 고충처리</h4>
                  <p>민원인의 신원 확인, 민원사항 확인, 처리결과 통보</p>
                </div>
              </div>
            </div>
          </section>

          {/* 제2조 - 보유기간 */}
          <section className="bg-[#1D1D1D] rounded-[10px] p-6">
            <h3 className="text-lg font-bold text-white mb-4">
              제2조 개인정보의 처리 및 보유기간
            </h3>
            <div className="text-[#D3D3D3] text-sm leading-relaxed space-y-3">
              <p>
                회사는 법령에 따른 개인정보 보유·이용기간 내에서 개인정보를
                처리·보유합니다.
              </p>

              <div className="bg-[#0F0F0F] rounded-lg p-4 space-y-2">
                <div>
                  <h4 className="text-white font-semibold">회원가입 및 관리</h4>
                  <p>
                    <span className="text-white">보유기간:</span> 회원 탈퇴
                    시까지
                  </p>
                </div>
                <div>
                  <h4 className="text-white font-semibold">서비스 제공</h4>
                  <p>
                    <span className="text-white">보유기간:</span> 5년
                    (전자상거래법)
                  </p>
                </div>
                <div>
                  <h4 className="text-white font-semibold">민원처리</h4>
                  <p>
                    <span className="text-white">보유기간:</span> 3년
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* 제3조 - 제3자 제공 */}
          <section className="bg-[#1D1D1D] rounded-[10px] p-6">
            <h3 className="text-lg font-bold text-white mb-4">
              제3조 개인정보의 제3자 제공
            </h3>
            <div className="text-[#D3D3D3] text-sm leading-relaxed space-y-3">
              <p>
                회사는 원칙적으로 개인정보를 외부에 제공하지 않습니다. 다만,
                다음의 경우는 예외입니다:
              </p>

              <div className="bg-[#0F0F0F] rounded-lg p-4 space-y-3">
                <div>
                  <h4 className="text-white font-semibold">카카오</h4>
                  <p>
                    <span className="text-white">제공목적:</span> 소셜 로그인
                    서비스
                  </p>
                  <p>
                    <span className="text-white">제공항목:</span> 이메일,
                    닉네임, 프로필 정보
                  </p>
                </div>
                <div>
                  <h4 className="text-white font-semibold">AWS</h4>
                  <p>
                    <span className="text-white">제공목적:</span> 클라우드 서버
                    운영
                  </p>
                  <p>
                    <span className="text-white">제공항목:</span> 서비스 이용
                    정보
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* 제4조 - 처리위탁 */}
          <section className="bg-[#1D1D1D] rounded-[10px] p-6">
            <h3 className="text-lg font-bold text-white mb-4">
              제4조 개인정보처리 위탁
            </h3>
            <div className="text-[#D3D3D3] text-sm leading-relaxed space-y-3">
              <p>
                회사는 원활한 개인정보 업무처리를 위하여 다음과 같이 개인정보
                처리업무를 위탁하고 있습니다:
              </p>

              <div className="bg-[#0F0F0F] rounded-lg p-4 space-y-2">
                <div>
                  <p>
                    <span className="text-white">위탁받는자:</span> Amazon Web
                    Services Korea LLC
                  </p>
                  <p>
                    <span className="text-white">위탁업무:</span> 클라우드 서버
                    운영, 데이터 저장
                  </p>
                </div>
                <div>
                  <p>
                    <span className="text-white">위탁받는자:</span> 카카오
                  </p>
                  <p>
                    <span className="text-white">위탁업무:</span> 소셜 로그인
                    인증
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* 제5조 - 정보주체 권리 */}
          <section className="bg-[#1D1D1D] rounded-[10px] p-6">
            <h3 className="text-lg font-bold text-white mb-4">
              제5조 정보주체의 권리·의무 및 행사방법
            </h3>
            <div className="text-[#D3D3D3] text-sm leading-relaxed space-y-3">
              <p>
                정보주체는 회사에 대해 언제든지 다음의 개인정보 보호 관련 권리를
                행사할 수 있습니다:
              </p>

              <div className="space-y-2 ml-4">
                <p>• 개인정보 처리현황 통지요구</p>
                <p>• 오류 등이 있을 경우 정정·삭제 요구</p>
                <p>• 처리정지 요구</p>
              </div>

              <p>
                위 권리 행사는 서면, 전자우편 등을 통하여 하실 수 있으며 회사는
                이에 대해 지체 없이 조치하겠습니다.
              </p>
            </div>
          </section>

          {/* 제6조 - 개인정보 항목 */}
          <section className="bg-[#1D1D1D] rounded-[10px] p-6">
            <h3 className="text-lg font-bold text-white mb-4">
              제6조 처리하는 개인정보의 항목
            </h3>
            <div className="text-[#D3D3D3] text-sm leading-relaxed space-y-3">
              <div className="bg-[#0F0F0F] rounded-lg p-4 space-y-2">
                <div>
                  <h4 className="text-white font-semibold">필수항목</h4>
                  <p>이메일, 닉네임, 카카오톡 계정 정보</p>
                </div>
                <div>
                  <h4 className="text-white font-semibold">선택항목</h4>
                  <p>프로필 사진, 관심 별자리, 지역 정보</p>
                </div>
                <div>
                  <h4 className="text-white font-semibold">자동 수집항목</h4>
                  <p>IP주소, 쿠키, 서비스 이용 기록, 방문 기록</p>
                </div>
              </div>
            </div>
          </section>

          {/* 제7조 - 파기 */}
          <section className="bg-[#1D1D1D] rounded-[10px] p-6">
            <h3 className="text-lg font-bold text-white mb-4">
              제7조 개인정보의 파기
            </h3>
            <div className="text-[#D3D3D3] text-sm leading-relaxed space-y-3">
              <p>
                회사는 개인정보 보유기간 경과, 처리목적 달성 등 개인정보가
                불필요하게 되었을 때에는 지체없이 해당 개인정보를 파기합니다.
              </p>

              <div className="space-y-2">
                <div>
                  <h4 className="text-white font-semibold">파기방법</h4>
                  <p>• 전자적 파일: 복구 불가능한 기술적 방법으로 삭제</p>
                  <p>• 서면 등: 분쇄 또는 소각</p>
                </div>
              </div>
            </div>
          </section>

          {/* 문의처 */}
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
                  enconovation@jnu.ac.kr
                </p>
                <p>
                  <span className="text-white font-semibold">전화:</span>{' '}
                  010-7610-0714
                </p>
                <p>
                  <span className="text-white font-semibold">운영시간:</span>{' '}
                  평일 09:00 ~ 18:00
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
