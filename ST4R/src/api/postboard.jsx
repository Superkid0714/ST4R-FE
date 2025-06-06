import { useMutation } from '@tanstack/react-query';
import axios from 'axios';

export const useCreateBoardMutation = () => {
  return useMutation({
    mutationFn: async (data) => {
      const response = await axios.post(
        'http://eridanus.econo.mooo.com:8080/home/board',
        data,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );

      return response.data;
    },
    onSuccess: () => {
      alert('게시글 작성 완료');
      window.location.href = '/home';
    },
    onError: (error) => {
      console.error('게시글 작성 실패:', error);
      alert('게시글 작성에 실패했습니다. 다시 시도해주세요.');
    },
  });
};
