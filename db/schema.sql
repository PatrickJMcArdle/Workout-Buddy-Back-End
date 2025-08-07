DROP TABLE IF EXISTS follows;
DROP TABLE IF EXISTS posts;
DROP TABLE IF EXISTS buddy;
DROP TABLE IF EXISTS gyms;
DROP TABLE IF EXISTS achievements;
DROP TABLE IF EXISTS goals;
DROP TABLE IF EXISTS workouts;
DROP TABLE IF EXISTS users;

CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  account_type INTEGER NOT NULL,
  username TEXT NOT NULL UNIQUE,
  fitness_level INTEGER,
  fitness_goal INTEGER,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  user_achievements INTEGER DEFAULT 0,
  password TEXT NOT NULL
);

CREATE TABLE workouts (
  id SERIAL PRIMARY KEY,
  workout_type INTEGER NOT NULL,
  description TEXT
);

CREATE TABLE goals (
  id SERIAL PRIMARY KEY,
  description TEXT NOT NULL
);

CREATE TABLE achievements (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  value INTEGER
);

CREATE TABLE gyms (
  id SERIAL PRIMARY KEY,
  location TEXT NOT NULL
);

CREATE TABLE posts (
  id SERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  body TEXT,
  user_id INTEGER NOT NULL,
  status TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE follows (
  following_user_id INTEGER NOT NULL,
  followed_user_id INTEGER NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (following_user_id, followed_user_id),
  FOREIGN KEY (following_user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (followed_user_id) REFERENCES users(id) ON DELETE CASCADE,
  CHECK (following_user_id != followed_user_id)
);

CREATE TABLE buddy (
  id SERIAL PRIMARY KEY,
  skill TEXT,
  level INTEGER,
  trainer_id INTEGER,
  FOREIGN KEY (trainer_id) REFERENCES users(id) ON DELETE SET NULL
);