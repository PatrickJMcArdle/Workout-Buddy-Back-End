// api/workouts.js
import express from "express";
import {
  getAllWorkouts,
  getWorkoutById,
  addWorkout,
  getUserWorkouts,
  updateUserWorkout,
  deleteUserWorkout,
} from "#db/queries/workouts";

const router = express.Router();

router.get("/", async (req, res, next) => {
  try {
    const workouts = await getAllWorkouts();
    if (!workouts.length) return res.status(404).send("no workouts found");

    res.send(workouts);
  } catch (err) {
    next(err);
  }
});

router.get("/:id", async (req, res, next) => {
  try {
    const w = await getWorkoutById(req.params.id);
    if (!w) return res.status(404).send("workout not found");
    res.send(w);
  } catch (err) {
    next(err);
  }
});

router.route("/user/:user_id").get(async (req, res) => {
  const { user_id } = req.params;
  const userWorkouts = await getUserWorkouts(user_id);
  res.send(userWorkouts);
});

router
  .route("/user/:user_id")
  .post(
    requireBody([
      "workout_description",
      "muscle",
      "workout_date",
      "minutes_worked_out",
    ]),
    async (req, res) => {
      const { user_id } = req.params;
      const {
        workout_description,
        muscle,
        workout_date,
        minutes_worked_out,
        notes,
      } = req.body;

      if (minutes_worked_out <= 0) {
        return res
          .status(400)
          .send("minutes_worked_out must be greater than 0");
      }

      const userWorkout = await addWorkout(
        user_id,
        workout_description,
        muscle,
        workout_date,
        minutes_worked_out,
        notes
      );

      res.status(201).send(userWorkout);
    }
  );

router
  .route("/user/:user_id/:id")
  .put(
    requireBody([
      "workout_description",
      "muscle",
      "workout_date",
      "minutes_worked_out",
    ]),
    async (req, res) => {
      const { user_id, id } = req.params;
      const {
        workout_description,
        muscle,
        workout_date,
        minutes_worked_out,
        notes,
      } = req.body;

      if (minutes_worked_out <= 0) {
        return res
          .status(400)
          .send("minutes_worked_out must be greater than 0");
      }

      const userWorkout = await updateUserWorkout(
        id,
        user_id,
        workout_description,
        muscle,
        workout_date,
        minutes_worked_out,
        notes
      );

      if (!userWorkout) {
        return res.status(404).send("User workout not found");
      }

      res.send(userWorkout);
    }
  );

router.route("/user/:user_id/:id").delete(async (req, res) => {
  const { user_id, id } = req.params;
  const deletedWorkout = await deleteUserWorkout(id, user_id);

  if (!deletedWorkout) {
    return res.status(404).send("User workout not found");
  }

  res.send(deletedWorkout);
});

export default router;
