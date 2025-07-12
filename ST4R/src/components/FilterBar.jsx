import { useState, useEffect } from 'react';

export default function FilterBar({
  currentPeriod,
  currentSort,
  currentDirection,
  currentCategory,
  onPeriodChange,
  onSortFilterChange,
}) {
  const [showPeriodMenu, setShowPeriodMenu] = useState(false);
  const [showSortMenu, setShowSortMenu] = useState(false);
  const [showCategoryMenu, setShowCategoryMenu] = useState(false);

  // 메뉴 외부 클릭 시 닫기
  useEffect(() => {
    const handleClickOutside = () => {
      setShowPeriodMenu(false);
      setShowSortMenu(false);
      setShowCategoryMenu(false);
    };

    if (showPeriodMenu || showSortMenu || showCategoryMenu) {
      document.addEventListener('click', handleClickOutside);
      return () => document.removeEventListener('click', handleClickOutside);
    }
  }, [showPeriodMenu, showSortMenu, showCategoryMenu]);

  const periodOptions = [
    { value: 'daily', label: '일별' },
    { value: 'weekly', label: '주별' },
    { value: 'monthly', label: '월별' },
    { value: 'yearly', label: '연별' },
  ];

  const sortOptions = [
    { sort: 'viewCount', direction: 'desc', label: '조회수' },
    { sort: 'likeCount', direction: 'desc', label: '좋아요 수' },
    { sort: 'createdAt', direction: 'desc', label: '최신순' },
    { sort: 'createdAt', direction: 'asc', label: '오래된순' },
  ];

  const categoryOptions = [
    { value: 'all', label: '전체글' },
    { value: 'SPOT', label: '스팟공유글' },
    { value: 'GENERAL', label: '자유글' },
    { value: 'PROMOTION', label: '홍보글' },
  ];

  const handlePeriodClick = (periodValue) => {
    onPeriodChange(periodValue);
    setShowPeriodMenu(false);
  };

  const handleSortClick = (option) => {
    onSortFilterChange({ ...option, type: 'sort' });
    setShowSortMenu(false);
  };

  const handleCategoryClick = (categoryValue) => {
    onSortFilterChange({ value: categoryValue, type: 'category' });
    setShowCategoryMenu(false);
  };

  // 현재 선택된 값의 라벨 찾기
  const getCurrentPeriodLabel = () => {
    return (
      periodOptions.find((option) => option.value === currentPeriod)?.label ||
      '일별'
    );
  };

  const getCurrentSortLabel = () => {
    return (
      sortOptions.find(
        (option) =>
          option.sort === currentSort && option.direction === currentDirection
      )?.label || '최신순'
    );
  };

  const getCurrentCategoryLabel = () => {
    return (
      categoryOptions.find((option) => option.value === currentCategory)
        ?.label || '전체글'
    );
  };

  return (
    <div className="flex items-center space-x-1 sm:space-x-2">
      {/* 카테고리 필터 */}
      <div className="relative">
        <button
          className="flex items-center px-2 sm:px-4 py-2 bg-[#1A1A1A] border border-gray-600 rounded-full text-gray-300 text-xs sm:text-sm hover:bg-[#2A2A2A] transition-colors"
          onClick={(e) => {
            e.stopPropagation();
            setShowCategoryMenu(!showCategoryMenu);
            setShowPeriodMenu(false);
            setShowSortMenu(false);
          }}
        >
          <span className="hidden sm:inline">{getCurrentCategoryLabel()}</span>
          <span className="sm:hidden">
            {currentCategory === 'all'
              ? '전체'
              : currentCategory === 'SPOT'
                ? '스팟'
                : currentCategory === 'GENERAL'
                  ? '자유'
                  : '홍보'}
          </span>
          <svg
            className={`w-3 h-3 sm:w-4 sm:h-4 ml-1 sm:ml-2 transition-transform ${showCategoryMenu ? 'rotate-180' : ''}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </button>

        {showCategoryMenu && (
          <div className="absolute top-12 left-0 bg-[#1A1A1A] border border-gray-700 rounded-lg py-2 w-28 sm:w-32 z-50 shadow-lg">
            {categoryOptions.map((option) => (
              <div
                key={option.value}
                onClick={() => handleCategoryClick(option.value)}
                className={`w-full text-left px-3 sm:px-4 py-2 text-xs sm:text-sm hover:bg-[#2A2A2A] transition-colors cursor-pointer ${
                  currentCategory === option.value
                    ? 'text-yellow-500 bg-[#2A2A2A]'
                    : 'text-gray-300'
                }`}
              >
                {option.label}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 기간 필터 */}
      <div className="relative">
        <button
          className="flex items-center px-2 sm:px-4 py-2 bg-[#1A1A1A] border border-gray-600 rounded-full text-gray-300 text-xs sm:text-sm hover:bg-[#2A2A2A] transition-colors"
          onClick={(e) => {
            e.stopPropagation();
            setShowPeriodMenu(!showPeriodMenu);
            setShowCategoryMenu(false);
            setShowSortMenu(false);
          }}
        >
          <span>{getCurrentPeriodLabel()}</span>
          <svg
            className={`w-3 h-3 sm:w-4 sm:h-4 ml-1 sm:ml-2 transition-transform ${showPeriodMenu ? 'rotate-180' : ''}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </button>

        {showPeriodMenu && (
          <div className="absolute top-12 left-0 bg-[#1A1A1A] border border-gray-700 rounded-lg py-2 w-20 sm:w-24 z-50 shadow-lg">
            {periodOptions.map((option) => (
              <div
                key={option.value}
                onClick={() => handlePeriodClick(option.value)}
                className={`w-full text-left px-3 sm:px-4 py-2 text-xs sm:text-sm hover:bg-[#2A2A2A] transition-colors cursor-pointer ${
                  currentPeriod === option.value
                    ? 'text-yellow-500 bg-[#2A2A2A]'
                    : 'text-gray-300'
                }`}
              >
                {option.label}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 정렬 필터 */}
      <div className="relative">
        <button
          className="flex items-center px-2 sm:px-4 py-2 bg-[#1A1A1A] border border-gray-600 rounded-full text-gray-300 text-xs sm:text-sm hover:bg-[#2A2A2A] transition-colors"
          onClick={(e) => {
            e.stopPropagation();
            setShowSortMenu(!showSortMenu);
            setShowCategoryMenu(false);
            setShowPeriodMenu(false);
          }}
        >
          <span>{getCurrentSortLabel()}</span>
          <svg
            className={`w-3 h-3 sm:w-4 sm:h-4 ml-1 sm:ml-2 transition-transform ${showSortMenu ? 'rotate-180' : ''}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </button>

        {showSortMenu && (
          <div className="absolute top-12 right-0 bg-[#1A1A1A] border border-gray-700 rounded-lg py-2 w-24 sm:w-28 z-50 shadow-lg">
            {sortOptions.map((option, index) => (
              <div
                key={index}
                onClick={() => handleSortClick(option)}
                className={`w-full text-left px-3 sm:px-4 py-2 text-xs sm:text-sm hover:bg-[#2A2A2A] transition-colors cursor-pointer ${
                  currentSort === option.sort &&
                  currentDirection === option.direction
                    ? 'text-yellow-500 bg-[#2A2A2A]'
                    : 'text-gray-300'
                }`}
              >
                {option.label}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
