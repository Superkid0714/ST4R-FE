import { useParams, useLocation } from 'react-router-dom';
import { getChatHistory } from '../../api/getChatHistory';
import BackButton from '../../components/common/BackButton';
import threelines from '../../assets/icons/threelines.svg';
import sendBotton from '../../assets/icons/send.svg';
import { useEffect, useRef, useState } from 'react';
import { useGetGroupDetail } from '../../api/getGroupDetail';
import SockJs from 'sockjs-client';
import Stomp from 'stompjs';
import ChatBlock from '../../components/ChatBlock';
import { useGetGroupMembers } from '../../api/getGroupMembers';
import { useInfiniteQuery, useQueryClient } from '@tanstack/react-query';

export default function ChatPage() {
  const { id } = useParams();
  const queryClient = useQueryClient();
  const clientRef = useRef(null);
  const messageListRef = useRef(null);
  const [input, setInput] = useState(''); // 보내는 메세지 내용
  const [isScrolledToBottom, setIsScrolledToBottom] = useState(true); //스크롤이 맨 아래에 있는지 추적

  // 모임 상세 정보
  const {
    data: groupDetail,
    isLoading: groupDetailLoading,
    isError: groupDetailError,
  } = useGetGroupDetail(id);
  console.log(groupDetail);

  // 모임 구성원 정보
  const { data: members } = useGetGroupMembers(id);

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage, // 다음 페이지를 불러오는 중인지 여부
    isLoading: isChatHistoryInitialLoading,
    isError,
  } = useInfiniteQuery({
    queryKey: ['chatHistory', id],
    queryFn: ({ pageParam = 0 }) => getChatHistory(id, pageParam),
    getNextPageParam: (lastPage, allPages) => {
      if (lastPage.last) {
        return undefined; 
      }
      return allPages.length;
    }, 
    select: (data) => ({
      pages: data.pages.map((page) => page.content).flat(), // pages 배열 안의 각 page 객체에서 'content' 배열만 뽑아서 평탄화
      pageParams: data.pageParams,
    }),
  });

  const messagelist = data?.pages || [];
  console.log('Current Messagelist:', messagelist);

  const stompDebugLogger = (str) => {
    console.log('[STOMP DEBUG]', str);
  };

  const scrollToBottom = () => {
    if (messageListRef.current) {
      messageListRef.current.scrollTop = messageListRef.current.scrollHeight;
    }
  };
  useEffect(() => {
    scrollToBottom();
  }, [id]);

  useEffect(() => {
    const chatContainer = messageListRef.current;
    if (!chatContainer) return;

    const handleScroll = () => {
      // 스크롤이 거의 맨 아래에 있는지 확인 
      const atBottom =
        chatContainer.scrollHeight -
          chatContainer.scrollTop -
          chatContainer.clientHeight <
        100;
      setIsScrolledToBottom(atBottom);
    };

    handleScroll();
    chatContainer.addEventListener('scroll', handleScroll);
    return () => chatContainer.removeEventListener('scroll', handleScroll);
  }, []);

  // 스크롤 컨테이너의 맨 위에 놓을 빈 div
  const observerTarget = useRef(null);

  useEffect(() => {
    if (!observerTarget.current || !messageListRef.current) return;

    const currentObserverTarget = observerTarget.current;
    const currentMessageListRef = messageListRef.current;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasNextPage && !isFetchingNextPage) {
          console.log('최상단에 닿았어요! 다음 페이지를 불러옵니다.');
          const prevScrollHeight = currentMessageListRef.scrollHeight;
          fetchNextPage().then(() => {
      
            requestAnimationFrame(() => {
              const newScrollHeight = currentMessageListRef.scrollHeight;
              
              currentMessageListRef.scrollTop +=
                newScrollHeight - prevScrollHeight;
            });
          }); 
        }
      },
      { root: messageListRef.current, threshold: 0.1 } // 10% 정도 보이면 콜백 실행
    );

    observer.observe(currentObserverTarget); 

    return () => {
      observer.disconnect(); // 컴포넌트 언마운트 시 관찰 중지
    };
  }, [fetchNextPage, hasNextPage, isFetchingNextPage]); 

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

  // 메세지를 받았을 경우 useInfiniteQuery의 캐시 데이터에 추가
  const handleIncomingMessage = (receivedData) => {
    if (receivedData.messageType === 'general') {
      const newMessage = receivedData.message;

      queryClient.setQueryData(['chatHistory', id], (oldData) => {
        if (!oldData) {
          // 캐시된 데이터가 아직 없으면 초기 구조를 만들어줌
          return {
            pages: [{ content: [newMessage], last: true }],
            pageParams: [0],
          };
        }
        const updatedPages = [...oldData.pages];
        const lastPageIndex = updatedPages.length - 1;

        // 중복 방지
        const alreadyExists = updatedPages[lastPageIndex].content.some(
          (msg) => msg.chatId === newMessage.chatId
        );

        if (!alreadyExists) {
          updatedPages[lastPageIndex] = {
            ...updatedPages[lastPageIndex],
            content: [...updatedPages[lastPageIndex].content, newMessage],
          };
        }

        return {
          ...oldData, 
          pages: updatedPages, 
        };
      });

      if (isScrolledToBottom) {
          requestAnimationFrame(() => {
            scrollToBottom();
          });
        ;
      }
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
          {groupDetail?.name}
        </div>
        <img className="mr-4 mt-2 w-12 h-12 " src={threelines} />
      </div>
      <div className="h-[1px] w-full bg-[#2F2F2F]"></div>

      {/* 채팅 메세지 목록 */}
      <div
        className="pt-2 pb-2 mb-[76px] flex flex-col gap-[6px] mx-3 pr-2 overflow-y-auto"
        ref={messageListRef}
      >
        <div ref={observerTarget} className="h-1" />
        {isFetchingNextPage && (
          <div className="mx-auto my-2 w-6 h-6 border-2 border-yellow-500 border-t-transparent rounded-full animate-spin"></div>
        )}
        {messagelist.map((msg, i) => {
          const senderInfo = members.find((m) => m.isMe == true); // 보낸사람 정보
          const prev = messagelist[i - 1];
          const next = messagelist[i + 1];

          const getTimeString = (date) => {
            const d = new Date(date);
            return `${d.getFullYear()}-${d.getMonth()}-${d.getDate()} ${d.getHours()}:${d.getMinutes()}`;
          };

          const prevTime = prev ? getTimeString(prev.chattedAt) : null;
          const currTime = getTimeString(msg.chattedAt);
          const nextTime = next ? getTimeString(next.chattedAt) : null;

          const showTime =
            !next || // 1. 이후 메시지 없음
            (next && next.sender.id !== msg.sender.id) || // 2. 다른 사람이 보냄
            nextTime !== currTime; // 3. 같은 사람이지만 분 단위가 바뀜

          const showprofile =
            !prev || // 1. 이전 메시지 없음
            (prev && prev.sender.id !== msg.sender.id) || // 2. 다른 사람이 보냄
            prevTime !== currTime; // 3. 같은 사람이지만 분 단위가 바뀜

          return (
            <ChatBlock
              key={i}
              message={msg.message}
              isMe={msg.sender.id === senderInfo.id}
              nickname={showprofile ? msg.sender.nickname : null}
              imageUrl={showprofile ? msg.sender.imageurl : null}
              chattedAt={showTime ? msg.chattedAt : null}
            ></ChatBlock>
          );
        })}
      </div>

      {isChatHistoryInitialLoading && (
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
