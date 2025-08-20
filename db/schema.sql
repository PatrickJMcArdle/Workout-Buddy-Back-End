DROP TABLE IF EXISTS settings;
DROP TABLE IF EXISTS user_goals;
DROP TABLE IF EXISTS workout_sessions;
DROP TABLE IF EXISTS follows;
DROP TABLE IF EXISTS posts;
DROP TABLE IF EXISTS buddy;
DROP TABLE IF EXISTS gyms;
DROP TABLE IF EXISTS achievements CASCADE;
DROP TABLE IF EXISTS goals CASCADE;
DROP TABLE IF EXISTS workouts;
DROP TABLE IF EXISTS users CASCADE;
DROP TABLE IF EXISTS user_achievements;
DROP TABLE IF EXISTS user_workouts;

CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  account_type INTEGER DEFAULT 0,
  username text NOT NULL UNIQUE,
  first_name TEXT NOT NULL,
  fitness_level INTEGER,
  fitness_goal INTEGER,
  preferred_trainer INTEGER,
  gender INTEGER,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  user_achievements INTEGER DEFAULT 0,
  birthday DATE,
  password TEXT NOT NULL
);

CREATE TABLE workouts (
  id SERIAL PRIMARY KEY,
  workout_type INTEGER NOT NULL,
  description TEXT
);

CREATE TABLE workout_sessions (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL,
  completed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE goals (
  id SERIAL PRIMARY KEY,
  description TEXT NOT NULL
);


CREATE TABLE user_goals (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL,
  goal_id INTEGER NOT NULL,
  target_value INTEGER NOT NULL,
  progress INTEGER DEFAULT 0,
  is_completed BOOLEAN DEFAULT false,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (goal_id) REFERENCES goals(id) ON DELETE CASCADE,
  UNIQUE (user_id, goal_id)
);

CREATE TABLE achievements (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  category TEXT NOT NULL,
  requirement_value INTEGER NOT NULL,
  points_awarded INTEGER NOT NULL
);

CREATE TABLE user_achievements (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL,
  achievement_id INTEGER NOT NULL,
  progress INTEGER DEFAULT 0,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (achievement_id) REFERENCES achievements(id) ON DELETE CASCADE,
  UNIQUE (user_id, achievement_id)
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

CREATE TABLE settings (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE UNIQUE,
  theme CHAR(1) DEFAULT 'L',
  notifications BOOLEAN DEFAULT true,
  public_profile BOOLEAN DEFAULT true,
  location_sharing BOOLEAN DEFAULT true
);

CREATE TABLE user_workouts (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL,
  workout_description TEXT NOT NULL,
  muscle TEXT NOT NULL,
  workout_date DATE NOT NULL,
  minutes_worked_out INTEGER NOT NULL,
  notes TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);
