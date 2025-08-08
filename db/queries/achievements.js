import db from "#db/client";

export async function getAllAchievements() {
  const sql = `
    SELECT * FROM achievements
    `;
  const { rows: achievements } = await db.query(sql);
  return achievements;
}

export async function getAchievementById(id) {
  const sql = `
  SELECT *
  FROM achievements
  WHERE id = $1
  `;
  const {
    rows: [achievement],
  } = await db.query(sql, [id]);
  return achievement;
}

export async function updateAchievementById(id, name, description, value) {
  const sql = `
    UPDATE achievements
    SET name = $1,
        description = $2,
        value = $3
    WHERE id = $4
    RETURNING *
  `;
  const {
    rows: [achievement],
  } = await db.query(sql, [name, description, value, id]);
  return achievement;
}
