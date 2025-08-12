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

  const users = [
    // TRAINERS (account_type: 1)
    {
      account_type: 1,
      username: "peckjustin",
      first_name: "Justin",
      fitness_level: 1,
      fitness_goal: 3,
      preferred_trainer: null, // trainers don't need this
      gender: 0, // male
      birthday: "1990-05-21",
      password: "password123",
    },
    {
      account_type: 1,
      username: "christine22",
      first_name: "Christine",
      fitness_level: 1,
      fitness_goal: 3,
      preferred_trainer: null,
      gender: 1, // female
      birthday: "1988-11-02",
      password: "password123",
    },
    {
      account_type: 1,
      username: "brianlee",
      first_name: "Brian",
      fitness_level: 3,
      fitness_goal: 2,
      preferred_trainer: null,
      gender: 0, // male
      birthday: "1987-12-01",
      password: "password123",
    },

    // TRAINEES (account_type: 0)
    {
      account_type: 0,
      username: "jennybriggs",
      first_name: "Jenny",
      fitness_level: 3,
      fitness_goal: 3, // matches Justin/Christine
      preferred_trainer: 0, // prefers male -> matches Justin
      gender: 1,
      birthday: "1992-08-14",
      password: "password123",
    },
    {
      account_type: 0,
      username: "mikejohnson",
      first_name: "Mike",
      fitness_level: 2,
      fitness_goal: 2, // matches Brian
      preferred_trainer: 0, // prefers male -> matches Brian
      gender: 0,
      birthday: "1995-04-10",
      password: "password123",
    },
    {
      account_type: 0,
      username: "sarawilliams",
      first_name: "Sara",
      fitness_level: 1,
      fitness_goal: 3, // matches Justin/Christine
      preferred_trainer: 1, // prefers female -> matches Christine
      gender: 1,
      birthday: "1998-09-17",
      password: "password123",
    },
  ];

  for (const u of users) {
    const created = await createUser(u.username, u.password, u.first_name);

    await db.query(
      `
    UPDATE users
    SET
      account_type = $1,
      fitness_level = $2,
      fitness_goal = $3,
      preferred_trainer = $4,
      gender = $5,
      birthday = $6
    WHERE id = $7
    `,
      [
        u.account_type,
        u.fitness_level,
        u.fitness_goal,
        u.preferred_trainer,
        u.gender,
        u.birthday,
        created.id,
      ]
    );
  }
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

  // Seed achievements table
  await db.query(`
    INSERT INTO achievements (name, description, category, requirement_value, points_awarded) VALUES
      ('Fitness Rookie', 'Reach fitness level 1', 'fitness_level", 1, 5),
      ('Fitness Intermediate', 'Reach fitness level 3', 'fitness_level", 3, 10),
      ('Fitness Master', 'Reach fitness level 5', 'fitness_level", 5, 15),
      ('Getting Into Rythm', 'Complete a workout', 'workouts", 1, 5),
      ('Getting Used To It', 'Complete 5 workouts', 'workouts", 5, 10),
      ('Mr. Consistent', 'Complete 25 workouts', 'workouts", 25, 15),
      ('Half Century Club', 'Complete 50 workouts', 'workouts", 50, 25),
      ('Century Club', 'Complete 100 workouts', 'workouts", 100, 35),
      ('Streak Starter', 'Maintain a 3-day workout streak', 'streaks', 3, 10),
      ('Weekly Warrior', 'Maintain a 7-day workout streak', 'streaks', 7, 15),
      ('Two Week Champion', 'Maintain a 14-day workout streak', 'streaks', 14, 25),
      ('Monthly Master', 'Maintain a 30-day workout streak', 'streaks', 30, 35),
      ('Streak Legend', 'Maintain a 60-day workout streak', 'streaks', 60, 50)
    ON CONFLICT DO NOTHING;
      `);
}
