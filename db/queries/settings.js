import db from "#db/client";

export async function createSettings(user_id) {
  const sql = `
    INSERT INTO settings (user_id, theme, notifications, public_profile, location_sharing)
    VALUES ($1, 'L', true, true, true)
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

export async function updateAllSettings(user_id, settings) {
  const sql = `
    UPDATE settings
    SET theme = $1, notifications = $2, public_profile = $3, location_sharing = $4
    WHERE user_id = $5
    RETURNING *
  `;
  const {
    rows: [updatedSettings],
  } = await db.query(sql, [
    settings.theme,
    settings.notifications,
    settings.public_profile,
    settings.location_sharing,
    user_id,
  ]);
  return updatedSettings;
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
