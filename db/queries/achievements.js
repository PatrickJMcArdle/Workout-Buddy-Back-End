import db from "#db/client";

export async function getAllAchievements() {
  const sql = `
    SELECT * FROM achievements
    ORDER BY category, requirement_value
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
        category = $3,
        requirement_value = $4,
        points_awarded = $5
    WHERE id = $6
    RETURNING *
  `;
  const {
    rows: [achievement],
  } = await db.query(sql, [
    name,
    description,
    category,
    requirement_value,
    points_awarded,
    id,
  ]);
  return achievement;
}

export async function getUserAchievements(userId) {
  const sql = `
    SELECT 
      achievements.name,
      achievements.description,
      user_achievements.progress
    FROM achievements
    JOIN user_achievements ON achievements.id = user_achievements.achievement_id
    WHERE user_achievements.user_id = $1
    ORDER BY user_achievements.id DESC
  `;
  const { rows: achievements } = await db.query(sql, [userId]);
  return achievements;
}

export async function updateAchievementProgress(
  userId,
  achievementId,
  progress
) {
  const sql = `
    INSERT INTO user_achievements (user_id, achievement_id, progress)
    VALUES ($1, $2, $3)
    ON CONFLICT (user_id, achievement_id) 
    DO UPDATE SET progress = $3
    RETURNING *
  `;
  const {
    rows: [userAchievement],
  } = await db.query(sql, [userId, achievementId, progress]);
  return userAchievement;
}

export async function checkUnlockedAchievements(
  userId,
  category,
  currentValue
) {
  const sql = `
    SELECT achievements.*
    FROM achievements
    LEFT JOIN user_achievements ON achievements.id = user_achievements.achievement_id 
      AND user_achievements.user_id = $3
    WHERE achievements.category = $1 
      AND achievements.requirement_value <= $2
      AND user_achievements.achievement_id IS NULL
    ORDER BY achievements.requirement_value
  `;
  const { rows: achievements } = await db.query(sql, [
    category,
    currentValue,
    userId,
  ]);
  return achievements;
}

export async function getTotalWorkouts(userId) {
  const sql = `SELECT COUNT(*) as total FROM workout_sessions WHERE user_id = $1`;
  const {
    rows: [result],
  } = await db.query(sql, [userId]);
  return parseInt(result.total);
}

export async function getCurrentWorkoutStreak(userId) {
  const sql = `
    WITH daily_workouts AS (
      SELECT DISTINCT DATE(completed_at) as workout_date
      FROM workout_sessions 
      WHERE user_id = $1
      ORDER BY workout_date DESC
    ),
    numbered_days AS (
      SELECT 
        workout_date,
        ROW_NUMBER() OVER (ORDER BY workout_date DESC) as day_number
      FROM daily_workouts
    )
    SELECT COUNT(*) as current_streak
    FROM numbered_days
    WHERE workout_date = CURRENT_DATE - INTERVAL '1 day' * (day_number - 1)
  `;

  const {
    rows: [result],
  } = await db.query(sql, [userId]);
  return parseInt(result.current_streak || 0);
}
