import { createPortal } from 'react-dom';

//모달 공통 컴포넌트(배경색, 정렬 등)
export default function ModalPotal({ children }) { //children으로 모달 상세내용을 넣어줘서 창을 띄움
  const el = document.getElementById('modal');
  return createPortal(
    <div className="fixed inset-0 z-[9999] bg-black/70 flex items-center justify-center">
      {children}
    </div>,
    el
  );
}
