import { useState } from 'react';

export default function SearchBar({
  onSearch,
  placeholder,
  isLoading = false,
}) {
  const [searchQuery, setSearchQuery] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();

    // 검색어를 부모 컴포넌트로 전달 (빈 문자열도 허용)
    if (onSearch) {
      onSearch(searchQuery.trim());
    }
  };

  const handleClear = () => {
    setSearchQuery('');
    if (onSearch) {
      // 빈 검색어로 초기화
      onSearch('');
    }
  };

  const handleInputChange = (e) => {
    const value = e.target.value;
    setSearchQuery(value);
  };

  return (
    <div className="w-full">
      <form onSubmit={handleSubmit} className="relative">
        <div className="relative flex items-center bg-[#1A1A1A] rounded-lg px-4 py-3">
          {/* 검색 아이콘 */}
          <button
            type="submit"
            className="flex-shrink-0 mr-3"
            disabled={isLoading}
          >
            {isLoading ? (
              <div className="w-5 h-5 border-2 border-yellow-500 border-t-transparent rounded-full animate-spin"></div>
            ) : (
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
            )}
          </button>

          {/* 입력 필드 */}
          <input
            type="text"
            placeholder={placeholder}
            className="bg-transparent font-['Pretendard'] text-gray-300 placeholder-gray-500 w-full focus:outline-none text-sm"
            value={searchQuery}
            onChange={handleInputChange}
            disabled={isLoading}
          />

          {/* 클리어 버튼 */}
          {searchQuery && (
            <button
              type="button"
              onClick={handleClear}
              className="ml-2 text-gray-400 hover:text-gray-300 transition-colors flex-shrink-0"
              disabled={isLoading}
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
