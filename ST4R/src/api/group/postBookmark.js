import { useQueryClient, useMutation } from '@tanstack/react-query';
import axios from 'axios';

export const useBookmarkMutation = () => {
  const BASE_URL = 'https://eridanus.econo.mooo.com';
  const config = {
    headers: {
      Authorization: `Bearer ${localStorage.getItem('token')}`,
    },
  };
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, liked }) => {
      if (liked) {
        //찜 취소
        const res = await axios.delete(
          `${BASE_URL}/groups/${id}/likes`,
          config
        );
        return res.data;
      } else {
        //찜 요청
        const res = await axios.post(
          `${BASE_URL}/groups/${id}/likes`,
          null,
          config
        );
        return res.data;
      }
    },
    onMutate: async ({ id, liked }) => { // onmutate -> 서버에 mutate요청 보내기 전에 실행
      await queryClient.cancelQueries(['group',id]); //1. 기존 쿼리 삭제

      const previous = queryClient.getQueryData(['group',id]); // 2. 원래 데이터 저장
      
      queryClient.setQueryData(['group', id], (old) => {
        if (!old) return old;
        //새로운 쿼리 등록( 낙관적 업데이트 )
        return {
          ...old,
          liked : !liked,
        };
      });
      return { previous };
    },
    onSettled: (data, error, variables) => { //성공이든 실패든 항상 실행
      queryClient.invalidateQueries({ queryKey: ['group', variables.id] }); //
    },
    onError: (error, variables, context) => { //3번째 요소가 롤백
      if (context?.previous) {
        queryClient.setQueryData(['group', variables.id], context.previous); //실패하면 롤백
      }
      console.error('요청 실패', error);
    },
  });
};

