import axios from 'axios';

//Presignedurl 받기
const getPresignedUrl = async (img) => {
  // console.log(img.name);
  const res = await axios.get(
    `http://eridanus.econo.mooo.com:8080/upload/s3/presigned-url?fileName=${img.name}`,
    {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    }
  );
  return res.data.presignedUrl;
};

//s3에 이미지 업로드
const uploadToPresignUrl = async (img, presignedUrl) => {
  await axios.put(presignedUrl, img, {
    headers: { 'Content-Type': img.type },
  });
};

// 최종 이미지 배열 s3에 업로드
export default async function uploadImagesToS3(images) {
  const imageUrls = [];

  for (const image of images) {
    const img = image.img; // 실제 이미지 파일 객체
    const presignedUrl = await getPresignedUrl(img);
    await uploadToPresignUrl(img, presignedUrl);
    imageUrls.push(presignedUrl.split('?')[0]); //백엔드에 보낼 최종 url
    console.log(imageUrls);
  }
  console.log(imageUrls);
  return imageUrls;
}
