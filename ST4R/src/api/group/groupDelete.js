import { useQueryClient, useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

export const usegroupDelete = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: async (id) => {
      const res = await axios.delete(
        `https://eridanus.econo.mooo.com/groups/${id}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey : ['groups']});
      queryClient.invalidateQueries({ queryKey: ['mychats'] });
      navigate('/groups');
    },
    onError: (error) => {
      console.error('요청 실패', error);
    },
  });
};

