import { useParams } from 'react-router-dom';
import { useGetChatHistory } from '../../api/getChatHistory';
import BackBotton from '../../components/common/BackButton';
import threelines from '../../assets/icons/threelines.svg';
import sendBotton from '../../assets/icons/send.svg'
import { useEffect, useRef, useState } from 'react';

export default function ChatPage() {
  const { id } = useParams();
  const clientRef = useRef(null);

  const {
    data: chatHistory,
    isLoading: isChatHistoryLoading,
    isError,
  } = useGetChatHistory(id);

  const [messagelist, setMessagelist] = useState([]);
  cosnt [input, setInput] = useState('');

  //stomp 연결 후 구독
  useEffect(()=>{
    const sock = new SockJs(
        'http://eridanus.econo.mooo.com:8080/websocket/connect'
      );
    
      const stompClient = new Client({
        webSocketFactory: () => sock,
        reconnectDelay: 5000,
        connectHeaders: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        onConnect: () => {
          console.log('✅ STOMP 연결됨');
          //subscibe(구독할url, 구독 후 실행할 콜백함수)
          stompClient.subscribe(`websocket/subscribe/${id}`, (message) => {
            const data = JSON.parse(message.body); //데이터 파싱
            handleIncomingMessage(data); //받은 데이터 처리 함수
            });
        },
        onStompError: (frame) => {
          console.error('❌ STOMP 에러', frame);
        },
      });
    
      stompClient.activate();
      clientRef.current = stompClient;
    
      return () => {
        stompClient.deactivate();
      };
  },[id])

  // 메세지를 받았을 경우
  const handleIncomingMessage = (data) =>{
    if (data.messageType === 'general') {
      const newMessage = data.message;
      setMessagelist(prev=>[...prev, newMessage]);} // 메시지 리스트 업데이트
    }

  return (
    <div>
      {/* 상단바 */}
      <div className="flex">
        <BackBotton className="ml-2 mt-2" />
        <div className="mx-auto mt-3 text-2xl text-[#8F8F8F] font-['Pretendard']">
          title
        </div>
        <img className="mr-2 mt-2 w-12 h-12" src={threelines} />
      </div>

      {/* 채팅 칸 */}
      {isChatHistoryLoading && (
        <div className="mx-auto py-8">
          <div className="w-8 h-8 border-2 border-yellow-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      )}

      {/* 메세지 입력 칸 */}
      <div className='absolute w-full flex p-3 bottom-3'>
        <input type="text" className="w-full rounded-3xl font-['Pretendard'] bg-[#1D1D1D]  placeholder:text-[#565656] p-3 h-14" placeholder='여기에 메세지를 입력하세요..'/>
        <img className="absolute w-12 right-4 top-4" src={sendBotton} />
      </div>
    </div>

  );
}
