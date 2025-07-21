import { useCallback, useState } from 'react';
import { useLikeBoard, useDeleteBoard } from '../api/boardDetail';

export function useBoardDetailActions(boardId, post, isLoggedIn, navigate) {
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [loginModalMessage, setLoginModalMessage] = useState('');

  const likeBoardMutation = useLikeBoard();
  const deleteBoardMutation = useDeleteBoard();

  // 작성자인지 확인
  const isAuthor = useCallback(() => {
    if (!post || !isLoggedIn) return false;
    return post.isViewerAuthor === true;
  }, [post, isLoggedIn]);

  // 좋아요 처리
  const handleLike = useCallback(() => {
    if (!isLoggedIn) {
      setLoginModalMessage('좋아요 기능을 사용하려면 로그인이 필요합니다.');
      setShowLoginModal(true);
      return;
    }

    likeBoardMutation.mutate(boardId);
  }, [isLoggedIn, likeBoardMutation, boardId]);

  // 게시글 수정
  const handleEdit = useCallback(() => {
    navigate(`/boards/edit/${boardId}`);
  }, [navigate, boardId]);

  // 게시글 삭제
  const handleDelete = useCallback(() => {
    setShowDeleteModal(true);
  }, []);

  // 게시글 삭제 확인
  const confirmDelete = useCallback(() => {
    deleteBoardMutation.mutate(boardId, {
      onSuccess: () => {
        setShowDeleteModal(false);
      },
    });
  }, [deleteBoardMutation, boardId]);

  // 공유하기
  const handleShare = useCallback(() => {
    setShowShareModal(true);
  }, []);

  // 뒤로가기
  const handleBack = useCallback(() => {
    navigate(-1);
  }, [navigate]);

  // 로그인 페이지로 이동
  const handleLoginRedirect = useCallback(() => {
    setShowLoginModal(false);
    navigate('/login');
  }, [navigate]);

  return {
    isAuthor: isAuthor(),
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
  };
}

