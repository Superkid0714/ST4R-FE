import SockJs from 'sockjs-client';
import Stomp from 'stompjs';
import { useEffect, useRef } from 'react';

export function connectChatPreview({ setChatPreviews }) {
  const clientRef = useRef(null);

  const stompDebugLogger = (str) => {
    console.log('[STOMP DEBUG]', str);
  };

  useEffect(() => {
    if (clientRef.current && clientRef.current.connected) {
      return;
    }
    //sockjs연결
    const socket = new SockJs(
      'https://eridanus.econo.mooo.com/websocket/connect',
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
        stompClient.subscribe(`/member/queue/previews`, (message) => {
          const newPreview = JSON.parse(message.body); //데이터 파싱

          setChatPreviews((prev) => {
            const index = prev.findIndex((p) => p.teamId === newPreview.teamId);
            const updated = [...prev];
            updated[index] = {
              ...updated[index],
              unreadCount: newPreview.unreadCount,
              recentMessage: newPreview.recentMessage,
            };
            return updated;
          });
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
  }, []);
}

