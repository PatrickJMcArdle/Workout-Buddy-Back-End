import express from "express";
const router = express.Router();
export default router;

import {
  createUser,
  getUserByUsernameAndPassword,
  getUserById,
  traineeFindTrainer,
  trainerFindTrainees,
  createTrainer,
} from "#db/queries/users";
import requireBody from "#middleware/requireBody";
import { createToken } from "#utils/jwt";
import requireUser from "#middleware/requireUser";
import requireAdmin from "#middleware/requireAdmin";

router
  .route("/register")
  .post(
    requireBody(["username", "password", "first_name"]),
    async (req, res) => {
      const { username, password, first_name } = req.body;
      const user = await createUser(username, password, first_name);

      const token = await createToken({ id: user.id });
      res.status(201).send(token);
    }
  );

router
  .route("/login")
  .post(requireBody(["username", "password"]), async (req, res) => {
    const { username, password } = req.body;
    const user = await getUserByUsernameAndPassword(username, password);
    if (!user) return res.status(401).send("Invalid username or password.");

    const token = await createToken({ id: user.id });
    res.send(token);
  });

router.route("/:id").get(requireUser, async (req, res) => {
  const { id } = req.params;
  const user = await getUserById(id);

  if (!user) {
    return res.status(404).send("User couldn't be found");
  }
  res.send(user);
});

router.route("/trainers/:id").get(requireUser, async (req, res) => {
  const { id } = req.params;
  let { goal, preferred_trainer } = req.query;
  if (goal === "") {
    goal = null;
  }
  if (preferred_trainer === "") {
    preferred_trainer = null;
  }
  const trainers = await traineeFindTrainer(id, goal, preferred_trainer);
  if (!trainers) return res.status(404).send("no trainers found");
  res.send(trainers);
});

router
  .route("/trainees/:id")
  .get(requireUser, async (req, res) => {
    const { id } = req.params;
    let { goal, preferred_trainer } = req.query;
    if (goal === "") {
      goal = null;
    }
    if (preferred_trainer === "") {
      preferred_trainer = null;
    }
    const trainees = await trainerFindTrainees(id, goal, preferred_trainer);
    if (!trainees) return res.status(404).send("no trainees found");
    res.send(trainees);
  })
  .put(requireUser, async (req, res) => {
    const { id } = req.params;
    const { username, name, gender, birthday } = req.body;

    const updatedUser = await changeProfile(
      id,
      username,
      name,
      gender,
      birthday
    );
    res.send(updatedUser);
  });

router.route("/:id/fitness-goal").put(requireUser, async (req, res) => {
  const { id } = req.params;
  const { fitness_goal } = req.body;

  const updatedUser = await changeFitnessGoal(id, fitness_goal);
  res.send(updatedUser);
});
