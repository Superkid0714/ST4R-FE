import { useState } from 'react';

export default function SearchBar({ onSearchResults, allPosts = [] }) {
  const [searchQuery, setSearchQuery] = useState('');

  // 클라이언트 사이드 검색 함수
  const performSearch = (query) => {
    if (!query.trim()) {
      return [];
    }

    const searchTerm = query.toLowerCase();
    return allPosts.filter(
      (post) =>
        post.title.toLowerCase().includes(searchTerm) ||
        post.contentPreview?.toLowerCase().includes(searchTerm)
    );
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const results = performSearch(searchQuery);
    console.log(`검색어: "${searchQuery}", 결과: ${results.length}개`);

    if (onSearchResults) {
      onSearchResults(results);
    }
  };

  const handleClear = () => {
    setSearchQuery('');
    if (onSearchResults) {
      onSearchResults([]);
    }
  };

  const handleInputChange = (e) => {
    const value = e.target.value;
    setSearchQuery(value);

    // 검색어가 비워지면 결과 초기화
    if (!value.trim()) {
      if (onSearchResults) {
        onSearchResults([]);
      }
    }
  };

  return (
    <div className="w-full px-4 py-3">
      <form onSubmit={handleSubmit} className="relative">
        <div className="relative flex items-center bg-[#1A1A1A] rounded-lg px-4 py-3">
          {/* 검색 아이콘 */}
          <button type="submit" className="flex-shrink-0 mr-3">
            <svg
              className="w-5 h-5 text-yellow-500 hover:text-yellow-400 transition-colors"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </button>

          {/* 입력 필드 */}
          <input
            type="text"
            placeholder="별자리에 관해 궁금한 글들을 검색해보세요..."
            className="bg-transparent text-gray-300 placeholder-gray-500 w-full focus:outline-none text-sm"
            value={searchQuery}
            onChange={handleInputChange}
          />

          {/* 클리어 버튼 */}
          {searchQuery && (
            <button
              type="button"
              onClick={handleClear}
              className="ml-2 text-gray-400 hover:text-gray-300 transition-colors flex-shrink-0"
            >
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
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          )}
        </div>
      </form>
    </div>
  );
}
