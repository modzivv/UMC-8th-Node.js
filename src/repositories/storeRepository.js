import { pool } from "../db.config.js";

export const findRegionById = async (regionId) => {
  const conn = await pool.getConnection();
  try {
    const [rows] = await conn.query(
      `SELECT * FROM regions WHERE id = ?`,
      [regionId]
    );
    return rows.length > 0 ? rows[0] : null;
  } finally {
    conn.release();
  }
};

export const findStoreById = async (storeId) => {
  const conn = await pool.getConnection();
  try {
    const [rows] = await conn.query(
      `SELECT * FROM stores WHERE id = ?`,
      [storeId]
    );
    return rows.length > 0 ? rows[0] : null;
  } finally {
    conn.release();
  }
};

export const createStore = async (storeData) => {
  const conn = await pool.getConnection();
  try {
    const [result] = await conn.query(
      `INSERT INTO stores (name, address, description, region_id) 
       VALUES (?, ?, ?, ?)`,
      [
        storeData.name,
        storeData.address,
        storeData.description || null,
        storeData.regionId
      ]
    );
    
    if (result.affectedRows > 0) {
      const [stores] = await conn.query(
        `SELECT * FROM stores WHERE id = ?`,
        [result.insertId]
      );
      return stores[0];
    }
    return null;
  } finally {
    conn.release();
  }
};