// 기본 프로필 아이콘
const DefaultProfileIcon = ({ size = 8 }) => (
  <svg
    width={size * 3.6}
    height={size * 3.6}
    viewBox="0 0 36 36"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <g clipPath="url(#clip0_3312_1842)">
      <rect width="36" height="36" rx="17.3325" fill="#2F2F2F" />
      <circle cx="18" cy="34" r="12" fill="#5F5F5F" />
      <circle cx="18" cy="13" r="6" fill="#5F5F5F" />
    </g>
    <defs>
      <clipPath id="clip0_3312_1842">
        <rect width="36" height="36" rx="17.3325" fill="white" />
      </clipPath>
    </defs>
  </svg>
);

export default function BoardDetailComments({
  comments,
  isLoading,
  isLoggedIn,
  currentUser,
  newComment,
  setNewComment,
  editingCommentId,
  editingCommentContent,
  setEditingCommentContent,
  onCommentSubmit,
  onEditComment,
  onUpdateComment,
  onCancelEdit,
  onDeleteComment,
  getAuthorDisplayName,
  createCommentMutation,
  updateCommentMutation,
  deleteCommentMutation,
  navigate,
}) {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">댓글 {comments?.length || 0}개</h3>

      {/* 댓글 작성 */}
      <CommentInput
        isLoggedIn={isLoggedIn}
        newComment={newComment}
        setNewComment={setNewComment}
        onCommentSubmit={onCommentSubmit}
        createCommentMutation={createCommentMutation}
        navigate={navigate}
      />

      {/* 댓글 목록 */}
      <CommentList
        comments={comments}
        isLoading={isLoading}
        isLoggedIn={isLoggedIn}
        currentUser={currentUser}
        editingCommentId={editingCommentId}
        editingCommentContent={editingCommentContent}
        setEditingCommentContent={setEditingCommentContent}
        onEditComment={onEditComment}
        onUpdateComment={onUpdateComment}
        onCancelEdit={onCancelEdit}
        onDeleteComment={onDeleteComment}
        getAuthorDisplayName={getAuthorDisplayName}
        updateCommentMutation={updateCommentMutation}
        deleteCommentMutation={deleteCommentMutation}
      />

      <div className="h-20"></div>
    </div>
  );
}

// 댓글 입력 컴포넌트
function CommentInput({
  isLoggedIn,
  newComment,
  setNewComment,
  onCommentSubmit,
  createCommentMutation,
  navigate,
}) {
  if (isLoggedIn) {
    return (
      <div className="flex space-x-3">
        <div className="flex-1 flex space-x-2">
          <input
            type="text"
            placeholder="댓글을 남겨보세요..."
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            className="flex-1 bg-[#1A1A1A] rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-yellow-500"
            onKeyPress={(e) => e.key === 'Enter' && onCommentSubmit()}
            disabled={createCommentMutation.isLoading}
            maxLength={500}
          />
          <button
            onClick={onCommentSubmit}
            disabled={!newComment.trim() || createCommentMutation.isLoading}
            className="w-12 h-12 bg-[#1A1A1A] text-yellow-500 rounded-full hover:bg-[#2A2A2A] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
            aria-label="댓글 등록"
          >
            {createCommentMutation.isLoading ? (
              <div className="w-5 h-5 border-2 border-yellow-500 border-t-transparent rounded-full animate-spin"></div>
            ) : (
              <svg
                width="19"
                height="16"
                viewBox="0 0 19 16"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="w-5 h-4"
              >
                <path
                  d="M17.8435 8.97835L1.55979 15.8436C1.20824 15.9842 0.874277 15.9539 0.557916 15.7529C0.241555 15.5516 0.083374 15.2596 0.083374 14.8767V1.12347C0.083374 0.740612 0.241555 0.448557 0.557916 0.247307C0.874277 0.0462511 1.20824 0.0160154 1.55979 0.156599L17.8435 7.02185C18.2773 7.21338 18.4942 7.53946 18.4942 8.0001C18.4942 8.46074 18.2773 8.78682 17.8435 8.97835ZM1.83337 13.8334L15.6584 8.0001L1.83337 2.16676V6.47439L8.16021 8.0001L1.83337 9.52581V13.8334Z"
                  fill="currentColor"
                />
              </svg>
            )}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-3">
      <div className="bg-[#1D1D1D] rounded-2xl px-5 py-4 flex-1">
        <span className="text-[#D3D3D3] text-sm font-normal">
          지금 로그인하고 댓글을 남겨보세요!
        </span>
      </div>
      <button
        onClick={() => navigate('/login')}
        className="bg-[#FFBB02] text-black px-5 py-4 rounded-2xl font-bold text-sm hover:bg-[#E6A500] transition-colors flex-shrink-0"
      >
        로그인
      </button>
    </div>
  );
}

// 댓글 목록 컴포넌트
function CommentList({
  comments,
  isLoading,
  isLoggedIn,
  currentUser,
  editingCommentId,
  editingCommentContent,
  setEditingCommentContent,
  onEditComment,
  onUpdateComment,
  onCancelEdit,
  onDeleteComment,
  getAuthorDisplayName,
  updateCommentMutation,
  deleteCommentMutation,
}) {
  if (isLoading) {
    return (
      <div className="text-center py-4">
        <div className="w-6 h-6 border-2 border-yellow-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
      </div>
    );
  }

  if (!comments || comments.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">첫 번째 댓글을 남겨보세요!</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {comments.map((comment) => (
        <CommentItem
          key={comment.id}
          comment={comment}
          isLoggedIn={isLoggedIn}
          currentUser={currentUser}
          editingCommentId={editingCommentId}
          editingCommentContent={editingCommentContent}
          setEditingCommentContent={setEditingCommentContent}
          onEditComment={onEditComment}
          onUpdateComment={onUpdateComment}
          onCancelEdit={onCancelEdit}
          onDeleteComment={onDeleteComment}
          getAuthorDisplayName={getAuthorDisplayName}
          updateCommentMutation={updateCommentMutation}
          deleteCommentMutation={deleteCommentMutation}
        />
      ))}
    </div>
  );
}

// 개별 댓글 컴포넌트
function CommentItem({
  comment,
  isLoggedIn,
  currentUser,
  editingCommentId,
  editingCommentContent,
  setEditingCommentContent,
  onEditComment,
  onUpdateComment,
  onCancelEdit,
  onDeleteComment,
  getAuthorDisplayName,
  updateCommentMutation,
  deleteCommentMutation,
}) {
  const isCommentAuthor = currentUser && comment.author?.id === currentUser.id;

  return (
    <div className="flex space-x-3">
      {/* 프로필 이미지 또는 기본 아이콘 */}
      <div className="flex-shrink-0">
        {comment.author?.imageUrl ? (
          <img
            src={comment.author.imageUrl}
            alt={`${getAuthorDisplayName(comment.author)} 프로필`}
            className="w-8 h-8 rounded-full object-cover"
            onError={(e) => {
              // 이미지 로딩 실패 시 기본 아이콘으로 대체
              e.target.style.display = 'none';
              e.target.nextSibling.style.display = 'block';
            }}
          />
        ) : null}
        <div
          className="w-8 h-8 flex items-center justify-center"
          style={{ display: comment.author?.imageUrl ? 'none' : 'block' }}
        >
          <DefaultProfileIcon size={8} />
        </div>
      </div>

      <div className="flex-1">
        <div className="flex items-center justify-between mb-1">
          <span className="font-medium text-sm">
            {getAuthorDisplayName(comment.author)}
          </span>
          {/* 댓글 수정/삭제 버튼 */}
          {isLoggedIn && isCommentAuthor && editingCommentId !== comment.id && (
            <CommentActions
              comment={comment}
              onEditComment={onEditComment}
              onDeleteComment={onDeleteComment}
              deleteCommentMutation={deleteCommentMutation}
            />
          )}
        </div>
        <div className="text-xs text-gray-500 mb-2">
          {comment.createdAt
            ? new Date(comment.createdAt).toLocaleString('ko-KR')
            : ''}
        </div>

        {editingCommentId === comment.id ? (
          // 수정 모드
          <CommentEditForm
            comment={comment}
            editingCommentContent={editingCommentContent}
            setEditingCommentContent={setEditingCommentContent}
            onUpdateComment={onUpdateComment}
            onCancelEdit={onCancelEdit}
            updateCommentMutation={updateCommentMutation}
          />
        ) : (
          // 일반 모드
          <p className="text-sm text-gray-300 mb-2">{comment.content}</p>
        )}
      </div>
    </div>
  );
}

// 댓글 액션 버튼들 (수정/삭제)
function CommentActions({
  comment,
  onEditComment,
  onDeleteComment,
  deleteCommentMutation,
}) {
  return (
    <div className="flex items-center space-x-3">
      <button
        onClick={() => onEditComment(comment)}
        className="p-1.5 hover:bg-gray-700 rounded transition-colors"
        title="수정"
      >
        <svg
          width="18"
          height="18"
          viewBox="0 0 18 18"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-4 h-4"
        >
          <path
            d="M1.59802 17.4614C1.28019 17.5319 1.00652 17.4524 0.777023 17.2229C0.547523 16.9934 0.468023 16.7197 0.538523 16.4019L1.37502 12.3864L5.61352 16.6249L1.59802 17.4614ZM5.61352 16.6249L1.37502 12.3864L12.5943 1.16715C12.9391 0.822319 13.366 0.649902 13.875 0.649902C14.384 0.649902 14.8109 0.822319 15.1558 1.16715L16.8328 2.84415C17.1776 3.18899 17.35 3.6159 17.35 4.1249C17.35 4.6339 17.1776 5.06082 16.8328 5.40565L5.61352 16.6249ZM13.6635 2.22115L3.43852 12.4364L5.56352 14.5614L15.7788 4.3364C15.8364 4.27874 15.8653 4.20665 15.8653 4.12015C15.8653 4.03349 15.8364 3.96132 15.7788 3.90365L14.0963 2.22115C14.0386 2.16349 13.9664 2.13465 13.8798 2.13465C13.7933 2.13465 13.7212 2.16349 13.6635 2.22115Z"
            fill="#8F8F8F"
          />
        </svg>
      </button>
      <button
        onClick={() => onDeleteComment(comment.id)}
        disabled={deleteCommentMutation.isLoading}
        className="p-1.5 hover:bg-gray-700 rounded transition-colors disabled:opacity-50"
        title="삭제"
      >
        <svg
          width="14"
          height="14"
          viewBox="0 0 14 14"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-4 h-4"
        >
          <path
            d="M7.00001 8.05376L1.92701 13.127C1.78851 13.2653 1.61443 13.3362 1.40476 13.3395C1.19526 13.3427 1.01801 13.2718 0.873012 13.127C0.728178 12.982 0.655762 12.8063 0.655762 12.6C0.655762 12.3937 0.728178 12.218 0.873012 12.073L5.94626 7.00001L0.873012 1.92701C0.734678 1.78851 0.663845 1.61443 0.660512 1.40476C0.657345 1.19526 0.728178 1.01801 0.873012 0.873012C1.01801 0.728178 1.19368 0.655762 1.40001 0.655762C1.60635 0.655762 1.78201 0.728178 1.92701 0.873012L7.00001 5.94626L12.073 0.873012C12.2115 0.734678 12.3856 0.663845 12.5953 0.660512C12.8048 0.657345 12.982 0.728178 13.127 0.873012C13.2718 1.01801 13.3443 1.19368 13.3443 1.40001C13.3443 1.60635 13.2718 1.78201 13.127 1.92701L8.05376 7.00001L13.127 12.073C13.2653 12.2115 13.3362 12.3856 13.3395 12.5953C13.3427 12.8048 13.2718 12.982 13.127 13.127C12.982 13.2718 12.8063 13.3443 12.6 13.3443C12.3937 13.3443 12.218 13.2718 12.073 13.127L7.00001 8.05376Z"
            fill="#8F8F8F"
          />
        </svg>
      </button>
    </div>
  );
}

// 댓글 수정 폼
function CommentEditForm({
  comment,
  editingCommentContent,
  setEditingCommentContent,
  onUpdateComment,
  onCancelEdit,
  updateCommentMutation,
}) {
  return (
    <div className="mb-2">
      <textarea
        value={editingCommentContent}
        onChange={(e) => setEditingCommentContent(e.target.value)}
        className="w-full bg-[#1A1A1A] rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-yellow-500 resize-none"
        rows={3}
        maxLength={500}
      />
      <div className="flex items-center justify-between mt-2">
        <span className="text-xs text-gray-500">
          {editingCommentContent.length}/500
        </span>
        <div className="flex space-x-2">
          <button
            onClick={onCancelEdit}
            className="px-3 py-1 text-xs bg-gray-600 text-white rounded hover:bg-gray-500 transition-colors"
          >
            취소
          </button>
          <button
            onClick={() => onUpdateComment(comment.id)}
            disabled={updateCommentMutation.isLoading}
            className="px-3 py-1 text-xs bg-yellow-500 text-black rounded hover:bg-yellow-400 transition-colors disabled:opacity-50"
          >
            {updateCommentMutation.isLoading ? '수정중...' : '수정'}
          </button>
        </div>
      </div>
    </div>
  );
}

