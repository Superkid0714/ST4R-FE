import { useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import error2 from '../../assets/icons/error2.svg';

// 모달 상세 내용
export default function JoinModal({ onClose, hasPassword, isLogin }) {
  const passwordRef = useRef('');
  const [passworderror, setPasswordError] = useState(false);
  const BASE_URL = 'https://eridanus.econo.mooo.com';
  const { id } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  //모임 참가 요청
  const postJoin = async ({ password }) => {
    const res = await axios.post(
      `${BASE_URL}/groups/${id}/members`,
      { password: password.trim() },
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      }
    );
    return res.data;
  };

  const useJoinMutation = useMutation({
    mutationFn: postJoin,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['mychats'] });
      queryClient.invalidateQueries({ queryKey: ['group'] });
      console.log('참가 완료');
      onClose(); // 모달창 닫기
      navigate(`/groups/${id}/chats`);
    },
    onError: (err) => {
      if (err.response?.status === 400) {
        setPasswordError(true); // 비번 틀림
      } else {
        console.log(err);
      }
    },
  });

  return (
    <div>
      {isLogin ? (
        !hasPassword ? (
          <div className="relative w-96 font-['Pretendard'] p-5 flex flex-col gap-5 bg-[#1D1D1D] rounded-2xl">
            <div className="text-xl">비밀번호를 입력해주세요</div>
            <div
              className="absolute text-xl right-6 hover:cursor-pointer"
              onClick={onClose}
            >
              ✕
            </div>
            <input
              type="text"
              className="w-full h-14 p-3 focus:outline-none bg-[#2F2F2F] placeholder:text-[#565656] rounded-xl"
              placeholder="여기에 비밀번호를 입력해주세요... "
              onChange={(e) => {
                passwordRef.current = e.target.value;
              }}
              onFocus={() => {
                setPasswordError(false);
              }}
            />
            {passworderror ? (
              <div className="flex gap-1 justify-center">
                <img src={error2}></img>
                <div className="text-[#FF4343] font-light">
                  잘못된 비밀번호에요
                </div>
              </div>
            ) : null}
            <button
              className="w-full h-14 hover:cursor-pointer leading-12 text-center text-black text-lg font-bold bg-[#FFBB02] rounded-xl"
              onClick={() => {
                useJoinMutation.mutate({ password: passwordRef.current });
              }}
            >
              입력완료
            </button>
          </div>
        ) : (
          <div className="relative w-96 font-['Pretendard'] p-5 flex flex-col gap-5 justify-start items-start bg-[#1D1D1D] rounded-2xl">
            <div className="text-xl">모임에 참가 하시겠어요?</div>
            <div
              className="absolute text-xl right-6 hover:cursor-pointer"
              onClick={onClose}
            >
              ✕
            </div>
            <button
              className="w-full h-14 hover:cursor-pointer leading-12 text-center text-black text-lg font-bold bg-[#FFBB02] rounded-xl"
              onClick={() => {
                useJoinMutation.mutate({ password: passwordRef.current });
              }}
            >
              참가하기
            </button>
          </div>
        )
      ) : (
        <div className="relative w-96 font-['Pretendard'] p-5 flex flex-col gap-5 justify-start items-start bg-[#1D1D1D] rounded-2xl">
          <div className="text-xl">로그인하고 모임에 참가하세요!</div>
          <div
            className="absolute text-xl right-6 hover:cursor-pointer"
            onClick={onClose}
          >
            ✕
          </div>
          <button
            className="w-full h-14 hover:cursor-pointer leading-12 text-center text-black text-lg font-bold bg-[#FFBB02] rounded-xl"
            onClick={() => {
              navigate('/login')
            }}
          >
            로그인하러 가기
          </button>
        </div>
      )}
    </div>
  );
}

