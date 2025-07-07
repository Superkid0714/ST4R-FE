import { useState, useCallback, useEffect, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  useBoardDetail,
  useLikeBoard,
  useComments,
  useCreateComment,
  useUpdateComment,
  useDeleteComment,
  useDeleteBoard,
} from '../../api/boardDetail';
import BackButton from '../../components/common/BackButton';
import ImageViewer from '../../components/common/ImageViewer';
import BoardDetailMap from '../../components/common/BoardDetailMap';

export default function BoardDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [newComment, setNewComment] = useState('');
  const [isImageViewerOpen, setIsImageViewerOpen] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [editingCommentId, setEditingCommentId] = useState(null);
  const [editingCommentContent, setEditingCommentContent] = useState('');
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // 로그인 상태 확인
  useEffect(() => {
    const checkAuthStatus = () => {
      const token = localStorage.getItem('token');

      if (!token) {
        setIsLoggedIn(false);
        setCurrentUser(null);
        return;
      }

      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        const currentTime = Math.floor(Date.now() / 1000);

        if (payload.exp && payload.exp > currentTime) {
          setIsLoggedIn(true);

          const userInfo = {
            id: payload.id || payload.sub,
            email: payload.email,
            name:
              payload.name ||
              payload.nickname ||
              `사용자${payload.id || payload.sub}`,
          };

          setCurrentUser(userInfo);
          localStorage.setItem('user', JSON.stringify(userInfo));
        } else {
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          setIsLoggedIn(false);
          setCurrentUser(null);
        }
      } catch (error) {
        console.error('토큰 파싱 에러:', error);
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setIsLoggedIn(false);
        setCurrentUser(null);
      }
    };

    checkAuthStatus();

    const handleStorageChange = () => {
      checkAuthStatus();
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  // API 호출
  const {
    data: post,
    isLoading: isPostLoading,
    error: postError,
  } = useBoardDetail(id);

  const { data: comments, isLoading: isCommentsLoading } = useComments(id);
  const likeBoardMutation = useLikeBoard();
  const createCommentMutation = useCreateComment();
  const updateCommentMutation = useUpdateComment();
  const deleteCommentMutation = useDeleteComment();
  const deleteBoardMutation = useDeleteBoard();

  // 작성자인지 확인 - 백엔드 응답의 isViewerAuthor 사용
  const isAuthor = useCallback(() => {
    if (!post || !isLoggedIn) return false;
    return post.isViewerAuthor === true;
  }, [post, isLoggedIn]);

  // 좋아요 상태 - 백엔드 응답의 liked 사용
  const isLiked = post?.liked === true;
  const likeCount = post?.likeCount || 0;

  // 이미지 슬라이드 함수들을 post 데이터가 있을 때만 정의
  const allImages = useMemo(() => {
    if (!post) return [];
    return post.imageUrls || [];
  }, [post]);

  const goToPrevImage = useCallback(() => {
    setCurrentImageIndex((prev) =>
      prev > 0 ? prev - 1 : allImages.length - 1
    );
  }, [allImages.length]);

  const goToNextImage = useCallback(() => {
    setCurrentImageIndex((prev) =>
      prev < allImages.length - 1 ? prev + 1 : 0
    );
  }, [allImages.length]);

  // 좋아요 처리 (토글 방식)
  const handleLike = useCallback(() => {
    if (!isLoggedIn) {
      if (
        window.confirm('로그인이 필요합니다. 로그인 페이지로 이동하시겠습니까?')
      ) {
        navigate('/login');
      }
      return;
    }

    // 좋아요 토글 - 이미 좋아요를 누른 상태라면 취소, 아니면 추가
    likeBoardMutation.mutate(id);
  }, [isLoggedIn, navigate, likeBoardMutation, id]);

  // 작성자 이름 표시 함수
  const getAuthorDisplayName = useCallback((author) => {
    if (!author) return '익명';
    return author.name || author.nickname || `사용자${author.id}` || '익명';
  }, []);

  // 이미지 클릭 핸들러
  const handleImageClick = useCallback((index = 0) => {
    setSelectedImageIndex(index);
    setIsImageViewerOpen(true);
  }, []);

  // 뒤로가기
  const handleBack = useCallback(() => {
    navigate(-1);
  }, [navigate]);

  // 댓글 작성 (로그인한 사용자만)
  const handleCommentSubmit = useCallback(() => {
    if (!isLoggedIn) {
      if (
        window.confirm('로그인이 필요합니다. 로그인 페이지로 이동하시겠습니까?')
      ) {
        navigate('/login');
      }
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
      { boardId: id, content: newComment.trim() },
      {
        onSuccess: () => {
          setNewComment('');
        },
        onError: (error) => {
          console.error('댓글 작성 실패:', error);
        },
      }
    );
  }, [isLoggedIn, navigate, newComment, createCommentMutation, id]);

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
          boardId: id,
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
    [id, editingCommentContent, updateCommentMutation]
  );

  // 댓글 삭제
  const handleDeleteComment = useCallback(
    (commentId) => {
      if (window.confirm('정말로 이 댓글을 삭제하시겠습니까?')) {
        deleteCommentMutation.mutate(
          { boardId: id, commentId },
          {
            onError: (error) => {
              console.error('댓글 삭제 실패:', error);
            },
          }
        );
      }
    },
    [id, deleteCommentMutation]
  );

  // 게시글 수정
  const handleEdit = useCallback(() => {
    navigate(`/boards/edit/${id}`);
  }, [navigate, id]);

  // 게시글 삭제
  const handleDelete = useCallback(() => {
    if (window.confirm('정말로 이 게시글을 삭제하시겠습니까?')) {
      deleteBoardMutation.mutate(id);
    }
  }, [deleteBoardMutation, id]);

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

  // 이미지 뷰어 닫기
  const handleCloseImageViewer = useCallback(() => {
    setIsImageViewerOpen(false);
  }, []);

  const currentIsAuthor = isAuthor();

  // 현재 이미지 인덱스가 배열 범위를 벗어나면 0으로 초기화
  useEffect(() => {
    if (allImages.length > 0 && currentImageIndex >= allImages.length) {
      setCurrentImageIndex(0);
    }
  }, [allImages.length, currentImageIndex]);

  // 로딩 상태
  if (isPostLoading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-yellow-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  // 에러 상태
  if (postError) {
    if (
      (postError.response?.status === 401 || postError.isAuthError) &&
      isLoggedIn
    ) {
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
              strokeWidth={1}
              d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <h2 className="text-xl font-bold text-white mb-2">
            게시글을 불러올 수 없습니다
          </h2>
          <p className="text-gray-400 mb-4">
            {postError?.response?.status === 404
              ? '존재하지 않는 게시글입니다.'
              : '잠시 후 다시 시도해주세요.'}
          </p>
          <button
            onClick={handleBack}
            className="bg-yellow-500 text-black px-6 py-2 rounded-lg font-medium hover:bg-yellow-400 transition-colors"
          >
            뒤로가기
          </button>
        </div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-yellow-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div>
      <div className="min-h-screen bg-black text-white">
        {/* 헤더 이미지 영역 - 슬라이드 기능 포함 */}
        <div className="relative h-80 overflow-hidden">
          {allImages.length > 0 ? (
            <div className="relative group h-full">
              {/* 현재 이미지 */}
              <img
                src={allImages[currentImageIndex] || allImages[0]}
                alt={`${post.title} - ${currentImageIndex + 1}`}
                className="w-full h-full object-cover cursor-pointer transition-transform group-hover:scale-105"
                onClick={() => handleImageClick(currentImageIndex)}
              />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors" />

              {/* 이미지 슬라이드 컨트롤 (이미지가 2개 이상일 때) */}
              {allImages.length > 1 && (
                <div>
                  {/* 이전 버튼 */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      goToPrevImage();
                    }}
                    className="absolute left-4 top-1/2 transform -translate-y-1/2 p-2 bg-black/50 backdrop-blur-sm rounded-full hover:bg-black/70 transition-colors opacity-0 group-hover:opacity-100"
                  >
                    <svg
                      className="w-6 h-6 text-white"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 19l-7-7 7-7"
                      />
                    </svg>
                  </button>

                  {/* 다음 버튼 */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      goToNextImage();
                    }}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 p-2 bg-black/50 backdrop-blur-sm rounded-full hover:bg-black/70 transition-colors opacity-0 group-hover:opacity-100"
                  >
                    <svg
                      className="w-6 h-6 text-white"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                  </button>

                  {/* 슬라이드 인디케이터 */}
                  <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
                    {allImages.map((_, index) => (
                      <button
                        key={index}
                        onClick={(e) => {
                          e.stopPropagation();
                          setCurrentImageIndex(index);
                        }}
                        className={`w-2 h-2 rounded-full transition-colors ${
                          index === currentImageIndex
                            ? 'bg-white'
                            : 'bg-white/50'
                        }`}
                      />
                    ))}
                  </div>
                </div>
              )}

              {/* 확대 안내 */}
              <div className="absolute bottom-4 left-4 bg-black/50 backdrop-blur-sm rounded-full px-3 py-1 text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                📷 클릭하여 확대
              </div>
            </div>
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center">
              <svg
                className="w-20 h-20 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1}
                  d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
            </div>
          )}

          <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-black/80" />

          <div className="absolute top-4 left-4 right-4 flex justify-between items-center">
            <BackButton className="bg-black/50 backdrop-blur-sm" />

            <div className="flex space-x-2">
              {/* 로그인 상태에 따른 버튼 표시 */}
              {isLoggedIn ? (
                /* 로그인한 경우 */
                currentIsAuthor ? (
                  /* 내 글인 경우: 삭제/수정/공유/좋아요 버튼 */
                  <>
                    <button
                      onClick={handleDelete}
                      className="p-3 bg-red-500/50 backdrop-blur-sm rounded-full hover:bg-red-500/70 transition-colors"
                    >
                      <svg
                        className="w-5 h-5"
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
                    <button
                      onClick={handleEdit}
                      className="p-3 bg-black/50 backdrop-blur-sm rounded-full hover:bg-black/70 transition-colors"
                    >
                      <svg
                        className="w-5 h-5"
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
                      onClick={handleShare}
                      className="p-3 bg-black/50 backdrop-blur-sm rounded-full hover:bg-black/70 transition-colors"
                    >
                      <svg
                        className="w-5 h-5"
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
                    </button>
                    <button
                      onClick={handleLike}
                      disabled={likeBoardMutation.isLoading}
                      className={`p-3 backdrop-blur-sm rounded-full transition-colors ${
                        isLiked
                          ? 'bg-red-500/80 hover:bg-red-500'
                          : 'bg-black/50 hover:bg-black/70'
                      } ${likeBoardMutation.isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
                      title={isLiked ? '좋아요 취소' : '좋아요'}
                    >
                      <svg
                        className={`w-5 h-5 ${isLiked ? 'text-white fill-current' : 'text-white'}`}
                        fill={isLiked ? 'currentColor' : 'none'}
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                        />
                      </svg>
                    </button>
                  </>
                ) : (
                  /* 다른 사람 글인 경우: 공유/좋아요 버튼 */
                  <>
                    <button
                      onClick={handleShare}
                      className="p-3 bg-black/50 backdrop-blur-sm rounded-full hover:bg-black/70 transition-colors"
                    >
                      <svg
                        className="w-5 h-5"
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
                    </button>
                    <button
                      onClick={handleLike}
                      disabled={likeBoardMutation.isLoading}
                      className={`p-3 backdrop-blur-sm rounded-full transition-colors ${
                        isLiked
                          ? 'bg-red-500/80 hover:bg-red-500'
                          : 'bg-black/50 hover:bg-black/70'
                      } ${likeBoardMutation.isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
                      title={isLiked ? '좋아요 취소' : '좋아요'}
                    >
                      <svg
                        className={`w-5 h-5 ${isLiked ? 'text-white fill-current' : 'text-white'}`}
                        fill={isLiked ? 'currentColor' : 'none'}
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                        />
                      </svg>
                    </button>
                  </>
                )
              ) : (
                /* 비로그인 상태: 공유 버튼만 */
                <button
                  onClick={handleShare}
                  className="p-3 bg-black/50 backdrop-blur-sm rounded-full hover:bg-black/70 transition-colors"
                >
                  <svg
                    className="w-5 h-5"
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
                </button>
              )}
            </div>
          </div>

          {/* 이미지 카운터 표시 (이미지가 2개 이상일 때) */}
          {allImages.length > 1 && (
            <div className="absolute bottom-4 right-4">
              <div className="bg-black/50 backdrop-blur-sm rounded-full px-3 py-1 text-sm font-medium">
                {currentImageIndex + 1} / {allImages.length}
              </div>
            </div>
          )}
        </div>

        {/* 메인 콘텐츠 */}
        <div className="px-4 py-6 -mt-8 relative bg-black rounded-t-3xl">
          {/* 카테고리 배지 */}
          {post.category && (
            <div className="mb-4">
              <span
                className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${
                  post.category === 'SPOT'
                    ? 'bg-green-500/20 text-green-400'
                    : post.category === 'PROMOTION'
                      ? 'bg-purple-500/20 text-purple-400'
                      : 'bg-gray-500/20 text-gray-400'
                }`}
              >
                {post.category === 'SPOT'
                  ? '스팟공유글'
                  : post.category === 'PROMOTION'
                    ? '홍보글'
                    : '자유글'}
              </span>
            </div>
          )}

          {/* 게시글 제목 */}
          <h1 className="text-2xl font-bold mb-4 leading-tight">
            {post.title}
          </h1>

          {/* 작성자 정보 - 프로필 사진을 일정하게 변경 */}
          <div className="mb-6">
            <div className="flex space-x-3">
              <div className="w-10 h-10 rounded-full bg-gray-600 flex items-center justify-center text-white font-medium text-sm flex-shrink-0">
                <svg
                  className="w-6 h-6 text-gray-300"
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
                <div className="flex items-center space-x-2 mb-1">
                  <p className="font-medium">
                    {getAuthorDisplayName(post.author)}
                  </p>
                </div>
                {/* 작성 날짜와 통계 정보를 같은 줄에 배치 */}
                <div className="flex items-center space-x-4">
                  <p className="text-sm text-gray-400">
                    {post.createdAt
                      ? new Date(post.createdAt).toLocaleDateString('ko-KR')
                      : ''}
                  </p>
                  <div className="flex items-center space-x-3 text-sm text-gray-400">
                    <div className="flex items-center space-x-1">
                      <svg
                        className="w-3 h-3"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                        />
                      </svg>
                      <span>{likeCount}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <svg
                        className="w-3 h-3"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                        />
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                        />
                      </svg>
                      <span>{post.viewCount?.toLocaleString() || 0}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <svg
                        className="w-3 h-3"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                        />
                      </svg>
                      <span>{post.commentCount || comments?.length || 0}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* 게시글 내용 */}
          <div className="mb-8">
            <p className="text-gray-300 leading-relaxed whitespace-pre-line">
              {post.content?.text || post.contentPreview}
            </p>
          </div>

          {/* 추가 이미지들 */}
          {allImages.length > 1 && (
            <div className="mb-8">
              <h3 className="text-lg font-semibold mb-3">추가 이미지</h3>
              <div className="grid grid-cols-1 gap-4">
                {allImages.slice(1).map((imageUrl, index) => (
                  <div key={index} className="relative group">
                    <img
                      src={imageUrl}
                      alt={`${post.title} - ${index + 2}`}
                      className="w-full rounded-lg object-cover max-h-96 cursor-pointer transition-transform group-hover:scale-[1.02]"
                      onClick={() => handleImageClick(index + 1)}
                    />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors rounded-lg" />
                    <div className="absolute bottom-2 right-2 bg-black/50 backdrop-blur-sm rounded-full px-2 py-1 text-xs font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                      클릭하여 확대
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 지도 */}
          {post.content?.map && (
            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-3">위치</h3>
              <div className="bg-[#1A1A1A] rounded-xl p-4">
                <BoardDetailMap location={post.content.map} />
              </div>
            </div>
          )}

          {/* 댓글 섹션 */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">
              댓글 {comments?.length || 0}개
            </h3>

            {/* 댓글 작성 */}
            {isLoggedIn ? (
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
                <div className="flex-1 flex space-x-2">
                  <input
                    type="text"
                    placeholder="댓글을 남겨보세요..."
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    className="flex-1 bg-[#1A1A1A] rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-yellow-500"
                    onKeyPress={(e) =>
                      e.key === 'Enter' && handleCommentSubmit()
                    }
                    disabled={createCommentMutation.isLoading}
                    maxLength={500}
                  />
                  <button
                    onClick={handleCommentSubmit}
                    disabled={
                      !newComment.trim() || createCommentMutation.isLoading
                    }
                    className="px-4 py-3 bg-yellow-500 text-black rounded-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:bg-yellow-400 transition-colors"
                  >
                    {createCommentMutation.isLoading ? '등록중...' : '등록'}
                  </button>
                </div>
              </div>
            ) : (
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
            )}

            {/* 댓글 목록 */}
            <div className="space-y-4">
              {isCommentsLoading ? (
                <div className="text-center py-4">
                  <div className="w-6 h-6 border-2 border-yellow-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
                </div>
              ) : comments && comments.length > 0 ? (
                comments.map((comment) => {
                  const isCommentAuthor =
                    currentUser && comment.author?.id === currentUser.id;

                  return (
                    <div key={comment.id} className="flex space-x-3">
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
                          {/* 댓글 수정/삭제 버튼을 오른쪽에 배치 */}
                          {isLoggedIn &&
                            isCommentAuthor &&
                            editingCommentId !== comment.id && (
                              <div className="flex items-center space-x-3">
                                <button
                                  onClick={() => handleEditComment(comment)}
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
                                  onClick={() =>
                                    handleDeleteComment(comment.id)
                                  }
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
                            )}
                        </div>
                        <div className="text-xs text-gray-500 mb-2">
                          {comment.createdAt
                            ? new Date(comment.createdAt).toLocaleString(
                                'ko-KR'
                              )
                            : ''}
                        </div>

                        {editingCommentId === comment.id ? (
                          // 수정 모드
                          <div className="mb-2">
                            <textarea
                              value={editingCommentContent}
                              onChange={(e) =>
                                setEditingCommentContent(e.target.value)
                              }
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
                                  onClick={handleCancelEdit}
                                  className="px-3 py-1 text-xs bg-gray-600 text-white rounded hover:bg-gray-500 transition-colors"
                                >
                                  취소
                                </button>
                                <button
                                  onClick={() =>
                                    handleUpdateComment(comment.id)
                                  }
                                  disabled={updateCommentMutation.isLoading}
                                  className="px-3 py-1 text-xs bg-yellow-500 text-black rounded hover:bg-yellow-400 transition-colors disabled:opacity-50"
                                >
                                  {updateCommentMutation.isLoading
                                    ? '수정중...'
                                    : '수정'}
                                </button>
                              </div>
                            </div>
                          </div>
                        ) : (
                          // 일반 모드
                          <p className="text-sm text-gray-300 mb-2">
                            {comment.content}
                          </p>
                        )}
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="text-center py-8">
                  <p className="text-gray-500">첫 번째 댓글을 남겨보세요!</p>
                </div>
              )}
            </div>
          </div>

          <div className="h-20"></div>
        </div>
      </div>

      {/* 이미지 뷰어 */}
      <ImageViewer
        images={allImages}
        initialIndex={selectedImageIndex}
        isOpen={isImageViewerOpen}
        onClose={handleCloseImageViewer}
      />
    </div>
  );
}
