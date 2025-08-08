import db from "#db/client";

export async function getWorkoutById(id) {
  const sql = `
  SELECT *
  FROM workouts
  WHERE id = $1
  `;
  const {
    rows: [workout],
  } = await db.query(sql, [id]);
  return workout;
}

export async function getAllWorkouts() {
  const sql = `
    SELECT * FROM workouts
    `;
  const { rows: workouts } = await db.query(sql);
  return workouts;
}


