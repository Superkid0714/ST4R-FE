import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

export const useGetGroupDetail = (id) => {
  const BASE_URL = 'https://eridanus.econo.mooo.com';
  const token = localStorage.getItem('token');
  const headers = token ? { Authorization: `Bearer ${token}` } : {};
  return useQuery({
    queryKey: ['group', id],
    queryFn: async () => {
      const res = await axios.get(`${BASE_URL}/groups/${id}`, { headers });
      return res.data;
    },
    refetchInterval: 3000,
  });
};

