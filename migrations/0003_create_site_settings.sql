CREATE TABLE IF NOT EXISTS site_settings (
  setting_key TEXT PRIMARY KEY,
  setting_value TEXT NOT NULL,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO site_settings (
  setting_key,
  setting_value,
  updated_at
)
SELECT
  'announcement_bar',
  '{"enabled":true,"text":"AgentDock v0.1.1 is now available for Windows.","linkText":"Download now","linkUrl":"https://github.com/crossainthero-lab/AgentDock/releases/download/v0.1.1_windows/AgentDock.Setup.0.1.1.exe"}',
  CURRENT_TIMESTAMP
WHERE NOT EXISTS (
  SELECT 1 FROM site_settings WHERE setting_key = 'announcement_bar'
);
