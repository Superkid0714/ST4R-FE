import { useParams, useNavigate } from 'react-router-dom';
import { getChatHistory } from '../../api/chat/getChatHistory';
import BackButton from '../../components/common/BackButton';
import threelines from '../../assets/icons/threelines.svg';
import sendBotton from '../../assets/icons/send.svg';
import { useEffect, useRef, useState } from 'react';
import { useGetGroupDetail } from '../../api/group/getGroupDetail';
import SockJs from 'sockjs-client';
import Stomp from 'stompjs';
import ChatBlock from '../../components/ChatBlock';
import { useGetGroupMembers } from '../../api/chat/getGroupMembers';
import { useGetInitialLastReadTimes } from '../../api/chat/getInitialLastReadTimes';
import { useInfiniteQuery, useQueryClient } from '@tanstack/react-query';

export default function ChatPage() {
  const { id } = useParams();
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const clientRef = useRef(null);
  const messageListRef = useRef(null);
  const [input, setInput] = useState(''); // 보내는 메세지 내용
  const [lastReadTimes, setLastReadTimes] = useState([]);

  // 모임 상세 정보
  const {
    data: groupDetail,
  } = useGetGroupDetail(id);

  console.log(groupDetail);

  // 모임 구성원 정보
  const { data: members } = useGetGroupMembers(id);
  
 useEffect(() => {
  if (groupDetail && groupDetail.banned) {
    alert('해당 모임에서 강퇴당하셨습니다.');
    navigate('/groups');
  }
}, [groupDetail, navigate]);


  // 모임 구성원의 가장 최근에 읽은 시간(최초 요청)
  const { data: initialLastReadTimes } = useGetInitialLastReadTimes(id);
  console.log(initialLastReadTimes);

  useEffect(() => {
    if (initialLastReadTimes) {
      setLastReadTimes(initialLastReadTimes); // 초기 읽은시간 설정
    }
  }, [initialLastReadTimes]);

  const {
    data, //무한 스크롤로 불러온 전체 데이터
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage, // 다음 페이지를 불러오는 중인지 여부
    isLoading: isChatHistoryInitialLoading,
    isError,
  } = useInfiniteQuery({
    queryKey: ['chatHistory', id],
    queryFn: ({ pageParam = 0 }) => getChatHistory(id, pageParam),
    getNextPageParam: (page) => {
      return page.last ? undefined : page.number + 1;
    },
  });

  const messagelist = data?.pages
    ? [...data.pages].flatMap((page) => page.content).reverse() // 오래된순-> 최신순으로 뒤집기
    : [];

  const stompDebugLogger = (str) => {
    console.log('[STOMP DEBUG]', str);
  };

  // 키보드 이벤트 핸들러
  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      sendMessage();
    }
  };

  //스크롤 내리기
  const scrollToBottom = () => {
    if (messageListRef.current) {
      messageListRef.current.scrollTop = messageListRef.current.scrollHeight;
    }
  };

  //새로운 메세지가 오면 스크롤 아래로
  useEffect(() => {
    scrollToBottom();
  }, [messagelist]);

  // 스크롤 컨테이너의 맨 위에 놓을 빈 div
  const observerTarget = useRef(null);

  useEffect(() => {
    if (!observerTarget.current || !messageListRef.current) return;

    const currentObserverTarget = observerTarget.current;
    const currentMessageListRef = messageListRef.current;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasNextPage && !isFetchingNextPage) {
          //스크롤이 최상단에 닿음
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
          // markAsRead(); //읽음 요청
          const data = JSON.parse(message.body);
          handleIncomingMessage(data); //받은 데이터 처리 함수
        });
        markAsRead();
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

  // 웹소켓으로 메세지를 받았을 경우
  const handleIncomingMessage = (receivedData) => {
    if (receivedData.messageType === 'general') {
      // 메세지 type이 general일때: useInfiniteQuery의 캐시 데이터에 추가
      markAsRead();
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
            content: [newMessage, ...updatedPages[lastPageIndex].content],
          };
        }

        return {
          ...oldData,
          pages: updatedPages,
        };
      });
    }
    if (receivedData.messageType === 'updateReadTime') {
      //메세지 type이 updateReadTime일때: 읽은 시간 생신
      const newMessage = receivedData.message;
      setLastReadTimes((prev) => {
        const index = prev.findIndex(
          (p) => p.memberId === newMessage.updateMemberId
        );
        const updated = [...prev];
        updated[index] = {
          ...updated[index],
          readTime: newMessage.updateReadTime,
        };
        return updated;
      });
    }
  };

  //읽음 상태 전송
  function markAsRead() {
    if (!clientRef.current) {
      console.warn('❗ STOMP 클라이언트가 아직 연결되지 않았습니다.');
      return;
    }
    clientRef.current.send(`/markAsRead/${id}`, {}, '');
  }

  //안읽은 사람 수 계산
  function calculateUnreadCount(chattedAt, lastReadTimes) {
    const messageTime = new Date(chattedAt).getTime();

    return lastReadTimes.reduce((count, { readTime }) => {
      const readTimestamp = readTime ? new Date(readTime).getTime() : 0;
      return messageTime > readTimestamp ? count + 1 : count;
    }, 0);
  }

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

  return (
    <div className="h-screen flex flex-col">
      {/* 상단바 */}
      <div className="flex mb-2">
        <BackButton className="ml-2 mt-2" />
        <div className="mx-auto mt-3 text-2xl text-[#8F8F8F] font-['Pretendard']">
          {groupDetail?.name}
        </div>
        <img
          className="mr-4 mt-2 w-12 h-12 hover:cursor-pointer "
          src={threelines}
          onClick={() => {
            navigate(`/groups/${id}/members`);
          }}
        />
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
          const senderInfo = members && members.find((m) => m.isMe == true); // 보낸사람 정보
          const prev = messagelist[i - 1];
          const next = messagelist[i + 1];

          const getTimeString = (date) => {
            const d = new Date(date);
            return `${d.getFullYear()}-${d.getMonth()}-${d.getDate()} ${d.getHours()}:${d.getMinutes()}`;
          };

          const getDateString = (date) => {
            const d = new Date(date);
            return `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()} `;
          };

          const prevTime = prev ? getTimeString(prev.chattedAt) : null;
          const currTime = getTimeString(msg.chattedAt);
          const nextTime = next ? getTimeString(next.chattedAt) : null;

          const prevDate = prev ? getDateString(prev.chattedAt) : null;
          const currDate = getDateString(msg.chattedAt);

          const showTime =
            !next || // 1. 이후 메시지 없음
            (next && next.sender.id !== msg.sender.id) || // 2. 다른 사람이 보냄
            nextTime !== currTime; // 3. 같은 사람이지만 분 단위가 바뀜

          const showprofile =
            !prev || // 1. 이전 메시지 없음
            (prev && prev.sender.id !== msg.sender.id) || // 2. 다른 사람이 보냄
            prevTime !== currTime; // 3. 같은 사람이지만 분 단위가 바뀜

          const showDate = prevDate !== currDate ? true : null;

          const unreadCount = calculateUnreadCount(
            msg.chattedAt,
            lastReadTimes
          );
          return (
            <ChatBlock
              key={i}
              message={msg.message}
              isMe={msg.sender?.id === senderInfo?.id}
              nickname={showprofile ? msg.sender.nickname : null}
              imageUrl={showprofile ? msg.sender.imageurl : null}
              chattedAt={showTime ? msg.chattedAt : null}
              date={showDate ? currDate : null}
              unreadCount={unreadCount === 0 ? 'ㅤ' : unreadCount}
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
          onKeyDown={handleKeyDown}
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
