import { useParams } from 'react-router-dom';
import { usegroupDelete } from '../api/groupDelete';

// 모달 상세 내용
export default function DeleteModal({ onClose }) {
  const { id } = useParams();

  const handleDelete = usegroupDelete();

  return (
    <div className="relative w-96 font-['Pretendard'] p-5 flex flex-col text-center gap-6 bg-[#1D1D1D] rounded-2xl">
      <div className="flex flex-col gap-2">
        <div className="text-xl ">정말로 해당 모임을 삭제하시겠어요?</div>
        <div className="text-sm text-[#8F8F8F]">
          삭제하시면 해당 모임은 더이상 이용하실 수 없어요
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
          삭제하기
        </button>
      </div>
    </div>
  );
}
