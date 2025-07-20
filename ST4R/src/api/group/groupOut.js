import { useQueryClient, useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

export const usegroupOut = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: async (id) => {
      const res = await axios.delete(
        `http://eridanus.econo.mooo.com:8080/groups/${id}/members`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey : ['groups', 'mychats']});
      navigate('/groups');
    },
    onError: (error) => {
      console.error('요청 실패', error);
    },
  });
};
