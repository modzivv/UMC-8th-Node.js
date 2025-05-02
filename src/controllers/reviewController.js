import { StatusCodes } from "http-status-codes";
import { createReviewDto } from "../dtos/reviewDto.js";
import * as reviewService from "../services/reviewService.js";

// 가게에 리뷰 추가하기 API
export const addReviewToStore = async (req, res) => {
  try {
    // 기본 사용자 ID는 테스트를 위해 1로 설정
    const userId = req.user?.id || 1;
    
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