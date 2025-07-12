import { useMutation } from '@tanstack/react-query';
import axios from 'axios';

// 게시글 작성
export const useCreateBoardMutation = () => {
  return useMutation({
    mutationFn: async (data) => {
      console.log('받은 프론트엔드 데이터:', data);

      // imageUrls 안전하게 처리
      let finalImageUrls = null;
      if (
        data.imageUrls &&
        Array.isArray(data.imageUrls) &&
        data.imageUrls.length > 0
      ) {
        finalImageUrls = data.imageUrls;
      }

      console.log('처리된 이미지 URLs:', finalImageUrls);

      // 프론트엔드 데이터
      const transformedData = {
        title: data.title,
        imageUrls: finalImageUrls,
        content: {
          text: data.content,
          map: data.location
            ? {
                marker: {
                  latitude: data.location.marker.latitude,
                  longitude: data.location.marker.longitude,
                  locationName: data.location.marker.locationName,
                  roadAddress: data.location.marker.roadAddress,
                },
                zoomLevel: data.location.zoomLevel || 13,
              }
            : null,
        },
        category: data.category ? data.category.toLowerCase() : 'general',
      };

      console.log('백엔드로 전송할 데이터:', transformedData);

      const response = await axios.post(
        'http://eridanus.econo.mooo.com:8080/home/boards',
        transformedData,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
            'Content-Type': 'application/json',
          },
        }
      );

      console.log('서버 응답:', response.data);
      return response.data;
    },
    onSuccess: (data) => {
      console.log('게시글 작성 성공:', data);
      alert('게시글 작성 완료');
      window.location.href = '/home';
    },
    onError: (error) => {
      console.error('게시글 작성 실패:', error);
      console.error('에러 상세:', {
        status: error.response?.status,
        statusText: error.response?.statusText,
        data: error.response?.data,
        message: error.message,
      });

      if (error.response?.status === 401) {
        alert('로그인이 필요합니다.');
        window.location.href = '/login';
      } else if (error.response?.status === 400) {
        alert('잘못된 데이터입니다. 모든 필드를 확인해주세요.');
      } else if (error.message.includes('imageUrls')) {
        alert('이미지 처리 중 오류가 발생했습니다.');
      } else {
        alert('게시글 작성에 실패했습니다. 다시 시도해주세요.');
      }
    },
  });
};

export const usePostBoardMutation = useCreateBoardMutation;

// 로그아웃 (기존과 동일)
export const useLogoutMutation = () => {
  return useMutation({
    mutationFn: async () => {
      const res = await axios.post(
        'http://eridanus.econo.mooo.com:8080/oauth/kakao/logout',
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
      window.location.href = '/login';
    },
    onError: (error) => {
      console.error('로그아웃 실패', error);
    },
  });
};
