import profile from '../assets/profile.svg';

export default function ChatBlock({
  message,
  isMe,
  nickname,
  imageUrl,
  chattedAt,
  unreadCount
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
        {isMe && (chattedAt ?
           ( 
           <div className='flex flex-col'>
              {unreadCount && (<div className='text-[11px] text-right mr-2 mt-1 text-yellow-300'>{unreadCount}</div>)}
              <div className="whitespace-nowrap self-end mr-2 text-xs text-gray-400">
                {timeString}
              </div>
            </div>
          ) : (<div className="whitespace-nowrap self-end mr-2 mb-1 text-[11px] text-yellow-300">
                {unreadCount}
              </div>)) }
        

        <div
          className={`relative max-w-[70%] px-3 py-2 rounded-xl font-['Pretendard'] text-sm break-words whitespace-pre-wrap
    ${isMe ? 'bg-[#2F2F2F]' : 'bg-[#1D1D1D] ml-8'}`}
        >
          {message}
        </div>
        {!isMe && (chattedAt ?
           ( 
            <div className='flex flex-col'>
              {unreadCount && (<div className='text-[11px] ml-2 mt-1 text-yellow-300'>{unreadCount}</div>)}
              <div className="whitespace-nowrap self-end ml-2 text-xs text-gray-400">
                {timeString}
              </div>
            </div>
            
          ):(  <div className="whitespace-nowrap self-end ml-2  mb-1 text-[11px] text-yellow-300">
                {unreadCount}
              </div>))}
          
      </div>
    </>
  );
}
