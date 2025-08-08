import express from "express";
const router = express.Router();
export default router;

import {
  createSettings,
  getSettingsById,
  updateTheme,
  updateNotifications,
  updatePublicProfile,
  updateLocationSharing,
} from "#db/queries/settings";
import requireBody from "#middleware/requireBody";

router.route("/").post(requireBody(["user_id"]), async (req, res) => {
  const { user_id } = req.body;
  const settings = await createSettings(user_id);
  res.status(201).send(settings);
});

router.route("/:user_id").get(async (req, res) => {
  const { user_id } = req.params;
  const settings = await getSettingsById(user_id);

  if (!settings) {
    return res.status(404).send("Settings not found");
  }

  res.send(settings);
});

router
  .route("/:user_id/theme")
  .put(requireBody(["theme"]), async (req, res) => {
    const { user_id } = req.params;
    const { theme } = req.body;

    if (!["L", "D"].includes(theme)) {
      return res.status(400).send("Theme must be 'L' or 'D'");
    }

    const settings = await updateTheme(user_id, theme);

    if (!settings) {
      return res.status(404).send("Settings not found");
    }

    res.send(settings);
  });

router
  .route("/:user_id/notifications")
  .put(requireBody(["notifications"]), async (req, res) => {
    const { user_id } = req.params;
    const { notifications } = req.body;

    const settings = await updateNotifications(user_id, notifications);

    if (!settings) {
      return res.status(404).send("Settings not found");
    }

    res.send(settings);
  });

router
  .route("/:user_id/public_profile")
  .put(requireBody(["public_profile"]), async (req, res) => {
    const { user_id } = req.params;
    const { public_profile } = req.body;

    const settings = await updatePublicProfile(user_id, public_profile);

    if (!settings) {
      return res.status(404).send("Settings not found");
    }

    res.send(settings);
  });

router
  .route("/:user_id/location_sharing")
  .put(requireBody(["location_sharing"]), async (req, res) => {
    const { user_id } = req.params;
    const { location_sharing } = req.body;

    const settings = await updateLocationSharing(user_id, location_sharing);

    if (!settings) {
      return res.status(404).send("Settings not found");
    }

    res.send(settings);
  });
