CREATE TABLE IF NOT EXISTS aigency_waitlist (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  use_case TEXT,
  source TEXT NOT NULL DEFAULT 'agentdock-website',
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE UNIQUE INDEX IF NOT EXISTS idx_aigency_waitlist_email_normalized
  ON aigency_waitlist (lower(email));
