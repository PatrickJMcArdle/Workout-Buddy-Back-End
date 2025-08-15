// api/workouts.js
import express from "express";
import { getAllWorkouts, getWorkoutById } from "#db/queries/workouts";

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

export default router;
