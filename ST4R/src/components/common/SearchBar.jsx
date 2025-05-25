import { useState } from 'react';

export default function SearchBar(props) {
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSearch = (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
            
    setIsLoading(true);
    // 검색 처리를 시뮬레이션 (실제로는 API 요청)
    setTimeout(() => {
      console.log('검색어:', searchQuery);
      setIsLoading(false);
    }, 1000);
  };

  return (
    <div className="w-full">
      <form onSubmit={handleSearch} className="relative">
        <div className="relative flex items-center bg-[#121212] rounded-[10px] px-4 py-4">
          {/* 검색 아이콘 */}
          <svg
            className="w-5 h-5 text-yellow-500 mr-3"
            fill="currentColor"
            viewBox="0 0 20 20"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fillRule="evenodd"
              d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
              clipRule="evenodd"
            />
          </svg>

          {/* 입력 필드 */}
          <input 
            type="text"
            placeholder={props.placeholder}
            className="bg-transparent font-['Pretendard'] text-gray-300 w-full font-light focus:outline-none text-sm"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />

          {/* 로딩 인디케이터 */}
          {isLoading && (
            <div className="absolute right-4">
              <div className="w-4 h-4 border-2 border-yellow-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
          )}
        </div>
      </form>
    </div>
  );
}
