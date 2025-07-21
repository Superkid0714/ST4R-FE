import { useParams, useNavigate } from 'react-router-dom';
import { useCallback } from 'react';
import { useBoardDetail, useComments } from '../../api/boardDetail';
import ImageViewer from '../../components/common/ImageViewer';
import ModalPortal from '../../components/common/ModalPortal';

// 분리된 컴포넌트들
import BoardDetailHeader from '../../components/board/BoardDetailHeader';
import BoardDetailContent from '../../components/board/BoardDetailContent';
import BoardDetailComments from '../../components/board/BoardDetailComments';

// 모달 컴포넌트들
import {
  BoardDeleteModal,
  CommentDeleteModal,
  LoginRequiredModal,
  ShareModal,
} from '../../components/modals/BoardModals';

// 커스텀 훅들
import { useBoardDetailAuth } from '../../hooks/useBoardDetailAuth';
import { useBoardDetailComments } from '../../hooks/useBoardDetailComments';
import { useBoardDetailActions } from '../../hooks/useBoardDetailActions';
import { useBoardDetailImage } from '../../hooks/useBoardDetailImage';

export default function BoardDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  // 커스텀 훅들로 로직 분리
  const { isLoggedIn, currentUser } = useBoardDetailAuth();
  const {
    isImageViewerOpen,
    selectedImageIndex,
    handleImageClick,
    handleCloseImageViewer,
  } = useBoardDetailImage();

  // API 호출
  const {
    data: post,
    isLoading: isPostLoading,
    error: postError,
  } = useBoardDetail(id);

  const { data: comments, isLoading: isCommentsLoading } = useComments(id);

  // 액션 관련 훅
  const {
    isAuthor,
    handleLike,
    handleEdit,
    handleDelete,
    handleShare,
    handleBack,
    likeBoardMutation,
    deleteBoardMutation,
    // 모달 상태들
    showDeleteModal,
    setShowDeleteModal,
    showLoginModal,
    setShowLoginModal,
    showShareModal,
    setShowShareModal,
    loginModalMessage,
    // 모달 액션들
    confirmDelete,
    handleLoginRedirect,
  } = useBoardDetailActions(id, post, isLoggedIn, navigate);

  // 댓글 관련 훅
  const {
    newComment,
    setNewComment,
    editingCommentId,
    editingCommentContent,
    setEditingCommentContent,
    handleCommentSubmit,
    handleEditComment,
    handleCancelEdit,
    handleUpdateComment,
    handleDeleteComment,
    createCommentMutation,
    updateCommentMutation,
    deleteCommentMutation,
    // 댓글 모달 관련
    showDeleteModal: showCommentDeleteModal,
    setShowDeleteModal: setShowCommentDeleteModal,
    showLoginModal: showCommentLoginModal,
    setShowLoginModal: setShowCommentLoginModal,
    confirmDeleteComment,
    handleLoginRedirect: handleCommentLoginRedirect,
  } = useBoardDetailComments(id, isLoggedIn, navigate);

  // 작성자 이름 표시 함수
  const getAuthorDisplayName = useCallback((author) => {
    if (!author) return '익명';
    return author.name || author.nickname || `사용자${author.id}` || '익명';
  }, []);

  // 좋아요 상태 및 개수
  const isLiked = post?.liked === true;
  const likeCount = post?.likeCount || 0;
  const allImages = post?.imageUrls || [];

  // 로딩 상태
  if (isPostLoading) {
    return <LoadingState />;
  }

  // 에러 상태
  if (postError) {
    return (
      <ErrorState
        error={postError}
        isLoggedIn={isLoggedIn}
        boardId={id}
        navigate={navigate}
        onBack={handleBack}
      />
    );
  }

  if (!post) {
    return <LoadingState />;
  }

  return (
    <div>
      <div className="min-h-screen bg-black text-white">
        {/* 헤더 이미지 영역 */}
        <BoardDetailHeader
          post={post}
          isLoggedIn={isLoggedIn}
          isAuthor={isAuthor}
          isLiked={isLiked}
          likeCount={likeCount}
          onLike={handleLike}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onShare={handleShare}
          likeMutation={likeBoardMutation}
          onImageClick={handleImageClick}
        />

        {/* 메인 콘텐츠 */}
        <BoardDetailContent
          post={post}
          likeCount={likeCount}
          getAuthorDisplayName={getAuthorDisplayName}
          onImageClick={handleImageClick}
        />

        {/* 댓글 섹션 */}
        <div className="px-4">
          <BoardDetailComments
            comments={comments}
            isLoading={isCommentsLoading}
            isLoggedIn={isLoggedIn}
            currentUser={currentUser}
            newComment={newComment}
            setNewComment={setNewComment}
            editingCommentId={editingCommentId}
            editingCommentContent={editingCommentContent}
            setEditingCommentContent={setEditingCommentContent}
            onCommentSubmit={handleCommentSubmit}
            onEditComment={handleEditComment}
            onUpdateComment={handleUpdateComment}
            onCancelEdit={handleCancelEdit}
            onDeleteComment={handleDeleteComment}
            getAuthorDisplayName={getAuthorDisplayName}
            createCommentMutation={createCommentMutation}
            updateCommentMutation={updateCommentMutation}
            deleteCommentMutation={deleteCommentMutation}
            navigate={navigate}
          />
        </div>
      </div>

      {/* 이미지 뷰어 */}
      <ImageViewer
        images={allImages}
        initialIndex={selectedImageIndex}
        isOpen={isImageViewerOpen}
        onClose={handleCloseImageViewer}
      />

      {/* 게시글 삭제 모달 */}
      {showDeleteModal && (
        <ModalPortal>
          <BoardDeleteModal
            onClose={() => setShowDeleteModal(false)}
            onConfirm={confirmDelete}
            isLoading={deleteBoardMutation.isLoading}
          />
        </ModalPortal>
      )}

      {/* 게시글 관련 로그인 필요 모달 */}
      {showLoginModal && (
        <ModalPortal>
          <LoginRequiredModal
            onClose={() => setShowLoginModal(false)}
            onLogin={handleLoginRedirect}
            message={loginModalMessage}
          />
        </ModalPortal>
      )}

      {/* 공유 모달 */}
      {showShareModal && (
        <ModalPortal>
          <ShareModal
            onClose={() => setShowShareModal(false)}
            postTitle={post.title}
            shareUrl={window.location.href}
          />
        </ModalPortal>
      )}

      {/* 댓글 삭제 모달 */}
      {showCommentDeleteModal && (
        <ModalPortal>
          <CommentDeleteModal
            onClose={() => setShowCommentDeleteModal(false)}
            onConfirm={confirmDeleteComment}
            isLoading={deleteCommentMutation.isLoading}
          />
        </ModalPortal>
      )}

      {/* 댓글 관련 로그인 필요 모달 */}
      {showCommentLoginModal && (
        <ModalPortal>
          <LoginRequiredModal
            onClose={() => setShowCommentLoginModal(false)}
            onLogin={handleCommentLoginRedirect}
            message="댓글 작성을 하려면 로그인이 필요합니다."
          />
        </ModalPortal>
      )}
    </div>
  );
}

// 로딩 상태 컴포넌트
function LoadingState() {
  return (
    <div className="min-h-screen bg-black flex items-center justify-center">
      <div className="w-8 h-8 border-2 border-yellow-500 border-t-transparent rounded-full animate-spin"></div>
    </div>
  );
}

// 에러 상태 컴포넌트
function ErrorState({ error, isLoggedIn, navigate, onBack }) {
  // 401 에러이고 로그인된 상태인 경우 (토큰 만료)
  if ((error.response?.status === 401 || error.isAuthError) && isLoggedIn) {
    return (
      <div className="min-h-screen bg-black flex flex-col items-center justify-center px-4">
        <div className="text-center">
          <svg
            className="w-16 h-16 mx-auto mb-4 text-yellow-500"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1}
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z"
            />
          </svg>
          <h2 className="text-xl font-bold text-white mb-2">
            로그인이 만료되었습니다
          </h2>
          <p className="text-gray-400 mb-4">
            이 게시글을 보려면 다시 로그인해주세요.
          </p>
          <div className="flex space-x-3 justify-center">
            <button
              onClick={() => navigate('/login')}
              className="bg-yellow-500 text-black px-6 py-2 rounded-lg font-medium hover:bg-yellow-400 transition-colors"
            >
              로그인
            </button>
            <button
              onClick={() => window.location.reload()}
              className="bg-gray-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-gray-500 transition-colors"
            >
              새로고침
            </button>
          </div>
        </div>
      </div>
    );
  }

  // 일반적인 에러
  return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center px-4">
      <div className="text-center">
        <svg
          className="w-16 h-16 mx-auto mb-4 text-red-400"
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
        <h2 className="text-xl font-bold text-white mb-2">
          게시글을 불러올 수 없습니다
        </h2>
        <p className="text-gray-400 mb-4">
          {error?.response?.status === 404
            ? '존재하지 않는 게시글입니다.'
            : '잠시 후 다시 시도해주세요.'}
        </p>
        <button
          onClick={onBack}
          className="bg-yellow-500 text-black px-6 py-2 rounded-lg font-medium hover:bg-yellow-400 transition-colors"
        >
          뒤로가기
        </button>
      </div>
    </div>
  );
}
