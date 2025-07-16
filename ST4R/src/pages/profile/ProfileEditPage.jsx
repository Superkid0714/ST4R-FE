import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import BackButton from '../components/common/BackButton';
import uploadImagesToS3 from '../api/imgupload';

// 사용자 정보 조회 API
const useUserInfo = () => {
  return useQuery({
    queryKey: ['userInfo'],
    queryFn: async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('로그인이 필요합니다.');
      }

      const response = await axios.get(
        'http://eridanus.econo.mooo.com:8080/my',
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      return response.data;
    },
    enabled: !!localStorage.getItem('token'),
    staleTime: 1000 * 60 * 10,
    retry: (failureCount, error) => {
      if (error?.response?.status === 401) return false;
      return failureCount < 2;
    },
  });
};

// 닉네임 중복 확인 API
const useCheckNicknameMutation = () => {
  return useMutation({
    mutationFn: async (nickname) => {
      const response = await axios.get(
        `http://eridanus.econo.mooo.com:8080/members/exists`,
        {
          params: { nickname },
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );
      return response.data;
    },
  });
};

// 프로필 수정 API
const useUpdateProfileMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data) => {
      console.log('프로필 수정 요청 데이터:', data);

      const response = await axios.patch(
        'http://eridanus.econo.mooo.com:8080/my/profile',
        data,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
            'Content-Type': 'application/json',
          },
        }
      );

      return response.data;
    },
    onSuccess: () => {
      // 사용자 정보 캐시 무효화
      queryClient.invalidateQueries(['userInfo']);
      console.log('프로필 수정 성공');
    },
    onError: (error) => {
      console.error('프로필 수정 실패:', error);
    },
  });
};

export default function ProfileEditPage() {
  const navigate = useNavigate();
  const imageInputRef = useRef(null);
  const queryClient = useQueryClient();

  // 사용자 정보 조회
  const { data: userInfo, isLoading, error } = useUserInfo();

  // 상태 관리
  const [profileImage, setProfileImage] = useState(null);
  const [profileImagePreview, setProfileImagePreview] = useState('');
  const [nickname, setNickname] = useState('');
  const [originalNickname, setOriginalNickname] = useState('');
  const [originalProfileImage, setOriginalProfileImage] = useState('');

  // 유효성 검사 상태
  const [isNicknameChecked, setIsNicknameChecked] = useState(false);
  const [nicknameCheckResult, setNicknameCheckResult] = useState('');
  const [nicknameError, setNicknameError] = useState('');

  // API 훅
  const checkNicknameMutation = useCheckNicknameMutation();
  const updateProfileMutation = useUpdateProfileMutation();

  // 사용자 정보 로드 시 초기값 설정
  useEffect(() => {
    if (userInfo) {
      setNickname(userInfo.nickname || '');
      setOriginalNickname(userInfo.nickname || '');
      setOriginalProfileImage(userInfo.profileImageUrl || '');
      setProfileImagePreview(userInfo.profileImageUrl || '');
    }
  }, [userInfo]);

  // 프로필 이미지 변경 핸들러
  const handleImageClick = () => {
    imageInputRef.current?.click();
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // 파일 크기 체크 (5MB 제한)
      if (file.size > 5 * 1024 * 1024) {
        alert('이미지 크기는 5MB 이하만 가능합니다.');
        return;
      }

      // 파일 타입 체크
      if (!file.type.startsWith('image/')) {
        alert('이미지 파일만 업로드 가능합니다.');
        return;
      }

      setProfileImage(file);

      // 미리보기 생성
      const reader = new FileReader();
      reader.onload = (e) => {
        setProfileImagePreview(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleImageRemove = () => {
    setProfileImage(null);
    setProfileImagePreview('');
    if (imageInputRef.current) {
      imageInputRef.current.value = '';
    }
  };

  // 닉네임 변경 핸들러
  const handleNicknameChange = (value) => {
    setNickname(value);
    setIsNicknameChecked(false);
    setNicknameCheckResult('');
    setNicknameError('');
  };

  // 닉네임 중복 확인
  const checkNickname = async () => {
    if (!nickname.trim()) {
      setNicknameError('닉네임을 입력해주세요.');
      return;
    }

    if (nickname.length < 2 || nickname.length > 10) {
      setNicknameError('닉네임은 2-10자 사이여야 합니다.');
      return;
    }

    // 원래 닉네임과 같으면 중복 확인 불필요
    if (nickname === originalNickname) {
      setIsNicknameChecked(true);
      setNicknameCheckResult('same');
      setNicknameError('');
      return;
    }

    try {
      const response = await checkNicknameMutation.mutateAsync(nickname);

      if (response.isSuccess) {
        if (response.exists) {
          setNicknameError('이미 존재하는 닉네임입니다.');
          setNicknameCheckResult('unavailable');
          setIsNicknameChecked(false);
        } else {
          setIsNicknameChecked(true);
          setNicknameCheckResult('available');
          setNicknameError('');
        }
      } else {
        setNicknameError(response.message || '닉네임 확인에 실패했습니다.');
        setNicknameCheckResult('error');
        setIsNicknameChecked(false);
      }
    } catch (error) {
      console.error('닉네임 중복 확인 에러:', error);

      if (error.response?.status === 404) {
        console.warn('닉네임 중복 확인 API 엔드포인트를 확인해주세요.');
        setNicknameCheckResult('error');
        setIsNicknameChecked(true); // 404 에러인 경우 진행 허용
        setNicknameError('');
      } else {
        setNicknameError('닉네임 확인에 실패했습니다.');
        setNicknameCheckResult('error');
        setIsNicknameChecked(false);
      }
    }
  };

  // 프로필 수정 제출
  const handleSubmit = async () => {
    // 닉네임 유효성 검사
    if (!nickname.trim()) {
      setNicknameError('닉네임을 입력해주세요.');
      return;
    }

    if (nickname.length < 2 || nickname.length > 10) {
      setNicknameError('닉네임은 2-10자 사이여야 합니다.');
      return;
    }

    // 변경사항 확인
    const hasNicknameChanged = nickname !== originalNickname;
    const hasImageChanged =
      profileImage !== null ||
      (profileImagePreview === '' && originalProfileImage !== '');

    if (!hasNicknameChanged && !hasImageChanged) {
      alert('변경된 내용이 없습니다.');
      return;
    }

    // 닉네임이 변경된 경우 중복 확인 체크
    if (
      hasNicknameChanged &&
      !isNicknameChecked &&
      nicknameCheckResult !== 'error'
    ) {
      setNicknameError('닉네임 중복 확인을 해주세요.');
      return;
    }

    try {
      let finalProfileImageUrl = originalProfileImage;

      // 이미지가 변경된 경우 처리
      if (profileImage) {
        console.log('새 프로필 이미지 업로드 시작');
        const imageUrls = await uploadImagesToS3([{ img: profileImage }]);
        if (imageUrls && imageUrls.length > 0) {
          finalProfileImageUrl = imageUrls[0];
          console.log('프로필 이미지 업로드 완료:', finalProfileImageUrl);
        }
      } else if (profileImagePreview === '' && originalProfileImage !== '') {
        // 이미지를 제거한 경우
        finalProfileImageUrl = '';
      }

      // 수정 데이터 구성
      const updateData = {};

      if (hasNicknameChanged) {
        updateData.nicknameToChange = nickname.trim();
        updateData.changeNickname = true;
      }

      if (hasImageChanged) {
        updateData.profileImageUrlToChange = finalProfileImageUrl;
        updateData.changeProfileImage = true;
      }

      console.log('프로필 수정 요청 데이터:', updateData);

      await updateProfileMutation.mutateAsync(updateData);

      alert('프로필이 수정되었습니다.');
      navigate('/profile');
    } catch (error) {
      console.error('프로필 수정 중 오류:', error);

      if (error.response?.status === 401) {
        alert('로그인이 필요합니다.');
        navigate('/login');
      } else if (error.response?.status === 400) {
        alert('입력한 정보를 확인해주세요.');
      } else {
        alert('프로필 수정에 실패했습니다. 다시 시도해주세요.');
      }
    }
  };

  // 로딩 상태
  if (isLoading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-yellow-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  // 에러 상태
  if (error) {
    return (
      <div className="min-h-screen bg-black flex flex-col items-center justify-center px-4">
        <div className="text-center">
          <h2 className="text-xl font-bold text-white mb-2">
            사용자 정보를 불러올 수 없습니다
          </h2>
          <p className="text-gray-400 mb-4">
            {error?.response?.status === 401
              ? '로그인이 필요합니다.'
              : '잠시 후 다시 시도해주세요.'}
          </p>
          <button
            onClick={() => navigate('/login')}
            className="bg-yellow-500 text-black px-6 py-2 rounded-lg font-medium hover:bg-yellow-400 transition-colors"
          >
            로그인
          </button>
        </div>
      </div>
    );
  }

  if (!userInfo) return null;

  return (
    <div className="min-h-screen bg-black text-white font-['Pretendard']">
      <div className="px-4 py-6">
        {/* 헤더 */}
        <div className="flex items-center gap-3 mb-8">
          <BackButton />
          <h1 className="text-xl font-medium">프로필 수정</h1>
        </div>

        {/* 프로필 수정 폼 */}
        <div className="space-y-6">
          {/* 프로필 이미지 */}
          <div className="text-center">
            <label className="block text-sm font-medium text-white mb-4">
              프로필 이미지
            </label>

            <div className="flex flex-col items-center">
              <div
                onClick={handleImageClick}
                className="relative w-32 h-32 rounded-full bg-[#1D1D1D] border-2 border-dashed border-gray-600 flex items-center justify-center cursor-pointer hover:border-yellow-500 transition-colors group"
              >
                {profileImagePreview ? (
                  <>
                    <img
                      src={profileImagePreview}
                      alt="프로필 미리보기"
                      className="w-full h-full rounded-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black bg-opacity-50 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <svg
                        className="w-8 h-8 text-white"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"
                        />
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"
                        />
                      </svg>
                    </div>
                  </>
                ) : (
                  <div className="text-center">
                    <svg
                      className="w-12 h-12 text-gray-400 group-hover:text-yellow-500 mx-auto mb-2"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1.5}
                        d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                      />
                    </svg>
                    <span className="text-sm text-gray-400 group-hover:text-yellow-500">
                      사진 선택
                    </span>
                  </div>
                )}
              </div>

              <input
                type="file"
                ref={imageInputRef}
                onChange={handleImageChange}
                accept="image/*"
                className="hidden"
              />

              {profileImagePreview && (
                <button
                  onClick={handleImageRemove}
                  className="mt-3 text-sm text-red-400 hover:text-red-300 transition-colors"
                >
                  이미지 제거
                </button>
              )}
            </div>
          </div>

          {/* 닉네임 */}
          <div>
            <label className="block text-sm font-medium text-white mb-2">
              닉네임 <span className="text-red-400">*</span>
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={nickname}
                onChange={(e) => handleNicknameChange(e.target.value)}
                placeholder="2-10자 사이로 입력해주세요"
                maxLength={10}
                className={`flex-1 h-12 px-3 bg-[#1D1D1D] rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 text-white placeholder-gray-500 ${
                  nicknameError ? 'border border-red-400' : ''
                }`}
              />
              <button
                type="button"
                onClick={checkNickname}
                disabled={
                  !nickname.trim() ||
                  nickname === originalNickname ||
                  checkNicknameMutation.isLoading
                }
                className="px-4 h-12 bg-yellow-500 text-black rounded-lg font-medium hover:bg-yellow-400 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {checkNicknameMutation.isLoading ? '확인중...' : '중복확인'}
              </button>
            </div>

            {nicknameError && (
              <p className="text-red-400 text-sm mt-1">{nicknameError}</p>
            )}

            {nicknameCheckResult === 'available' && !nicknameError && (
              <p className="text-green-400 text-sm mt-1">
                ✓ 사용 가능한 닉네임입니다
              </p>
            )}

            {nicknameCheckResult === 'same' && !nicknameError && (
              <p className="text-blue-400 text-sm mt-1">
                ✓ 현재 사용 중인 닉네임입니다
              </p>
            )}

            {nicknameCheckResult === 'unavailable' && (
              <p className="text-red-400 text-sm mt-1">
                이미 존재하는 닉네임입니다.
              </p>
            )}

            {nicknameCheckResult === 'error' && !nicknameError && (
              <p className="text-yellow-400 text-sm mt-1">
                ⚠ 닉네임 중복 확인을 할 수 없습니다. 고유한 닉네임을
                사용해주세요.
              </p>
            )}
          </div>

          {/* 수정 불가능한 정보 표시 */}
          <div className="bg-[#1D1D1D] rounded-lg p-4">
            <h3 className="text-sm font-medium text-gray-400 mb-3">
              수정 불가능한 정보
            </h3>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-400">이메일</span>
                <span className="text-gray-300">
                  {userInfo.email || '이메일 없음'}
                </span>
              </div>
              {userInfo.birthDate && (
                <div className="flex justify-between">
                  <span className="text-gray-400">생년월일</span>
                  <span className="text-gray-300">
                    {new Date(userInfo.birthDate).toLocaleDateString('ko-KR')}
                  </span>
                </div>
              )}
              {userInfo.gender && (
                <div className="flex justify-between">
                  <span className="text-gray-400">성별</span>
                  <span className="text-gray-300">
                    {userInfo.gender === 'MAN'
                      ? '남성'
                      : userInfo.gender === 'WOMAN'
                        ? '여성'
                        : '선택안함'}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* 수정 버튼 */}
          <div className="flex space-x-3">
            <button
              onClick={() => navigate('/profile')}
              className="flex-1 h-12 bg-gray-600 text-white rounded-lg font-medium hover:bg-gray-500 transition-colors"
            >
              취소
            </button>
            <button
              onClick={handleSubmit}
              disabled={updateProfileMutation.isLoading}
              className={`flex-1 h-12 rounded-lg font-medium transition-colors ${
                updateProfileMutation.isLoading
                  ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
                  : 'bg-yellow-500 text-black hover:bg-yellow-400'
              }`}
            >
              {updateProfileMutation.isLoading ? '수정 중...' : '수정 완료'}
            </button>
          </div>
        </div>

        {/* 하단 여백 */}
        <div className="h-10"></div>
      </div>
    </div>
  );
}
