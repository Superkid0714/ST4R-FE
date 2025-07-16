export default function ChatBlock({ message, isMe, nickname }) {
  return (
    <>
      {nickname && !isMe && (
        <div className="flex mx-2 justify-start font-['Pretendard'] text-sm">{nickname}</div>
      )}
      <div className={`m-2 flex ${isMe ? 'justify-end' : 'justify-start'}`}>
        <div
          className={`max-w-[70%] px-3 py-2 rounded-xl font-['Pretendard'] text-sm break-words whitespace-pre-wrap
          ${isMe ? 'bg-[#2F2F2F]' : 'bg-[#1D1D1D]'}`}
        >
          {message}
        </div>
      </div>
    </>
  );
}
