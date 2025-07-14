import { useParams } from 'react-router-dom';
import { useGetChatHistory } from '../../api/getChatHistory';
import BackBotton from '../../components/common/BackButton';
import threelines from '../../assets/icons/threelines.svg';
import sendBotton from '../../assets/icons/send.svg'

export default function ChatPage() {
  const { id } = useParams();
  const {
    data: chatHistory,
    isLoading: isChatHistoryLoading,
    isError,
  } = useGetChatHistory(id);

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
