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

