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

export async function addWorkout(
  user_id,
  workout_description,
  muscle,
  workout_date,
  minutes_worked_out,
  notes = null
) {
  const sql = `
    INSERT INTO user_workouts (user_id, workout_description, muscle, workout_date, minutes_worked_out, notes)
    VALUES ($1, $2, $3, $4, $5, $6)
    RETURNING *
  `;
  const {
    rows: [userWorkout],
  } = await db.query(sql, [
    user_id,
    workout_description,
    muscle,
    workout_date,
    minutes_worked_out,
    notes,
  ]);
  return userWorkout;
}

export async function getUserWorkouts(user_id) {
  const sql = `
    SELECT *
    FROM user_workouts
    WHERE user_id = $1
    ORDER BY workout_date DESC, created_at DESC
  `;
  const { rows } = await db.query(sql, [user_id]);
  return rows;
}

export async function updateUserWorkout(
  id,
  user_id,
  workout_description,
  muscle,
  workout_date,
  minutes_worked_out,
  notes = null
) {
  const sql = `
    UPDATE user_workouts 
    SET workout_description = $3, muscle = $4, workout_date = $5, minutes_worked_out = $6, notes = $7
    WHERE id = $1 AND user_id = $2
    RETURNING *
  `;
  const {
    rows: [userWorkout],
  } = await db.query(sql, [
    id,
    user_id,
    workout_description,
    muscle,
    workout_date,
    minutes_worked_out,
    notes,
  ]);
  return userWorkout;
}

export async function deleteUserWorkout(id, user_id) {
  const sql = `
    DELETE FROM user_workouts
    WHERE id = $1 AND user_id = $2
    RETURNING *
  `;
  const {
    rows: [deletedWorkout],
  } = await db.query(sql, [id, user_id]);
  return deletedWorkout;
}
