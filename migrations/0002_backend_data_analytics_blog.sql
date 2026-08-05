-- Safe forward migration for AgentDock backend data systems.
-- Rollback note: D1 migrations are forward-only in this project. To roll back,
-- stop writing to the new APIs, export data from the tables below if needed,
-- then drop the 0002 tables/indexes manually. The legacy waitlist_entries table
-- is not altered or removed by this migration.

CREATE TABLE IF NOT EXISTS join_pro_requests (
  id TEXT PRIMARY KEY,
  legacy_waitlist_entry_id INTEGER UNIQUE,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  intended_use TEXT,
  selected_agents TEXT NOT NULL DEFAULT '[]',
  message TEXT,
  source_page TEXT,
  source TEXT,
  referrer TEXT,
  utm_source TEXT,
  utm_medium TEXT,
  utm_campaign TEXT,
  anonymous_session_id TEXT,
  status TEXT NOT NULL DEFAULT 'New' CHECK (status IN ('New', 'Contacted', 'Accepted', 'Rejected', 'Archived')),
  internal_notes TEXT,
  created_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')),
  updated_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now'))
);

CREATE UNIQUE INDEX IF NOT EXISTS join_pro_requests_email_unique
  ON join_pro_requests (email);
CREATE INDEX IF NOT EXISTS join_pro_requests_status_created_idx
  ON join_pro_requests (status, created_at);
CREATE INDEX IF NOT EXISTS join_pro_requests_created_idx
  ON join_pro_requests (created_at);
CREATE INDEX IF NOT EXISTS join_pro_requests_utm_idx
  ON join_pro_requests (utm_source, utm_medium, utm_campaign);

INSERT OR IGNORE INTO join_pro_requests (
  id,
  legacy_waitlist_entry_id,
  name,
  email,
  intended_use,
  selected_agents,
  source_page,
  source,
  status,
  created_at,
  updated_at
)
SELECT
  'legacy-waitlist-' || id,
  id,
  COALESCE(NULLIF(name, ''), 'Unknown'),
  lower(trim(email)),
  'Legacy waitlist signup',
  '[]',
  page_url,
  source,
  'New',
  created_at,
  created_at
FROM waitlist_entries
WHERE email IS NOT NULL AND trim(email) <> '';

CREATE TABLE IF NOT EXISTS contact_requests (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  contact_reason TEXT NOT NULL,
  message TEXT NOT NULL,
  source_page TEXT,
  anonymous_session_id TEXT,
  status TEXT NOT NULL DEFAULT 'New' CHECK (status IN ('New', 'Contacted', 'Resolved', 'Archived')),
  internal_notes TEXT,
  dedupe_key TEXT NOT NULL UNIQUE,
  created_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')),
  updated_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now'))
);

CREATE INDEX IF NOT EXISTS contact_requests_email_idx
  ON contact_requests (email);
CREATE INDEX IF NOT EXISTS contact_requests_status_created_idx
  ON contact_requests (status, created_at);
CREATE INDEX IF NOT EXISTS contact_requests_session_idx
  ON contact_requests (anonymous_session_id);

CREATE TABLE IF NOT EXISTS anonymous_funnel_events (
  id TEXT PRIMARY KEY,
  anonymous_session_id TEXT NOT NULL,
  event_name TEXT NOT NULL CHECK (event_name IN (
    'contact_cta_clicked',
    'contact_flow_opened',
    'contact_reason_selected',
    'contact_details_step_reached',
    'contact_final_step_reached',
    'contact_form_submitted',
    'contact_flow_abandoned',
    'join_pro_cta_clicked',
    'join_pro_form_opened',
    'join_pro_form_submitted'
  )),
  source_page TEXT,
  funnel_type TEXT CHECK (funnel_type IS NULL OR funnel_type IN ('contact', 'join_pro')),
  step TEXT,
  contact_reason TEXT,
  utm_source TEXT,
  utm_medium TEXT,
  utm_campaign TEXT,
  dedupe_key TEXT NOT NULL UNIQUE,
  created_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now'))
);

CREATE INDEX IF NOT EXISTS anonymous_funnel_events_name_created_idx
  ON anonymous_funnel_events (event_name, created_at);
CREATE INDEX IF NOT EXISTS anonymous_funnel_events_session_idx
  ON anonymous_funnel_events (anonymous_session_id);
CREATE INDEX IF NOT EXISTS anonymous_funnel_events_page_created_idx
  ON anonymous_funnel_events (source_page, created_at);
CREATE INDEX IF NOT EXISTS anonymous_funnel_events_utm_idx
  ON anonymous_funnel_events (utm_source, utm_medium, utm_campaign);

CREATE TABLE IF NOT EXISTS submission_rate_limits (
  scope TEXT NOT NULL,
  key_hash TEXT NOT NULL,
  window_start TEXT NOT NULL,
  count INTEGER NOT NULL DEFAULT 1,
  updated_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')),
  PRIMARY KEY (scope, key_hash, window_start)
);

CREATE INDEX IF NOT EXISTS submission_rate_limits_updated_idx
  ON submission_rate_limits (updated_at);

CREATE TABLE IF NOT EXISTS blog_posts (
  id TEXT PRIMARY KEY,
  slug TEXT NOT NULL UNIQUE,
  title TEXT NOT NULL,
  excerpt TEXT,
  content_markdown TEXT NOT NULL,
  content_blocks TEXT,
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'archived')),
  author TEXT,
  published_at TEXT,
  created_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')),
  updated_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now'))
);

CREATE INDEX IF NOT EXISTS blog_posts_status_published_idx
  ON blog_posts (status, published_at);
CREATE INDEX IF NOT EXISTS blog_posts_updated_idx
  ON blog_posts (updated_at);
