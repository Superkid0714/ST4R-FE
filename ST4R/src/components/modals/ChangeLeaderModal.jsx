import { useParams } from 'react-router-dom';
import {useChangeLeader } from '../../api/chat/changeLeader';

export default function ChangeLeaderModal({ onClose, userId, nickname }) {
  const { id } = useParams();

  const changeLeader = useChangeLeader(id);

  return (
    <div className="relative w-100 font-['Pretendard'] p-5 flex flex-col text-center gap-6 bg-[#1D1D1D] rounded-2xl">
      <div className="flex flex-col gap-2">
        <div className="text-lg ">정말 {nickname}님에게 모임장 권한을 위임하시겠어요?</div>
        <div className="text-sm text-[#8F8F8F]">
          <div> 모임을 관리할 수 있는 모든 권한이 해당 멤버에게 이전됩니다.</div>
          <div>이 작업은 되돌릴 수 없습니다.</div>
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
            changeLeader.mutate(userId);
          }}
        >
          위임하기
        </button>
      </div>
    </div>
  );
}

