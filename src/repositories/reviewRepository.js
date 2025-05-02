import { pool } from "../db.config.js";

export const createReview = async (reviewData) => {
  const conn = await pool.getConnection();
  
  try {
    // 트랜잭션 시작
    await conn.beginTransaction();
    
    // 리뷰 생성
    const [reviewResult] = await conn.query(
      `INSERT INTO reviews (content, rating, user_id, store_id, created_at, updated_at) 
       VALUES (?, ?, ?, ?, NOW(), NOW())`,
      [
        reviewData.content,
        reviewData.rating,
        reviewData.userId,
        reviewData.storeId
      ]
    );
    
    const reviewId = reviewResult.insertId;
    
    // 이미지 추가
    if (reviewData.images && reviewData.images.length > 0) {
      for (const imageUrl of reviewData.images) {
        await conn.query(
          `INSERT INTO review_images (review_id, image_url, created_at, updated_at)
           VALUES (?, ?, NOW(), NOW())`,
          [reviewId, imageUrl]
        );
      }
    }
    
    // 트랜잭션 커밋
    await conn.commit();
    
    // 생성된 리뷰 정보 조회 (이미지 포함)
    const [reviews] = await conn.query(
      `SELECT r.*, u.username, s.name as store_name 
       FROM reviews r 
       JOIN users u ON r.user_id = u.id 
       JOIN stores s ON r.store_id = s.id 
       WHERE r.id = ?`,
      [reviewId]
    );
    
    // 이미지 조회
    const [images] = await conn.query(
      `SELECT image_url FROM review_images WHERE review_id = ?`,
      [reviewId]
    );
    
    const imageUrls = images.map(img => img.image_url);
    
    if (reviews.length === 0) {
      return null;
    }
    
    return {
      id: reviews[0].id,
      content: reviews[0].content,
      rating: reviews[0].rating,
      userId: reviews[0].user_id,
      username: reviews[0].username,
      storeId: reviews[0].store_id,
      storeName: reviews[0].store_name,
      images: imageUrls,
      createdAt: reviews[0].created_at,
      updatedAt: reviews[0].updated_at
    };
  } catch (error) {
    // 오류 발생 시 롤백
    await conn.rollback();
    console.error("리뷰 생성 오류:", error);
    throw new Error(`리뷰 생성 중 오류가 발생했습니다: ${error.message}`);
  } finally {
    conn.release();
  }
};