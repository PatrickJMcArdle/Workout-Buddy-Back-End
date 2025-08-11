import db from "#db/client";
import { createUser } from "#db/queries/users";

console.log("Seeding DB URL:", process.env.DATABASE_URL);

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
    INSERT INTO users 
    (account_type, username, first_name, fitness_level, fitness_goal, preferred_trainer, gender, password) 
  VALUES
    (1, 'peckjustin', 'Justin', 1, 3, NULL, 0, 'password123'),
    (1, 'jennybriggs', 'Jenny', 3, 1, NULL, 1, 'password123'),
    (1, 'christine22', 'Christine', 1, 3, NULL, 1, 'password123'),
    (1, 'ronald76', 'Ronald', 3, 2, NULL, 0, 'password123'),
    (1, 'sherylwalsh', 'Sheryl', 1, 2, NULL, 1, 'password123'),
    (0, 'iortiz', 'Isabel', 1, 2, 0, 1, 'password123'),       
    (0, 'ydavis', 'Yvonne', 3, 3, 1, 1, 'password123'),       
    (0, 'johnfox', 'John', 3, 2, 0, 0, 'password123'),       
    (0, 'david49', 'David', 1, 2, 1, 0, 'password123'),      
    (0, 'randalljames', 'Randall', 2, 1, 0, 0, 'password123'),
    (0, 'andrew65', 'Andrew', 3, 2, 0, 0, 'password123'),    
    (0, 'portermelissa', 'Melissa', 2, 2, 1, 1, 'password123'),
    (0, 'jacoballen', 'Jacob', 2, 3, 0, 0, 'password123'),    
    (0, 'weaverryan', 'Ryan', 1, 3, 0, 0, 'password123'),    
    (0, 'moorebrian', 'Brian', 2, 3, 0, 0, 'password123'),   
    (0, 'blackkelly', 'Kelly', 1, 1, 1, 1, 'password123'),    
    (0, 'robertjoseph', 'Robert', 2, 2, 0, 0, 'password123'), 
    (0, 'riverachristian', 'Christian', 3, 3, 1, 0, 'password123'), 
    (0, 'simpsondavid', 'David', 1, 3, 0, 0, 'password123'),  
    (0, 'harrisnicholas', 'Nicholas', 3, 3, 0, 0, 'password123'); 
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
