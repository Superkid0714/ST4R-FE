import BoardDetailMap from '../common/BoardDetailMap';

export default function BoardDetailContent({
  post,
  likeCount,
  getAuthorDisplayName,
  onImageClick,
}) {
  if (!post) return null;

  const allImages = post.imageUrls || [];

  return (
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
      <h1 className="text-2xl font-bold mb-4 leading-tight">{post.title}</h1>

      {/* 작성자 정보 */}
      <AuthorInfo
        post={post}
        likeCount={likeCount}
        getAuthorDisplayName={getAuthorDisplayName}
      />

      {/* 게시글 내용 */}
      <div className="mb-8">
        <p className="text-gray-300 leading-relaxed whitespace-pre-line">
          {post.content?.text || post.contentPreview}
        </p>
      </div>

      {/* 추가 이미지들 */}
      {allImages.length > 1 && (
        <AdditionalImages
          images={allImages.slice(1)}
          title={post.title}
          onImageClick={onImageClick}
        />
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
    </div>
  );
}

// 작성자 정보 컴포넌트
function AuthorInfo({ post, likeCount, getAuthorDisplayName }) {
  return (
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
            <p className="font-medium">{getAuthorDisplayName(post.author)}</p>
          </div>
          <div className="flex items-center space-x-4">
            <p className="text-sm text-gray-400">
              {post.createdAt
                ? new Date(post.createdAt).toLocaleDateString('ko-KR')
                : ''}
            </p>
            <PostStats
              likeCount={likeCount}
              viewCount={post.viewCount}
              commentCount={post.commentCount}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

// 게시글 통계 컴포넌트
function PostStats({ likeCount, viewCount, commentCount }) {
  return (
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
        <span>{viewCount?.toLocaleString() || 0}</span>
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
        <span>{commentCount || 0}</span>
      </div>
    </div>
  );
}

// 추가 이미지들 컴포넌트
function AdditionalImages({ images, title, onImageClick }) {
  return (
    <div className="mb-8">
      <h3 className="text-lg font-semibold mb-3">추가 이미지</h3>
      <div className="grid grid-cols-1 gap-4">
        {images.map((imageUrl, index) => (
          <div key={index} className="relative group">
            <img
              src={imageUrl}
              alt={`${title} - ${index + 2}`}
              className="w-full rounded-lg object-cover max-h-96 cursor-pointer transition-transform group-hover:scale-[1.02]"
              onClick={() => onImageClick(index + 1)}
            />
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors rounded-lg" />
            <div className="absolute bottom-2 right-2 bg-black/50 backdrop-blur-sm rounded-full px-2 py-1 text-xs font-medium opacity-0 group-hover:opacity-100 transition-opacity">
              클릭하여 확대
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
