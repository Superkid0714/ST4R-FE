import { useNavigate } from 'react-router-dom';

export default function PostCard({ post }) {
  const navigate = useNavigate();

  const handleCardClick = () => {
    // 게시글 상세 페이지로 이동
    navigate(`/boards/${post.id}`);
  };

  return (
    <div
      className="bg-[#1A1A1A] rounded-lg p-4 cursor-pointer hover:bg-[#242424] transition-colors"
      onClick={handleCardClick}
    >
      {/* 카테고리 배지 */}
      {post.category && (
        <div className="mb-2">
          <span
            className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${
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
      <h3 className="text-white font-medium text-base mb-2 leading-relaxed line-clamp-2">
        {post.title}
      </h3>

      {/* 게시글 설명 */}
      <p className="text-gray-400 text-sm mb-3 leading-relaxed line-clamp-2">
        {post.contentPreview}
      </p>

      {/* 게시글 이미지 */}
      {post.imageUrl && (
        <div className="relative mb-3">
          <img
            src={post.imageUrl}
            alt={post.title}
            className="w-full h-48 object-cover rounded-xl"
          />
        </div>
      )}

      {/* 하단 정보 바 */}
      <div className="flex items-center justify-between text-gray-400 text-sm">
        <div className="flex items-center space-x-4">
          {/* 좋아요 */}
          <div className="flex items-center space-x-1">
            <svg
              className="w-4 h-4"
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
            <span>{post.likeCount}</span>
          </div>

          {/* 댓글 */}
          <div className="flex items-center space-x-1">
            <svg
              className="w-4 h-4"
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
            <span>{post.commentCount}</span>
          </div>

          {/* 조회수 */}
          <div className="flex items-center space-x-1">
            <svg
              className="w-4 h-4"
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
            <span>{post.viewCount}</span>
          </div>
        </div>

        {/* 날짜 */}
        <span className="text-gray-500">
          {new Date(post.createdAt)
            .toLocaleDateString('ko-KR', {
              year: 'numeric',
              month: '2-digit',
              day: '2-digit',
            })
            .replace(/\./g, '.')
            .replace(/ /g, '')}
        </span>
      </div>
    </div>
  );
}

