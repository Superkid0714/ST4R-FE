export default function Bookmark({ handleClick, isliked }) {
  return (
    <button
      onClick={handleClick}
      className="p-6 mt-2 absolute right-3 z-10 bg-[#1D1D1Db3] rounded-full "
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill={isliked ? '#FFBB02' : "none"}
        stroke={isliked ? "none" : "currentColor"}
        strokeWidth={isliked ? "none" : "1.5"}
        viewBox="0 0 24 24"
        className="size-7 absolute top-2.5 right-2.5 z-10 opacity-[1]"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M17.593 3.322c1.1.128 1.907 1.077 1.907 2.185V21L12 17.25 4.5 21V5.507c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0 1 11.186 0Z"
        />
      </svg>
    </button>
  );
}

