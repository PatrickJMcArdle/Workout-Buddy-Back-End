import express from "express";
const router = express.Router();
export default router;

import requireUser from "#middleware/requireUser";
import { getUserById } from "#db/queries/users";

router.use(requireUser)

router.route("/user").get(requireUser, async (req, res) => {
    const id = req.user.id
    const user = await getUserById(id)
    res.send(user)
})