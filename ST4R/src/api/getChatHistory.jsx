import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

export const useGetChatHistory = (id) => {
  return useQuery({
    queryKey: ['chatHistory'],
    queryFn: async () => {
      const res = await axios.get(
        `http://eridanus.econo.mooo.com:8080/groups/${id}/chats?sort=chattedAt`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );
      return res.data;
    },
    staleTime: 1000 * 60 * 2, // 2분간 캐시 유지
  });
};