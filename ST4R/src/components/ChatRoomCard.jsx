import { useNavigate } from 'react-router-dom';
import mainimage from '../assets/mainimage.png'; 

export default function ChatRoomCard({ chatRoom, chatPreview }) {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/groups/${chatRoom.id}/chats`);
  };

  return (
    <div
      key={chatRoom.id}
      className="flex items-center w-full h-20 sm:h-[105px] bg-[#1D1D1D] rounded-[10px] p-2 sm:p-3 cursor-pointer" // Add flex and padding
      onClick={handleClick}
    >
      <div className="flex-shrink-0 w-14 h-14 sm:w-20 sm:h-20 rounded-xl overflow-hidden">
        {chatRoom.thumbnailImageUrl === null ? (
          <img
            className="w-full h-full object-cover" 
            src={mainimage}
          />
        ) : (
          <img
            className="w-full h-full object-cover"
            src={chatRoom.thumbnailImageUrl}
          />
        )}
      </div>
      <div className="flex flex-col gap-0.5 justify-center ml-3 flex-grow min-w-0"> 
        <div className="flex items-center text-base sm:text-xl font-normal font-['Pretendard'] leading-normal truncate"> 
          <span className="text-white">{chatRoom.title}</span> 
          <span className="text-[#8F8F8F] text-xs px-2 whitespace-nowrap">
            {chatRoom.nowParticipants}/{chatRoom.maxParticipants}
          </span>
        </div>

        <div className="text-[#8F8F8F] text-xs sm:text-base font-normal font-['Pretendard'] leading-none truncate mt-1">
          {chatPreview?.recentMessage}
        </div>
      </div>

      {chatPreview?.unreadCount > 0 && ( 
        <div className="flex-shrink-0 w-12 h-9 sm:w-16 sm:h-10 bg-[#FFBB02] rounded-3xl ml-auto flex items-center justify-center"> 
          <div className="text-center text-[#000000] text-base sm:text-lg font-semibold font-['Pretendard']">
            {chatPreview?.unreadCount}
          </div>
        </div>
      )}
    </div>
  );
}