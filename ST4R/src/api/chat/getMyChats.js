import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

export const useGetMyChats = () => {
  return useQuery({
    queryKey: ['mychats'],
    queryFn: async () => {
      const res = await axios.get(
        'https://eridanus.econo.mooo.com/groups/my',
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );
      return res.data;
    },
    refetchInterval: 3000, //자동 갱신
  });
};

export const useGetInitialChatPreviews = () => {
  return useQuery({
    queryKey: ['initialChatPreviews'],
    queryFn: async () => {
      const res = await axios.get(
        'https://eridanus.econo.mooo.com/groups/chats/preview',
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );
      return res.data;
    },
    refetchInterval: 3000, 
  });
};


