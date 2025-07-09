import { useQueryClient, useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

export const usegroupMutation = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: async (data) => {
      const res = await axios.post(
        'http://eridanus.econo.mooo.com:8080/groups',
        data,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );
      return res.data;
    },
    onSuccess: () => {
      alert('모임 만들기 완료');
      queryClient.invalidateQueries({ queryKey : ['groups']});
      navigate('/groups');
    },
    onError: (error) => {
      console.error('요청 실패', error);
    },
  });
};
