import db from "#db/client";

export async function createSettings(user_id) {
  const sql = `
    INSERT INTO settings (user_id)
    VALUES ($1)
    RETURNING *
  `;
  const {
    rows: [settings],
  } = await db.query(sql, [user_id]);
  return settings;
}

export async function getSettingsById(user_id) {
  const sql = `
  SELECT *
  FROM settings
  WHERE user_id = $1
  `;
  const {
    rows: [settings],
  } = await db.query(sql, [user_id]);
  return settings;
}

export async function updateTheme(user_id, theme) {
  const sql = `
    UPDATE settings
    SET theme = $1
    WHERE user_id = $2
    RETURNING *
  `;
  const {
    rows: [settings],
  } = await db.query(sql, [theme, user_id]);
  return settings;
}

export async function updateNotifications(user_id, notifications) {
  const sql = `
    UPDATE settings
    SET notifications = $1
    WHERE user_id = $2
    RETURNING *
  `;
  const {
    rows: [settings],
  } = await db.query(sql, [notifications, user_id]);
  return settings;
}

export async function updatePublicProfile(user_id, public_profile) {
  const sql = `
    UPDATE settings
    SET public_profile = $1
    WHERE user_id = $2
    RETURNING *
  `;
  const {
    rows: [settings],
  } = await db.query(sql, [public_profile, user_id]);
  return settings;
}

export async function updateLocationSharing(user_id, location_sharing) {
  const sql = `
    UPDATE settings
    SET location_sharing = $1
    WHERE user_id = $2
    RETURNING *
  `;
  const {
    rows: [settings],
  } = await db.query(sql, [location_sharing, user_id]);
  return settings;
}
