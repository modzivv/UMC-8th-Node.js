import { prisma } from "../db.config.js";

export const findMissionById = async (missionId) => {
  const mission = await prisma.mission.findUnique({
    where: { id: missionId },
    include: {
      store: {
        select: {
          name: true,
          owner_code: true
        }
      }
    }
  });
  
  if (!mission) return null;
  
  return {
    ...mission,
    store_name: mission.store.name,
    owner_code: mission.store.owner_code
  };
};

export const findUserMission = async (userId, missionId) => {
  const userMission = await prisma.userMission.findFirst({
    where: {
      user_id: userId,
      mission_id: missionId
    },
    include: {
      user: {
        select: { username: true }
      },
      mission: {
        select: { title: true }
      }
    }
  });
  
  if (!userMission) return null;
  
  return {
    ...userMission,
    username: userMission.user.username,
    mission_title: userMission.mission.title
  };
};

export const createUserMission = async (userMissionData) => {
  try {
    const userMission = await prisma.userMission.create({
      data: {
        user_id: userMissionData.userId,
        mission_id: userMissionData.missionId,
        status: 'STARTED',
        started_at: new Date()
      },
      include: {
        user: {
          select: { username: true }
        },
        mission: {
          select: { title: true }
        }
      }
    });
    
    return {
      id: userMission.id,
      userId: userMission.user_id,
      username: userMission.user.username,
      missionId: userMission.mission_id,
      missionTitle: userMission.mission.title,
      status: userMission.status,
      startedAt: userMission.started_at,
      completedAt: userMission.completed_at,
      createdAt: userMission.created_at,
      updatedAt: userMission.updated_at
    };
  } catch (error) {
    console.error("미션 도전 생성 오류:", error);
    throw new Error(`미션 도전 생성 중 오류가 발생했습니다: ${error.message}`);
  }
};