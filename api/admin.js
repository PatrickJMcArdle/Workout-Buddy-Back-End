import express from "express";
const router = express.Router();
export default router;

import { createTrainer } from "#db/queries/users";
import requireAdmin from "#middleware/requireAdmin";
import { getUsers } from "#db/queries/users";


router.route("/").get(requireAdmin, async (req, res) => {
    const users = await getUsers();
    if (!users) return res.status(404).send("no users found");
    res.send(users);
})

router.route("/admin/trainers/:id").put(requireAdmin, async (req, res) => {
  const { id } = req.params;
  const changedAccount = await createTrainer(id);
  if (!changedAccount) return res.status(404).send("account not found");
  res.status(200).send("account changed to trainer");
});

