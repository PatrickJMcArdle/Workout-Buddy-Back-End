import db from "#db/client";
import { createUser } from "#db/queries/users";

await db.connect();
await seed();
await db.end();
console.log("🌱 Database seeded.");

async function seed() {
  await db.query(`
    INSERT INTO gyms (location) VALUES
      ('Chicago'),
      ('New York')
    ON CONFLICT DO NOTHING;
  `);

  // Seed users
  await db.query(`
    INSERT INTO users (account_type, username, fitness_level, fitness_goal, preferred_trainer, password) VALUES
      (1, 'peckjustin', 1, 3, NULL, 'password123'),
      (1, 'jennybriggs', 3, 1, NULL, 'password123'),
      (1, 'christine22', 1, 3, NULL, 'password123'),
      (1, 'ronald76', 3, 2, NULL, 'password123'),
      (1, 'sherylwalsh', 1, 2, NULL, 'password123'),
      (0, 'iortiz', 1, 2, 3, 'password123'),
      (0, 'ydavis', 3, 3, 5, 'password123'),
      (0, 'johnfox', 3, 2, 5, 'password123'),
      (0, 'david49', 1, 2, 4, 'password123'),
      (0, 'randalljames', 2, 1, 4, 'password123'),
      (0, 'andrew65', 3, 2, 2, 'password123'),
      (0, 'portermelissa', 2, 2, 1, 'password123'),
      (0, 'jacoballen', 2, 3, 3, 'password123'),
      (0, 'weaverryan', 1, 3, 1, 'password123'),
      (0, 'moorebrian', 2, 3, 4, 'password123'),
      (0, 'blackkelly', 1, 1, 4, 'password123'),
      (0, 'robertjoseph', 2, 2, 5, 'password123'),
      (0, 'riverachristian', 3, 3, 2, 'password123'),
      (0, 'simpsondavid', 1, 3, 1, 'password123'),
      (0, 'harrisnicholas', 3, 3, 5, 'password123');
  `);

  // Seed workouts
  await db.query(`
    INSERT INTO workouts (workout_type, description) VALUES
      (1, 'Full body circuit'),
      (2, 'Upper body strength training'),
      (3, 'Yoga session')
    ON CONFLICT DO NOTHING;
  `);

  // Seed goals
  await db.query(`
    INSERT INTO goals (description) VALUES
      ('Run a marathon'),
      ('Lose 10 pounds'),
      ('Build muscle')
    ON CONFLICT DO NOTHING;
  `);

  // Seed achievements
  await db.query(`
    INSERT INTO achievements (name, description, value) VALUES
      ('First Workout', 'Completed your first workout!', 10),
      ('Weekly Streak', 'Worked out 7 days in a row', 50),
      ('Level Up', 'Reached fitness level 3', 100)
    ON CONFLICT DO NOTHING;
  `);

  // Seed posts
  await db.query(`
    INSERT INTO posts (title, body, user_id, status)
    VALUES
      ('Crushed leg day!', 'Feeling strong after today''s workout.', 1, 'public'),
      ('Yoga saved my back', 'Best session yet!', 2, 'public'),
      ('Training update', 'Added new clients this week.', 3, 'private')
    ON CONFLICT DO NOTHING;
  `);

  // Seed follows
  await db.query(`
    INSERT INTO follows (following_user_id, followed_user_id)
    VALUES
      (2, 1),
      (3, 1),
      (1, 3)
    ON CONFLICT DO NOTHING;
  `);

  // Seed buddy table
  await db.query(`
    INSERT INTO buddy (skill, level, trainer_id)
    VALUES
      ('Strength training', 3, 3),
      ('Cardio coaching', 2, 3),
      ('Mobility & Flexibility', 1, 3)
    ON CONFLICT DO NOTHING;
  `);
}
