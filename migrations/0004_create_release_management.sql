CREATE TABLE IF NOT EXISTS release_settings (
  id INTEGER PRIMARY KEY CHECK (id = 1),
  main_heading TEXT NOT NULL,
  main_description TEXT NOT NULL,
  latest_version TEXT NOT NULL,
  github_releases_url TEXT NOT NULL,
  show_legacy_releases INTEGER NOT NULL DEFAULT 1,
  announcement TEXT NOT NULL DEFAULT '',
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS platform_releases (
  platform_key TEXT PRIMARY KEY CHECK (platform_key IN ('windows', 'macos', 'linux')),
  display_name TEXT NOT NULL,
  current_version TEXT NOT NULL DEFAULT '',
  is_available INTEGER NOT NULL DEFAULT 0,
  primary_download_url TEXT NOT NULL DEFAULT '',
  primary_button_label TEXT NOT NULL DEFAULT '',
  secondary_download_url TEXT NOT NULL DEFAULT '',
  secondary_button_label TEXT NOT NULL DEFAULT '',
  status_label TEXT NOT NULL DEFAULT 'Coming Soon' CHECK (status_label IN ('Available', 'Experimental', 'Coming Soon', 'Legacy')),
  release_note TEXT NOT NULL DEFAULT '',
  release_date TEXT,
  display_order INTEGER NOT NULL DEFAULT 0,
  is_visible INTEGER NOT NULL DEFAULT 1,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_platform_releases_public_order
  ON platform_releases (is_visible, display_order);

CREATE TABLE IF NOT EXISTS legacy_releases (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  version TEXT NOT NULL,
  platform TEXT NOT NULL,
  title TEXT NOT NULL,
  url TEXT NOT NULL,
  button_label TEXT NOT NULL DEFAULT 'Download',
  release_notes_url TEXT NOT NULL DEFAULT '',
  file_type TEXT NOT NULL DEFAULT '',
  arch TEXT NOT NULL DEFAULT '',
  display_order INTEGER NOT NULL DEFAULT 0,
  is_visible INTEGER NOT NULL DEFAULT 1,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_legacy_releases_public_order
  ON legacy_releases (is_visible, version, display_order);

INSERT INTO release_settings (
  id,
  main_heading,
  main_description,
  latest_version,
  github_releases_url,
  show_legacy_releases,
  announcement,
  updated_at
)
SELECT
  1,
  'Download AgentDock',
  'Available for Windows, macOS, and Linux (Experimental).',
  'v0.1.1',
  'https://github.com/crossainthero-lab/AgentDock/releases',
  1,
  '',
  CURRENT_TIMESTAMP
WHERE NOT EXISTS (
  SELECT 1 FROM release_settings WHERE id = 1
);

INSERT INTO platform_releases (
  platform_key,
  display_name,
  current_version,
  is_available,
  primary_download_url,
  primary_button_label,
  secondary_download_url,
  secondary_button_label,
  status_label,
  release_note,
  release_date,
  display_order,
  is_visible,
  updated_at
)
SELECT
  'windows',
  'Windows',
  'v0.1.1',
  1,
  'https://github.com/crossainthero-lab/AgentDock/releases/download/v0.1.1_windows/AgentDock.Setup.0.1.1.exe',
  'Installer',
  'https://github.com/crossainthero-lab/AgentDock/releases/download/v0.1.1_windows/AgentDock.0.1.1.exe',
  'Portable executable',
  'Available',
  'Recommended Windows release with installer and portable executable options.',
  NULL,
  10,
  1,
  CURRENT_TIMESTAMP
WHERE NOT EXISTS (
  SELECT 1 FROM platform_releases WHERE platform_key = 'windows'
);

INSERT INTO platform_releases (
  platform_key,
  display_name,
  current_version,
  is_available,
  primary_download_url,
  primary_button_label,
  secondary_download_url,
  secondary_button_label,
  status_label,
  release_note,
  release_date,
  display_order,
  is_visible,
  updated_at
)
SELECT
  'macos',
  'macOS',
  'v0.1.0',
  1,
  'https://github.com/crossainthero-lab/AgentDock/releases/download/v0.1.0_macOS/AgentDock-0.1.0-arm64.dmg',
  'Apple Silicon DMG',
  'https://github.com/crossainthero-lab/AgentDock/releases/download/v0.1.0_macOS/AgentDock-0.1.0.dmg',
  'Intel Mac DMG',
  'Available',
  'DMG packages are available for Apple Silicon and Intel Macs.',
  NULL,
  20,
  1,
  CURRENT_TIMESTAMP
WHERE NOT EXISTS (
  SELECT 1 FROM platform_releases WHERE platform_key = 'macos'
);

INSERT INTO platform_releases (
  platform_key,
  display_name,
  current_version,
  is_available,
  primary_download_url,
  primary_button_label,
  secondary_download_url,
  secondary_button_label,
  status_label,
  release_note,
  release_date,
  display_order,
  is_visible,
  updated_at
)
SELECT
  'linux',
  'Linux',
  '',
  0,
  '',
  'Download package',
  '',
  '',
  'Experimental',
  'Linux builds are currently experimental. Please install from source below.',
  NULL,
  30,
  1,
  CURRENT_TIMESTAMP
WHERE NOT EXISTS (
  SELECT 1 FROM platform_releases WHERE platform_key = 'linux'
);

INSERT INTO legacy_releases (
  version,
  platform,
  title,
  url,
  button_label,
  release_notes_url,
  file_type,
  arch,
  display_order,
  is_visible,
  updated_at
)
SELECT
  'v0.1.0',
  'Windows',
  'Windows Installer',
  'https://github.com/crossainthero-lab/AgentDock/releases/download/v0.1.0_windows/AgentDock.Setup.0.1.0.exe',
  'Download',
  'https://github.com/crossainthero-lab/AgentDock/releases/tag/v0.1.0_windows',
  '.exe',
  'x64',
  10,
  1,
  CURRENT_TIMESTAMP
WHERE NOT EXISTS (
  SELECT 1 FROM legacy_releases WHERE version = 'v0.1.0' AND title = 'Windows Installer'
);

INSERT INTO legacy_releases (
  version,
  platform,
  title,
  url,
  button_label,
  release_notes_url,
  file_type,
  arch,
  display_order,
  is_visible,
  updated_at
)
SELECT
  'v0.1.0',
  'Windows',
  'Windows Portable',
  'https://github.com/crossainthero-lab/AgentDock/releases/download/v0.1.0_windows/AgentDock.0.1.0.exe',
  'Download',
  'https://github.com/crossainthero-lab/AgentDock/releases/tag/v0.1.0_windows',
  '.exe',
  'x64',
  20,
  1,
  CURRENT_TIMESTAMP
WHERE NOT EXISTS (
  SELECT 1 FROM legacy_releases WHERE version = 'v0.1.0' AND title = 'Windows Portable'
);
