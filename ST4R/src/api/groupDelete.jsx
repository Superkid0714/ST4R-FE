import { useQueryClient, useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

export const usegroupDelete = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: async (id) => {
      const res = await axios.delete(
        `http://eridanus.econo.mooo.com:8080/groups/${id}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );
      return res.data;
    },
    onSuccess: () => {
      alert('모임 삭제 완료');
      queryClient.invalidateQueries({ queryKey : ['groups']});
      navigate('/groups');
    },
    onError: (error) => {
      console.error('요청 실패', error);
    },
  });
};
