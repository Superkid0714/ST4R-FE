import { useGetGroupDetail } from '../../api/group/getGroupDetail';
import { useParams, useNavigate } from 'react-router-dom';
import { useEffect, useRef, useState } from 'react';
import BackButton from '../../components/common/BackButton';
import mainimage from '../../assets/mainimage.png';
import { useGetGroupMembers } from '../../api/chat/getGroupMembers';
import { useGetBannedMembers } from '../../api/chat/getBannedMembers';
import profile from '../../assets/profile.svg';
import location from '../../assets/icons/location.svg';
import out from '../../assets/icons/out.svg';
import ModalPortal from '../../components/common/ModalPortal';
import OutModal from '../../components/modals/OutModal';
import BanModal from '../../components/modals/BanModal';
import ChangeLeaderModal from '../../components/modals/ChangeLeaderModal';

export default function ChatMembersPage() {
  const { id } = useParams();
  const alertedRef = useRef(false);
  const navigate = useNavigate();
  const [outModal, setOutModal] = useState(false);
  const [banTarget, setBanTarget] = useState(null);
  const [changeLeaderTarget, setChangeLeaderTarget] = useState(null);

  // 모임 상세 정보
  const { data: groupDetail, isLoading: groupDetailLoading } =
    useGetGroupDetail(id);

  // 모임 구성원 정보
  const { data: members } = useGetGroupMembers(id);

  const myMember = members && members.find((member) => member.isMe === true);
  const isLeader = myMember?.isLeader;

  //접근 제한
  useEffect(() => {
    if (groupDetail && groupDetail.banned) {
      alert('해당 모임에서 강퇴당하셨습니다.');
      navigate('/groups');
    }
  }, [groupDetail, navigate]);

  useEffect(() => {
    const token = localStorage.getItem('token') || false;
    if (!token && !alertedRef.current) {
      alertedRef.current = true;
      alert('로그인이 되어있지 않아요!');
      navigate('/groups');
    }
  }, [navigate]);

  // 강퇴한 모임 구성원 정보
  // if (isLeader) {
  //   const { data: bannedMembers, isLoading: bannedMembersLoading } =
  //     useGetBannedMembers(id);
  // }

  if (!groupDetail) return null;

  const d = new Date(groupDetail.whenToMeet);
  const dateString = `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`;
  const timeString = d.toLocaleTimeString('ko-KR', {
    hour: 'numeric',
    minute: 'numeric',
    hour12: true,
  });

  return (
    <div className=" relative min-h-screen pb-[100px] flex flex-col gap-8 mx-2 font-['Pretendard']">
      <BackButton className="w-12 mt-2"></BackButton>
      {groupDetailLoading && (
        <div className="mx-auto mt-10 w-8 h-8 border-2 border-yellow-500 border-t-transparent rounded-full animate-spin"></div>
      )}
      <div className="flex flex-col gap-2 items-center">
        <img
          src={groupDetail.imageUrls[0] || mainimage}
          className="w-32 h-32 rounded-2xl"
        />
        <div
          className="text-2xl font-bold 
leading-loose"
        >
          {groupDetail.name}
        </div>
        <div className="text-[#8F8F8F] ">
          {groupDetail.nowParticipants}/{groupDetail.maxParticipants}, 약속시간:{' '}
          {dateString} {timeString}
        </div>
      </div>
      <div className="flex flex-col gap-3">
        <div className="flex flex-col p-3 gap-2 bg-[#1D1D1D] rounded-xl">
          <div className="text-sm text-[#8F8F8F] ">모임설명:</div>
          <div className="break-words">{groupDetail.description}</div>
        </div>
        <div className="bg-[#1D1D1D] p-3 rounded-xl flex gap-2">
          <img src={location} className="w-6"></img>
          {groupDetail.location.marker.roadAddress}
        </div>
      </div>
      <div className="flex flex-col gap-3">
        <div className="text-sm text-[#8F8F8F] ml-2"> 모임인원</div>
        <div className="flex flex-col p-3 gap-4 border-[#1D1D1D] border-2 rounded-xl">
          {members &&
            members.map((member) => (
              <div className="flex items-center justify-between" key={member.id}>
                <div className="flex gap-3 items-center">
                  <img
                    src={member.imageUrl || profile}
                    className="w-8 h-8 rounded-full"
                  ></img>
                  <div>{member.nickname}</div>
                  {member.isLeader && (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="#FFBB02"
                      stroke-width="2"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      class="lucide lucide-crown-icon lucide-crown"
                    >
                      <path d="M11.562 3.266a.5.5 0 0 1 .876 0L15.39 8.87a1 1 0 0 0 1.516.294L21.183 5.5a.5.5 0 0 1 .798.519l-2.834 10.246a1 1 0 0 1-.956.734H5.81a1 1 0 0 1-.957-.734L2.02 6.02a.5.5 0 0 1 .798-.519l4.276 3.664a1 1 0 0 0 1.516-.294z" />
                      <path d="M5 21h14" />
                    </svg>
                  )}
                </div>
                {isLeader && !member.isLeader && (
                  <div className="flex gap-1.5">
                    <div
                      className="text-xs text-[#FF4343] hover:cursor-pointer"
                      onClick={() => setBanTarget(member)}
                    >
                      강퇴하기
                    </div>

                    <div className="text-xs text-[#bebebeff]">/</div>
                    <div
                      className="text-xs text-[#bebebeff] hover:cursor-pointer"
                      onClick={() => setChangeLeaderTarget(member)}
                    >
                      모임장 위임하기
                    </div>
                  </div>
                )}
              </div>
            ))}
          {banTarget ? (
            <ModalPortal>
              <BanModal
                onClose={() => setBanTarget(null)}
                userId={banTarget.id}
                nickname={banTarget.nickname}
              ></BanModal>
            </ModalPortal>
          ) : null}
          {changeLeaderTarget ? (
            <ModalPortal>
              <ChangeLeaderModal
                onClose={() => setChangeLeaderTarget(null)}
                userId={changeLeaderTarget.id}
                nickname={changeLeaderTarget.nickname}
              ></ChangeLeaderModal>
            </ModalPortal>
          ) : null}
        </div>
      </div>
      <div
        className="flex gap-2 items-center absolute hover:cursor-pointer bottom-2 w-full p-3 h-[60px] hover:cursor-pointer leading-[60px] text-lg rounded-[10px] bg-[#1D1D1D] text-[#FF4343]"
        onClick={() => setOutModal(true)}
      >
        <img src={out} className="w-7"></img>모임에서 나가기
      </div>
      {outModal ? (
        <ModalPortal>
          <OutModal
            onClose={() => setOutModal(false)}
            isLeader={isLeader}
          ></OutModal>
        </ModalPortal>
      ) : null}
    </div>
  );
}
