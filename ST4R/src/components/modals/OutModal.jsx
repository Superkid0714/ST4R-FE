import { useParams } from 'react-router-dom';
import { usegroupOut } from '../../api/group/groupOut';
import { usegroupDelete } from '../../api/group/groupDelete';

export default function OutModal({ onClose, isLeader }) {
  const { id } = useParams();

  const groupOut = usegroupOut();
  const handleDelete = usegroupDelete();

  return (
    <>
      {!isLeader ? (
        <div className="relative w-96 font-['Pretendard'] p-5 flex flex-col text-center gap-6 bg-[#1D1D1D] rounded-2xl">
          <div className="flex flex-col gap-2">
            <div className="text-xl ">정말로 모임에서 나가시겠어요?</div>
            <div className="text-sm text-[#8F8F8F]">
              모임에 나가면 모든 채팅 정보가 삭제됩니다.
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
                groupOut.mutate(id);
              }}
            >
              나가기
            </button>
          </div>
        </div>
      ) : (
        <div className="relative w-96 font-['Pretendard'] p-5 flex flex-col text-center gap-6 bg-[#1D1D1D] rounded-2xl">
          <div className="flex flex-col gap-2">
            <div className="text-xl ">팀장은 모임을 나갈 수 없어요!</div>
            <div className="text-sm text-[#8F8F8F]">
              다른 사람에게 모임장을 위임하거나 모임을 삭제해주세요.
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
                handleDelete.mutate(id);
              }}
            >
              모임 삭제하기
            </button>
          </div>
        </div>
      )}
    </>
  );
}
