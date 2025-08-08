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

export async function traineeFindTrainer(userId) {
  const sql = `
    SELECT *
    FROM users
    WHERE account_type = 1
      AND id != $1
      AND fitness_goal = (
        SELECT fitness_goal FROM users WHERE id = $1
      )
      AND gender = (
        SELECT preferred_trainer FROM users WHERE id = $1
      )
  `;
  const { rows: trainers } = await db.query(sql, [userId]);
  return trainers;
}

export async function trainerFindTrainees(trainerId) {
  const sql = `
    SELECT *
    FROM users
    WHERE account_type = 0             
      AND id != $1
      AND fitness_goal = (SELECT fitness_goal FROM users WHERE id = $1)
      AND preferred_trainer = (SELECT gender FROM users WHERE id = $1)
  `;
  const { rows: trainees } = await db.query(sql, [trainerId]);
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
  const {rows: users} = await db.query(sql);
  return users;
}