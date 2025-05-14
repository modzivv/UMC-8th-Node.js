import { prisma } from "../db.config.js";

export const createReview = async (reviewData) => {
  try {
    // Prisma는 트랜잭션을 자동으로 처리하기 때문에 별도의 설정이 필요 없음
    const review = await prisma.review.create({
      data: {
        content: reviewData.content,
        rating: reviewData.rating,
        user_id: reviewData.userId,
        store_id: reviewData.storeId,
        images: {
          create: reviewData.images ? 
            reviewData.images.map(imageUrl => ({
              image_url: imageUrl
            })) : []
        }
      },
      include: {
        user: {
          select: { username: true }
        },
        store: {
          select: { name: true }
        },
        images: {
          select: { image_url: true }
        }
      }
    });
    
    return {
      id: review.id,
      content: review.content,
      rating: review.rating,
      userId: review.user_id,
      username: review.user.username,
      storeId: review.store_id,
      storeName: review.store.name,
      images: review.images.map(img => img.image_url),
      createdAt: review.created_at,
      updatedAt: review.updated_at
    };
  } catch (error) {
    console.error("리뷰 생성 오류:", error);
    throw new Error(`리뷰 생성 중 오류가 발생했습니다: ${error.message}`);
  }
};