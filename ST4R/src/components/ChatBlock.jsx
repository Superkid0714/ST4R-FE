import profile from '../assets/profile.svg';

export default function ChatBlock({
  message,
  isMe,
  nickname,
  imageUrl,
  chattedAt,
}) {
  const localDate = new Date(chattedAt);
  const timeString = localDate.toLocaleTimeString('ko-KR', {
    hour: 'numeric',
    minute: 'numeric',
    hour12: true,
  });

  return (
    <>
      {nickname && !isMe && (
        <div className="flex gap-2">
          <img src={imageUrl || profile} className="w-8"></img>
          <div className="pt-[6px] justify-start font-['Pretendard'] text-sm">
            {nickname}
          </div>
        </div>
      )}
      <div
        className={`flex font-['Pretendard'] ${isMe ? 'justify-end' : 'justify-start'}`}
      >
        {chattedAt &&
          isMe && ( 
            <div className="whitespace-nowrap self-end mr-2 mb-1  text-xs text-gray-400">
              {timeString}
            </div>
          )}
        <div
          className={`relative max-w-[70%] px-3 py-2 rounded-xl font-['Pretendard'] text-sm break-words whitespace-pre-wrap
    ${isMe ? 'bg-[#2F2F2F]' : 'bg-[#1D1D1D] ml-8'}`}
        >
          {message}
        </div>
        {chattedAt &&
          !isMe && ( 
            <div className="whitespace-nowrap self-end ml-2 mb-1 text-xs text-gray-400">
              {timeString}
            </div>
          )}
      </div>
    </>
  );
}
