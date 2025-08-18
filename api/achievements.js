import db from "#db/client";
import express from "express";
const router = express.Router();
export default router;

import db from "#db/client";

import {
  getAllAchievements,
  getAchievementById,
  updateAchievementById,
  getUserAchievements,
  updateAchievementProgress,
  checkUnlockedAchievements,
  getTotalWorkouts,
  getCurrentWorkoutStreak,
} from "#db/queries/achievements";
import requireBody from "#middleware/requireBody";
import requireUser from "#middleware/requireUser";

router.route("/").get(async (req, res) => {
  const achievements = await getAllAchievements();
  res.send(achievements);
});

router.route("/:id").get(async (req, res) => {
  const { id } = req.params;
  const achievement = await getAchievementById(id);
  if (!achievement) {
    return res.status(404).send("Achievement not found");
  }
  res.send(achievement);
});

router
  .route("/:id")
  .put(
    requireBody([
      "name",
      "description",
      "category",
      "requirement_value",
      "points_awarded",
    ]),
    async (req, res) => {
      const { id } = req.params;
      const { name, description, category, requirement_value, points_awarded } =
        req.body;
      const achievement = await updateAchievementById(
        id,
        name,
        description,
        category,
        requirement_value,
        points_awarded
      );
      if (!achievement) {
        return res.status(404).send("Achievement not found");
      }
      res.send(achievement);
    }
  );

router.route("/user/:user_id").get(requireUser, async (req, res) => {
  const { user_id } = req.params;
  const achievements = await getUserAchievements(user_id);
  if (!achievements) return res.status(404).send("No achievements found");
  res.send(achievements);
});

router
  .route("/user/:user_id/progress")
  .put(
    requireUser,
    requireBody(["achievement_id", "progress"]),
    async (req, res) => {
      const { user_id } = req.params;
      const { achievement_id, progress } = req.body;
      const userAchievement = await updateAchievementProgress(
        user_id,
        achievement_id,
        progress
      );
      res.send(userAchievement);
    }
  );

router
  .route("/user/:user_id/check")
  .post(
    requireUser,
    requireBody(["category", "current_value"]),
    async (req, res) => {
      const { user_id } = req.params;
      const { category, current_value } = req.body;
      const unlockedAchievements = await checkUnlockedAchievements(
        user_id,
        category,
        current_value
      );
      res.send(unlockedAchievements);
    }
  );

router.post(
  "/user/:user_id/complete-workout",
  requireUser,
  async (req, res) => {
    const { user_id } = req.params;

    await db.query("INSERT INTO workout_sessions (user_id) VALUES ($1)", [
      user_id,
    ]);

    const totalWorkouts = await getTotalWorkouts(user_id);
    const currentStreak = await getCurrentWorkoutStreak(user_id);
    const workoutAchievements = await checkUnlockedAchievements(
      user_id,
      "workouts",
      totalWorkouts
    );
    const streakAchievements = await checkUnlockedAchievements(
      user_id,
      "streaks",
      currentStreak
    );

    const newAchievements = [...workoutAchievements, ...streakAchievements];

    // Save new achievments to the database
    for (const achievement of newAchievements) {
      await updateAchievementProgress(
        user_id,
        achievement.id,
        achievement.requirement_value
      );
    }

    res.send({
      totalWorkouts,
      currentStreak,
      newAchievements,
    });
  }
);
