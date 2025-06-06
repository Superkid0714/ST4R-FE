import camera from '../../assets/icons/camera.svg';
import BackButton from '../../components/common/BackButton';
import { useState, useRef } from 'react';
import {
  DateSelector,
  TimeSelector,
  combine,
} from '../../components/DatePicker';
import Kakaomap from '../../components/common/Kakaomap';
import { usePostgroupMutation } from '../../api/postgroup';
import uploadImagesToS3 from '../../api/imgupload';

export default function GroupWritePage() {
  const imageInputRef = useRef(null); //이미지 input 태그 연결
  const [images, setImages] = useState([]); // 이미지 배열

  const [name, setName] = useState(''); // 제목

  const [selectedDate, setSelectedDate] = useState(null); //날짜
  const [selectedTime, setSelectedTime] = useState(null); //시간
  const whenToMeet = combine(selectedDate, selectedTime); //ISO 8601 형식 + KST 시간대 오프셋(+09:00) / ex) 2025-05-16T15:56:00+09:00

  const [maxParticipantCount, setMaxParticipantCount] = useState(''); //최대 인원 수

  const [password, setPassword] = useState(''); //비밀번호

  const [description, setDescription] = useState(''); //본문

  const [lat, setLat] = useState(null); //위도
  const [lng, setLng] = useState(null); // 경도
  const [locationName, setLocationName] = useState('장소명 미지정'); //장소명
  const [roadAddress, setRoadAddress] = useState(null); // 도로명주소(or 지번주소)

  //이벤트 핸들러 함수들
  const handleIconClick = () => {
    imageInputRef.current.click(); //숨겨진 input 클릭
  };

  const handleImageChange = (e) => {
    const newimages = Array.from(e.target.files); //새로 선택된 이미지들

    setImages((prev) => {
      if (prev.length + newimages.length > 10) {
        alert('이미지는 최대 10장까지 업로드 가능합니다.');

        //초과된 건 제외하고 업로드
        const allowimgs = newimages.slice(0, 10 - prev.length);
        const previews = allowimgs.map((img) => ({
          img,
          previewUrl: URL.createObjectURL(img), //임시 url생성(미리보기 메로리 생성)
        }));

        return [...prev, ...previews];
      }

      // 제한 안넘으면 모두 업로드
      const previews = newimages.map((img) => ({
        img,
        previewUrl: URL.createObjectURL(img), //임시 url생성(미리보기 메로리 생성)
      }));

      return [...prev, ...previews];
    });

    e.target.value = null; //입력 초기화(같은 사진 올릴수있게)
  };

  const handleImageRemove = (idx) => {
    setImages((prev) => {
      URL.revokeObjectURL(prev[idx].previewUrl); //메모리 해제
      return prev.filter((_, i) => i !== idx); //특정 idx 이미지만 삭제 후 새배열 만들어서 저장
    });
  };

  const handleMapChange = ({ lat, lng, locationName, roadAddress }) => {
    setLat(lat);
    setLng(lng);
    setLocationName(locationName);
    setRoadAddress(roadAddress);
  };

  const postgroup = usePostgroupMutation();

  const handlepost = async () => {
    if (!name.trim()) {
      alert('제목을 입력해주세요.');
      return;
    }
    if (name.trim().length < 2) {
      alert('제목의 길이는 2자 이상이여야 합니다.');
      return;
    }
    if (!selectedDate || !selectedTime) {
      alert('일정을 선택해주세요.');
      return;
    }
    if (!maxParticipantCount.trim()) {
      alert('모임 인원을 입력해주세요.');
      return;
    }
    if (parseInt(maxParticipantCount, 10) > 30) {
      alert('최대 30명까지 입력 가능합니다.');
      return;
    }
    if (password.trim() !== '' && password.trim().length < 4) {
      alert('비밀번호는 4자 이상이여야 합니다.');
      return;
    }

    if (!lat || !lng || !roadAddress) {
      alert('지도에서 모임 위치를 선택해주세요.');
      return;
    }

    const imageUrls = await uploadImagesToS3(images);
    console.log(imageUrls);

    postgroup.mutate({
      imageUrls: imageUrls,
      name: name,
      whenToMeet: whenToMeet,
      maxParticipantCount: maxParticipantCount,
      password: password,
      description: description,
      location: {
        marker: {
          latitude: lat,
          longitude: lng,
          locationName: locationName,
          roadAddress: roadAddress,
        },
        zoomLevel: 3,
      },
    });
  };

  return (
    <div className="px-3 py-2 max-w-screen w-full min-h-screen bg-black">
      <div className="inline-flex justify-start items-center gap-3">
        <BackButton className="mt-2 hover:cursor-pointer" />
        <div className="text-[#8F8F8F] pt-1 text-2xl font-normal font-['Pretendard'] leading-loose">
          모임 만들기
        </div>
      </div>

      <div className="flex flex-col gap-8 ">
        <div></div>
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
                onClick={() => {
                  handleImageRemove(idx);
                }}
              >
                ✕
              </button>
            </div>
          ))}
        </div>

        {/* 모임 제목 칸 */}
        <div className="flex flex-col gap-2.5">
          <div className="text-lg font-['Pretendard'] text-white">
            모임 제목
          </div>
          <input
            type="text"
            placeholder="모임의 제목을 작성해보세요."
            value={name}
            minLength={2}
            maxLength={30}
            onChange={(e) => setName(e.target.value)}
            className="h-12 px-2 bg-[#1D1D1D] rounded-[10px] focus:outline-none text-sm placeholder:text-[#565656] font-['Pretendard'] text-white"
          />
        </div>

        {/* 모임 일정 칸 */}
        <div className="flex flex-col gap-2.5">
          <div className="text-lg font-['Pretendard'] text-white">
            모임 일정
          </div>
          <div className="flex gap-2">
            <div className="pl-3 flex-1 h-12 bg-[#1D1D1D] rounded-[10px]">
              <DateSelector
                selected={selectedDate}
                onChange={(date) => {
                  setSelectedDate(date);
                }}
              />
            </div>
            <div className="pl-3 flex-1 h-12 bg-[#1D1D1D] rounded-[10px]">
              <TimeSelector
                selected={selectedTime}
                onChange={(time) => {
                  setSelectedTime(time);
                }}
                selectedDate={selectedDate}
              />
            </div>
          </div>
        </div>

        {/* 모임 인원/비밀번호 칸 */}
        <div className="flex flex-col gap-2.5">
          <div className="text-lg font-['Pretendard'] text-white">
            모임 인원 / 입장 비밀번호
          </div>
          <div className="flex gap-2">
            <div className="relative flex-1 h-12 bg-[#1D1D1D] rounded-[10px]">
              <div className="left-3 top-3.5 absolute justify-start text-sm font-['Pretendard']">
                최대:
              </div>
              <input
                type="text"
                className="w-full h-12 pl-12 pr-3 bg-[#1D1D1D] rounded-[10px] focus:outline-none text-sm font-['Pretendard']"
                value={maxParticipantCount}
                minLength={1}
                maxLength={2} //2자리수까지
                onChange={(e) => {
                  //숫자만 입력 가능
                  if (/^\d*$/.test(e.target.value)) {
                    setMaxParticipantCount(e.target.value);
                  }
                }}
              />
            </div>
            <div className="relative flex-1 h-12 bg-[#1D1D1D] rounded-[10px]">
              <div className="left-3 top-3.5 absolute justify-start text-sm font-['Pretendard']">
                PW:
              </div>
              <input
                type="text"
                className="w-full h-12 pl-12 pr-3 bg-[#1D1D1D] rounded-[10px] focus:outline-none text-sm font-['Pretendard']"
                value={password}
                maxLength={32}
                onChange={(e) => {
                  if (e.target.value.length <= 32) {
                    //한국어는 자음+모음을 치는 중엔 한글자로 보기때문에 오류가능성ㅇ -> 한번더 검사
                    setPassword(e.target.value);
                  }
                }}
              />
            </div>
          </div>
        </div>

        {/* 모임 위치 칸 */}
        <div className="flex flex-col gap-2.5">
          <div className="text-lg font-['Pretendard'] text-white">
            모임 위치
          </div>
          <Kakaomap onChange={handleMapChange} />
        </div>

        {/* 모임 설명 칸 */}
        <div className="flex flex-col gap-2.5">
          <div className="text-lg font-['Pretendard'] text-white">
            모임 설명
          </div>
          <textarea
            placeholder={`모임 설명에 들어갈 내용을 자유롭게 작성해주세요\n(1000자 이내까지 작성 가능)`}
            value={description}
            maxLength={1000} // 최대 1000자
            onChange={(e) => setDescription(e.target.value)}
            className="h-48 px-2 py-4 text-sm font-['Pretendard'] focus:outline-none bg-[#1D1D1D] rounded-[10px] placeholder:text-[#565656] text-white resize-none"
          />
          <div className="text-right text-xs text-[#8F8F8F] font-['Pretendard']">
            {description.length}/1000
          </div>
        </div>

        <div
          onClick={handlepost}
          className="h-[60px] hover:cursor-pointer leading-[60px] font-['Pretendard'] text-center text-black text-lg font-bold bg-[#FFBB02] rounded-[10px]"
        >
          모임 등록하기
        </div>
      </div>
    </div>
  );
}
