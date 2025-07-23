import axios from 'axios';

// 파일명 정리 함수 추가
const sanitizeFileName = (fileName) => {
  // 한글 파일명을 영문으로 변환하거나 안전한 문자로 대체
  return fileName
    .replace(/\s+/g, '_') // 공백을 언더스코어로
    .replace(/[()]/g, '') // 괄호 제거
    .replace(/[^\w\-_.]/g, '') // 영문, 숫자, 하이픈, 언더스코어, 점만 허용
    .replace(/_{2,}/g, '_') // 연속된 언더스코어를 하나로
    .substring(0, 100); // 길이 제한
};

// 고유한 파일명 생성 함수
const generateUniqueFileName = (originalName) => {
  const timestamp = Date.now();
  const random = Math.random().toString(36).substring(2, 8);
  const extension = originalName.split('.').pop().toLowerCase();
  const baseName = originalName.split('.').slice(0, -1).join('.');
  const cleanBaseName = sanitizeFileName(baseName);

  return `${cleanBaseName}_${timestamp}_${random}.${extension}`;
};

//Presignedurl 받기
const getPresignedUrl = async (img) => {
  const token = localStorage.getItem('token');
  if (!token) {
    throw new Error('인증 토큰이 없습니다.');
  }

  // 원본 파일명 대신 정리된 파일명 사용
  const cleanFileName = generateUniqueFileName(img.name);

  console.log('원본 파일명:', img.name);
  console.log('정리된 파일명:', cleanFileName);
  console.log('파일 타입:', img.type);
  console.log('파일 크기:', (img.size / 1024 / 1024).toFixed(2), 'MB');

  try {
    // axios 인터셉터를 우회하여 직접 요청
    const res = await axios
      .create({
        baseURL: 'https://eridanus.econo.mooo.com',
        timeout: 15000,
      })
      .get(
        `/upload/s3/presigned-url?fileName=${encodeURIComponent(cleanFileName)}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
    console.log('받은 Presigned URL:', res.data.presignedUrl);
    return res.data.presignedUrl;
  } catch (error) {
    console.error('Presigned URL 요청 실패:', error);
    console.error('에러 응답:', error.response?.data);
    console.error('에러 상태:', error.response?.status);

    if (error.response?.status === 401) {
      throw new Error('인증이 만료되었습니다. 다시 로그인해주세요.');
    }

    throw error;
  }
};

//s3에 이미지 업로드
const uploadToPresignUrl = async (img, presignedUrl) => {
  console.log('업로드 시작 - 파일 타입:', img.type);
  console.log('업로드 URL:', presignedUrl);

  try {
    // S3에 직접 업로드할 때는 Authorization 헤더가 필요 없음
    // axios 인터셉터를 우회하여 직접 요청
    const response = await axios.create().put(presignedUrl, img, {
      headers: {
        'Content-Type': img.type,
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
    console.error('에러 상태:', error.response?.status);
    throw error;
  }
};

// 최종 이미지 배열 s3에 업로드
export default async function uploadImagesToS3(images) {
  if (!images || images.length === 0) {
    console.log('업로드할 이미지가 없습니다.');
    return [];
  }

  // 토큰 확인
  const token = localStorage.getItem('token');
  if (!token) {
    console.error('토큰이 없습니다. 로그인이 필요합니다.');
    throw new Error('로그인이 필요합니다.');
  }

  console.log('이미지 업로드 시작, 이미지 개수:', images.length);
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

      // 파일 크기 체크 (10MB 제한)
      if (img.size > 10 * 1024 * 1024) {
        console.error('파일 크기가 너무 큽니다 (10MB 초과):', img.size);
        alert(
          `파일 "${img.name}"의 크기가 너무 큽니다. 10MB 이하의 파일을 선택해주세요.`
        );
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
      console.error('파일명:', image.img?.name);

      // 인증 에러인 경우 전체 중단
      if (error.message?.includes('인증')) {
        throw error;
      }

      // 개별 이미지 업로드 실패는 전체를 중단하지 않고 계속 진행
      alert(
        `이미지 "${image.img?.name || '알 수 없음'}" 업로드에 실패했습니다.`
      );
    }
  }

  console.log('모든 이미지 업로드 완료:', imageUrls);
  return imageUrls;
}
