import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

export const useGetGroupDetail = (id) => {
  const BASE_URL = 'http://eridanus.econo.mooo.com:8080';
  const token = localStorage.getItem('token');
  const headers = token ? { Authorization: `Bearer ${token}` } : {};
  return useQuery({
    queryKey: ['group', id],
    queryFn: async () => {
      const res = await axios.get(`${BASE_URL}/groups/${id}`, { headers });
      return res.data;
    },
  });
};
