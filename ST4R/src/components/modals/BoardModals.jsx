// 게시글 삭제 모달
export function BoardDeleteModal({ onClose, onConfirm, isLoading }) {
  return (
    <div className="relative w-96 font-['Pretendard'] p-5 flex flex-col text-center gap-6 bg-[#1D1D1D] rounded-2xl">
      <div className="flex flex-col gap-2">
        <div className="text-xl text-white">
          정말로 이 게시글을 삭제하시겠어요?
        </div>
        <div className="text-sm text-[#8F8F8F]">
          삭제된 게시글은 복구할 수 없습니다.
        </div>
      </div>
      <div className="flex gap-2">
        <button
          className="w-full h-14 hover:cursor-pointer leading-14 bg-[#2F2F2F] rounded-xl transition-colors hover:bg-[#3F3F3F]"
          onClick={onClose}
          disabled={isLoading}
        >
          취소
        </button>
        <button
          className="w-full h-14 hover:cursor-pointer leading-14 bg-[#FF4343] rounded-xl transition-colors hover:bg-[#E63939] disabled:opacity-50"
          onClick={onConfirm}
          disabled={isLoading}
        >
          {isLoading ? '삭제 중...' : '삭제하기'}
        </button>
      </div>
    </div>
  );
}

// 게시글 수정 성공 모달
export function BoardUpdateSuccessModal({ onClose }) {
  return (
    <div className="relative w-96 font-['Pretendard'] p-5 flex flex-col text-center gap-6 bg-[#1D1D1D] rounded-2xl">
      {/* 성공 아이콘 */}
      <div className="flex justify-center">
        <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center">
          <svg
            className="w-8 h-8 text-green-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5 13l4 4L19 7"
            />
          </svg>
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <div className="text-xl font-medium text-white">
          게시글이 수정되었습니다!
        </div>
        <div className="text-sm text-[#8F8F8F]">
          변경된 내용이 성공적으로 저장되었습니다.
        </div>
      </div>

      <button
        className="w-full h-14 hover:cursor-pointer flex items-center justify-center bg-[#FFBB02] text-black rounded-xl transition-colors hover:bg-[#E6A500]"
        onClick={onClose}
      >
        <span className="font-medium">확인</span>
      </button>
    </div>
  );
}

// 게시글 작성 성공 모달
export function BoardCreateSuccessModal({ onClose }) {
  return (
    <div className="relative w-96 font-['Pretendard'] p-5 flex flex-col text-center gap-6 bg-[#1D1D1D] rounded-2xl">
      {/* 성공 아이콘 */}
      <div className="flex justify-center">
        <div className="w-16 h-16 bg-blue-500/20 rounded-full flex items-center justify-center">
          <svg
            className="w-8 h-8 text-blue-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
            />
          </svg>
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <div className="text-xl font-medium text-white">게시글 작성 완료!</div>
        <div className="text-sm text-[#8F8F8F]">
          새로운 게시글이 성공적으로 등록되었습니다.
        </div>
      </div>

      <button
        className="w-full h-14 hover:cursor-pointer flex items-center justify-center bg-[#FFBB02] text-black rounded-xl transition-colors hover:bg-[#E6A500]"
        onClick={onClose}
      >
        <span className="font-medium">홈으로 돌아가기</span>
      </button>
    </div>
  );
}

// 댓글 삭제 모달
export function CommentDeleteModal({ onClose, onConfirm, isLoading }) {
  return (
    <div className="relative w-96 font-['Pretendard'] p-5 flex flex-col text-center gap-6 bg-[#1D1D1D] rounded-2xl">
      <div className="flex flex-col gap-2">
        <div className="text-xl text-white">댓글을 삭제하시겠어요?</div>
        <div className="text-sm text-[#8F8F8F]">
          삭제된 댓글은 복구할 수 없습니다.
        </div>
      </div>
      <div className="flex gap-2">
        <button
          className="w-full h-14 hover:cursor-pointer leading-14 bg-[#2F2F2F] rounded-xl transition-colors hover:bg-[#3F3F3F]"
          onClick={onClose}
          disabled={isLoading}
        >
          취소
        </button>
        <button
          className="w-full h-14 hover:cursor-pointer leading-14 bg-[#FF4343] rounded-xl transition-colors hover:bg-[#E63939] disabled:opacity-50"
          onClick={onConfirm}
          disabled={isLoading}
        >
          {isLoading ? '삭제 중...' : '삭제하기'}
        </button>
      </div>
    </div>
  );
}

// 로그인 필요 모달
export function LoginRequiredModal({
  onClose,
  onLogin,
  message = '로그인이 필요합니다.',
}) {
  return (
    <div className="relative w-96 font-['Pretendard'] p-5 flex flex-col text-center gap-6 bg-[#1D1D1D] rounded-2xl">
      {/* 로그인 아이콘 */}
      <div className="flex justify-center">
        <div className="w-16 h-16 bg-yellow-500/20 rounded-full flex items-center justify-center">
          <svg
            className="w-8 h-8 text-yellow-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
            />
          </svg>
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <div className="text-xl text-white">로그인이 필요해요</div>
        <div className="text-sm text-[#8F8F8F]">
          {message}
          <br />
          로그인 페이지로 이동하시겠어요?
        </div>
      </div>

      <div className="flex gap-2">
        <button
          className="w-full h-14 hover:cursor-pointer leading-14 bg-[#2F2F2F] rounded-xl transition-colors hover:bg-[#3F3F3F]"
          onClick={onClose}
        >
          취소
        </button>
        <button
          className="w-full h-14 hover:cursor-pointer leading-14 bg-[#FFBB02] text-black rounded-xl transition-colors hover:bg-[#E6A500]"
          onClick={onLogin}
        >
          로그인하기
        </button>
      </div>
    </div>
  );
}

// 공유 모달
export function ShareModal({ onClose, postTitle, shareUrl }) {
  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      alert('링크가 클립보드에 복사되었습니다.');
    } catch (error) {
      console.error('클립보드 복사 실패:', error);
      // 대안 방법
      const textArea = document.createElement('textarea');
      textArea.value = shareUrl;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      alert('링크가 클립보드에 복사되었습니다.');
    }
  };

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: postTitle,
          url: shareUrl,
        });
      } catch (error) {
        console.error('공유 실패:', error);
      }
    } else {
      handleCopyLink();
    }
  };

  return (
    <div className="relative w-96 font-['Pretendard'] p-5 flex flex-col gap-6 bg-[#1D1D1D] rounded-2xl">
      {/* 헤더 */}
      <div className="flex items-center justify-between">
        <div className="text-xl font-medium text-white">게시글 공유</div>
        <button
          onClick={onClose}
          className="text-gray-400 hover:text-white transition-colors"
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      </div>

      {/* 게시글 정보 */}
      <div className="bg-[#2F2F2F] rounded-lg p-3">
        <div className="text-sm text-white font-medium truncate">
          {postTitle}
        </div>
        <div className="text-xs text-gray-400 mt-1 truncate">{shareUrl}</div>
      </div>

      {/* 공유 옵션 */}
      <div className="flex flex-col gap-3">
        {navigator.share && (
          <button
            onClick={handleNativeShare}
            className="flex items-center gap-3 p-3 bg-[#2F2F2F] rounded-lg hover:bg-[#3F3F3F] transition-colors"
          >
            <div className="w-10 h-10 bg-blue-500/20 rounded-full flex items-center justify-center">
              <svg
                className="w-5 h-5 text-blue-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z"
                />
              </svg>
            </div>
            <div className="text-left">
              <div className="text-white font-medium">다른 앱으로 공유</div>
              <div className="text-xs text-gray-400">카카오톡, 메시지 등</div>
            </div>
          </button>
        )}

        <button
          onClick={handleCopyLink}
          className="flex items-center gap-3 p-3 bg-[#2F2F2F] rounded-lg hover:bg-[#3F3F3F] transition-colors"
        >
          <div className="w-10 h-10 bg-green-500/20 rounded-full flex items-center justify-center">
            <svg
              className="w-5 h-5 text-green-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
              />
            </svg>
          </div>
          <div className="text-left">
            <div className="text-white font-medium">링크 복사</div>
            <div className="text-xs text-gray-400">클립보드에 링크 복사</div>
          </div>
        </button>
      </div>
    </div>
  );
}

// 일반적인 확인 모달
export function ConfirmModal({
  onClose,
  onConfirm,
  isLoading = false,
  title = '확인',
  message = '정말로 진행하시겠습니까?',
  confirmText = '확인',
  cancelText = '취소',
  confirmButtonStyle = 'bg-[#FFBB02] text-black hover:bg-[#E6A500]',
  icon = null,
}) {
  return (
    <div className="relative w-96 font-['Pretendard'] p-5 flex flex-col text-center gap-6 bg-[#1D1D1D] rounded-2xl">
      {icon && <div className="flex justify-center">{icon}</div>}

      <div className="flex flex-col gap-2">
        <div className="text-xl text-white">{title}</div>
        <div className="text-sm text-[#8F8F8F]">{message}</div>
      </div>

      <div className="flex gap-2">
        <button
          className="w-full h-14 hover:cursor-pointer leading-14 bg-[#2F2F2F] rounded-xl transition-colors hover:bg-[#3F3F3F]"
          onClick={onClose}
          disabled={isLoading}
        >
          {cancelText}
        </button>
        <button
          className={`w-full h-14 hover:cursor-pointer leading-14 rounded-xl transition-colors disabled:opacity-50 ${confirmButtonStyle}`}
          onClick={onConfirm}
          disabled={isLoading}
        >
          {isLoading ? '처리 중...' : confirmText}
        </button>
      </div>
    </div>
  );
}

// 알림 모달 (정보 표시용)
export function AlertModal({
  onClose,
  title = '알림',
  message = '',
  buttonText = '확인',
  icon = null,
  buttonStyle = 'bg-[#FFBB02] text-black hover:bg-[#E6A500]',
}) {
  return (
    <div className="relative w-96 font-['Pretendard'] p-5 flex flex-col text-center gap-6 bg-[#1D1D1D] rounded-2xl">
      {icon && <div className="flex justify-center">{icon}</div>}

      <div className="flex flex-col gap-2">
        <div className="text-xl text-white">{title}</div>
        <div className="text-sm text-[#8F8F8F]">{message}</div>
      </div>

      <button
        className={`w-full h-14 hover:cursor-pointer flex items-center justify-center rounded-xl transition-colors ${buttonStyle}`}
        onClick={onClose}
      >
        <span className="font-medium">{buttonText}</span>
      </button>
    </div>
  );
}

// 에러 모달
export function ErrorModal({
  onClose,
  title = '오류',
  message = '알 수 없는 오류가 발생했습니다.',
}) {
  const errorIcon = (
    <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center">
      <svg
        className="w-8 h-8 text-red-400"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
        />
      </svg>
    </div>
  );

  return (
    <AlertModal
      onClose={onClose}
      title={title}
      message={message}
      icon={errorIcon}
      buttonStyle="bg-red-500 text-white hover:bg-red-600"
    />
  );
}

// 성공 모달
export function SuccessModal({
  onClose,
  title = '성공',
  message = '작업이 완료되었습니다.',
}) {
  const successIcon = (
    <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center">
      <svg
        className="w-8 h-8 text-green-400"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M5 13l4 4L19 7"
        />
      </svg>
    </div>
  );

  return (
    <AlertModal
      onClose={onClose}
      title={title}
      message={message}
      icon={successIcon}
      buttonStyle="bg-green-500 text-white hover:bg-green-600"
    />
  );
}

