import express from "express";
const router = express.Router();
export default router;

import {
  createUser,
  getUserByUsernameAndPassword,
  getUserById,
  traineeFindTrainer
} from "#db/queries/users";
import requireBody from "#middleware/requireBody";
import { createToken } from "#utils/jwt";

router
  .route("/register")
  .post(requireBody(["username", "password"]), async (req, res) => {
    const { username, password } = req.body;
    const user = await createUser(username, password);

    const token = await createToken({ id: user.id });
    res.status(201).send(token);
  });

router
  .route("/login")
  .post(requireBody(["username", "password"]), async (req, res) => {
    const { username, password } = req.body;
    const user = await getUserByUsernameAndPassword(username, password);
    if (!user) return res.status(401).send("Invalid username or password.");

    const token = await createToken({ id: user.id });
    res.send(token);
  });

router.route("/:id").get(async (req, res) => {
  const { id } = req.params;
  const user = await getUserById(id);

  if (!user) {
    return res.status(404).send("User couldn't be found");
  }
  res.send(user);
});

router.route("/trainers/:id").get(async (req, res) => {
  const {id} = req.params;
  const trainers = await traineeFindTrainer(id);
  if (!trainers) return res.status(404).send("no trainers found");
  res.send(trainers);
})