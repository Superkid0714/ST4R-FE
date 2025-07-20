import camera from '../../assets/icons/camera.svg';
import BackButton from '../../components/common/BackButton';
import { useEffect, useState, useRef } from 'react';
import {
  DateSelector,
  TimeSelector,
  combine,
} from '../../components/DatePicker';
import Kakaomap from '../../components/common/Kakaomap';
import { usegroupEdit } from '../../api/group/groupEdit';
import uploadImagesToS3 from '../../api/imgupload';
import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

export default function GroupEditPage() {
  const { id } = useParams();
  const BASE_URL = 'http://eridanus.econo.mooo.com:8080';

  //수정 전 정보 가져오기
  const getGroupDetail = async (id) => {
    const res = await axios.get(`${BASE_URL}/groups/${id}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    });
    return res.data;
  };

  const {
    data: groupDetail,
    isLoading,
    isError,
  } = useQuery(['group', id], () => getGroupDetail(id), { enabled: !!id });

  const imageInputRef = useRef(''); //이미지 input 태그 연결
  const [images, setImages] = useState([]); // 새로 선택될 이미지 배열
  const [originalUrls, setOriginalUrls] = useState([]); // 기존 s3에 올라간 이미지 배열

  const [name, setName] = useState(''); // 제목

  const [selectedDate, setSelectedDate] = useState(''); //날짜
  const [selectedTime, setSelectedTime] = useState(''); //시간
  const [originalWhenToMeet, setOriginalWhenToMeet] = useState(''); //기존 일정
  const [newWhenToMeet, setNewWhenToMeet] = useState(null); // 새 일정
  const [changeWhenToMeet, setchangeWhenToMeet] = useState(false);

  const [maxParticipantCount, setMaxParticipantCount] = useState(''); //최대 인원 수

  const [newPassword, setNewPassword] = useState(null); //새 비밀번호
  const [changePassword, setChangePassword] = useState(false);

  const [description, setDescription] = useState(''); //본문

  const [lat, setLat] = useState(''); //위도
  const [lng, setLng] = useState(''); // 경도
  const [locationName, setLocationName] = useState(null); //장소명
  const [roadAddress, setRoadAddress] = useState(''); // 도로명주소(or 지번주소)

  // 원래 정보 설정
  useEffect(() => {
    if (groupDetail) {
      console.log(groupDetail);
      setName(groupDetail.name);
      const when = groupDetail.whenToMeet;
      const dt = new Date(
        Number(when.slice(0, 4)), // year
        Number(when.slice(5, 7)) - 1, // month
        Number(when.slice(8, 10)), // day
        Number(when.slice(11, 13)), // hour
        Number(when.slice(14, 16)) // minute
      );
      setSelectedDate(new Date(dt.getFullYear(), dt.getMonth(), dt.getDate()));
      setSelectedTime(new Date(2000, 0, 1, dt.getHours(), dt.getMinutes()));

      setOriginalWhenToMeet(groupDetail.whenToMeet);

      setMaxParticipantCount(groupDetail.maxParticipants);
      setDescription(groupDetail.description);
      setLat(groupDetail.location.marker.latitude);
      setLng(groupDetail.location.marker.longitude);
      setLocationName(groupDetail.location.marker.locationName);
      setRoadAddress(groupDetail.location.marker.roadAddress);
      setOriginalUrls(groupDetail.imageUrls);
    }
  }, [groupDetail]);

  useEffect(() => {
    setNewWhenToMeet(combine(selectedDate, selectedTime));
  }, [selectedDate, selectedTime]);

  useEffect(() => {
    setchangeWhenToMeet(
      originalWhenToMeet?.slice(0, 16) !== newWhenToMeet?.slice(0, 16)
        ? true
        : false
    );
  }, [newWhenToMeet]);

  //이번트 핸들러 함수들
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
          previewUrl: URL.createObjectURL(img), //임시 url생성(미리보기 메모리 생성)
        }));

        return [...prev, ...previews];
      }

      // 제한 안넘으면 모두 업로드
      const previews = newimages.map((img) => ({
        img,
        previewUrl: URL.createObjectURL(img), //임시 url생성(미리보기 메모리 생성)
      }));

      return [...prev, ...previews];
    });

    e.target.value = null; //입력 초기화(같은 사진 올릴수있게)
  };

  const handleOriginalUrlRemove = (idx) => {
    setOriginalUrls((prev) => {
      return prev.filter((_, i) => i !== idx);
    });
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

  const groupEditMutation = usegroupEdit();

  const handleEdit = async () => {
    if (!name) {
      alert('제목을 입력해주세요.');
      return;
    }
    if (name.length < 2) {
      alert('제목의 길이는 2자 이상이여야 합니다.');
    }
    if (!selectedDate || !selectedTime) {
      alert('일정을 선택해주세요.');
      return;
    }
    if (!maxParticipantCount) {
      alert('모임 인원을 입력해주세요.');
      return;
    }
    if (parseInt(maxParticipantCount, 10) > 30) {
      alert('최대 30명까지 입력 가능합니다.');
    }
    if (newPassword !== null && newPassword !== '') {
      if (0 < newPassword.length && newPassword.length < 4) {
        alert('비빌번호는 4자 이상이여야 합니다.');
      }
    }

    if (!lat || !lng || !roadAddress) {
      alert('지도에서 모임 위치를 선택해주세요.');
      return;
    }

    const newImageUrls = await uploadImagesToS3(images);
    const finalImageUrls = [...originalUrls, ...newImageUrls];

    if (originalWhenToMeet !== newWhenToMeet) {
      setchangeWhenToMeet(true);
    }

    groupEditMutation.mutate({
      data: {
        imageUrls: finalImageUrls,
        name: name,
        changeWhenToMeet: changeWhenToMeet,
        newWhenToMeet: newWhenToMeet,
        maxParticipantCount: maxParticipantCount,
        changePassword: changePassword,
        newPassword: newPassword,
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
      },
      id,
    });
  };

  if (isLoading)
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="w-8 h-8 border-2 border-yellow-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  if (isError || !groupDetail) return <p>에러 발생</p>;

  return (
    <div className="px-3 py-2 max-w-screen w-full">
      <div className="inline-flex justify-start items-center gap-3">
        <BackButton className="mt-2 hover:cursor-pointer" />
        <div className="text-[#8F8F8F] pt-1 text-2xl font-normal font-['Pretendard'] leading-loose">
          모임 수정하기
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
          {/* 기존 이미지 */}
          {originalUrls.map((url, idx) => (
            <div key={idx} className="relative">
              <img src={url} className="w-20 h-20 rounded-xl" />
              <button
                className="absolute top-[-8px] right-[-8px] text-[#000000] text-xs w-5 h-5 bg-[#8F8F8F] rounded-full flex items-center justify-center"
                onClick={() => {
                  handleOriginalUrlRemove(idx);
                }}
              >
                ✕
              </button>
            </div>
          ))}
          {/* 새로 선택된 이미지 */}
          {images.map((img, idx) => (
            <div key={idx} className="relative">
              <img src={img.previewUrl} className="w-20 h-20 rounded-xl" />
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
          <div className="text-lg font-['Pretendard']">모임 제목</div>
          <input
            type="text"
            placeholder="모임의 제목을 작성해보세요."
            value={name}
            minLength={2}
            maxLength={30}
            onChange={(e) => setName(e.target.value)}
            className="h-12 px-2 bg-[#1D1D1D] rounded-[10px] focus:outline-none text-sm placeholder:text-[#565656] font-['Pretendard']"
          />
        </div>
        {/* 모임 일정 칸 */}
        <div className="flex flex-col gap-2.5">
          <div className="text-lg font-['Pretendard']">모임 일정</div>
          <div className="flex gap-2">
            <div className="pl-3 flex-1 h-12 bg-[#1D1D1D] rounded-[10px]">
              <DateSelector
                selected={selectedDate}
                onChange={(date) => {
                  setSelectedDate(date);
                }}
              ></DateSelector>
            </div>
            <div className="pl-3 flex-1 h-12 bg-[#1D1D1D] rounded-[10px]">
              <TimeSelector
                selected={selectedTime}
                onChange={(time) => {
                  setSelectedTime(time);
                }}
                selectedDate={selectedDate}
              ></TimeSelector>
            </div>
          </div>
        </div>
        {/* 모임 인원/비밀번호 칸 */}
        <div className="flex flex-col gap-2.5">
          <div className="text-lg font-['Pretendard']">
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
            {changePassword ? (
              <div className="relative flex-1 h-12 bg-[#1D1D1D] rounded-[10px]">
                <div className="left-3 top-3.5 absolute justify-start text-sm font-['Pretendard']">
                  새 비밀번호:
                </div>
                <input
                  type="text"
                  className="w-52 h-12 pl-24 pr-3 bg-[#1D1D1D] rounded-[10px] focus:outline-none text-sm font-['Pretendard']"
                  value={newPassword}
                  maxLength={32}
                  onChange={(e) => {
                    if (e.target.value.length <= 32) {
                      //한국어는 자음+모음을 치는 중엔 한글자로 보기때문에 오류가능성ㅇ -> 한번더 검사
                      setNewPassword(e.target.value);
                    }
                  }}
                />
                <div
                  className="absolute right-3 top-3 hover:cursor-pointer"
                  onClick={() => {
                    setChangePassword(false);
                  }}
                >
                  ✕
                </div>
              </div>
            ) : (
              <label className="relative flex-1 h-12 bg-[#1D1D1D] rounded-[10px]">
                <input
                  type="checkbox"
                  className="w-5 h-12 ml-4"
                  checked={changePassword}
                  onChange={(e) => {
                    setChangePassword(e.target.checked);
                  }}
                />
                <div className="left-12 top-3.5 absolute justify-start text-sm font-['Pretendard']">
                  비밀번호 변경
                </div>
              </label>
            )}
          </div>
        </div>
        {/* 모임 위치 칸 */}
        <div className="flex flex-col gap-2.5">
          <div className="text-lg font-['Pretendard']">모임 위치</div>
          <Kakaomap
            onChange={handleMapChange}
            initialLat={lat}
            initialLng={lng}
            initialRoadAddress={roadAddress}
            initialMap={true}
          ></Kakaomap>
        </div>
        {/* 모임 설명 칸 */}
        <div className="flex flex-col gap-2.5">
          <div className="text-lg font-['Pretendard']">모임 설명</div>
          <textarea
            type="text"
            placeholder={`모임 설명에 들어갈 내용을 자유롭게 작성해주세요\n(1000자 이내까지 작성 가능)`}
            value={description}
            maxLength={1000} // 최대 1000자
            onChange={(e) => setDescription(e.target.value)}
            className="h-48 px-2 py-4 text-sm font-['Pretendard'] focus:outline-none bg-[#1D1D1D] rounded-[10px] placeholder:text-[#565656]"
          />
        </div>
        <div
          onClick={handleEdit}
          className="h-[60px] hover:cursor-pointer leading-[60px] font-['Pretendard'] text-center text-black text-lg font-bold bg-[#FFBB02] rounded-[10px]"
        >
          수정 완료
        </div>
      </div>
    </div>
  );
}
