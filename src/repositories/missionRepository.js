import { pool } from "../db.config.js";

export const findMissionById = async (missionId) => {
  const conn = await pool.getConnection();
  try {
    const [rows] = await conn.query(
      `SELECT m.*, s.name as store_name, s.owner_code
       FROM missions m
       JOIN stores s ON m.store_id = s.id
       WHERE m.id = ?`,
      [missionId]
    );
    return rows.length > 0 ? rows[0] : null;
  } finally {
    conn.release();
  }
};

export const findUserMission = async (userId, missionId) => {
  const conn = await pool.getConnection();
  try {
    const [rows] = await conn.query(
      `SELECT um.*, u.username, m.title as mission_title
       FROM user_missions um
       JOIN users u ON um.user_id = u.id
       JOIN missions m ON um.mission_id = m.id
       WHERE um.user_id = ? AND um.mission_id = ?`,
      [userId, missionId]
    );
    return rows.length > 0 ? rows[0] : null;
  } finally {
    conn.release();
  }
};

export const createUserMission = async (userMissionData) => {
  const conn = await pool.getConnection();
  try {
    const [result] = await conn.query(
      `INSERT INTO user_missions (user_id, mission_id, status, started_at)
       VALUES (?, ?, 'STARTED', NOW())`,
      [userMissionData.userId, userMissionData.missionId]
    );
    
    if (result.affectedRows === 0) {
      return null;
    }
    
    const [userMissions] = await conn.query(
      `SELECT um.*, u.username, m.title as mission_title
       FROM user_missions um
       JOIN users u ON um.user_id = u.id
       JOIN missions m ON um.mission_id = m.id
       WHERE um.id = ?`,
      [result.insertId]
    );
    
    if (userMissions.length === 0) {
      return null;
    }
    
    return {
      id: userMissions[0].id,
      userId: userMissions[0].user_id,
      username: userMissions[0].username,
      missionId: userMissions[0].mission_id,
      missionTitle: userMissions[0].mission_title,
      status: userMissions[0].status,
      startedAt: userMissions[0].started_at,
      completedAt: userMissions[0].completed_at,
      createdAt: userMissions[0].created_at,
      updatedAt: userMissions[0].updated_at
    };
  } catch (error) {
    console.error("미션 도전 생성 오류:", error);
    throw new Error(`미션 도전 생성 중 오류가 발생했습니다: ${error.message}`);
  } finally {
    conn.release();
  }
};