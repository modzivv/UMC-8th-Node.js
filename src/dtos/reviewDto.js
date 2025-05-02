// 리뷰 생성 DTO
export const createReviewDto = (body) => {
    if (!body.content) {
      throw new Error("리뷰 내용은 필수입니다.");
    }
    
    if (!body.rating || isNaN(body.rating) || body.rating < 1 || body.rating > 5) {
      throw new Error("평점은 1에서 5 사이의 숫자여야 합니다.");
    }
    
    if (!body.storeId) {
      throw new Error("가게 ID는 필수입니다.");
    }
    
    return {
      content: body.content,
      rating: parseInt(body.rating),
      userId: body.userId || 1, // 기본값 설정
      storeId: parseInt(body.storeId),
      images: body.images || [] // 이미지 배열
    };
  };
  
  // 리뷰 응답 DTO
  export const reviewResponseDto = (review) => {
    return {
      id: review.id,
      content: review.content,
      rating: review.rating,
      userId: review.userId,
      username: review.username || null,
      storeId: review.storeId,
      storeName: review.storeName || null,
      images: review.images || [],
      createdAt: review.createdAt,
      updatedAt: review.updatedAt
    };
  };