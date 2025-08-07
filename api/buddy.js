import express from "express";
const router = express.Router();
export default router;

import { createBuddy, updateBuddyById, deleteBuddy } from "#db/queries/buddy";
import requireBody from "#middleware/requireBody";

router
  .route("/:id")
  .get(async (req, res) => {
    const { id } = req.params;
    const buddy = await getBuddyById(id);

    if (!buddy) {
      return res.status(404).send("Buddy not found");
    }

    res.send(buddy);
  })
  .put(requireBody(["skill", "level", "trainer_id"]), async (req, res) => {
    const { id } = req.params;
    const { skill, level, trainer_id } = req.body;
    const buddy = await updateBuddyById(id, skill, level, trainer_id);

    if (!buddy) {
      return res.status(404).send("Buddy not found");
    }

    res.send(buddy);
  })
  .delete(async (req, res) => {
    const { id } = req.params;
    const buddy = await deleteBuddy(id);

    if (!buddy) {
      return res.status(404).send("Buddy not found");
    }

    res.send(buddy);
  });

router
  .route("/")
  .post(requireBody(["skill", "level", "trainer_id"]), async (req, res) => {
    const { skill, level, trainer_id } = req.body;
    const buddy = await createBuddy(skill, level, trainer_id);
    res.status(201).send(buddy);
  });
