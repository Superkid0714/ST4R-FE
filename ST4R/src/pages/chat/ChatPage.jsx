import { useParams, useLocation } from 'react-router-dom';
import { useGetChatHistory } from '../../api/getChatHistory';
import BackButton from '../../components/common/BackButton';
import threelines from '../../assets/icons/threelines.svg';
import sendBotton from '../../assets/icons/send.svg';
import { useEffect, useRef, useState } from 'react';
import { useGetGroupDetail } from '../../api/getGroupDetail';
import SockJs from 'sockjs-client';
import Stomp from 'stompjs';
import ChatBlock from '../../components/ChatBlock';
import { useGetGroupMembers } from '../../api/getGroupMembers';

export default function ChatPage() {
  const { id } = useParams();
  const clientRef = useRef(null);
  const messageListRef = useRef(null);
  const [messagelist, setMessagelist] = useState([]);
  const [input, setInput] = useState(''); // 보내는 메세지 내용

  // 모임 상세 정보
  const {
    data: groupDetail,
    isLoading,
    isError: groupDetailError,
  } = useGetGroupDetail(id);

  // 모임 구성원 정보
  const { data: members } = useGetGroupMembers(id);

  // 채팅 히스토리
  const {
    data: chatHistory,
    isLoading: isChatHistoryLoading,
    isError,
  } = useGetChatHistory(id);

  // 기존 채팅 히스토리 설정
  useEffect(() => {
    if (chatHistory) {
      console.log(chatHistory.content);
      setMessagelist(chatHistory.content);
    }
  }, [chatHistory]);

  const stompDebugLogger = (str) => {
    console.log('[STOMP DEBUG]', str);
  };

  //채팅 올 때마다 맨 아래로 스크롤
  useEffect(() => {
    if (messageListRef.current) {
      messageListRef.current.scrollTop = messageListRef.current.scrollHeight;
    }
  }, [messagelist]);

  //웹소켓으로 채팅하기
  useEffect(() => {
    if (clientRef.current && clientRef.current.connected) {
      return;
    }
    //sockjs연결
    const socket = new SockJs(
      'http://eridanus.econo.mooo.com:8080/websocket/connect',
      null,
      {
        debug: true, // SockJS 자체의 상세 로그 활성화
      }
    );

    const stompClient = Stomp.over(socket);

    stompClient.debug = stompDebugLogger;

    //stomp 연결 후 구독
    stompClient.connect(
      { Authorization: `Bearer ${localStorage.getItem('token')}` },
      () => {
        console.log('✅ STOMP 연결됨');
        clientRef.current = stompClient;
        stompClient.subscribe(`/subscribe/${id}`, (message) => {
          const data = JSON.parse(message.body);
          handleIncomingMessage(data); //받은 데이터 처리 함수
        });
      },
      (error) => {
        console.error('❌ stomp 연결 실패:', error);
      }
    );

    return () => {
      if (clientRef.current) {
        clientRef.current.disconnect(() => {
          console.log('⛔ 웹소켓 연결 종료');
        });
        clientRef.current = null;
      }
    };
  }, [id]);

  // 메세지를 받았을 경우
  const handleIncomingMessage = (data) => {
    if (data.messageType === 'general') {
      const newMessage = data.message;

      setMessagelist((prev) => {
        // 중복 방지: 동일 ID 가진 메시지가 이미 있으면 추가 안 함
        const alreadyExists = prev.some(
          (msg) => msg.chatId === newMessage.chatId
        );
        if (alreadyExists) return [...prev];

        return [...prev, newMessage]; // 메시지 리스트 업데이트
      }); 
    }
  };

  //메세지 전송
  const sendMessage = () => {
    if (!input.trim()) return;
    // 연결 확인
    if (!clientRef.current) {
      console.warn('❗ STOMP 클라이언트가 아직 연결되지 않았습니다.');
      return;
    }

    clientRef.current.send(
      `/broadcast/${id}`,
      {},
      JSON.stringify({ message: input })
    );

    setInput(''); // 전송 후 다시 초기화
  };

  console.log(messagelist);

  return (
    <div className="h-screen flex flex-col">
      {/* 상단바 */}
      <div className="flex mb-2">
        <BackButton className="ml-2 mt-2" />
        <div className="mx-auto mt-3 text-2xl text-[#8F8F8F] font-['Pretendard']">
          {/* {groupDetail.name} */}
        </div>
        <img className="mr-4 mt-2 w-12 h-12 " src={threelines} />
      </div>
      <div className="h-[1px] w-full bg-[#2F2F2F]"></div>

      {/* 채팅 메세지 목록 */}
      <div
        className="pt-2 mb-[76px] flex flex-col gap-2 mx-3 pr-2 overflow-y-auto"
        ref={messageListRef}
      >
        {messagelist.map((msg, i) => {
          const senderInfo = members.find((m) => m.isMe == true); // 보낸사람 정보
          const prev = messagelist[i - 1];
          const isFirstOfSender = !prev || prev.sender.id !== msg.sender.id; // 연속된 채팅을 보냈을 경우 가장 첫 메세지
          return (
            <ChatBlock
              key={i}
              message={msg.message}
              isMe={msg.sender.id === senderInfo.id}
              nickname={isFirstOfSender ? msg.sender.nickname : null}
            ></ChatBlock>
          );
        })}
      </div>

      {isChatHistoryLoading && (
        <div className="mx-auto mt-10 w-8 h-8 border-2 border-yellow-500 border-t-transparent rounded-full animate-spin"></div>
      )}

      {/* 메세지 입력 칸 */}
      <div className="absolute z-9999 w-full flex px-3 bottom-3">
        <input
          type="text"
          className="w-full focus:outline-none rounded-3xl font-['Pretendard'] bg-[#1D1D1D] placeholder:text-[#565656] p-3 h-14"
          placeholder="여기에 메세지를 입력하세요.."
          onChange={(e) => setInput(e.target.value)}
          value={input}
        />
        <img
          onClick={sendMessage}
          className="absolute w-12 right-4 top-1"
          src={sendBotton}
        />
      </div>
    </div>
  );
}
