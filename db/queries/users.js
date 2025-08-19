import db from "#db/client";
import bcrypt from "bcrypt";

export async function createUser(username, password, first_name) {
  const sql = `
  INSERT INTO users
    (username, password, first_name)
  VALUES
    ($1, $2, $3)
  RETURNING *
  `;
  const hashedPassword = await bcrypt.hash(password, 10);
  const {
    rows: [user],
  } = await db.query(sql, [username, hashedPassword, first_name]);

  const settingsSql = `
      INSERT INTO settings (user_id)
      VALUES ($1)
    `;
  await db.query(settingsSql, [user.id]);

  const achievementsSql = `
      INSERT INTO user_achievements (user_id, achievement_id, progress)
      SELECT $1, id, 0
      FROM achievements
    `;
  await db.query(achievementsSql, [user.id]);

  const defaultGoalsSql = `
      INSERT INTO user_goals (user_id, goal_id, target_value)
      SELECT $1, id, 
        CASE 
          WHEN id = 1 THEN 1
          WHEN id = 2 THEN 7
          WHEN id = 3 THEN 5
          ELSE 1
        END
      FROM goals
      WHERE id IN (1, 2, 3)
    `; //This sets the first 3 goals to new users (easiest) and can later be changed as progress is made
  await db.query(defaultGoalsSql, [user.id]);

  return user;
}

export async function getUserByUsernameAndPassword(username, password) {
  const sql = `
  SELECT *
  FROM users
  WHERE username = $1
  `;
  const {
    rows: [user],
  } = await db.query(sql, [username]);
  if (!user) return null;

  const isValid = await bcrypt.compare(password, user.password);
  if (!isValid) return null;

  return user;
}

export async function getUserById(id) {
  const sql = `
  SELECT *
  FROM users
  WHERE id = $1
  `;
  const {
    rows: [user],
  } = await db.query(sql, [id]);
  return user;
}

export async function updateUserById(
  id,
  account_type,
  username,
  first_name,
  fitness_level,
  fitness_goal,
  user_achievements
) {
  const sql = `
    UPDATE users
    SET account_type = $1,
        username = $2,
        first_name = $3,
        fitness_level = $4,
        fitness_goal = $5,
        user_achievements = $6
    WHERE id = $7
    RETURNING *
  `;
  const {
    rows: [user],
  } = await db.query(sql, [
    account_type,
    username,
    first_name,
    fitness_level,
    fitness_goal,
    user_achievements,
    id,
  ]);
  return user;
}

export async function traineeFindTrainer(userId, goal, gender) {
  const sql = `
    SELECT *
    FROM users
    WHERE account_type = 1
      AND id != $1
      AND ($2::int IS NULL OR fitness_goal = $2::int)
      AND ($3::int IS NULL OR gender = $3::int)
  `;
  const { rows: trainers } = await db.query(sql, [userId, goal, gender]);
  return trainers;
}

export async function trainerFindTrainees(trainerId, goal, preferred) {
  const sql = `
    SELECT *
    FROM users
    WHERE account_type = 0             
      AND id != $1
      AND ($2::int IS NULL OR fitness_goal = $2::int)
      AND ($3::int IS NULL OR preferred_trainer = $3::int)
  `;

  const { rows: trainees } = await db.query(sql, [trainerId, goal, preferred]);
  return trainees; 
}

export async function createTrainer(userId) {
  const sql = `
    UPDATE users
    SET account_type = 1
    WHERE id = $1
    RETURNING id, username, first_name, account_type
  `;
  const {
    rows: [user],
  } = await db.query(sql, [userId]);
  return user;
}

export async function getUsers() {
  const sql = `
  SELECT * 
  FROM users
  `;
  const { rows: users } = await db.query(sql);
  return users;
}

export async function changeProfile(id, username, name, gender, birthday) {
  const sql = `
    UPDATE users
    SET username = $1,
        first_name = $2,
        gender = $3,
        birthday = $4
    WHERE id = $5
    RETURNING id, username, first_name, gender, birthday;
  `;

  const values = [username, name, gender, birthday, id];
  const {rows : [user]} = await db.query(sql, values);
  return user;
}

export async function changeFitnessGoal(id, fitness_goal) {
  const sql = `
    UPDATE users
    SET fitness_goal = $1
    WHERE id = $2
    RETURNING id, fitness_goal;
  `;

  const values = [fitness_goal, id];
  const {rows : [goal]} = db.await(sql, values);
  return goal;
}