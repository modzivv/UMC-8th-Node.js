import { StatusCodes } from "http-status-codes";
import { success } from '../utils/response.js';
import * as userService from "../services/userService.js";

// 현재 로그인한 사용자 정보 조회 API
export const getUserProfile = async (req, res, next) => {
  /*
    #swagger.summary = '사용자 정보 조회 API';
    #swagger.description = '현재 로그인한 사용자의 정보를 조회합니다.';
    #swagger.responses[200] = {
      description: "사용자 정보 조회 성공",
      content: {
        "application/json": {
          schema: {
            type: "object",
            properties: {
              status: { type: "string", example: "success" },
              message: { type: "string", example: "사용자 정보를 성공적으로 조회했습니다." },
              data: {
                type: "object",
                properties: {
                  id: { type: "integer" },
                  username: { type: "string" },
                  email: { type: "string" },
                  gender: { type: "string" },
                  birth_date: { type: "string", format: "date" },
                  address: { type: "string" },
                  detail_address: { type: "string" }
                }
              }
            }
          }
        }
      }
    };
  */
  try {
    const userId = req.user.id;
    
    const userProfile = await userService.getUserById(userId);
    
    res.status(StatusCodes.OK).json(
      success(userProfile, "사용자 정보를 성공적으로 조회했습니다.")
    );
  } catch (error) {
    next(error);
  }
};

// 사용자 정보 수정 API
export const updateUserProfile = async (req, res, next) => {
  /*
    #swagger.summary = '사용자 정보 수정 API';
    #swagger.description = '현재 로그인한 사용자의 정보를 수정합니다.';
    #swagger.requestBody = {
      required: true,
      content: {
        "application/json": {
          schema: {
            type: "object",
            properties: {
              username: { type: "string", description: "사용자명" },
              gender: { type: "string", description: "성별" },
              birth_date: { type: "string", format: "date", description: "생년월일 (YYYY-MM-DD)" },
              address: { type: "string", description: "주소" },
              detail_address: { type: "string", description: "상세주소" }
            }
          }
        }
      }
    };
    #swagger.responses[200] = {
      description: "사용자 정보 수정 성공",
      content: {
        "application/json": {
          schema: {
            type: "object",
            properties: {
              status: { type: "string", example: "success" },
              message: { type: "string", example: "사용자 정보가 성공적으로 수정되었습니다." },
              data: {
                type: "object",
                properties: {
                  id: { type: "integer" },
                  username: { type: "string" },
                  email: { type: "string" },
                  gender: { type: "string" },
                  birth_date: { type: "string", format: "date" },
                  address: { type: "string" },
                  detail_address: { type: "string" }
                }
              }
            }
          }
        }
      }
    };
  */
  try {
    const userId = req.user.id;
    
    const updatedUser = await userService.updateUser(userId, req.body);
    
    res.status(StatusCodes.OK).json(
      success(updatedUser, "사용자 정보가 성공적으로 수정되었습니다.")
    );
  } catch (error) {
    next(error);
  }
};