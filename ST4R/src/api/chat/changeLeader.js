import { useQueryClient, useMutation } from '@tanstack/react-query';
import axios from 'axios';

export const useChangeLeader = (teamId) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (userId) => {
      const res = await axios.patch(
        `https://eridanus.econo.mooo.com/groups/${teamId}/members/leader`,
        {
          targetMemberId: userId,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['members'] });
    },
    onError: (error) => {
      console.error('요청 실패', error);
    },
  });
};

