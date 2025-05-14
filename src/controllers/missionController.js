import { StatusCodes } from "http-status-codes";
import { missionChallengeDto } from "../dtos/missionDto.js";
import { success } from '../utils/response.js';
import * as missionService from "../services/missionService.js";

// 가게의 미션을 도전 중인 미션에 추가 API
export const challengeMission = async (req, res, next) => {
  try {
    // 기본 사용자 ID는 테스트를 위해 1로 설정
    const userId = req.user?.id || 1;
    const { missionId } = req.params;
    
    const missionDto = missionChallengeDto({
      userId,
      missionId,
      ownerCode: req.body.ownerCode
    });
    
    const result = await missionService.challengeMission(missionDto);
    
    res.status(StatusCodes.CREATED).json(
      success(result, "미션 도전이 성공적으로 시작되었습니다.")
    );
  } catch (error) {
    next(error);  // 에러를 에러 핸들러로 전달
  }
};