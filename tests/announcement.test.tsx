import assert from "node:assert/strict";
import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { AnnouncementBar } from "../src/components/AnnouncementBar";
import {
  getAnnouncementSettings,
  updateAnnouncementSettings,
  type CmsDatabase,
} from "../functions/_lib/cms";
import { onRequestGet as getAdminAnnouncement } from "../functions/api/admin/announcement";

type SettingRow = {
  setting_key: string;
  setting_value: string;
  created_at: string;
  updated_at: string;
};

class MockSettingsDb implements CmsDatabase {
  public setting: SettingRow | null = null;
  private tick = 0;

  prepare(query: string) {
    const db = this;
    let values: unknown[] = [];

    return {
      bind(...bound: unknown[]) {
        values = bound;
        return this;
      },
      async first<T>() {
        if (query.includes("FROM site_settings")) {
          return db.setting && db.setting.setting_key === values[0] ? db.setting as T : null;
        }

        return null;
      },
      async all<T>() {
        return { results: [] as T[], meta: { changes: 0, rows_written: 0, last_row_id: 0 } };
      },
      async run<T>() {
        if (query.includes("INSERT INTO site_settings")) {
          const now = db.timestamp();
          db.setting = {
            setting_key: values[0] as string,
            setting_value: values[1] as string,
            created_at: db.setting?.created_at ?? now,
            updated_at: now,
          };
          return { results: [] as T[], meta: { changes: 1, rows_written: 1, last_row_id: 1 } };
        }

        return { results: [] as T[], meta: { changes: 0, rows_written: 0, last_row_id: 0 } };
      },
    };
  }

  private timestamp() {
    this.tick += 1;
    return new Date(1_800_000_000_000 + this.tick * 1000).toISOString();
  }
}

class MissingSettingsTableDb extends MockSettingsDb {
  prepare() {
    return {
      bind() {
        return this;
      },
      async first<T>() {
        throw new Error("D1_ERROR: no such table: site_settings");
      },
      async all<T>() {
        return { results: [] as T[], meta: { changes: 0, rows_written: 0, last_row_id: 0 } };
      },
      async run<T>() {
        throw new Error("D1_ERROR: no such table: site_settings");
      },
    };
  }
}

async function responseJson(response: Response) {
  return response.json() as Promise<Record<string, unknown>>;
}

const tests: Array<[string, () => Promise<void> | void]> = [
  [
    "enabled announcement renders",
    () => {
      const html = renderToStaticMarkup(
        <AnnouncementBar announcement={{ enabled: true, text: "AgentDock v0.1.1 is now available for Windows.", linkText: "", linkUrl: "", updatedAt: null }} />,
      );
      assert.match(html, /AgentDock v0\.1\.1 is now available for Windows\./);
    },
  ],
  [
    "disabled announcement is hidden",
    () => {
      const html = renderToStaticMarkup(
        <AnnouncementBar announcement={{ enabled: false, text: "Hidden", linkText: "", linkUrl: "", updatedAt: null }} />,
      );
      assert.equal(html, "");
    },
  ],
  [
    "text-only announcement renders without a link",
    () => {
      const html = renderToStaticMarkup(
        <AnnouncementBar announcement={{ enabled: true, text: "Windows build is ready.", linkText: "", linkUrl: "", updatedAt: null }} />,
      );
      assert.match(html, /Windows build is ready\./);
      assert.doesNotMatch(html, /<a /);
    },
  ],
  [
    "announcement with external link renders safe link attributes",
    () => {
      const html = renderToStaticMarkup(
        <AnnouncementBar announcement={{ enabled: true, text: "Windows build is ready.", linkText: "Download now", linkUrl: "https://github.com/crossainthero-lab/AgentDock/releases/download/v0.1.1_windows/AgentDock.Setup.0.1.1.exe", updatedAt: null }} />,
      );
      assert.match(html, /href="https:\/\/github\.com\/crossainthero-lab\/AgentDock\/releases\/download\/v0\.1\.1_windows\/AgentDock\.Setup\.0\.1\.1\.exe"/);
      assert.match(html, /target="_blank"/);
      assert.match(html, /rel="noopener noreferrer"/);
      assert.match(html, /Download now/);
    },
  ],
  [
    "admin announcement endpoint requires authentication",
    async () => {
      const response = await getAdminAnnouncement({
        request: new Request("https://example.com/api/admin/announcement"),
        env: { WAITLIST_DB: new MockSettingsDb(), ADMIN_SESSION_SECRET: "secret" },
      });
      assert.equal(response.status, 401);
    },
  ],
  [
    "valid announcement settings update is persisted",
    async () => {
      const db = new MockSettingsDb();
      const response = await updateAnnouncementSettings(db, {
        enabled: true,
        text: "  AgentDock v0.1.1 is now available for Windows.  ",
        linkText: "  Download now  ",
        linkUrl: "  https://github.com/crossainthero-lab/AgentDock/releases/download/v0.1.1_windows/AgentDock.Setup.0.1.1.exe  ",
      });
      assert.equal(response.status, 200);

      const settings = await getAnnouncementSettings(db);
      assert.deepEqual(
        {
          enabled: settings.enabled,
          text: settings.text,
          linkText: settings.linkText,
          linkUrl: settings.linkUrl,
        },
        {
          enabled: true,
          text: "AgentDock v0.1.1 is now available for Windows.",
          linkText: "Download now",
          linkUrl: "https://github.com/crossainthero-lab/AgentDock/releases/download/v0.1.1_windows/AgentDock.Setup.0.1.1.exe",
        },
      );
    },
  ],
  [
    "invalid announcement URL is rejected",
    async () => {
      const response = await updateAnnouncementSettings(new MockSettingsDb(), {
        enabled: true,
        text: "Release is ready.",
        linkText: "Download now",
        linkUrl: "javascript:alert(1)",
      });
      assert.equal(response.status, 400);
      assert.equal((await responseJson(response)).ok, false);
    },
  ],
  [
    "missing site settings table falls back to disabled announcement",
    async () => {
      const settings = await getAnnouncementSettings(new MissingSettingsTableDb());
      assert.deepEqual(settings, {
        enabled: false,
        text: "",
        linkText: "",
        linkUrl: "",
        updatedAt: null,
      });
    },
  ],
];

for (const [name, run] of tests) {
  await run();
  console.log(`ok - ${name}`);
}
