import express from "express";
const router = express.Router();
export default router;

import { getAllWorkouts } from "#db/queries/workouts";

router.route("/").get(async (req, res) => {
    const workouts = await getAllWorkouts();
    if (!workouts) return res.status(404).send("no workouts found");
    res.send(workouts);
})