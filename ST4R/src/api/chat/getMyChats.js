import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

export const useGetMyChats = () => {
  return useQuery({
    queryKey: ['mychats'],
    queryFn: async () => {
      const res = await axios.get(
        'http://eridanus.econo.mooo.com:8080/groups/my',
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );
      return res.data;
    },
  });
};

export const useGetInitialChatPreviews = () => {
  return useQuery({
    queryKey: ['initialChatPreviews'],
    queryFn: async () => {
      const res = await axios.get(
        'http://eridanus.econo.mooo.com:8080/groups/chats/preview',
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );
      return res.data;
    },
  });
};

