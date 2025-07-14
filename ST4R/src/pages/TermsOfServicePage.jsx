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
        <div className="space-y-6">
          {/* 서비스 이용약관 */}
          <section className="bg-[#1D1D1D] rounded-[10px] p-6">
            <h2 className="text-xl font-bold text-white mb-4">
              Starlight 서비스 이용약관
            </h2>

            <div className="space-y-4 text-[#D3D3D3] text-sm leading-relaxed">
              <div>
                <h3 className="text-white font-semibold mb-2">제1조 (목적)</h3>
                <p>
                  본 약관은 에코노베이션이 제공하는 Starlight 서비스 이용에 관한
                  조건과 절차, 회사와 이용자의 권리·의무 및 책임사항을
                  규정합니다.
                </p>
              </div>

              <div>
                <h3 className="text-white font-semibold mb-2">제2조 (정의)</h3>
                <div className="space-y-1">
                  <p>• 서비스: 별자리 관찰 및 모임 매칭 플랫폼</p>
                  <p>• 회원: 서비스에 회원가입한 이용자</p>
                  <p>• 게시물: 서비스에 업로드된 텍스트, 이미지, 영상 등</p>
                </div>
              </div>

              <div>
                <h3 className="text-white font-semibold mb-2">
                  제3조 (서비스 제공)
                </h3>
                <div className="space-y-1">
                  <p>• 별자리 관찰 정보 및 모임 매칭 서비스</p>
                  <p>• 커뮤니티 게시판 서비스</p>
                  <p>• 기타 회사가 개발하는 부가 서비스</p>
                </div>
              </div>

              <div>
                <h3 className="text-white font-semibold mb-2">
                  제4조 (회원의 의무)
                </h3>
                <div className="space-y-1">
                  <p>• 허위 정보 등록 금지</p>
                  <p>• 타인의 개인정보 도용 금지</p>
                  <p>• 서비스 부정 이용 금지</p>
                  <p>• 타인의 권리 침해 금지</p>
                </div>
              </div>

              <div className="pt-4 border-t border-[#2F2F2F]">
                <p className="text-[#8F8F8F] text-xs">
                  시행일: 2025년 7월 25일 | 최종 수정일: 2025년 7월 25일
                </p>
              </div>
            </div>
          </section>

          {/* 개인정보 처리 동의 */}
          <section className="bg-[#1D1D1D] rounded-[10px] p-6">
            <h2 className="text-xl font-bold text-white mb-4">
              개인정보 수집 및 이용 동의
            </h2>

            <div className="space-y-4 text-[#D3D3D3] text-sm leading-relaxed">
              <div>
                <h3 className="text-white font-semibold mb-2">
                  1. 수집하는 개인정보
                </h3>
                <div className="space-y-1">
                  <p>
                    <span className="text-white">필수:</span> 이메일, 닉네임,
                    카카오 계정 정보
                  </p>
                  <p>
                    <span className="text-white">선택:</span> 프로필 사진, 관심
                    별자리
                  </p>
                  <p>
                    <span className="text-white">자동수집:</span> IP주소, 접속
                    기록, 쿠키
                  </p>
                </div>
              </div>

              <div>
                <h3 className="text-white font-semibold mb-2">2. 이용목적</h3>
                <div className="space-y-1">
                  <p>• 회원 가입 및 본인 확인</p>
                  <p>• 서비스 제공 및 맞춤 콘텐츠 추천</p>
                  <p>• 고객 상담 및 민원 처리</p>
                  <p>• 서비스 개선 및 신규 서비스 개발</p>
                </div>
              </div>

              <div>
                <h3 className="text-white font-semibold mb-2">3. 보유기간</h3>
                <p>
                  회원 탈퇴 시까지 (법령에 의한 보존의무가 있는 경우 해당
                  기간까지)
                </p>
              </div>

              <div>
                <h3 className="text-white font-semibold mb-2">4. 제3자 제공</h3>
                <div className="space-y-1">
                  <p>• 카카오: 소셜 로그인 서비스</p>
                  <p>• AWS: 클라우드 서버 운영</p>
                  <p>
                    • 법령에 의한 경우를 제외하고 제3자에게 제공하지 않습니다
                  </p>
                </div>
              </div>

              <div>
                <h3 className="text-white font-semibold mb-2">
                  5. 정보주체의 권리
                </h3>
                <p>
                  언제든지 개인정보 열람, 정정·삭제, 처리정지를 요구하실 수
                  있습니다.
                </p>
              </div>

              <div className="pt-4 border-t border-[#2F2F2F]">
                <p className="text-[#8F8F8F] text-xs">
                  시행일: 2025년 7월 25일 | 최종 수정일: 2025년 7월 25일
                </p>
              </div>
            </div>
          </section>

          {/* 문의 정보 */}
          <section className="bg-[#1D1D1D] rounded-[10px] p-6">
            <h3 className="text-lg font-bold text-white mb-3">문의하기</h3>
            <div className="text-[#D3D3D3] text-sm space-y-2">
              <p>개인정보 관련 문의사항이 있으시면 아래로 연락해 주세요.</p>
              <div className="bg-[#0F0F0F] rounded-lg p-3 space-y-1">
                <p>
                  <span className="text-white">이메일:</span>{' '}
                  enconovation@jnu.ac.kr
                </p>
                <p>
                  <span className="text-white">전화:</span> 010-7610-0714
                </p>
                <p>
                  <span className="text-white">운영시간:</span> 평일 09:00-18:00
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
