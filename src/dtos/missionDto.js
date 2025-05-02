// 미션 도전 DTO
export const missionChallengeDto = (body) => {
    if (!body.missionId) {
      throw new Error("미션 ID는 필수입니다.");
    }
    
    return {
      userId: body.userId || 1, // 기본값 설정
      missionId: parseInt(body.missionId),
      ownerCode: body.ownerCode
    };
  };
  
  // 미션 응답 DTO
  export const missionResponseDto = (mission) => {
    return {
      id: mission.id,
      title: mission.title,
      description: mission.description,
      reward: mission.reward,
      storeId: mission.storeId,
      storeName: mission.storeName || null,
      expiryDate: mission.expiryDate,
      createdAt: mission.createdAt,
      updatedAt: mission.updatedAt
    };
  };
  
  // 유저 미션 응답 DTO
  export const userMissionResponseDto = (userMission) => {
    return {
      id: userMission.id,
      userId: userMission.userId,
      username: userMission.username || null,
      missionId: userMission.missionId,
      missionTitle: userMission.missionTitle || null,
      status: userMission.status,
      startedAt: userMission.startedAt,
      completedAt: userMission.completedAt,
      createdAt: userMission.createdAt,
      updatedAt: userMission.updatedAt
    };
  };