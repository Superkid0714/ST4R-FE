import { useMutation } from '@tanstack/react-query';
import axios from 'axios';

// 회원 탈퇴 API
export const useDeleteMemberMutation = () => {
  return useMutation({
    mutationFn: async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('로그인이 필요합니다.');
      }

      console.log('회원 탈퇴 요청 시작');

      const response = await axios.delete(
        'https://eridanus.econo.mooo.com/members',
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );

      console.log('회원 탈퇴 성공:', response.status);
      return response.data;
    },
    onSuccess: () => {
      console.log('회원 탈퇴 성공, 토큰 및 사용자 정보 삭제');

      // 로컬스토리지에서 토큰과 사용자 정보 제거
      localStorage.removeItem('token');
      localStorage.removeItem('user');

      alert('회원 탈퇴가 완료되었습니다. 이용해 주셔서 감사합니다.');

      // 홈 화면으로 리다이렉트
      window.location.href = '/home';
    },
    onError: (error) => {
      console.error('회원 탈퇴 실패:', error);
      console.error('에러 상세:', {
        status: error.response?.status,
        statusText: error.response?.statusText,
        data: error.response?.data,
        message: error.message,
      });

      if (error.response?.status === 401) {
        alert('로그인이 필요합니다.');
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = '/login';
      } else if (error.response?.status === 400) {
        console.error('400 에러 상세 정보:', error.response?.data);
        const errorData = error.response?.data;
        const errorMessage = errorData?.message || '잘못된 요청입니다.';
        alert(`회원 탈퇴 요청이 거부되었습니다: ${errorMessage}`);
      } else if (error.response?.status === 403) {
        alert('회원 탈퇴 권한이 없습니다.');
      } else if (error.response?.status === 404) {
        alert('사용자를 찾을 수 없습니다.');
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = '/home';
      } else if (error.response?.status >= 500) {
        alert(
          '서버 오류로 회원 탈퇴에 실패했습니다. 잠시 후 다시 시도해주세요.'
        );
      } else if (error.message === '로그인이 필요합니다.') {
        alert(error.message);
        window.location.href = '/login';
      } else {
        alert('회원 탈퇴 중 오류가 발생했습니다. 다시 시도해주세요.');
      }
    },
  });
};

