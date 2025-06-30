import { useNavigate } from 'react-router-dom';

export default function GroupCard({ group }) {

  const navigate = useNavigate();

  const handleClick = () =>{
    navigate(`/groups/${group.id}`);
  };

  const month = group.whenToMeet.slice(5, 7);
  const day = group.whenToMeet.slice(8, 10);
  const time = group.whenToMeet.slice(11, 16);

  return (
    <div
      key={group.id}
      className=" relative w-full h-20 sm:h-[105px] bg-[#1D1D1D] rounded-[10px]"
      onClick={handleClick}
    >
      {group.imageUrls && (
        <img
          className="absolute w-14 sm:w-20 sm:h-20 h-14 left-2 top-3 rounded-xl"
          src={group.imageUrls[0]}
        />
      )}
      <div className="absolute left-[74px] sm:left-[100px] top-4 sm:top-6 justify-start text-base sm:text-xl font-normal font-['Pretendard'] leading-normal">
        {group.name}
      </div>
      <div className="absolute right-16 left-[74px] sm:left-[100px] top-11 sm:top-[55px] justify-start text-[#8F8F8F] text-xs sm:text-base font-normal font-['Pretendard'] leading-none truncate">
        {`${month}/${day} ${time}, ${group.location?.marker?.roadAddress}`}
      </div>
      <div className="absolute w-14 sm:w-20 h-9 sm:h-14 right-3 top-6 sm:top-6 flex flex-col justify-center bg-[#101010] rounded-3xl ">
        <div className="text-center text-[#FFBB02] text-base sm:text-lg font-medium font-['Pretendard']">
          {`${group.currentParticipantCount}/${group.maxParticipantCount}`}
        </div>
      </div>
    </div>
  );
}
