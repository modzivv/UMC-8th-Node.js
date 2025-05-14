import { NotFoundError, ConflictError, BadRequestError } from '../errors/CustomError.js';
import { userMissionResponseDto } from "../dtos/missionDto.js";
import * as missionRepository from "../repositories/missionRepository.js";

export const challengeMission = async (userMissionData) => {
  // 미션이 존재하는지 확인
  const mission = await missionRepository.findMissionById(userMissionData.missionId);
  if (!mission) {
    throw new NotFoundError("해당 미션이 존재하지 않습니다.");
  }
  
  // 사장님 인증 코드 확인
  if (userMissionData.ownerCode && mission.owner_code !== userMissionData.ownerCode) {
    throw new BadRequestError("사장님 인증 코드가 일치하지 않습니다.");
  }
  
  // 이미 도전 중인 미션인지 확인
  const existingUserMission = await missionRepository.findUserMission(
    userMissionData.userId,
    userMissionData.missionId
  );
  
  if (existingUserMission) {
    throw new ConflictError("이미 도전 중인 미션입니다.");
  }
  
  // 미션 도전 시작
  const userMission = await missionRepository.createUserMission({
    userId: userMissionData.userId,
    missionId: userMissionData.missionId
  });
  
  if (!userMission) {
    throw new Error("미션 도전에 실패했습니다.");
  }
  
  return userMissionResponseDto(userMission);
};