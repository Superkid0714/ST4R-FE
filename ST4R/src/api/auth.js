import { useMutation } from '@tanstack/react-query';
import axios from 'axios';

export const useLogoutMutation = () => {
  return useMutation({
    mutationFn: async () => {
      const res = await axios.post(
        'https://eridanus.econo.mooo.com/oauth/kakao/logout',
        {},
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );
      return res.data;
    },
    onSuccess: () => {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/home';
    },
    onError: (error) => {
      console.error('로그아웃 실패', error);
      // 에러가 발생해도 로컬 데이터는 삭제하고 홈으로 이동
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/home';
    },
  });
};

