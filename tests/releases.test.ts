import assert from "node:assert/strict";
import { fallbackReleaseData } from "../src/config/downloads";
import {
  getPublicReleaseManagement,
  getReleaseManagement,
  updateReleaseManagement,
  type CmsDatabase,
} from "../functions/_lib/cms";
import { onRequestGet as getAdminReleases } from "../functions/api/admin/releases";
import type { PlatformRelease, ReleaseManagement } from "../src/types/cms";

type ReleaseSettingsRow = {
  main_heading: string;
  main_description: string;
  latest_version: string;
  github_releases_url: string;
  show_legacy_releases: number;
  announcement: string;
  updated_at: string;
};

type PlatformRow = {
  platform_key: PlatformRelease["platformKey"];
  display_name: string;
  current_version: string;
  is_available: number;
  primary_download_url: string;
  primary_button_label: string;
  secondary_download_url: string;
  secondary_button_label: string;
  status_label: PlatformRelease["statusLabel"];
  release_note: string;
  release_date: string | null;
  display_order: number;
  is_visible: number;
  updated_at: string;
};

type LegacyRow = {
  id: number;
  version: string;
  platform: string;
  title: string;
  url: string;
  button_label: string;
  release_notes_url: string;
  file_type: string;
  arch: string;
  display_order: number;
  is_visible: number;
};

class MockReleaseDb implements CmsDatabase {
  private tick = 0;
  public settings: ReleaseSettingsRow | null = this.settingsFromFallback();
  public platforms: PlatformRow[] = fallbackReleaseData.platforms.map((platform) => this.platformFromFallback(platform));
  public legacy: LegacyRow[] = fallbackReleaseData.legacyReleases.map((asset) => ({
    id: asset.id,
    version: asset.version,
    platform: asset.platform,
    title: asset.title,
    url: asset.url,
    button_label: asset.buttonLabel,
    release_notes_url: asset.releaseNotesUrl,
    file_type: asset.fileType,
    arch: asset.arch,
    display_order: asset.displayOrder,
    is_visible: asset.isVisible ? 1 : 0,
  }));

  prepare(query: string) {
    const db = this;
    let values: unknown[] = [];

    return {
      bind(...bound: unknown[]) {
        values = bound;
        return this;
      },
      async first<T>() {
        if (query.includes("FROM release_settings")) {
          return db.settings as T | null;
        }

        return null;
      },
      async all<T>() {
        if (query.includes("FROM platform_releases")) {
          const rows = query.includes("WHERE is_visible = 1")
            ? db.platforms.filter((platform) => platform.is_visible === 1)
            : db.platforms;
          return { results: [...rows].sort((a, b) => a.display_order - b.display_order) as T[] };
        }

        if (query.includes("FROM legacy_releases")) {
          const rows = query.includes("WHERE is_visible = 1")
            ? db.legacy.filter((asset) => asset.is_visible === 1)
            : db.legacy;
          return { results: [...rows].sort((a, b) => a.display_order - b.display_order) as T[] };
        }

        return { results: [] as T[] };
      },
      async run<T>() {
        if (query.includes("INSERT INTO release_settings")) {
          db.settings = {
            main_heading: values[0] as string,
            main_description: values[1] as string,
            latest_version: values[2] as string,
            github_releases_url: values[3] as string,
            show_legacy_releases: Number(values[4]),
            announcement: values[5] as string,
            updated_at: db.timestamp(),
          };
        }

        if (query.includes("INSERT INTO platform_releases")) {
          const platformKey = values[0] as PlatformRelease["platformKey"];
          const row: PlatformRow = {
            platform_key: platformKey,
            display_name: values[1] as string,
            current_version: values[2] as string,
            is_available: Number(values[3]),
            primary_download_url: values[4] as string,
            primary_button_label: values[5] as string,
            secondary_download_url: values[6] as string,
            secondary_button_label: values[7] as string,
            status_label: values[8] as PlatformRelease["statusLabel"],
            release_note: values[9] as string,
            release_date: values[10] as string | null,
            display_order: Number(values[11]),
            is_visible: Number(values[12]),
            updated_at: db.timestamp(),
          };
          db.platforms = db.platforms.filter((platform) => platform.platform_key !== platformKey);
          db.platforms.push(row);
        }

        return { results: [] as T[], meta: { changes: 1, rows_written: 1, last_row_id: 1 } };
      },
    };
  }

  private settingsFromFallback(): ReleaseSettingsRow {
    return {
      main_heading: fallbackReleaseData.settings.mainHeading,
      main_description: fallbackReleaseData.settings.mainDescription,
      latest_version: fallbackReleaseData.settings.latestVersion,
      github_releases_url: fallbackReleaseData.settings.githubReleasesUrl,
      show_legacy_releases: fallbackReleaseData.settings.showLegacyReleases ? 1 : 0,
      announcement: fallbackReleaseData.settings.announcement,
      updated_at: this.timestamp(),
    };
  }

  private platformFromFallback(platform: PlatformRelease): PlatformRow {
    return {
      platform_key: platform.platformKey,
      display_name: platform.displayName,
      current_version: platform.currentVersion,
      is_available: platform.isAvailable ? 1 : 0,
      primary_download_url: platform.primaryDownloadUrl,
      primary_button_label: platform.primaryButtonLabel,
      secondary_download_url: platform.secondaryDownloadUrl,
      secondary_button_label: platform.secondaryButtonLabel,
      status_label: platform.statusLabel,
      release_note: platform.releaseNote,
      release_date: platform.releaseDate,
      display_order: platform.displayOrder,
      is_visible: platform.isVisible ? 1 : 0,
      updated_at: this.timestamp(),
    };
  }

  private timestamp() {
    this.tick += 1;
    return new Date(1_800_000_000_000 + this.tick * 1000).toISOString();
  }
}

class MissingReleaseTablesDb extends MockReleaseDb {
  prepare() {
    return {
      bind() {
        return this;
      },
      async first<T>() {
        throw new Error("D1_ERROR: no such table: release_settings");
      },
      async all<T>() {
        throw new Error("D1_ERROR: no such table: platform_releases");
      },
      async run<T>() {
        throw new Error("D1_ERROR: no such table: release_settings");
      },
    };
  }
}

function releaseDraft(patch?: Partial<ReleaseManagement>): ReleaseManagement {
  return {
    settings: {
      ...fallbackReleaseData.settings,
      mainHeading: "Download AgentDock",
      mainDescription: "Managed release copy.",
      latestVersion: "v0.2.0",
      githubReleasesUrl: "https://github.com/crossainthero-lab/AgentDock/releases",
      announcement: "",
      updatedAt: null,
      ...(patch?.settings ?? {}),
    },
    platforms: fallbackReleaseData.platforms.map((platform) => ({ ...platform })),
    legacyReleases: [],
    ...patch,
  };
}

async function responseJson(response: Response) {
  return response.json() as Promise<Record<string, unknown>>;
}

const tests: Array<[string, () => Promise<void>]> = [
  [
    "missing release tables fall back to seeded public data",
    async () => {
      const data = await getPublicReleaseManagement(new MissingReleaseTablesDb());
      assert.equal(data.settings.latestVersion, "v0.1.1");
      assert.equal(data.platforms.some((platform) => platform.platformKey === "windows"), true);
    },
  ],
  [
    "admin release endpoint requires authentication",
    async () => {
      const response = await getAdminReleases({
        request: new Request("https://example.com/api/admin/releases"),
        env: { WAITLIST_DB: new MockReleaseDb(), ADMIN_SESSION_SECRET: "secret" },
      });
      assert.equal(response.status, 401);
    },
  ],
  [
    "valid release update is persisted and hidden platforms stay private",
    async () => {
      const db = new MockReleaseDb();
      const draft = releaseDraft({
        platforms: fallbackReleaseData.platforms.map((platform) => platform.platformKey === "linux"
          ? {
            ...platform,
            isAvailable: true,
            isVisible: false,
            currentVersion: "v0.2.0",
            primaryDownloadUrl: "https://github.com/crossainthero-lab/AgentDock/releases/download/v0.2.0/agentdock-linux.AppImage",
            primaryButtonLabel: "AppImage",
            statusLabel: "Experimental",
          }
          : platform),
      });

      const response = await updateReleaseManagement(db, draft);
      assert.equal(response.status, 200);

      const adminData = await getReleaseManagement(db, { includeHidden: true });
      assert.equal(adminData.platforms.find((platform) => platform.platformKey === "linux")?.isAvailable, true);

      const publicData = await getPublicReleaseManagement(db);
      assert.equal(publicData.platforms.some((platform) => platform.platformKey === "linux"), false);
    },
  ],
  [
    "invalid release URLs are rejected",
    async () => {
      const response = await updateReleaseManagement(new MockReleaseDb(), releaseDraft({
        platforms: fallbackReleaseData.platforms.map((platform) => platform.platformKey === "windows"
          ? { ...platform, primaryDownloadUrl: "http://example.com/AgentDock.exe" }
          : platform),
      }));
      assert.equal(response.status, 400);
      assert.match(String((await responseJson(response)).error), /https:\/\/ URL/);
    },
  ],
  [
    "available platforms require a version",
    async () => {
      const response = await updateReleaseManagement(new MockReleaseDb(), releaseDraft({
        platforms: fallbackReleaseData.platforms.map((platform) => platform.platformKey === "windows"
          ? { ...platform, currentVersion: "" }
          : platform),
      }));
      assert.equal(response.status, 400);
      assert.match(String((await responseJson(response)).error), /version is required/);
    },
  ],
  [
    "unavailable experimental platforms remain visible without required download buttons",
    async () => {
      const db = new MockReleaseDb();
      const response = await updateReleaseManagement(db, releaseDraft({
        platforms: fallbackReleaseData.platforms.map((platform) => platform.platformKey === "linux"
          ? { ...platform, isAvailable: false, isVisible: true, statusLabel: "Experimental", currentVersion: "", primaryDownloadUrl: "" }
          : platform),
      }));
      assert.equal(response.status, 200);

      const publicData = await getPublicReleaseManagement(db);
      const linux = publicData.platforms.find((platform) => platform.platformKey === "linux");
      assert.equal(linux?.isAvailable, false);
      assert.equal(linux?.statusLabel, "Experimental");
      assert.equal(linux?.primaryDownloadUrl, "");
    },
  ],
];

for (const [name, run] of tests) {
  await run();
  console.log(`ok - ${name}`);
}
