// api/workouts.js
import express from "express";
import requireBody from "#middleware/requireBody";
import requireUser from "#middleware/requireUser";
import {
  getAllWorkouts,
  getWorkoutById,
  addWorkout,
  getUserWorkouts,
  updateUserWorkout,
  deleteUserWorkout,
} from "#db/queries/workouts";

const router = express.Router();

router.get("/", async (_req, res, next) => {
  try {
    const workouts = await getAllWorkouts();
    res.json(workouts ?? []);
  } catch (err) {
    next(err);
  }
});

router.get("/:id", async (req, res, next) => {
  try {
    const w = await getWorkoutById(req.params.id);
    if (!w) return res.status(404).json({ error: "workout not found" });
    res.json(w);
  } catch (err) {
    next(err);
  }
});

function assertSelf(req, res) {
  const { user_id } = req.params;
  if (!req.user) {
    res.status(401).json({ error: "Unauthorized" });
    return false;
  }
  if (String(req.user.id) !== String(user_id)) {
    res.status(403).json({ error: "Forbidden: cannot access another user" });
    return false;
  }
  return true;
}

router.get("/user/:user_id", requireUser, async (req, res, next) => {
  try {
    if (!assertSelf(req, res)) return;
    const { user_id } = req.params;
    const userWorkouts = await getUserWorkouts(user_id);
    res.json(userWorkouts ?? []);
  } catch (err) {
    next(err);
  }
});

router.post(
  "/user/:user_id",
  requireUser,
  requireBody([
    "workout_description",
    "muscle",
    "workout_date",
    "minutes_worked_out",
  ]),
  async (req, res, next) => {
    try {
      if (!assertSelf(req, res)) return;

      const { user_id } = req.params;
      const {
        workout_description,
        muscle,
        workout_date,
        minutes_worked_out,
        notes,
      } = req.body;

      const minutes = Number(minutes_worked_out);
      if (!Number.isFinite(minutes) || minutes <= 0) {
        return res
          .status(400)
          .json({ error: "minutes_worked_out must be a positive number" });
      }

      const userWorkout = await addWorkout(
        user_id,
        workout_description,
        muscle,
        workout_date,
        minutes,
        notes ?? ""
      );

      res.status(201).json(userWorkout);
    } catch (err) {
      next(err);
    }
  }
);

router.put(
  "/user/:user_id/:id",
  requireUser,
  requireBody([
    "workout_description",
    "muscle",
    "workout_date",
    "minutes_worked_out",
  ]),
  async (req, res, next) => {
    try {
      if (!assertSelf(req, res)) return;

      const { user_id, id } = req.params;
      const {
        workout_description,
        muscle,
        workout_date,
        minutes_worked_out,
        notes,
      } = req.body;

      const minutes = Number(minutes_worked_out);
      if (!Number.isFinite(minutes) || minutes <= 0) {
        return res
          .status(400)
          .json({ error: "minutes_worked_out must be a positive number" });
      }

      const userWorkout = await updateUserWorkout(
        id,
        user_id,
        workout_description,
        muscle,
        workout_date,
        minutes,
        notes ?? ""
      );

      if (!userWorkout) {
        return res.status(404).json({ error: "User workout not found" });
      }

      res.json(userWorkout);
    } catch (err) {
      next(err);
    }
  }
);

router.delete("/user/:user_id/:id", requireUser, async (req, res, next) => {
  try {
    if (!assertSelf(req, res)) return;

    const { user_id, id } = req.params;
    const deletedWorkout = await deleteUserWorkout(id, user_id);

    if (!deletedWorkout) {
      return res.status(404).json({ error: "User workout not found" });
    }

    res.json(deletedWorkout);
  } catch (err) {
    next(err);
  }
});

export default router;
