import express from "express";
const router = express.Router();
export default router;

import getUserFromToken from "#middleware/getUserFromToken";

router.route("/").get(async (req, res, next) => {
    const user = getUserFromToken(req, res, next);
    if (!user) return res.status(404).send("no user found");
    res.send(user);
})