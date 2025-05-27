import { StatusCodes } from "http-status-codes";
import { missionChallengeDto } from "../dtos/missionDto.js";
import { success } from '../utils/response.js';
import * as missionService from "../services/missionService.js";

// 가게의 미션을 도전 중인 미션에 추가 API
export const challengeMission = async (req, res, next) => {
  /*
    #swagger.summary = '미션 도전하기 API';
    #swagger.description = '미션을 도전 중인 미션 목록에 추가합니다.';
    #swagger.parameters['missionId'] = {
      in: 'path',
      description: '도전할 미션 ID',
      required: true,
      type: 'integer'
    };
    #swagger.requestBody = {
      required: true,
      content: {
        "application/json": {
          schema: {
            type: "object",
            properties: {
              ownerCode: { type: "string", description: "사장님 코드" }
            },
            required: ["ownerCode"]
          }
        }
      }
    };
    #swagger.responses[201] = {
      description: "미션 도전 성공 응답",
      content: {
        "application/json": {
          schema: {
            type: "object",
            properties: {
              status: { type: "string", example: "success" },
              message: { type: "string", example: "미션 도전이 성공적으로 시작되었습니다." },
              data: {
                type: "object",
                properties: {
                  id: { type: "integer" },
                  userId: { type: "integer" },
                  missionId: { type: "integer" },
                  status: { type: "string", example: "IN_PROGRESS" },
                  createdAt: { type: "string", format: "date-time" }
                }
              }
            }
          }
        }
      }
    };
    #swagger.responses[400] = {
      description: "미션 도전 실패 응답",
      content: {
        "application/json": {
          schema: {
            type: "object",
            properties: {
              status: { type: "string", example: "error" },
              message: { type: "string", example: "올바르지 않은 사장님 코드입니다." }
            }
          }
        }
      }
    };
  */
  try {
    const userId = req.user?.id;
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