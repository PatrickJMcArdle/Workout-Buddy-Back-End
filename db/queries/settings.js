import db from "#db/client";

export async function createSettings(id) {
  const sql = `
    INSERT INTO settings (id)
    VALUES ($1)
    RETURNING *
  `;
  const {
    rows: [settings],
  } = await db.query(sql, [user_id]);
  return settings;
}

export async function getSettingsById(id) {
  const sql = `
  SELECT *
  FROM settings
  WHERE id = $1
  `;
  const {
    rows: [settings],
  } = await db.query(sql, [id]);
  return settings;
}

export async function updateTheme(id, theme) {
  const sql = `
    UPDATE settings
    SET theme = $1
    WHERE id = $2
    RETURNING *
  `;
  const {
    rows: [settings],
  } = await db.query(sql, [theme, id]);
  return settings;
}

export async function updateNotifications(id, notifications) {
  const sql = `
    UPDATE settings
    SET notifications = $1
    WHERE id = $2
    RETURNING *
  `;
  const {
    rows: [settings],
  } = await db.query(sql, [notifications, id]);
  return settings;
}

export async function updatePublicProfile(id, public_profile) {
  const sql = `
    UPDATE settings
    SET public_profile = $1
    WHERE id = $2
    RETURNING *
  `;
  const {
    rows: [settings],
  } = await db.query(sql, [public_profile, id]);
  return settings;
}

export async function updateLocationSharing(id, location_sharing) {
  const sql = `
    UPDATE settings
    SET location_sharing = $1
    WHERE id = $2
    RETURNING *
  `;
  const {
    rows: [settings],
  } = await db.query(sql, [location_sharing, id]);
  return settings;
}
