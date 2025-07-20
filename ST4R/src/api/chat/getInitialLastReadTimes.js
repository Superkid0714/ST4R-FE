import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

export const useGetInitialLastReadTimes = (id) => {
  return useQuery({
    queryKey: ['lastReadTimes'],
    queryFn: async () => {
      const res = await axios.get(
        `http://eridanus.econo.mooo.com:8080/groups/${id}/chats/lastReadTimes`,
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