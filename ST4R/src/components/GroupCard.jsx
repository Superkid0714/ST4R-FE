import { useNavigate } from 'react-router-dom';
import mainimage from '../assets/mainimage.png';

export default function GroupCard({ group }) {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/groups/${group.id}`);
  };

  const d = new Date(group.whenToMeet);
  const dateString = `${d.getFullYear()}-${d.getMonth()+1}-${d.getDate()} ${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;
  

  return (
    <div
      key={group.id}
      className=" relative hover:cursor-pointer w-full h-20 sm:h-[105px] bg-[#1D1D1D] rounded-[10px]"
      onClick={handleClick}
    >
      {group.imageUrls?.length === 0 ? (
        <img
          className="absolute w-14 sm:w-20 sm:h-20 h-14 left-2 top-3 rounded-xl"
          src={mainimage}
        />
      ) : (
        <img
          className="absolute w-14 sm:w-20 sm:h-20 h-14 left-2 top-3 rounded-xl"
          src={group.imageUrls[0]}
        />
      )}
      <div className="absolute left-[74px] sm:left-[100px] top-4 sm:top-6 justify-start text-base sm:text-xl font-normal font-['Pretendard'] leading-normal">
        {group.name}
      </div>
      <div className="absolute right-16 left-[74px] sm:left-[100px] top-11 sm:top-[55px] justify-start text-[#8F8F8F] text-xs sm:text-base font-normal font-['Pretendard'] leading-none truncate">
        {dateString} / {group.location?.marker?.roadAddress}
      </div>
      <div className="absolute w-14 sm:w-20 h-9 sm:h-14 right-3 top-6 sm:top-6 flex flex-col justify-center bg-[#101010] rounded-3xl ">
        <div className="text-center text-[#FFBB02] text-base sm:text-lg font-medium font-['Pretendard']">
          {`${group.currentParticipantCount}/${group.maxParticipantCount}`}
        </div>
      </div>
    </div>
  );
}
