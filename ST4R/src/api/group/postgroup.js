import { useQueryClient, useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

export const usePostGroupMutation = ({setGroupCreateSuccessModal}) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data) => {
      const res = await axios.post(
        'https://eridanus.econo.mooo.com/groups',
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
      queryClient.invalidateQueries({ queryKey: ['groups'] });
      queryClient.invalidateQueries({ queryKey: ['mychats'] });
      setGroupCreateSuccessModal(true);
    },
    onError: (error) => {
      console.error('요청 실패', error);
    },
  });
};

