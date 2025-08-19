import express from "express";
const app = express();
export default app;

import usersRouter from "#api/users";
import adminRouter from "#api/admin";
import getUserFromToken from "#middleware/getUserFromToken";
import handlePostgresErrors from "#middleware/handlePostgresErrors";
import homeRouter from "#api/home";
import mapRouter from "#api/map";
import settingsRouter from "#api/settings";
import cors from "cors";
import morgan from "morgan";
import workoutsRouter from "#api/workouts";
import goalsRouter from "#api/goals";
import achievementsRouter from "#api/achievements";


app.use(cors({ origin: process.env.CORS_ORIGIN ?? /localhost/ }));

app.use(morgan("dev"));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(getUserFromToken);

app.get("/", (req, res) => res.send("Hello, World!"));

app.use("/users", usersRouter);
app.use("/home", homeRouter);
app.use("/admin", adminRouter);
app.use("/map", mapRouter);
app.use("/workouts", workoutsRouter);
app.use("/settings", settingsRouter);
app.use("/goals", goalsRouter);
app.use("/achievements", achievementsRouter);

app.use(handlePostgresErrors);
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).send("Sorry! Something went wrong.");
});
