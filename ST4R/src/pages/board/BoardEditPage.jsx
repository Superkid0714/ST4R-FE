import { useState, useRef, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import camera from '../../assets/icons/camera.svg';
import dropDown from '../../assets/icons/drop_down.svg';
import BackButton from '../../components/common/BackButton';
import uploadImagesToS3 from '../../api/imgupload';
import Kakaomap from '../../components/common/Kakaomap';
import { useBoardDetail } from '../../api/boardDetail';
import { useMutation } from '@tanstack/react-query';
import axios from 'axios';

// 게시글 수정 API
const useUpdateBoardMutation = () => {
  return useMutation({
    mutationFn: async ({ id, data }) => {
      console.log('게시글 수정 요청:', data);

      // imageUrls 안전하게 처리
      let finalImageUrls = null;
      if (
        data.imageUrls &&
        Array.isArray(data.imageUrls) &&
        data.imageUrls.length > 0
      ) {
        finalImageUrls = data.imageUrls;
      }

      // 수정할 게시글 데이터 준비
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
        category: data.category, // 대문자 그대로 전송
      };

      console.log('백엔드로 전송할 수정 데이터:', transformedData);

      const response = await axios.put(
        `http://eridanus.econo.mooo.com:8080/home/boards/${id}`,
        transformedData,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
            'Content-Type': 'application/json',
          },
        }
      );

      return response.data;
    },
    onSuccess: (data, variables) => {
      console.log('게시글 수정 성공:', data);
      alert('게시글이 수정되었습니다.');
      window.location.href = `/boards/${variables.id}`;
    },
    onError: (error) => {
      console.error('게시글 수정 실패:', error);
      console.error('에러 상세:', {
        status: error.response?.status,
        statusText: error.response?.statusText,
        data: error.response?.data,
        message: error.message,
      });

      if (error.response?.status === 401) {
        alert('로그인이 필요합니다.');
        window.location.href = '/login';
      } else if (error.response?.status === 403) {
        alert('수정 권한이 없습니다.');
        window.location.href = `/boards/${variables.id}`;
      } else if (error.response?.status === 400) {
        alert('잘못된 데이터입니다. 모든 필드를 확인해주세요.');
      } else {
        alert('게시글 수정에 실패했습니다. 다시 시도해주세요.');
      }
    },
  });
};

export default function BoardEditPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const imageInputRef = useRef(null);

  // 상태 관리
  const [images, setImages] = useState([]);
  const [newImages, setNewImages] = useState([]); // 새로 추가된 이미지
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('GENERAL');
  const [content, setContent] = useState('');
  const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);

  // 지도 관련 상태
  const [lat, setLat] = useState(null);
  const [lng, setLng] = useState(null);
  const [locationName, setLocationName] = useState(null);
  const [roadAddress, setRoadAddress] = useState(null);

  // 기존 게시글 데이터 가져오기
  const {
    data: post,
    isLoading: isPostLoading,
    error: postError,
  } = useBoardDetail(id);
  const updateBoardMutation = useUpdateBoardMutation();

  // 게시글 데이터가 로드되면 폼에 채우기
  useEffect(() => {
    if (post) {
      setTitle(post.title || '');
      setCategory(post.category || 'GENERAL');
      setContent(post.content?.text || post.contentPreview || '');

      // 기존 이미지 설정
      if (post.imageUrls && post.imageUrls.length > 0) {
        const existingImages = post.imageUrls.map((url, index) => ({
          img: null, // 기존 이미지는 URL만 있음
          previewUrl: url,
          isExisting: true, // 기존 이미지 표시
          id: `existing-${index}`,
        }));
        setImages(existingImages);
      }

      // 위치 정보 설정
      if (post.content?.map) {
        const mapData = post.content.map;
        setLat(mapData.marker?.latitude || null);
        setLng(mapData.marker?.longitude || null);
        setLocationName(mapData.marker?.locationName || null);
        setRoadAddress(mapData.marker?.roadAddress || null);
      }
    }
  }, [post]);

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
    const newImageFiles = Array.from(e.target.files);
    const totalImages = images.length + newImageFiles.length;

    if (totalImages > 10) {
      alert('이미지는 최대 10장까지 업로드 가능합니다.');
      const allowedImages = newImageFiles.slice(0, 10 - images.length);
      const previews = allowedImages.map((img, index) => ({
        img,
        previewUrl: URL.createObjectURL(img),
        isExisting: false,
        id: `new-${Date.now()}-${index}`,
      }));
      setImages((prev) => [...prev, ...previews]);
      setNewImages((prev) => [...prev, ...allowedImages]);
    } else {
      const previews = newImageFiles.map((img, index) => ({
        img,
        previewUrl: URL.createObjectURL(img),
        isExisting: false,
        id: `new-${Date.now()}-${index}`,
      }));
      setImages((prev) => [...prev, ...previews]);
      setNewImages((prev) => [...prev, ...newImageFiles]);
    }

    e.target.value = null;
  };

  const handleImageRemove = (imageId) => {
    setImages((prev) => {
      const imageToRemove = prev.find((img) => img.id === imageId);

      // 메모리 해제 (새 이미지인 경우)
      if (imageToRemove && !imageToRemove.isExisting) {
        URL.revokeObjectURL(imageToRemove.previewUrl);
        // newImages에서도 제거
        setNewImages((prevNew) =>
          prevNew.filter((img) => img !== imageToRemove.img)
        );
      }

      return prev.filter((img) => img.id !== imageId);
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

  // 게시글 수정 제출
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
      // 새로 추가된 이미지만 업로드
      let newImageUrls = [];
      if (newImages && newImages.length > 0) {
        console.log('새 이미지 업로드 시작, 이미지 개수:', newImages.length);
        const newImagesForUpload = newImages.map((img) => ({ img }));
        const uploadedUrls = await uploadImagesToS3(newImagesForUpload);
        newImageUrls = uploadedUrls || [];
        console.log('새 이미지 업로드 완료:', newImageUrls);
      }

      // 기존 이미지 URL 수집
      const existingImageUrls = images
        .filter((img) => img.isExisting)
        .map((img) => img.previewUrl);

      // 전체 이미지 URL 배열 생성
      const allImageUrls = [...existingImageUrls, ...newImageUrls];
      const finalImageUrls = allImageUrls.length > 0 ? allImageUrls : null;

      // 수정할 게시글 데이터 준비
      const updateData = {
        title: title.trim(),
        content: content.trim(),
        category: category,
        imageUrls: finalImageUrls,
      };

      // 위치 정보가 있으면 추가
      if (lat && lng && roadAddress) {
        updateData.location = {
          marker: {
            latitude: lat,
            longitude: lng,
            locationName: locationName || '위치 정보 없음',
            roadAddress: roadAddress,
          },
          zoomLevel: 3,
        };
      }

      console.log('최종 수정 데이터:', updateData);
      updateBoardMutation.mutate({ id, data: updateData });
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

  // 로딩 상태
  if (isPostLoading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-yellow-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  // 에러 상태
  if (postError) {
    return (
      <div className="min-h-screen bg-black flex flex-col items-center justify-center px-4">
        <div className="text-center">
          <h2 className="text-xl font-bold text-white mb-2">
            게시글을 불러올 수 없습니다
          </h2>
          <p className="text-gray-400 mb-4">
            {postError?.response?.status === 404
              ? '존재하지 않는 게시글입니다.'
              : postError?.response?.status === 403
                ? '수정 권한이 없습니다.'
                : '잠시 후 다시 시도해주세요.'}
          </p>
          <button
            onClick={() => navigate(`/boards/${id}`)}
            className="bg-yellow-500 text-black px-6 py-2 rounded-lg font-medium hover:bg-yellow-400 transition-colors"
          >
            게시글로 돌아가기
          </button>
        </div>
      </div>
    );
  }

  if (!post) return null;

  return (
    <div className="px-3 py-2 max-w-screen w-full min-h-screen bg-black">
      {/* 헤더 */}
      <div className="inline-flex justify-start items-center gap-3 mb-8">
        <BackButton className="mt-2 hover:cursor-pointer" />
        <div className="text-[#8F8F8F] pt-1 text-2xl font-normal font-['Pretendard'] leading-loose">
          글 수정
        </div>
      </div>

      <div className="flex flex-col gap-8">
        {/* 이미지 업로드 섹션 */}
        <div className="flex gap-2 justify-start overflow-x-auto">
          <img
            src={camera}
            alt="사진"
            className="w-20 h-auto hover:cursor-pointer flex-shrink-0"
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
          {images.map((img) => (
            <div key={img.id} className="relative flex-shrink-0">
              <img
                src={img.previewUrl}
                className="w-20 h-20 rounded-xl object-cover"
                alt="미리보기"
              />
              {/* 기존 이미지 표시 */}
              {img.isExisting && (
                <div className="absolute top-0 left-0 bg-blue-500 text-white text-xs px-1 rounded-br-lg">
                  기존
                </div>
              )}
              <button
                className="absolute top-[-8px] right-[-8px] text-[#000000] text-xs w-5 h-5 bg-[#8F8F8F] rounded-full flex items-center justify-center hover:bg-red-500 transition-colors"
                onClick={() => handleImageRemove(img.id)}
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
          <Kakaomap
            onChange={handleMapChange}
            initialLocation={
              lat && lng
                ? {
                    lat,
                    lng,
                    locationName,
                    roadAddress,
                  }
                : null
            }
          />
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

        {/* 수정 버튼 */}
        <button
          onClick={handleSubmit}
          disabled={updateBoardMutation.isLoading}
          className={`h-[60px] font-['Pretendard'] text-center text-black text-lg font-bold rounded-[10px] transition-colors ${
            updateBoardMutation.isLoading
              ? 'bg-[#999] cursor-not-allowed'
              : 'bg-[#FFBB02] hover:bg-[#E6A500] cursor-pointer'
          }`}
        >
          {updateBoardMutation.isLoading ? '수정 중...' : '글 수정하기'}
        </button>

        {/* 하단 여백 */}
        <div className="h-20"></div>
      </div>
    </div>
  );
}
