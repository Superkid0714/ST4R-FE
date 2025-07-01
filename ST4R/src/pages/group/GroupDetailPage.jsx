import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation } from '@tanstack/react-query';
import axios from 'axios';
import BackButton from '../../components/common/BackButton';
import { useEffect, useState } from 'react';
import JoinModal from '../../components/JoinModal';
import Carousel from '../../components/common/Carousel';
import { usegroupDelete } from '../../api/groupDelete';

export default function GroupDetailPage() {
  const BASE_URL = 'http://eridanus.econo.mooo.com:8080';
  const { id } = useParams();
  const navigate = useNavigate();

  //모임상세정보 가져오기
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

  console.log(groupDetail);

  //참가 모달창 띄우기
  const [modal, setModal] = useState(false);

  //카카오 지도 띄우기
  useEffect(() => {
    const kakao = window.kakao;

    if (!kakao || !kakao.maps) return;
    if (!groupDetail?.location?.marker) return;

    const container = document.getElementById('map'); //지도를 띄울 요소 찾아오기
    const lat = groupDetail.location.marker.latitude;
    const lng = groupDetail.location.marker.longitude;

    const options = {
      center: new kakao.maps.LatLng(lat, lng),
      level: 3,
    };
    const map = new kakao.maps.Map(container, options); //지도 객체 생성

    const marcker = new kakao.maps.Marker({
      map: map,
      position: new kakao.maps.LatLng(lat, lng),
    });
  }, [groupDetail]);

  //글 삭제하기
  const handleDelete = usegroupDelete();

  //예외처리
  if (isLoading) return <p>로딩 중...</p>;
  if (isError || !groupDetail) return <p>에러 발생</p>;

  //표시할 정보들
  const year = groupDetail.whenToMeet.slice(0, 4);
  const month = groupDetail.whenToMeet.slice(5, 7);
  const day = groupDetail.whenToMeet.slice(8, 10);
  const time = groupDetail.whenToMeet.slice(11, 16);
  const nickname = groupDetail.author.nickname.split('@')[0];

  return (
    <div className="flex flex-col gap-3">
      {/* 사진 영역 */}
      <div className="relative">
        <BackButton className="absolute ml-2 mt-2 z-10 hover:cursor-pointer"></BackButton>
        <Carousel imageUrls={groupDetail.imageUrls}></Carousel>
      </div>

      <div className="p-2 flex flex-col gap-10">
        {/* 타이틀 영역 */}
        <div>
          <div className="text-sm text-[#8F8F8F] font-['Pretendard'] ">
            {year}/{month}/{day}, {time}, 최대 {groupDetail.maxParticipants}명
          </div>
          <div className="text-xl font-medium font-['Pretendard']">
            {groupDetail.name}
          </div>
        </div>

        {/* 본문 영역 */}
        <div className="text-sm font-['Pretendard'] font-light ">
          {groupDetail.description}
        </div>

        {/* 프로필 영역 */}
        <div className="relative text-sm text-[#8F8F8F] font-['Pretendard']">
          작성자: {nickname}{' '}
          <span className="absolute right-3">오리온자리</span>
          <div className="mt-4 h-[1.5px] bg-[#565656]"></div>
        </div>

        {/* 지도 영역 */}
        <div>
          <div className="text-xl font-medium font-['Pretendard']">위치</div>
          <div
            id="map"
            style={{ height: '200px', borderRadius: '10px', margin: '8px 0' }}
          ></div>
          <div className="flex flex-col gap-0.5 p-3 2 bg-[#1D1D1D] rounded-[10px] justify-start">
            <div className="flex-1 font-light text-sm font-['Pretendard']">
              📍 {groupDetail.location.marker.locationName}
            </div>
            <div className="flex-1 font-light text-sm font-['Pretendard']">
              🗺️ {groupDetail.location.marker.roadAddress}
            </div>
          </div>
        </div>

        {groupDetail.isViewerAuthor ? (
          <div className="flex gap-2 h-[60px] leading-[60px] font-['Pretendard'] text-black text-lg font-bold">
            <div
              onClick={()=> navigate(`/groups/edit/${id}`)}
              className="flex-1 text-center hover:cursor-pointer bg-[#FFBB02] rounded-[10px]  "
            >
              수정하기
            </div>
            <div
              onClick={() => {
                if (confirm('정말 삭제하시겠습니까?')) { // 확인 누르면 삭제
                  handleDelete.mutate(id);
                }
              }}
              className="flex-1 text-center hover:cursor-pointer bg-[#FFBB02] rounded-[10px] "
            >
              삭제하기
            </div>
          </div>
        ) : (
          <>
            <div
              onClick={() => setModal(true)} // 모달창 열림
              className="h-[60px] hover:cursor-pointer leading-[60px] font-['Pretendard'] text-center text-black text-lg font-bold bg-[#FFBB02] rounded-[10px]"
            >
              모임 참가하기(현재 {groupDetail.nowParticipants}명 참가 중)
            </div>
            {modal ? (
              <JoinModal
                onClose={() => setModal(false)}
                hasPassword={groupDetail.isPublic}
                id={id}
              ></JoinModal>
            ) : null}
          </>
        )}
      </div>
    </div>
  );
}
