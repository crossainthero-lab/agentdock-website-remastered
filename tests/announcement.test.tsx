import assert from "node:assert/strict";
import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { MemoryRouter } from "react-router-dom";
import { AnnouncementBar, getAnnouncementDismissalKey } from "../src/components/AnnouncementBar";
import {
  getAnnouncementSettings,
  updateAnnouncementSettings,
  type CmsDatabase,
} from "../functions/_lib/cms";
import { onRequestGet as getAdminAnnouncement } from "../functions/api/admin/announcement";
import { onRequestGet as getPublicAnnouncement } from "../functions/api/announcement";
import type { SiteAnnouncement } from "../src/types/cms";

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

class FailingSettingsDb extends MockSettingsDb {
  prepare() {
    return {
      bind() {
        return this;
      },
      async first<T>() {
        throw new Error("D1_ERROR: database is temporarily unavailable");
      },
      async all<T>() {
        return { results: [] as T[], meta: { changes: 0, rows_written: 0, last_row_id: 0 } };
      },
      async run<T>() {
        throw new Error("D1_ERROR: database is temporarily unavailable");
      },
    };
  }
}

async function responseJson(response: Response) {
  return response.json() as Promise<Record<string, unknown>>;
}

function announcement(overrides: Partial<SiteAnnouncement> = {}): SiteAnnouncement {
  return {
    enabled: true,
    text: "AgentDock v0.1.1 is now available for Windows.",
    linkText: "",
    linkUrl: "",
    openInNewTab: false,
    dismissible: false,
    version: "test-version",
    updatedAt: null,
    ...overrides,
  };
}

function renderAnnouncement(overrides: Partial<SiteAnnouncement> = {}) {
  return renderToStaticMarkup(
    <MemoryRouter>
      <AnnouncementBar announcement={announcement(overrides)} />
    </MemoryRouter>,
  );
}

const tests: Array<[string, () => Promise<void> | void]> = [
  [
    "enabled announcement renders",
    () => {
      const html = renderAnnouncement();
      assert.match(html, /AgentDock v0\.1\.1 is now available for Windows\./);
    },
  ],
  [
    "disabled announcement is hidden",
    () => {
      const html = renderAnnouncement({ enabled: false, text: "Hidden" });
      assert.equal(html, "");
    },
  ],
  [
    "text-only announcement renders without a link",
    () => {
      const html = renderAnnouncement({ text: "Windows build is ready." });
      assert.match(html, /Windows build is ready\./);
      assert.doesNotMatch(html, /<a /);
    },
  ],
  [
    "announcement with external link renders configured safe new-tab attributes",
    () => {
      const html = renderAnnouncement({
        text: "Windows build is ready.",
        linkText: "Download now",
        linkUrl: "https://github.com/crossainthero-lab/AgentDock/releases/download/v0.1.1_windows/AgentDock.Setup.0.1.1.exe",
        openInNewTab: true,
      });
      assert.match(html, /href="https:\/\/github\.com\/crossainthero-lab\/AgentDock\/releases\/download\/v0\.1\.1_windows\/AgentDock\.Setup\.0\.1\.1\.exe"/);
      assert.match(html, /target="_blank"/);
      assert.match(html, /rel="noopener noreferrer"/);
      assert.match(html, /Download now/);
    },
  ],
  [
    "external link can open in the same tab",
    () => {
      const html = renderAnnouncement({
        linkText: "Download now",
        linkUrl: "https://example.com/download",
        openInNewTab: false,
      });
      assert.match(html, /href="https:\/\/example\.com\/download"/);
      assert.doesNotMatch(html, /target="_blank"/);
      assert.doesNotMatch(html, /rel="noopener noreferrer"/);
    },
  ],
  [
    "same-tab internal link uses router link markup",
    () => {
      const html = renderAnnouncement({ linkText: "Read more", linkUrl: "/blog", openInNewTab: false });
      assert.match(html, /href="\/blog"/);
      assert.doesNotMatch(html, /target="_blank"/);
    },
  ],
  [
    "dismissible announcement renders dismiss button and stable storage key",
    () => {
      const html = renderAnnouncement({ dismissible: true, version: "release-2" });
      assert.match(html, /aria-label="Dismiss announcement"/);
      assert.equal(getAnnouncementDismissalKey(announcement({ version: "release-2" })), "agentdock-announcement-dismissed:release-2");
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
        openInNewTab: true,
        dismissible: true,
      });
      assert.equal(response.status, 200);

      const settings = await getAnnouncementSettings(db);
      assert.deepEqual(
        {
          enabled: settings.enabled,
          text: settings.text,
          linkText: settings.linkText,
          linkUrl: settings.linkUrl,
          openInNewTab: settings.openInNewTab,
          dismissible: settings.dismissible,
          version: Boolean(settings.version),
        },
        {
          enabled: true,
          text: "AgentDock v0.1.1 is now available for Windows.",
          linkText: "Download now",
          linkUrl: "https://github.com/crossainthero-lab/AgentDock/releases/download/v0.1.1_windows/AgentDock.Setup.0.1.1.exe",
          openInNewTab: true,
          dismissible: true,
          version: true,
        },
      );
    },
  ],
  [
    "unchanged announcement save preserves version and material change updates it",
    async () => {
      const db = new MockSettingsDb();
      await updateAnnouncementSettings(db, {
        enabled: true,
        text: "Release is ready.",
        linkText: "Download now",
        linkUrl: "https://example.com/download",
        openInNewTab: true,
        dismissible: true,
      });
      const first = await getAnnouncementSettings(db);

      await updateAnnouncementSettings(db, {
        enabled: true,
        text: "Release is ready.",
        linkText: "Download now",
        linkUrl: "https://example.com/download",
        openInNewTab: true,
        dismissible: true,
        updatedAt: first.updatedAt,
      });
      const unchanged = await getAnnouncementSettings(db);
      assert.equal(unchanged.version, first.version);

      await updateAnnouncementSettings(db, {
        enabled: true,
        text: "Release 2 is ready.",
        linkText: "Download now",
        linkUrl: "https://example.com/download",
        openInNewTab: true,
        dismissible: true,
        updatedAt: unchanged.updatedAt,
      });
      const changed = await getAnnouncementSettings(db);
      assert.notEqual(changed.version, first.version);
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
    "root-relative announcement URL is accepted",
    async () => {
      const response = await updateAnnouncementSettings(new MockSettingsDb(), {
        enabled: true,
        text: "Read the latest update.",
        linkText: "Read more",
        linkUrl: "/blog",
        openInNewTab: false,
        dismissible: false,
      });
      assert.equal(response.status, 200);
    },
  ],
  [
    "legacy external announcement defaults to opening in a new tab",
    async () => {
      const db = new MockSettingsDb();
      db.setting = {
        setting_key: "announcement_bar",
        setting_value: JSON.stringify({
          enabled: true,
          text: "Legacy release.",
          linkText: "Download",
          linkUrl: "https://example.com/download",
        }),
        created_at: "2026-08-07T00:00:00.000Z",
        updated_at: "2026-08-07T00:00:00.000Z",
      };

      const settings = await getAnnouncementSettings(db);
      assert.equal(settings.openInNewTab, true);
      assert.match(settings.version, /^legacy-/);
    },
  ],
  [
    "public announcement endpoint omits admin updatedAt",
    async () => {
      const db = new MockSettingsDb();
      await updateAnnouncementSettings(db, {
        enabled: true,
        text: "Release is ready.",
        linkText: "Download now",
        linkUrl: "https://example.com/download",
        openInNewTab: true,
        dismissible: true,
      });

      const response = await getPublicAnnouncement({ env: { WAITLIST_DB: db } });
      const body = await responseJson(response);
      assert.equal(body.ok, true);
      const data = body.data as Record<string, unknown>;
      assert.equal(data.updatedAt, undefined);
      assert.equal(data.version !== undefined, true);
    },
  ],
  [
    "public announcement endpoint fails closed when database read fails",
    async () => {
      const originalConsoleError = console.error;
      console.error = () => undefined;
      try {
        const response = await getPublicAnnouncement({ env: { WAITLIST_DB: new FailingSettingsDb() } });
        const body = await responseJson(response);
        assert.equal(response.status, 200);
        assert.deepEqual(body, {
          ok: true,
          data: {
            enabled: false,
            text: "",
            linkText: "",
            linkUrl: "",
            openInNewTab: false,
            dismissible: false,
            version: "unavailable",
          },
        });
      } finally {
        console.error = originalConsoleError;
      }
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
        openInNewTab: false,
        dismissible: false,
        version: "default",
        updatedAt: null,
      });
    },
  ],
];

for (const [name, run] of tests) {
  await run();
  console.log(`ok - ${name}`);
}
