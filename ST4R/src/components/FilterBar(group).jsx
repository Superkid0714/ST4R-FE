import { useState, useEffect } from 'react';

export default function FilterBar({
  currentPeriod,
  currentSort,
  currentDirection,
  onPeriodChange,
  onSortFilterChange,
}) {
  const [showPeriodMenu, setShowPeriodMenu] = useState(false);
  const [showSortMenu, setShowSortMenu] = useState(false);

  // 메뉴 외부 클릭 시 닫기
  useEffect(() => {
    const handleClickOutside = () => {
      setShowPeriodMenu(false);
      setShowSortMenu(false);
    };

    if (showPeriodMenu || showSortMenu) { //메뉴창이 하나라도 열여있으면 실행
      document.addEventListener('click', handleClickOutside);
      return () => document.removeEventListener('click', handleClickOutside); //클린업 함수
    }
  }, [showPeriodMenu, showSortMenu]);

  const periodOptions = [
    { value: 'daily', label: '일별' },
    { value: 'weekly', label: '주별' },
    { value: 'monthly', label: '월별' },
    { value: 'yearly', label: '연별' },
  ];

  const sortOptions = [
    { sort: 'createdAt', direction: 'desc', label: '최신순' },
    { sort: 'createdAt', direction: 'asc', label: '오래된순' },
    { sort: 'whenToMeet', direction: 'asc', label: '모임 임박한 순' },
  ];

  const handlePeriodClick = (period) => {
    onPeriodChange(period);
    setShowPeriodMenu(false);
  };

  const handleSortClick = (option) => {
    onSortFilterChange(option);
    setShowSortMenu(false);
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

  return (
    <div className="flex items-center space-x-1 sm:space-x-2 ">
      
      {/* 기간 필터 */}
      <div className="relative">
        <button
          className="flex items-center px-2 sm:px-4 py-2 bg-[#1A1A1A] border border-gray-600 rounded-full text-gray-300 text-xs sm:text-sm hover:bg-[#2A2A2A] transition-colors"
          onClick={(e) => {
            e.stopPropagation();
            setShowPeriodMenu(!showPeriodMenu);
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
            {periodOptions.map((option, index) => (
              <div
                key={index}
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
