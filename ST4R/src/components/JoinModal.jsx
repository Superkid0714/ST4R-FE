import { useState } from 'react';
import { createPortal } from 'react-dom'; // React Portal 사용

export default function JoinModal({ onClose, hasPassword, id }) {
  const [passwordInput, setPasswordInput] = useState(''); //사용자가 입력한 비밀번호
  const [passworderror, setPasswordError] = useState(false);

  //모임 참가 요청
  const postJoin = async (id) => {
    const res = await axios.post(
      `${BASE_URL}/groups/${id}/members`,
      userpassword
    );
    return res.data;
  };

  const { mutate } = useMutation({
    mutationFn: postJoin,
    onSuccess: () => {
      console.log('참가 완료');
      onClose(); // 모달창 닫기
    },
    onError: (err) => {
      if (err.response?.status === 401){
        setPasswordError(True); // 비번 틀림
      }
      else {
        console.log(err);
      }
      
    },
  });

  return createPortal(
    <div>
      {hasPassword ? (
        <div>비밀번호를 입력하세요</div>
      ) : (
        <div>모임에 참가하시겠습니까?</div>
      )}
      <button onClick={()=>{mutate(id)}}>모임 참가하기</button>
    </div>
  );
}
