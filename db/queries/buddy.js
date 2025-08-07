import db from "#db/client";

export async function getBuddyById(id) {
  const sql = `
  SELECT *
  FROM buddy
  WHERE id = $1
  `;
  const {
    rows: [buddy],
  } = await db.query(sql, [id]);
  return buddy;
}

export async function createBuddy(skill, level, trainer_id) {
  const sql = `
    INSERT INTO buddy
        (skill, level, trainer_id)
    VALUES
        ($1, $2, $3)
    RETURNING *
    `;
  const {
    rows: [buddy],
  } = await db.query(sql, [skill, level, trainer_id]);
  return buddy;
}

export async function updateBuddyById(id, skill, level, trainer_id) {
  const sql = `
    UPDATE buddy
    SET skill = $1,
        level = $2,
        trainer_id = $3
    WHERE id = $4
    RETURNING *
  `;
  const {
    rows: [buddy],
  } = await db.query(sql, [skill, level, trainer_id, id]);
  return buddy;
}

export async function deleteBuddy(id) {
  const sql = `
    DELETE FROM buddy
    WHERE id = $1
    RETURNING *
    `;
  const {
    rows: [buddy],
  } = await db.query(sql, [id]);
  return buddy;
}
