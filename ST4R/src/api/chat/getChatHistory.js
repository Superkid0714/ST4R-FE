import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

export const getChatHistory = async (id, page) => {
  const res = await axios.get(`https://eridanus.econo.mooo.com/groups/${id}/chats?page=${page}&size=30&sort=chattedAt&direction=desc`, {
    headers: {
      'Authorization': `Bearer ${localStorage.getItem('token')}`
    }
  });

  return res.data; 
};

