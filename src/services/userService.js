import { prisma } from "../db.config.js";

// 사용자 ID로 사용자 정보 조회
export const getUserById = async (userId) => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      username: true,
      email: true,
      gender: true,
      birth_date: true,
      address: true,
      detail_address: true,
      created_at: true,
      updated_at: true
    }
  });

  if (!user) {
    throw new Error("사용자를 찾을 수 없습니다.");
  }

  return user;
};

// 사용자 정보 수정
export const updateUser = async (userId, updateData) => {
  // 업데이트할 데이터만 필터링
  const allowedFields = {
    username: updateData.username,
    gender: updateData.gender,
    birth_date: updateData.birth_date ? new Date(updateData.birth_date) : undefined,
    address: updateData.address,
    detail_address: updateData.detail_address
  };

  // undefined인 필드는 제거 (변경하지 않을 필드)
  const filteredData = Object.fromEntries(
    Object.entries(allowedFields).filter(([_, value]) => value !== undefined)
  );

  if (Object.keys(filteredData).length === 0) {
    throw new Error("수정할 정보가 없습니다.");
  }

  try {
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: filteredData,
      select: {
        id: true,
        username: true,
        email: true,
        gender: true,
        birth_date: true,
        address: true,
        detail_address: true,
        updated_at: true
      }
    });

    return updatedUser;
  } catch (error) {
    if (error.code === 'P2025') {
      throw new Error("사용자를 찾을 수 없습니다.");
    }
    throw error;
  }
};