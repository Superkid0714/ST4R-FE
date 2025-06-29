import axios from 'axios';

//Presignedurl 받기
const getPresignedUrl = async (img) => {
  console.log('요청할 파일명:', img.name);
  console.log('파일 타입:', img.type);

  const res = await axios.get(
    `http://eridanus.econo.mooo.com:8080/upload/s3/presigned-url?fileName=${encodeURIComponent(img.name)}`,
    {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    }
  );
  console.log('받은 Presigned URL:', res.data.presignedUrl);
  return res.data.presignedUrl;
};

//s3에 이미지 업로드
const uploadToPresignUrl = async (img, presignedUrl) => {
  console.log('업로드 시작 - 파일 타입:', img.type);
  console.log('업로드 URL:', presignedUrl);

  try {
    const response = await axios.put(presignedUrl, img, {
      headers: {
        'Content-Type': img.type,
        // axios가 자동으로 추가하는 헤더들을 제거하여 S3와의 호환성 향상
      },
      // 진행률 추적
      onUploadProgress: (progressEvent) => {
        const percentCompleted = Math.round(
          (progressEvent.loaded * 100) / progressEvent.total
        );
        console.log(`업로드 진행률: ${percentCompleted}%`);
      },
    });

    console.log('업로드 성공:', response.status);
    return response;
  } catch (error) {
    console.error('업로드 실패:', error);
    console.error('에러 상세:', error.response?.data);
    throw error;
  }
};

// 최종 이미지 배열 s3에 업로드
export default async function uploadImagesToS3(images) {
  const imageUrls = [];

  for (const image of images) {
    try {
      const img = image.img; // 실제 이미지 파일 객체

      // 파일 유효성 검사
      if (!img || !img.type || !img.name) {
        console.error('유효하지 않은 파일:', img);
        continue;
      }

      // 이미지 파일인지 확인
      if (!img.type.startsWith('image/')) {
        console.error('이미지 파일이 아님:', img.type);
        continue;
      }

      const presignedUrl = await getPresignedUrl(img);
      await uploadToPresignUrl(img, presignedUrl);

      // 쿼리 파라미터 제거하여 최종 URL 생성
      const finalUrl = presignedUrl.split('?')[0];
      imageUrls.push(finalUrl);

      console.log('최종 이미지 URL:', finalUrl);
    } catch (error) {
      console.error('이미지 업로드 실패:', error);
      // 개별 이미지 업로드 실패 시 전체를 중단할지 결정
      // throw error; // 전체 중단
      // 또는 계속 진행하고 실패한 이미지만 제외
    }
  }

  console.log('모든 이미지 업로드 완료:', imageUrls);
  return imageUrls;
}
