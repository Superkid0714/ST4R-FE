import { useState, useCallback } from 'react';
import {
  useCreateComment,
  useUpdateComment,
  useDeleteComment,
} from '../api/boardDetail';

export function useBoardDetailComments(boardId, isLoggedIn, navigate) {
  const [newComment, setNewComment] = useState('');
  const [editingCommentId, setEditingCommentId] = useState(null);
  const [editingCommentContent, setEditingCommentContent] = useState('');

  // 모달 상태들
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [commentToDelete, setCommentToDelete] = useState(null);

  const createCommentMutation = useCreateComment();
  const updateCommentMutation = useUpdateComment();
  const deleteCommentMutation = useDeleteComment();

  // 댓글 작성
  const handleCommentSubmit = useCallback(() => {
    if (!isLoggedIn) {
      setShowLoginModal(true);
      return;
    }

    if (!newComment.trim()) {
      alert('댓글 내용을 입력해주세요.');
      return;
    }

    if (newComment.trim().length > 500) {
      alert('댓글은 500자 이하로 입력해주세요.');
      return;
    }

    createCommentMutation.mutate(
      { boardId, content: newComment.trim() },
      {
        onSuccess: () => {
          setNewComment('');
        },
        onError: (error) => {
          console.error('댓글 작성 실패:', error);
        },
      }
    );
  }, [isLoggedIn, newComment, createCommentMutation, boardId]);

  // 댓글 수정 시작
  const handleEditComment = useCallback((comment) => {
    setEditingCommentId(comment.id);
    setEditingCommentContent(comment.content);
  }, []);

  // 댓글 수정 취소
  const handleCancelEdit = useCallback(() => {
    setEditingCommentId(null);
    setEditingCommentContent('');
  }, []);

  // 댓글 수정 완료
  const handleUpdateComment = useCallback(
    (commentId) => {
      if (!editingCommentContent.trim()) {
        alert('댓글 내용을 입력해주세요.');
        return;
      }

      if (editingCommentContent.trim().length > 500) {
        alert('댓글은 500자 이하로 입력해주세요.');
        return;
      }

      updateCommentMutation.mutate(
        {
          boardId,
          commentId,
          content: editingCommentContent.trim(),
        },
        {
          onSuccess: () => {
            setEditingCommentId(null);
            setEditingCommentContent('');
          },
          onError: (error) => {
            console.error('댓글 수정 실패:', error);
          },
        }
      );
    },
    [boardId, editingCommentContent, updateCommentMutation]
  );

  // 댓글 삭제 (모달 표시)
  const handleDeleteComment = useCallback((commentId) => {
    setCommentToDelete(commentId);
    setShowDeleteModal(true);
  }, []);

  // 댓글 삭제 확인
  const confirmDeleteComment = useCallback(() => {
    if (commentToDelete) {
      deleteCommentMutation.mutate(
        { boardId, commentId: commentToDelete },
        {
          onSuccess: () => {
            setShowDeleteModal(false);
            setCommentToDelete(null);
          },
          onError: (error) => {
            console.error('댓글 삭제 실패:', error);
            setShowDeleteModal(false);
            setCommentToDelete(null);
          },
        }
      );
    }
  }, [boardId, commentToDelete, deleteCommentMutation]);

  // 로그인 페이지로 이동
  const handleLoginRedirect = useCallback(() => {
    setShowLoginModal(false);
    navigate('/login');
  }, [navigate]);

  return {
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

    // 모달 관련
    showDeleteModal,
    setShowDeleteModal,
    showLoginModal,
    setShowLoginModal,
    commentToDelete,
    confirmDeleteComment,
    handleLoginRedirect,
  };
}
