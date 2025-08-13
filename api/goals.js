import express from "express";
const router = express.Router();
export default router;

import {
  getAllGoals,
  getGoalById,
  updateGoalById,
  getUserGoals,
  createUserGoal,
  updateUserGoalProgress,
  deleteUserGoal,
} from "#db/queries/goals";
import requireBody from "#middleware/requireBody";
import requireUser from "#middleware/requireUser";

router.route("/").get(async (req, res) => {
  const goals = await getAllGoals();
  res.send(goals);
});

router.route("/:id").get(async (req, res) => {
  const { id } = req.params;
  const goal = await getGoalById(id);
  if (!goal) {
    return res.status(404).send("Goal not found");
  }
  res.send(goal);
});

router.route("/:id").put(requireBody(["description"]), async (req, res) => {
  const { id } = req.params;
  const { description } = req.body;
  const goal = await updateGoalById(id, description);
  if (!goal) {
    return res.status(404).send("Goal not found");
  }
  res.send(goal);
});

router.route("/user/:user_id").get(requireUser, async (req, res) => {
  const { user_id } = req.params;
  const goals = await getUserGoals(user_id);
  if (!goals) return res.status(404).send("No goals found");
  res.send(goals);
});

router
  .route("/user/:user_id")
  .post(
    requireUser,
    requireBody(["goal_id", "target_value"]),
    async (req, res) => {
      const { user_id } = req.params;
      const { goal_id, target_value } = req.body;
      const userGoal = await createUserGoal(user_id, goal_id, target_value);
      res.send(userGoal);
    }
  );

router
  .route("/user/:user_id/progress")
  .put(requireUser, requireBody(["goal_id", "progress"]), async (req, res) => {
    const { user_id } = req.params;
    const { goal_id, progress } = req.body;
    const userGoal = await updateUserGoalProgress(user_id, goal_id, progress);
    res.send(userGoal);
  });

router
  .route("/user/:user_id/goal/:goal_id")
  .delete(requireUser, async (req, res) => {
    const { user_id, goal_id } = req.params;
    const userGoal = await deleteUserGoal(user_id, goal_id);
    if (!userGoal) {
      return res.status(404).send("User goal not found");
    }
    res.send(userGoal);
  });
