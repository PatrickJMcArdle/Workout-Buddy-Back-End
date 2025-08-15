import db from "#db/client";

export async function getWorkoutById(id) {
  const { rows } = await db.query(
    `
      SELECT id, workout_type, description
      FROM workouts
      WHERE id = $1
    `,
    [id]
  );
  return rows[0] || null;
}

/** Return all workouts (ordered for stable UI). */
export async function getAllWorkouts() {
  const { rows } = await db.query(`
    SELECT id, workout_type, description
    FROM workouts
    ORDER BY id ASC
  `);
  return rows;
}
