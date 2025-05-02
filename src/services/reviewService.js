import { reviewResponseDto } from "../dtos/reviewDto.js";
import * as reviewRepository from "../repositories/reviewRepository.js";
import * as storeRepository from "../repositories/storeRepository.js";

export const addReview = async (reviewData) => {
  // 가게가 존재하는지 확인
  const store = await storeRepository.findStoreById(reviewData.storeId);
  if (!store) {
    throw new Error("해당 가게가 존재하지 않습니다.");
  }
  
  // 리뷰 추가
  const review = await reviewRepository.createReview(reviewData);
  if (!review) {
    throw new Error("리뷰 추가에 실패했습니다.");
  }
  
  return reviewResponseDto(review);
};