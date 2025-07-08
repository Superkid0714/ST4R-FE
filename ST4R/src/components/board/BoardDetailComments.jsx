import { useState } from 'react';

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
      <div className="w-8 h-8 rounded-full bg-gray-600 flex-shrink-0 flex items-center justify-center text-white font-medium text-xs">
        <svg
          className="w-5 h-5 text-gray-300"
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path
            fillRule="evenodd"
            d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
            clipRule="evenodd"
          />
        </svg>
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
          className="w-4 h-4 text-gray-400 hover:text-gray-300"
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
      </button>
      <button
        onClick={() => onDeleteComment(comment.id)}
        disabled={deleteCommentMutation.isLoading}
        className="p-1.5 hover:bg-gray-700 rounded transition-colors disabled:opacity-50"
        title="삭제"
      >
        <svg
          className="w-4 h-4 text-gray-400 hover:text-gray-300"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
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
