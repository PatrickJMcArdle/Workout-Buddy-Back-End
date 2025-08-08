import db from "#db/client";

export async function getAllPosts() {
  const sql = `
    SELECT * FROM posts
    `;
  const { rows: posts } = await db.query(sql);
  return posts;
}

export async function insertPost(title, body, user_id, status) {
  const sql = `
    INSERT INTO posts
        (title, body, user_id, status)
    VALUES
        ($1, $2, $3, $4)
    RETURNING *
    `;
  const {
    rows: [post],
  } = await db.query(sql, [title, body, user_id, status]);
  return post;
}

export async function removePost(id) {
  const sql = `
    DELETE FROM posts
    WHERE id = $1
    RETURNING *
    `;
  const {
    rows: [post],
  } = await db.query(sql, [id]);
  return post;
}

export async function updatePostById(id, title, body, user_id, status) {
  const sql = `
    UPDATE posts
    SET title = $1,
        body = $2,
        user_id = $3,
        status = $4
    WHERE id = $5
    RETURNING *
  `;
  const {
    rows: [post],
  } = await db.query(sql, [title, body, user_id, status, id]);
  return post;
}


