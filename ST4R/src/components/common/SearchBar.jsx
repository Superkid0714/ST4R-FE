import { useState, useEffect, useRef } from 'react';

export default function SearchBar({
  onSearch,
  placeholder,
  isLoading = false,
  showSearchTypeSelector = false, // 검색 타입 선택기 표시 여부
  onSearchTypeChange, // 검색 타입 변경 콜백
  currentSearchType = 'titleAndContent', // 현재 검색 타입
}) {
  const [searchQuery, setSearchQuery] = useState('');
  const [showTypeMenu, setShowTypeMenu] = useState(false);
  const [validationError, setValidationError] = useState('');
  const dropdownRef = useRef(null);

  const searchTypeOptions = [
    { value: 'title', label: '제목', minLength: 1, maxLength: 100 },
    { value: 'content', label: '내용', minLength: 10, maxLength: 5000 },
    {
      value: 'titleAndContent',
      label: '제목+내용',
      minLength: 1,
      maxLength: 100,
    },
    { value: 'author', label: '작성자', minLength: 1, maxLength: 20 },
  ];

  // 외부 클릭 시 드롭다운 닫기
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowTypeMenu(false);
      }
    };

    if (showTypeMenu) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => {
        document.removeEventListener('mousedown', handleClickOutside);
      };
    }
  }, [showTypeMenu]);

  // 검색어 유효성 검사
  const validateSearchQuery = (query, searchType) => {
    const trimmedQuery = query.trim();
    const currentType = searchTypeOptions.find(
      (option) => option.value === searchType
    );

    if (!currentType) return { isValid: true, error: '' };

    if (trimmedQuery.length === 0) {
      return { isValid: true, error: '' }; // 빈 검색어는 허용 (전체 목록 표시)
    }

    if (trimmedQuery.length < currentType.minLength) {
      return {
        isValid: false,
        error: `${currentType.label} 검색은 ${currentType.minLength}자 이상 입력해주세요.`,
      };
    }

    if (trimmedQuery.length > currentType.maxLength) {
      return {
        isValid: false,
        error: `${currentType.label} 검색은 ${currentType.maxLength}자 이하로 입력해주세요.`,
      };
    }

    return { isValid: true, error: '' };
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const validation = validateSearchQuery(searchQuery, currentSearchType);

    if (!validation.isValid) {
      setValidationError(validation.error);
      return;
    }

    setValidationError('');

    if (onSearch) {
      onSearch(searchQuery.trim());
    }
  };

  const handleClear = () => {
    setSearchQuery('');
    setValidationError('');
    if (onSearch) {
      onSearch('');
    }
  };

  const handleInputChange = (e) => {
    const value = e.target.value;
    setSearchQuery(value);

    // 입력 중에는 에러 메시지 제거
    if (validationError) {
      setValidationError('');
    }
  };

  const handleSearchTypeSelect = (type) => {
    if (onSearchTypeChange) {
      onSearchTypeChange(type);
    }
    setShowTypeMenu(false);

    // 검색 타입 변경 시 현재 검색어 재검증
    const validation = validateSearchQuery(searchQuery, type);
    setValidationError(validation.isValid ? '' : validation.error);
  };

  const getCurrentTypeLabel = () => {
    return (
      searchTypeOptions.find((option) => option.value === currentSearchType)
        ?.label || '제목+내용'
    );
  };

  const getCurrentTypeInfo = () => {
    return searchTypeOptions.find(
      (option) => option.value === currentSearchType
    );
  };

  const currentTypeInfo = getCurrentTypeInfo();

  return (
    <div className="w-full">
      <form onSubmit={handleSubmit} className="relative">
        <div className="relative flex items-center bg-[#1A1A1A] rounded-lg pl-3 pr-2 py-3">
          {/* 검색 타입 선택기 */}
          {showSearchTypeSelector && (
            <div className="flex-shrink-0 mr-3 relative" ref={dropdownRef}>
              <button
                type="button"
                onClick={() => setShowTypeMenu(!showTypeMenu)}
                className="flex items-center text-sm text-gray-400 hover:text-gray-300 transition-colors"
                disabled={isLoading}
              >
                <span className="mr-1">{getCurrentTypeLabel()}</span>
                <svg
                  className={`w-3 h-3 transition-transform ${
                    showTypeMenu ? 'rotate-180' : ''
                  }`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={3}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </button>

              {/* 검색 타입 드롭다운 */}
              {showTypeMenu && (
                <div className="absolute top-8 left-0 bg-[#1A1A1A] border border-gray-700 rounded-lg py-1 min-w-[120px] z-50 shadow-lg">
                  {searchTypeOptions.map((option) => (
                    <button
                      key={option.value}
                      type="button"
                      onClick={() => handleSearchTypeSelect(option.value)}
                      className={`w-full text-left px-3 py-2 text-sm hover:bg-[#2A2A2A] transition-colors ${
                        currentSearchType === option.value
                          ? 'text-yellow-500 bg-[#2A2A2A]'
                          : 'text-gray-300'
                      }`}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* 중앙: 입력 필드 */}
          <input
            type="text"
            placeholder={placeholder}
            className="bg-transparent font-['Pretendard'] text-gray-300 placeholder-gray-500 w-full focus:outline-none text-sm"
            value={searchQuery}
            onChange={handleInputChange}
            disabled={isLoading}
            maxLength={currentTypeInfo?.maxLength || 100}
          />

          {/* 오른쪽: 클리어 버튼 + 검색 버튼 */}
          <div className="flex items-center flex-shrink-0 ml-2">
            {/* 클리어(X) 버튼 */}
            {searchQuery && (
              <button
                type="button"
                onClick={handleClear}
                className="p-1.5 text-gray-400 hover:text-gray-300 transition-colors"
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

            {/* 검색(돋보기) 버튼 */}
            <button
              type="submit"
              className="p-1.5 ml-1"
              disabled={isLoading || !!validationError}
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-yellow-500 border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <svg
                  className={`w-5 h-5 transition-colors ${
                    validationError
                      ? 'text-red-400'
                      : 'text-yellow-500 hover:text-yellow-400'
                  }`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
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
          </div>
        </div>

        {/* 유효성 검사 에러 메시지만 표시 */}
        {validationError && (
          <div className="mt-2 px-1">
            <div className="flex items-center text-red-400 text-sm">
              <svg
                className="w-4 h-4 mr-1 flex-shrink-0"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              {validationError}
            </div>
          </div>
        )}
      </form>
    </div>
  );
}
