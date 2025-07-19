import { useState, useEffect } from 'react';
import { useDeleteMemberMutation } from '../../api/deleteMember';
import ModalPortal from '../common/ModalPortal';
import FinalDeleteConfirmationModal from './FinalDeleteConfirmationModal';
import DeleteMemberErrorModal from './DeleteMemberErrorModal';

// 회원탈퇴 모달 컴포넌트 (1단계)
export default function DeleteMemberModal({ onClose }) {
  const [showFinalConfirmation, setShowFinalConfirmation] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const deleteMemberMutation = useDeleteMemberMutation();

  // 에러 상태 감지
  useEffect(() => {
    if (deleteMemberMutation.isError) {
      const error = deleteMemberMutation.error;
      let message = '회원 탈퇴 중 오류가 발생했습니다.';

      if (error.response?.status === 400 || error.response?.status === 403) {
        const errorData = error.response?.data;
        message =
          errorData?.message ||
          '모임장은 회원 탈퇴할 수 없습니다. 모임장을 위임한 후에 탈퇴해주세요.';
      }

      setErrorMessage(message);
      setShowFinalConfirmation(false); // 최종 확인 모달 닫기
      setShowErrorModal(true);
    }
  }, [deleteMemberMutation.isError, deleteMemberMutation.error]);

  const handleDeleteMember = () => {
    // 1단계에서 2단계로 이동
    setShowFinalConfirmation(true);
  };

  const handleFinalConfirm = () => {
    // 실제 탈퇴 실행
    deleteMemberMutation.mutate();
  };

  return (
    <>
      {/* 1단계: 초기 확인 모달 */}
      <div className="relative w-96 font-['Pretendard'] p-5 flex flex-col text-center gap-6 bg-[#1D1D1D] rounded-2xl">
        <div className="flex flex-col gap-2">
          <div className="text-xl ">정말로 회원 탈퇴하시겠어요?</div>
          <div className="text-sm text-[#8F8F8F] text-left">
            회원 탈퇴 시 다음 사항들이 영구적으로 삭제됩니다:
            <br />
            • 사용자의 프로필 정보
            <br />
            • 사용자의 생년월일 성별 등 개인정보
            <br />
            <br />
            <span className="text-[#FF4343]">
              이 작업은 되돌릴 수 없습니다.
            </span>
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
            className="w-full h-14 hover:cursor-pointer leading-14 bg-[#FF4343] text-white rounded-xl transition-colors hover:bg-[#E63939]"
            onClick={handleDeleteMember}
          >
            회원탈퇴
          </button>
        </div>
      </div>

      {/* 2단계: 최종 확인 모달 */}
      {showFinalConfirmation && (
        <ModalPortal>
          <FinalDeleteConfirmationModal
            onClose={() => setShowFinalConfirmation(false)}
            onConfirm={handleFinalConfirm}
            isLoading={deleteMemberMutation.isLoading}
          />
        </ModalPortal>
      )}

      {/* 3단계: 에러 모달 */}
      {showErrorModal && (
        <ModalPortal>
          <DeleteMemberErrorModal
            errorMessage={errorMessage}
            onClose={() => {
              setShowErrorModal(false);
              onClose(); // 전체 모달 닫기
            }}
          />
        </ModalPortal>
      )}
    </>
  );
}
