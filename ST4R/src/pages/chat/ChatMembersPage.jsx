import { useGetGroupDetail } from '../../api/getGroupDetail';
import { useParams, useNavigate } from 'react-router-dom';
import { useEffect, useRef, useState } from 'react';
import BackButton from '../../components/common/BackButton';
import mainimage from '../../assets/mainimage.png';
import { useGetGroupMembers } from '../../api/getGroupMembers';
import profile from '../../assets/profile.svg';
import location from '../../assets/icons/location.svg';
import out from '../../assets/icons/out.svg';
import {usegroupOut}from '../../api/groupOut';

export default function ChatMembersPage() {
  const { id } = useParams();

  // 모임 상세 정보
  const {
    data: groupDetail,
    isLoading: groupDetailLoading,
    isError: groupDetailError,
  } = useGetGroupDetail(id);
  console.log(groupDetail);

  // 모임 구성원 정보
  const { data: members, isLoading: membersLoding } = useGetGroupMembers(id);
  console.log(members);

  const d = new Date(groupDetail.whenToMeet);
  const dateString = `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`;
  const timeString = d.toLocaleTimeString('ko-KR', {
    hour: 'numeric',
    minute: 'numeric',
    hour12: true,
  });

  //모임 나가기
  const groupOut = usegroupOut();

  return (
    <div className=" relative min-h-screen pb-[100px] flex flex-col gap-8 mx-2 font-['Pretendard']">
      <BackButton className="w-12 mt-2"></BackButton>
      <div className="flex flex-col gap-2 items-center">
        <img
          src={groupDetail.imageUrls[0] || mainimage}
          className="w-32 h-32 rounded-2xl"
        />
        <div className="text-2xl font-bold 
leading-loose">{groupDetail.name}</div>
        <div className="text-[#8F8F8F] ">
          {groupDetail.nowParticipants}/{groupDetail.maxParticipants}, 약속시간:{' '}
          {dateString} {timeString}
        </div>
      </div>
      <div className="flex flex-col gap-3">
        <div className="flex flex-col p-3 gap-2 bg-[#1D1D1D] rounded-xl">
          <div className='text-sm text-[#8F8F8F] '>모임설명:</div>
          <div className='break-words'>{groupDetail.description}</div>
        </div>
        <div className="bg-[#1D1D1D] p-3 rounded-xl flex gap-2">
           <img src={location} className='w-6'></img>
          {groupDetail.location.marker.roadAddress}
        </div>
      </div>
      <div className="flex flex-col gap-3">
        <div className='text-sm text-[#8F8F8F] ml-2'> 모임인원</div>
        <div className="flex flex-col p-3 gap-4 border-[#1D1D1D] border-2 rounded-xl">
          {members.map((member) => (
            <div className="flex gap-2 items-center">
              <img src={member.imageUrl || profile} className="w-8 h-8 rounded-full"></img>
              <div>{member.nickname}</div>
            </div>
          ))}
        </div>
      </div>
      <div className='flex gap-2 items-center absolute bottom-2 w-full p-3 h-[60px] hover:cursor-pointer leading-[60px] text-lg rounded-[10px] bg-[#1D1D1D] text-[#FF4343]' onClick={()=>groupOut.mutate(id)}> <img src={out} className='w-7'></img>모임에서 나가기</div>
     
    </div>
  );
}
