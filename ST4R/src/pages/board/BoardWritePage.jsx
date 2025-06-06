import { useState, useRef } from 'react';
import camera from '../../assets/icons/camera.svg';
import dropDown from '../../assets/icons/drop_down.svg';
import BackButton from '../../components/common/BackButton';
import uploadImagesToS3 from '../../api/imgupload';
import { usePostBoardMutation } from '../../api/postboard';
import Kakaomap from '../../components/common/Kakaomap';

export default function BoardWritePage() {
  const imageInputRef = useRef(null);

  // 상태 관리
  const [images, setImages] = useState([]);
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('GENERAL'); // 기본값: 자유글
  const [content, setContent] = useState('');
  const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);

  // 지도 관련 상태
  const [lat, setLat] = useState(null);
  const [lng, setLng] = useState(null);
  const [locationName, setLocationName] = useState(null);
  const [roadAddress, setRoadAddress] = useState(null);

  // 카테고리 옵션
  const categoryOptions = [
    { value: 'GENERAL', label: '자유글' },
    { value: 'SPOT', label: '스팟공유글' },
    { value: 'PROMOTION', label: '홍보글' },
  ];

  // 이미지 관련 핸들러
  const handleIconClick = () => {
    imageInputRef.current.click();
  };

  const handleImageChange = (e) => {
    const newImages = Array.from(e.target.files);

    setImages((prev) => {
      if (prev.length + newImages.length > 10) {
        alert('이미지는 최대 10장까지 업로드 가능합니다.');
        const allowedImages = newImages.slice(0, 10 - prev.length);
        const previews = allowedImages.map((img) => ({
          img,
          previewUrl: URL.createObjectURL(img),
        }));
        return [...prev, ...previews];
      }

      const previews = newImages.map((img) => ({
        img,
        previewUrl: URL.createObjectURL(img),
      }));
      return [...prev, ...previews];
    });

    e.target.value = null;
  };

  const handleImageRemove = (idx) => {
    setImages((prev) => {
      URL.revokeObjectURL(prev[idx].previewUrl);
      return prev.filter((_, i) => i !== idx);
    });
  };

  // 카테고리 선택 핸들러
  const handleCategorySelect = (categoryValue) => {
    setCategory(categoryValue);
    setShowCategoryDropdown(false);
  };

  // 지도 변경 핸들러
  const handleMapChange = ({ lat, lng, locationName, roadAddress }) => {
    setLat(lat);
    setLng(lng);
    setLocationName(locationName);
    setRoadAddress(roadAddress);
  };

  const postBoard = usePostBoardMutation();

  // 글 등록 핸들러
  const handleSubmit = async () => {
    // 유효성 검사
    if (!title.trim()) {
      alert('글 제목을 입력해주세요.');
      return;
    }

    if (title.trim().length < 2) {
      alert('제목은 2자 이상 입력해주세요.');
      return;
    }

    if (!content.trim()) {
      alert('글 내용을 입력해주세요.');
      return;
    }

    if (content.trim().length < 10) {
      alert('내용은 10자 이상 입력해주세요.');
      return;
    }

    try {
      // 이미지 업로드
      const imageUrls = images.length > 0 ? await uploadImagesToS3(images) : [];

      // 게시글 데이터 준비 및 API 호출
      const postData = {
        title: title.trim(),
        content: content.trim(),
        category: category,
        imageUrls: imageUrls,
      };

      // 위치 정보가 있으면 추가
      if (lat && lng && roadAddress) {
        postData.location = {
          marker: {
            latitude: lat,
            longitude: lng,
            locationName: locationName || '위치 정보 없음',
            roadAddress: roadAddress,
          },
          zoomLevel: 3,
        };
      }

      postBoard.mutate(postData);
    } catch (error) {
      console.error('이미지 업로드 실패:', error);
      alert('이미지 업로드에 실패했습니다. 다시 시도해주세요.');
    }
  };

  const getCurrentCategoryLabel = () => {
    return (
      categoryOptions.find((option) => option.value === category)?.label ||
      '자유글'
    );
  };

  return (
    <div className="px-3 py-2 max-w-screen w-full min-h-screen bg-black">
      {/* 헤더 */}
      <div className="inline-flex justify-start items-center gap-3 mb-8">
        <BackButton className="mt-2 hover:cursor-pointer" />
        <div className="text-[#8F8F8F] pt-1 text-2xl font-normal font-['Pretendard'] leading-loose">
          글 작성
        </div>
      </div>

      <div className="flex flex-col gap-8">
        {/* 이미지 업로드 섹션 */}
        <div className="flex gap-2 justify-start">
          <img
            src={camera}
            alt="사진"
            className="w-20 h-auto hover:cursor-pointer"
            onClick={handleIconClick}
          />
          <input
            type="file"
            accept="image/*"
            ref={imageInputRef}
            multiple
            hidden
            onChange={handleImageChange}
          />
          {images.map((img, idx) => (
            <div key={idx} className="relative">
              <img
                src={img.previewUrl}
                className="w-20 h-20 rounded-xl object-cover"
              />
              <button
                className="absolute top-[-8px] right-[-8px] text-[#000000] text-xs w-5 h-5 bg-[#8F8F8F] rounded-full flex items-center justify-center"
                onClick={() => handleImageRemove(idx)}
              >
                ✕
              </button>
            </div>
          ))}
        </div>

        {/* 글 제목 */}
        <div className="flex flex-col gap-2.5">
          <div className="text-lg font-['Pretendard'] text-white">글 제목</div>
          <input
            type="text"
            placeholder="제목을 작성해주세요"
            value={title}
            maxLength={100}
            onChange={(e) => setTitle(e.target.value)}
            className="h-12 px-3 bg-[#1D1D1D] rounded-[10px] focus:outline-none text-sm placeholder:text-[#565656] font-['Pretendard'] text-white"
          />
        </div>

        {/* 카테고리 선택 */}
        <div className="flex flex-col gap-2.5">
          <div className="text-lg font-['Pretendard'] text-white">카테고리</div>
          <div className="relative">
            <button
              onClick={() => setShowCategoryDropdown(!showCategoryDropdown)}
              className="w-full h-12 px-3 bg-[#1D1D1D] rounded-[10px] flex items-center justify-between text-sm font-['Pretendard'] text-white"
            >
              <span>{getCurrentCategoryLabel()}</span>
              <img
                src={dropDown}
                alt="dropdown"
                className={`w-6 h-6 transition-transform ${showCategoryDropdown ? 'rotate-180' : ''}`}
              />
            </button>

            {showCategoryDropdown && (
              <div className="absolute top-14 left-0 w-full bg-[#1D1D1D] border border-[#333] rounded-[10px] z-10 overflow-hidden">
                {categoryOptions.map((option) => (
                  <div
                    key={option.value}
                    onClick={() => handleCategorySelect(option.value)}
                    className="px-3 py-3 text-sm font-['Pretendard'] text-white hover:bg-[#2A2A2A] cursor-pointer"
                  >
                    {option.label}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* 위치 선택 (선택사항) */}
        <div className="flex flex-col gap-2.5">
          <div className="text-lg font-['Pretendard'] text-white">
            위치 선택 <span className="text-sm text-[#8F8F8F]">(선택사항)</span>
          </div>
          <Kakaomap onChange={handleMapChange} />
        </div>

        {/* 글 내용 */}
        <div className="flex flex-col gap-2.5">
          <div className="text-lg font-['Pretendard'] text-white">글 내용</div>
          <textarea
            placeholder={`자신의 경험이나 질문을 자유롭게 작성해주세요\n(5000자 이내까지 작성 가능)`}
            value={content}
            maxLength={5000}
            onChange={(e) => setContent(e.target.value)}
            className="h-64 px-3 py-4 text-sm font-['Pretendard'] focus:outline-none bg-[#1D1D1D] rounded-[10px] placeholder:text-[#565656] text-white resize-none"
          />
          <div className="text-right text-xs text-[#8F8F8F] font-['Pretendard']">
            {content.length}/5000
          </div>
        </div>

        {/* 등록 버튼 */}
        <button
          onClick={handleSubmit}
          disabled={postBoard.isLoading}
          className={`h-[60px] font-['Pretendard'] text-center text-black text-lg font-bold rounded-[10px] transition-colors ${
            postBoard.isLoading
              ? 'bg-[#999] cursor-not-allowed'
              : 'bg-[#FFBB02] hover:bg-[#E6A500] cursor-pointer'
          }`}
        >
          {postBoard.isLoading ? '등록 중...' : '글 등록하기'}
        </button>

        {/* 하단 여백 */}
        <div className="h-20"></div>
      </div>
    </div>
  );
}
