import { useCallback } from 'react';
import { useLikeBoard, useDeleteBoard } from '../api/boardDetail';

export function useBoardDetailActions(boardId, post, isLoggedIn, navigate) {
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
      if (
        window.confirm('로그인이 필요합니다. 로그인 페이지로 이동하시겠습니까?')
      ) {
        navigate('/login');
      }
      return;
    }

    likeBoardMutation.mutate(boardId);
  }, [isLoggedIn, navigate, likeBoardMutation, boardId]);

  // 게시글 수정
  const handleEdit = useCallback(() => {
    navigate(`/boards/edit/${boardId}`);
  }, [navigate, boardId]);

  // 게시글 삭제
  const handleDelete = useCallback(() => {
    if (window.confirm('정말로 이 게시글을 삭제하시겠습니까?')) {
      deleteBoardMutation.mutate(boardId);
    }
  }, [deleteBoardMutation, boardId]);

  // 공유하기
  const handleShare = useCallback(() => {
    if (navigator.share && post) {
      navigator.share({
        title: post.title,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert('링크가 클립보드에 복사되었습니다.');
    }
  }, [post]);

  // 뒤로가기
  const handleBack = useCallback(() => {
    navigate(-1);
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
  };
}
