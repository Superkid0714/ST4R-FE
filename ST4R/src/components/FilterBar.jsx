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
  const [showSortFilterMenu, setShowSortFilterMenu] = useState(false);

  // 메뉴 외부 클릭 시 닫기
  useEffect(() => {
    const handleClickOutside = () => {
      setShowPeriodMenu(false);
      setShowSortFilterMenu(false);
    };

    if (showPeriodMenu || showSortFilterMenu) {
      document.addEventListener('click', handleClickOutside);
      return () => document.removeEventListener('click', handleClickOutside);
    }
  }, [showPeriodMenu, showSortFilterMenu]);

  const periodOptions = [
    { value: 'daily', label: '일별' },
    { value: 'weekly', label: '주별' },
    { value: 'monthly', label: '월별' },
    { value: 'yearly', label: '연별' },
  ];

  const sortFilterOptions = [
    { sort: 'viewCount', direction: 'desc', label: '조회수', type: 'sort' },
    { sort: 'likeCount', direction: 'desc', label: '좋아요 수', type: 'sort' },
    { sort: 'createdAt', direction: 'desc', label: '최신순', type: 'sort' },
    { sort: 'createdAt', direction: 'asc', label: '오래된순', type: 'sort' },
    { value: 'SPOT', label: '스팟공유글', type: 'category' },
    { value: 'GENERAL', label: '자유글', type: 'category' },
    { value: 'PROMOTION', label: '홍보글', type: 'category' },
  ];

  const handlePeriodClick = (periodValue) => {
    onPeriodChange(periodValue);
    setShowPeriodMenu(false);
  };

  const handleSortFilterClick = (option) => {
    onSortFilterChange(option);
    setShowSortFilterMenu(false);
  };

  return (
    <div className="flex items-center space-x-2 relative">
      {/* 기간 설정 버튼 */}
      <div className="relative">
        <button
          className="p-1"
          onClick={(e) => {
            e.stopPropagation();
            setShowPeriodMenu(!showPeriodMenu);
            setShowSortFilterMenu(false);
          }}
        >
          <svg
            className="w-5 h-5 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
            />
          </svg>
        </button>

        {/* 기간 메뉴 */}
        {showPeriodMenu && (
          <div className="absolute top-8 right-0 bg-[#1A1A1A] border border-gray-700 rounded-lg py-2 w-24 z-50 shadow-lg">
            {periodOptions.map((option) => (
              <div
                key={option.value}
                onClick={() => handlePeriodClick(option.value)}
                className={`w-full text-left px-4 py-2 text-sm hover:bg-[#2A2A2A] transition-colors cursor-pointer ${
                  currentPeriod === option.value
                    ? 'text-yellow-500'
                    : 'text-gray-300'
                }`}
              >
                {option.label}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 정렬/필터 버튼 */}
      <div className="relative">
        <button
          className="p-1"
          onClick={(e) => {
            e.stopPropagation();
            setShowSortFilterMenu(!showSortFilterMenu);
            setShowPeriodMenu(false);
          }}
        >
          <svg
            className="w-5 h-5 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 6h16M4 10h16M4 14h16M4 18h16"
            />
          </svg>
        </button>

        {/* 정렬/필터 메뉴 */}
        {showSortFilterMenu && (
          <div className="absolute top-8 right-0 bg-[#1A1A1A] border border-gray-700 rounded-lg py-2 w-36 z-50 shadow-lg">
            {sortFilterOptions.map((option, index) => (
              <div
                key={index}
                onClick={() => handleSortFilterClick(option)}
                className={`w-full text-left px-4 py-2 text-sm hover:bg-[#2A2A2A] transition-colors cursor-pointer ${
                  (option.type === 'sort' &&
                    currentSort === option.sort &&
                    currentDirection === option.direction &&
                    currentCategory === 'all') ||
                  (option.type === 'category' &&
                    currentCategory === option.value)
                    ? 'text-yellow-500'
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
