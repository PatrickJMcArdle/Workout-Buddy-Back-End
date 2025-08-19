import express from "express";
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

const router = express.Router();

router.get("/", async (_req, res, next) => {
  try {
    const achievements = await getAllAchievements();
    res.json(achievements ?? []);
  } catch (e) {
    next(e);
  }
});

router.get("/:id", async (req, res, next) => {
  try {
    const { id } = req.params;
    const achievement = await getAchievementById(id);
    if (!achievement) return res.status(404).json({ error: "Not found" });
    res.json(achievement);
  } catch (e) {
    next(e);
  }
});

router.put(
  "/:id",
  requireBody([
    "name",
    "description",
    "category",
    "requirement_value",
    "points_awarded",
  ]),
  async (req, res, next) => {
    try {
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
      if (!achievement) return res.status(404).json({ error: "Not found" });
      res.json(achievement);
    } catch (e) {
      next(e);
    }
  }
);

router.get("/user/:user_id", requireUser, async (req, res, next) => {
  try {
    const { user_id } = req.params;
    const achievements = await getUserAchievements(user_id);
    res.json(achievements ?? []);
  } catch (e) {
    next(e);
  }
});

router.put(
  "/user/:user_id/progress",
  requireUser,
  requireBody(["achievement_id", "progress"]),
  async (req, res, next) => {
    try {
      const { user_id } = req.params;
      const { achievement_id, progress } = req.body;
      const userAchievement = await updateAchievementProgress(
        user_id,
        achievement_id,
        progress
      );
      res.json(userAchievement);
    } catch (e) {
      next(e);
    }
  }
);

router.post(
  "/user/:user_id/check",
  requireUser,
  requireBody(["category", "current_value"]),
  async (req, res, next) => {
    try {
      const { user_id } = req.params;
      const { category, current_value } = req.body;
      const unlocked = await checkUnlockedAchievements(
        user_id,
        category,
        current_value
      );
      res.json(unlocked ?? []);
    } catch (e) {
      next(e);
    }
  }
);

router.post(
  "/user/:user_id/complete-workout",
  requireUser,
  async (req, res, next) => {
    try {
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

      const newAchievements = [
        ...(workoutAchievements ?? []),
        ...(streakAchievements ?? []),
      ];

      for (const a of newAchievements) {
        await updateAchievementProgress(user_id, a.id, a.requirement_value);
      }

      res.json({ totalWorkouts, currentStreak, newAchievements });
    } catch (e) {
      next(e);
    }
  }
);

export default router;
