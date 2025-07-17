export default function ChatBlock({ message, isMe, nickname, imageUrl, chattedAt }) {
  const localDate = new Date(chattedAt);
  const timeString =  localDate.toLocaleTimeString('ko-KR', {
    hour: 'numeric',
    minute: 'numeric',
    hour12: true
  });
 
  return (
    <>
      {nickname && imageUrl && !isMe && (
        <div className="flex justify-start font-['Pretendard'] text-sm">{nickname}</div>
      )}
      <div className={`flex font-['Pretendard'] ${isMe ? 'justify-end' : 'justify-start'}`}>
        {chattedAt && isMe && <div className="text-xs pt-4 pr-2">{timeString}</div>}
        <div
          className={` max-w-[70%] px-3 py-2 rounded-xl font-['Pretendard'] text-sm break-words whitespace-pre-wrap
          ${isMe ? 'bg-[#2F2F2F]' : 'bg-[#1D1D1D]'}`}
        >
          {message}
        </div>
        {chattedAt && !isMe && <div className="text-xs pt-4 pl-2">{timeString}</div>}
      </div>
    </>
  );
}
