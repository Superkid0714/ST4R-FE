import { useParams } from 'react-router-dom';
import { useMemberBan } from '../../api/chat/memberBan';

export default function BanModal({ onClose, userId, nickname }) {
  const { id } = useParams();

  const memberBan = useMemberBan(id);

  return (
    <div className="relative w-96 font-['Pretendard'] p-5 flex flex-col text-center gap-6 bg-[#1D1D1D] rounded-2xl">
      <div className="flex flex-col gap-2">
        <div className="text-xl ">정말 {nickname}님을 강퇴하시겠어요?</div>
        <div className="text-sm text-[#8F8F8F]">
          <div>강퇴 후에는 채팅 및 모임 참가 접근이 차단됩니다.</div>
          <div> 이 작업은 되돌릴 수 없습니다.</div>
        </div>
      </div>
      <div className="flex gap-2">
        <button
          className="w-full h-14 hover:cursor-pointer leading-14 bg-[#2F2F2F] rounded-xl"
          onClick={onClose}
        >
          취소하기
        </button>
        <button
          className="w-full h-14 hover:cursor-pointer leading-14 bg-[#FF4343] rounded-xl"
          onClick={() => {
            memberBan.mutate(userId);
            onClose();
          }}
        >
          강퇴하기
        </button>
      </div>
    </div>
  );
}

