import db from "#db/client";

export async function getAllGoals() {
  const sql = `
    SELECT * FROM goals
    ORDER BY id
    `;
  const { rows: goals } = await db.query(sql);
  return goals;
}

export async function getGoalById(id) {
  const sql = `
  SELECT *
  FROM goals
  WHERE id = $1
  `;
  const {
    rows: [goal],
  } = await db.query(sql, [id]);
  return goal;
}

export async function updateGoalById(id, description) {
  const sql = `
    UPDATE goals
    SET description = $1
    WHERE id = $2
    RETURNING *
  `;
  const {
    rows: [goal],
  } = await db.query(sql, [description, id]);
  return goal;
}

export async function getUserGoals(userId) {
  const sql = `
    SELECT 
      goals.id,
      goals.description,
      user_goals.progress,
      user_goals.target_value,
      user_goals.is_completed,
      user_goals.created_at
    FROM goals
    JOIN user_goals ON goals.id = user_goals.goal_id
    WHERE user_goals.user_id = $1
    ORDER BY user_goals.created_at DESC
  `;
  const { rows: goals } = await db.query(sql, [userId]);
  return goals;
}

export async function createUserGoal(userId, goalId, targetValue) {
  const sql = `
    INSERT INTO user_goals (user_id, goal_id, target_value, progress, is_completed)
    VALUES ($1, $2, $3, 0, false)
    RETURNING *
  `;
  const {
    rows: [userGoal],
  } = await db.query(sql, [userId, goalId, targetValue]);
  return userGoal;
}

export async function updateUserGoalProgress(userId, goalId, progress) {
  const sql = `
    INSERT INTO user_goals (user_id, goal_id, progress)
    VALUES ($1, $2, $3)
    ON CONFLICT (user_id, goal_id) 
    DO UPDATE SET progress = $3
    RETURNING *
  `;
  const {
    rows: [userGoal],
  } = await db.query(sql, [userId, goalId, progress]);
  return userGoal;
}

export async function deleteUserGoal(userId, goalId) {
  const sql = `
    DELETE FROM user_goals
    WHERE user_id = $1 AND goal_id = $2
    RETURNING *
  `;
  const {
    rows: [userGoal],
  } = await db.query(sql, [userId, goalId]);
  return userGoal;
}
