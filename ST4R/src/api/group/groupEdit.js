import { useQueryClient, useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

export const usegroupEdit = ({setGroupEditSuccessModal}) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ data, id }) => {
      const res = await axios.put(
        `https://eridanus.econo.mooo.com/groups/${id}`,
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
      setGroupEditSuccessModal(true);
    },
    onError: (error) => {
      console.error('요청 실패', error);
    },
  });
};

