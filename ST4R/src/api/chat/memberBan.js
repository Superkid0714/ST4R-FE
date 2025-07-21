import { useQueryClient, useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

export const useMemberBan = (teamId) => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: async (userId) => {
      const res = await axios.delete(
        `https://eridanus.econo.mooo.com/groups/${teamId}/members/${userId}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey : ['members']});
      navigate(`/groups/${teamId}/members`);
    },
    onError: (error) => {
      console.error('요청 실패', error);
    },
  });
};
