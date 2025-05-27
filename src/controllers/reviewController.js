import { StatusCodes } from "http-status-codes";
import { createReviewDto } from "../dtos/reviewDto.js";
import * as reviewService from "../services/reviewService.js";

// 가게에 리뷰 추가하기 API
export const addReviewToStore = async (req, res) => {
  /*
    #swagger.summary = '가게에 리뷰 추가하기 API';
    #swagger.description = '특정 가게에 새로운 리뷰를 추가합니다.';
    #swagger.requestBody = {
      required: true,
      content: {
        "application/json": {
          schema: {
            type: "object",
            properties: {
              storeId: { type: "integer", description: "리뷰를 작성할 가게 ID" },
              rating: { type: "number", format: "float", description: "별점 (1-5)" },
              content: { type: "string", description: "리뷰 내용" }
            },
            required: ["storeId", "rating", "content"]
          }
        }
      }
    };
    #swagger.responses[201] = {
      description: "리뷰 추가 성공 응답",
      content: {
        "application/json": {
          schema: {
            type: "object",
            properties: {
              status: { type: "string", example: "success" },
              message: { type: "string", example: "리뷰가 성공적으로 추가되었습니다." },
              data: {
                type: "object",
                properties: {
                  id: { type: "integer" },
                  userId: { type: "integer" },
                  storeId: { type: "integer" },
                  rating: { type: "number" },
                  content: { type: "string" },
                  createdAt: { type: "string", format: "date-time" }
                }
              }
            }
          }
        }
      }
    };
    #swagger.responses[400] = {
      description: "리뷰 추가 실패 응답",
      content: {
        "application/json": {
          schema: {
            type: "object",
            properties: {
              status: { type: "string", example: "error" },
              message: { type: "string" }
            }
          }
        }
      }
    };
  */
  try {
    const userId = req.user?.id;
    
    const reviewDto = createReviewDto({
      ...req.body,
      userId
    });
    
    const result = await reviewService.addReview(reviewDto);
    
    res.status(StatusCodes.CREATED).json({
      status: "success",
      message: "리뷰가 성공적으로 추가되었습니다.",
      data: result
    });
  } catch (error) {
    console.error("리뷰 추가 실패:", error);
    res.status(StatusCodes.BAD_REQUEST).json({
      status: "error",
      message: error.message
    });
  }
};