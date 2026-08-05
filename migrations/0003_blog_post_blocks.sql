-- Safe additive storage for structured blog blocks across legacy blog schemas.
-- Rollback note: export any needed rows from blog_post_blocks, then drop the
-- table and index. Existing blog_posts data is not altered.

CREATE TABLE IF NOT EXISTS blog_post_blocks (
  post_id TEXT PRIMARY KEY,
  content_blocks TEXT,
  updated_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now'))
);

CREATE INDEX IF NOT EXISTS blog_post_blocks_updated_idx
  ON blog_post_blocks (updated_at);
