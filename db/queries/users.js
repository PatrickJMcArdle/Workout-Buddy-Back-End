import db from "#db/client";
import bcrypt from "bcrypt";

export async function createUser(username, password) {
  const sql = `
  INSERT INTO users
    (username, password)
  VALUES
    ($1, $2)
  RETURNING *
  `;
  const hashedPassword = await bcrypt.hash(password, 10);
  const {
    rows: [user],
  } = await db.query(sql, [username, hashedPassword]);
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
  fitness_level,
  fitness_goal,
  user_achievements
) {
  const sql = `
    UPDATE users
    SET account_type = $1,
        username = $2,
        fitness_level = $3,
        fitness_goal = $4,
        user_achievements = $5
    WHERE id = $6
    RETURNING *
  `;
  const {
    rows: [user],
  } = await db.query(sql, [
    account_type,
    username,
    fitness_level,
    fitness_goal,
    user_achievements,
    id,
  ]);
  return user;
}
