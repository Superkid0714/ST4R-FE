import BackButton from '../components/common/BackButton';

export default function TermsOfServicePage() {
  return (
    <div className="min-h-screen bg-black text-white font-['Pretendard']">
      <div className="px-4 py-6">
        {/* 헤더 */}
        <div className="flex items-center gap-3 mb-8">
          <BackButton className="hover:cursor-pointer" />
          <h1 className="text-[#8F8F8F] text-2xl font-normal">
            약관 및 개인정보 처리 동의
          </h1>
        </div>

        {/* 컨텐츠 */}
        <div className="space-y-8">
          {/* 서비스 이용약관 */}
          <section className="bg-[#1D1D1D] rounded-[10px] p-6">
            <h2 className="text-xl font-bold text-white mb-6">
              Starlight 서비스 이용약관
            </h2>

            <div className="space-y-6 text-[#D3D3D3] text-sm leading-relaxed">
              <div>
                <h3 className="text-white font-semibold mb-3">제1조 (목적)</h3>
                <p>
                  이 약관은 에코노베이션(이하 "회사")이 제공하는 Starlight
                  서비스(이하 "서비스")의 이용과 관련하여 회사와 이용자 간의
                  권리, 의무 및 책임사항, 기타 필요한 사항을 규정함을 목적으로
                  합니다.
                </p>
              </div>

              <div>
                <h3 className="text-white font-semibold mb-3">제2조 (정의)</h3>
                <div className="space-y-2">
                  <p>
                    1. "서비스"란 회사가 제공하는 별자리 관찰 및 모임 매칭
                    플랫폼을 의미합니다.
                  </p>
                  <p>
                    2. "이용자"란 이 약관에 따라 회사가 제공하는 서비스를 받는
                    회원 및 비회원을 말합니다.
                  </p>
                  <p>
                    3. "회원"이란 회사에 개인정보를 제공하여 회원등록을 한
                    자로서, 회사의 정보를 지속적으로 제공받으며, 회사가 제공하는
                    서비스를 계속적으로 이용할 수 있는 자를 말합니다.
                  </p>
                  <p>
                    4. "게시물"이란 회원이 서비스를 이용함에 있어 서비스상에
                    게시한 부호, 문자, 음성, 음향, 화상, 동영상 등의 정보 형태의
                    글, 사진, 동영상 및 각종 파일과 링크 등을 의미합니다.
                  </p>
                </div>
              </div>

              <div>
                <h3 className="text-white font-semibold mb-3">
                  제3조 (약관의 효력 및 변경)
                </h3>
                <div className="space-y-2">
                  <p>
                    1. 이 약관은 서비스를 이용하고자 하는 모든 이용자에 대하여
                    그 효력을 발생합니다.
                  </p>
                  <p>
                    2. 회사는 관련법을 위배하지 않는 범위에서 이 약관을 개정할
                    수 있습니다.
                  </p>
                  <p>
                    3. 회사가 약관을 개정할 경우에는 적용일자 및 개정사유를
                    명시하여 현행약관과 함께 서비스의 초기화면에 그 적용일자 7일
                    이전부터 적용일자 전일까지 공지합니다.
                  </p>
                </div>
              </div>

              <div>
                <h3 className="text-white font-semibold mb-3">
                  제4조 (회원가입)
                </h3>
                <div className="space-y-2">
                  <p>
                    1. 이용자는 회사가 정한 가입 양식에 따라 회원정보를 기입한
                    후 이 약관에 동의한다는 의사표시를 함으로서 회원가입을
                    신청합니다.
                  </p>
                  <p>
                    2. 회사는 제1항과 같이 회원으로 가입할 것을 신청한 이용자 중
                    다음 각 호에 해당하지 않는 한 회원으로 등록합니다.
                  </p>
                  <p>
                    - 가입신청자가 이 약관에 의하여 이전에 회원자격을 상실한
                    적이 있는 경우
                  </p>
                  <p>- 등록 내용에 허위, 기재누락, 오기가 있는 경우</p>
                  <p>
                    - 기타 회원으로 등록하는 것이 회사의 기술상 현저히 지장이
                    있다고 판단되는 경우
                  </p>
                </div>
              </div>

              <div>
                <h3 className="text-white font-semibold mb-3">
                  제5조 (서비스의 제공 및 변경)
                </h3>
                <div className="space-y-2">
                  <p>1. 회사는 회원에게 아래와 같은 서비스를 제공합니다.</p>
                  <p>- 별자리 관찰 정보 제공 서비스</p>
                  <p>- 별자리 관찰 모임 매칭 서비스</p>
                  <p>- 커뮤니티 게시판 서비스</p>
                  <p>
                    - 기타 회사가 추가 개발하거나 다른 회사와의 제휴계약 등을
                    통해 회원에게 제공하는 일체의 서비스
                  </p>
                  <p>
                    2. 회사는 운영상, 기술상의 필요에 따라 제공하고 있는 전부
                    또는 일부 서비스를 변경할 수 있습니다.
                  </p>
                </div>
              </div>

              <div>
                <h3 className="text-white font-semibold mb-3">
                  제6조 (서비스의 중단)
                </h3>
                <div className="space-y-2">
                  <p>
                    1. 회사는 컴퓨터 등 정보통신설비의 보수점검, 교체 및 고장,
                    통신의 두절 등의 사유가 발생한 경우에는 서비스의 제공을
                    일시적으로 중단할 수 있습니다.
                  </p>
                  <p>
                    2. 회사는 제1항의 사유로 서비스의 제공이 일시적으로
                    중단됨으로 인하여 이용자 또는 제3자가 입은 손해에 대하여
                    배상하지 않습니다.
                  </p>
                </div>
              </div>

              <div>
                <h3 className="text-white font-semibold mb-3">
                  제7조 (회원의 의무)
                </h3>
                <div className="space-y-2">
                  <p>1. 이용자는 다음 행위를 하여서는 안 됩니다.</p>
                  <p>- 신청 또는 변경시 허위 내용의 등록</p>
                  <p>- 타인의 정보 도용</p>
                  <p>- 회사가 게시한 정보의 변경</p>
                  <p>
                    - 회사가 정한 정보 이외의 정보(컴퓨터 프로그램 등) 등의 송신
                    또는 게시
                  </p>
                  <p>- 회사 기타 제3자의 저작권 등 지적재산권에 대한 침해</p>
                  <p>
                    - 회사 기타 제3자의 명예를 손상시키거나 업무를 방해하는 행위
                  </p>
                  <p>
                    - 외설 또는 폭력적인 메시지, 화상, 음성, 기타 공서양속에
                    반하는 정보를 서비스에 공개 또는 게시하는 행위
                  </p>
                </div>
              </div>

              <div>
                <h3 className="text-white font-semibold mb-3">
                  제8조 (저작권의 귀속 및 이용제한)
                </h3>
                <div className="space-y-2">
                  <p>
                    1. 회사가 작성한 저작물에 대한 저작권 기타 지적재산권은
                    회사에 귀속합니다.
                  </p>
                  <p>
                    2. 이용자는 서비스를 이용함으로써 얻은 정보 중 회사에게
                    지적재산권이 귀속된 정보를 회사의 사전 승낙 없이 복제, 송신,
                    출판, 배포, 방송 기타 방법에 의하여 영리목적으로 이용하거나
                    제3자에게 이용하게 하여서는 안됩니다.
                  </p>
                </div>
              </div>

              <div>
                <h3 className="text-white font-semibold mb-3">부칙</h3>
                <div className="space-y-2">
                  <p>이 약관은 2025년 1월 1일부터 적용됩니다.</p>
                  <p>최종 수정일: 2025년 1월 15일</p>
                </div>
              </div>
            </div>
          </section>

          {/* 개인정보 처리 동의 */}
          <section className="bg-[#1D1D1D] rounded-[10px] p-6">
            <h2 className="text-xl font-bold text-white mb-6">
              개인정보 수집 및 이용 동의
            </h2>

            <div className="space-y-6 text-[#D3D3D3] text-sm leading-relaxed">
              <div>
                <h3 className="text-white font-semibold mb-3">
                  1. 개인정보 수집항목
                </h3>
                <div className="space-y-2">
                  <p>
                    <span className="text-white font-medium">필수항목:</span>{' '}
                    이메일, 닉네임, 카카오톡 계정 정보
                  </p>
                  <p>
                    <span className="text-white font-medium">선택항목:</span>{' '}
                    프로필 사진, 관심 별자리, 지역 정보
                  </p>
                  <p>
                    <span className="text-white font-medium">
                      자동 수집항목:
                    </span>{' '}
                    IP주소, 접속 로그, 쿠키, 기기정보
                  </p>
                </div>
              </div>

              <div>
                <h3 className="text-white font-semibold mb-3">
                  2. 개인정보 수집 및 이용목적
                </h3>
                <div className="space-y-2">
                  <p>- 회원 가입 및 관리, 본인확인</p>
                  <p>- 서비스 제공 및 맞춤형 콘텐츠 추천</p>
                  <p>- 별자리 관찰 모임 매칭 서비스 제공</p>
                  <p>- 고객 상담 및 민원 처리</p>
                  <p>- 서비스 개선 및 신규 서비스 개발</p>
                  <p>- 마케팅 및 광고 활용 (선택항목, 별도 동의 시)</p>
                </div>
              </div>

              <div>
                <h3 className="text-white font-semibold mb-3">
                  3. 개인정보 보유 및 이용기간
                </h3>
                <div className="space-y-2">
                  <p>- 회원 탈퇴 시까지 보유하는 것을 원칙으로 합니다.</p>
                  <p>
                    - 단, 관계법령에 의한 보존의무가 있는 경우 해당 기간까지
                    보유합니다.
                  </p>
                  <p>
                    - 회원 탈퇴 후에도 서비스 부정이용 방지를 위해 최소 6개월간
                    이메일을 암호화하여 보관할 수 있습니다.
                  </p>
                </div>
              </div>

              <div>
                <h3 className="text-white font-semibold mb-3">
                  4. 개인정보 제3자 제공
                </h3>
                <div className="space-y-2">
                  <p>
                    회사는 원칙적으로 이용자의 개인정보를 외부에 제공하지
                    않습니다. 다만, 다음의 경우에는 예외로 합니다:
                  </p>
                  <p>- 이용자들이 사전에 동의한 경우</p>
                  <p>
                    - 법령의 규정에 의거하거나, 수사 목적으로 법령에 정해진
                    절차와 방법에 따라 수사기관의 요구가 있는 경우
                  </p>
                </div>
              </div>

              <div>
                <h3 className="text-white font-semibold mb-3">
                  5. 개인정보 처리 위탁
                </h3>
                <div className="space-y-2">
                  <p>
                    회사는 서비스 향상을 위해 다음과 같이 개인정보 처리업무를
                    위탁하고 있습니다:
                  </p>
                  <p>- 카카오톡: 소셜 로그인 서비스</p>
                  <p>- AWS: 클라우드 서버 및 데이터 저장</p>
                  <p>- 기타 서비스 운영에 필요한 전문업체</p>
                </div>
              </div>

              <div>
                <h3 className="text-white font-semibold mb-3">
                  6. 개인정보의 파기
                </h3>
                <div className="space-y-2">
                  <p>
                    회사는 개인정보 보유기간의 경과, 처리목적 달성 등 개인정보가
                    불필요하게 되었을 때에는 지체없이 해당 개인정보를
                    파기합니다.
                  </p>
                  <p>
                    전자적 파일 형태인 경우 복구 및 재생이 되지 않도록 안전하게
                    삭제하고, 그 밖에 기록물, 인쇄물, 서면 등의 경우 분쇄하거나
                    소각하여 파기합니다.
                  </p>
                </div>
              </div>

              <div>
                <h3 className="text-white font-semibold mb-3">
                  7. 개인정보 처리방침의 변경
                </h3>
                <div className="space-y-2">
                  <p>
                    이 개인정보 처리방침은 시행일로부터 적용되며, 법령 및 방침에
                    따른 변경내용의 추가, 삭제 및 정정이 있는 경우에는
                    변경사항의 시행 7일 전부터 공지사항을 통하여 고지할
                    것입니다.
                  </p>
                </div>
              </div>

              <div className="pt-4 border-t border-[#2F2F2F]">
                <p className="text-[#8F8F8F] text-xs">
                  시행일자: 2025년 1월 1일
                  <br />
                  최종 수정일: 2025년 1월 15일
                </p>
              </div>
            </div>
          </section>

          {/* 동의 확인 (선택사항) */}
          <section className="bg-[#1D1D1D] rounded-[10px] p-6">
            <h2 className="text-lg font-bold text-white mb-4">동의 확인</h2>
            <div className="space-y-3">
              <label className="flex items-start space-x-3 cursor-pointer">
                <input
                  type="checkbox"
                  className="mt-1 w-4 h-4 text-[#FFBB02] bg-transparent border-2 border-[#8F8F8F] rounded focus:ring-[#FFBB02] focus:ring-2"
                />
                <span className="text-[#D3D3D3] text-sm">
                  <span className="text-white font-medium">[필수]</span> 서비스
                  이용약관에 동의합니다.
                </span>
              </label>

              <label className="flex items-start space-x-3 cursor-pointer">
                <input
                  type="checkbox"
                  className="mt-1 w-4 h-4 text-[#FFBB02] bg-transparent border-2 border-[#8F8F8F] rounded focus:ring-[#FFBB02] focus:ring-2"
                />
                <span className="text-[#D3D3D3] text-sm">
                  <span className="text-white font-medium">[필수]</span>{' '}
                  개인정보 수집 및 이용에 동의합니다.
                </span>
              </label>

              <label className="flex items-start space-x-3 cursor-pointer">
                <input
                  type="checkbox"
                  className="mt-1 w-4 h-4 text-[#FFBB02] bg-transparent border-2 border-[#8F8F8F] rounded focus:ring-[#FFBB02] focus:ring-2"
                />
                <span className="text-[#D3D3D3] text-sm">
                  <span className="text-[#8F8F8F] font-medium">[선택]</span>{' '}
                  마케팅 정보 수신에 동의합니다.
                </span>
              </label>
            </div>
          </section>

          {/* 하단 여백 */}
          <div className="h-20"></div>
        </div>
      </div>
    </div>
  );
}
