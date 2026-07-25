import type {
  ApiErrorResponse,
  ApiSuccessResponse,
  BlogPost,
  BlogPostInput,
  BlogPostStatus,
  LegacyReleaseAsset,
  PlatformRelease,
  PlatformStatusLabel,
  ReleaseManagement,
  ReleasePlatformKey,
  ReleaseSettings,
  BlogPostSummary,
  SiteAnnouncement,
  SiteAnnouncementInput,
  TechnicalSection,
  TechnicalSectionInput,
} from "../../src/types/cms";
import { fallbackReleaseData } from "../../src/config/downloads";

export interface D1ResultLike<T = Record<string, unknown>> {
  results: T[];
  meta?: {
    changes?: number;
    rows_written?: number;
    last_row_id?: number;
  };
}

export interface D1PreparedStatementLike {
  bind(...values: unknown[]): D1PreparedStatementLike;
  first<T = Record<string, unknown>>(): Promise<T | null>;
  all<T = Record<string, unknown>>(): Promise<D1ResultLike<T>>;
  run<T = Record<string, unknown>>(): Promise<D1ResultLike<T>>;
}

export interface CmsDatabase {
  prepare(query: string): D1PreparedStatementLike;
  batch?<T = Record<string, unknown>>(statements: D1PreparedStatementLike[]): Promise<D1ResultLike<T>[]>;
}

export interface CmsEnv {
  WAITLIST_DB: CmsDatabase;
  ADMIN_PASSWORD_HASH?: string;
  ADMIN_SESSION_SECRET?: string;
}

type BlogRow = {
  id: number;
  slug: string;
  title: string;
  description: string;
  category: string | null;
  cover_image: string | null;
  content_markdown: string;
  status: BlogPostStatus;
  published_at: string | null;
  created_at: string;
  updated_at: string;
};

type TechnicalRow = {
  id: number;
  section_key: string;
  title: string;
  content_markdown: string;
  mermaid_source: string | null;
  sort_order: number;
  is_visible: number;
  created_at: string;
  updated_at: string;
};

type SiteSettingsRow = {
  setting_key: string;
  setting_value: string;
  updated_at: string;
};

type ReleaseSettingsRow = {
  main_heading: string;
  main_description: string;
  latest_version: string;
  github_releases_url: string;
  show_legacy_releases: number;
  announcement: string;
  updated_at: string;
};

type PlatformReleaseRow = {
  platform_key: ReleasePlatformKey;
  display_name: string;
  current_version: string;
  is_available: number;
  primary_download_url: string;
  primary_button_label: string;
  secondary_download_url: string;
  secondary_button_label: string;
  status_label: PlatformStatusLabel;
  release_note: string;
  release_date: string | null;
  display_order: number;
  is_visible: number;
  updated_at: string;
};

type LegacyReleaseRow = {
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

const MAX_JSON_BYTES = 256 * 1024;
const SESSION_COOKIE_NAME = "admin_session";
const SESSION_MAX_AGE_SECONDS = 8 * 60 * 60;
const MAX_LOGIN_FAILURES = 5;
const LOCKOUT_MS = 15 * 60 * 1000;
const ANNOUNCEMENT_SETTING_KEY = "announcement_bar";
const MAX_ANNOUNCEMENT_TEXT_LENGTH = 220;
const MAX_ANNOUNCEMENT_LINK_TEXT_LENGTH = 60;
const MAX_ANNOUNCEMENT_LINK_URL_LENGTH = 500;
const MAX_RELEASE_TEXT_LENGTH = 500;
const MAX_RELEASE_NOTE_LENGTH = 300;
const MAX_RELEASE_URL_LENGTH = 1000;
const PLATFORM_KEYS: ReleasePlatformKey[] = ["windows", "macos", "linux"];
const STATUS_LABELS: PlatformStatusLabel[] = ["Available", "Experimental", "Coming Soon", "Legacy"];
const SLUG_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const SECTION_KEY_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const MERMAID_START_PATTERN =
  /^(flowchart|graph|sequenceDiagram|stateDiagram-v2|stateDiagram|classDiagram|erDiagram|gantt|journey|pie|gitGraph|mindmap|timeline|quadrantChart|requirementDiagram|c4Context|C4Context|sankey-beta|block-beta|packet-beta|xychart-beta|architecture-beta)\b/;
const DEFAULT_ANNOUNCEMENT: SiteAnnouncement = {
  enabled: false,
  text: "",
  linkText: "",
  linkUrl: "",
  updatedAt: null,
};

export async function handleLogin(request: Request, env: CmsEnv): Promise<Response> {
  try {
    if (request.method !== "POST") {
      return jsonError("Method not allowed.", 405);
    }

    if (!env.ADMIN_PASSWORD_HASH || !env.ADMIN_SESSION_SECRET) {
      return jsonError("Admin authentication is not configured.", 500);
    }

    const body = await readJsonBody<{ password?: unknown }>(request);
    if ("error" in body) {
      return jsonError(body.error, 400);
    }

    const password = typeof body.value.password === "string" ? body.value.password : "";
    if (!password) {
      return jsonError("Password is required.", 400);
    }

    const attemptKey = await loginAttemptKey(request, env.ADMIN_SESSION_SECRET);
    const lockout = await getLoginLockout(env.WAITLIST_DB, attemptKey);
    if (lockout.locked) {
      return jsonError("Too many failed login attempts. Try again later.", 429);
    }

    const ok = await verifyPasswordHash(password, env.ADMIN_PASSWORD_HASH);
    if (!ok) {
      await recordFailedLogin(env.WAITLIST_DB, attemptKey, lockout.failedCount + 1);
      return jsonError("Invalid password.", 401);
    }

    await clearLoginAttempts(env.WAITLIST_DB, attemptKey);
    const cookie = await createSessionCookie(request, env.ADMIN_SESSION_SECRET);
    return jsonOk({ authenticated: true }, 200, { "Set-Cookie": cookie });
  } catch (error) {
    console.error("Admin login failed", getErrorMessage(error));
    return jsonError("Login failed. Try again.", 500);
  }
}

export async function handleLogout(request: Request): Promise<Response> {
  return jsonOk(
    { authenticated: false },
    200,
    {
      "Set-Cookie": clearSessionCookie(request),
    },
  );
}

export async function handleMe(request: Request, env: CmsEnv): Promise<Response> {
  const session = await requireAdminSession(request, env);
  if ("response" in session) {
    return session.response;
  }

  return jsonOk({ authenticated: true });
}

export async function requireAdminSession(
  request: Request,
  env: CmsEnv,
): Promise<{ ok: true } | { response: Response }> {
  if (!env.ADMIN_SESSION_SECRET) {
    return { response: jsonError("Admin authentication is not configured.", 500) };
  }

  const cookie = getCookie(request, SESSION_COOKIE_NAME);
  if (!cookie) {
    return { response: jsonError("Admin session is required.", 401) };
  }

  const verified = await verifySessionCookie(cookie, env.ADMIN_SESSION_SECRET);
  if (!verified) {
    return { response: jsonError("Admin session is invalid or expired.", 401) };
  }

  return { ok: true };
}

export async function listPublishedPosts(db: CmsDatabase): Promise<BlogPostSummary[]> {
  const { results } = await db
    .prepare(
      `SELECT id, slug, title, description, category, cover_image, status, published_at, created_at, updated_at
       FROM blog_posts
       WHERE status = 'published'
       ORDER BY datetime(published_at) DESC, id DESC`,
    )
    .all<BlogRow>();

  return results.map(mapBlogSummary);
}

export async function getPublishedPost(db: CmsDatabase, slug: string): Promise<BlogPost | null> {
  const row = await db
    .prepare(
      `SELECT id, slug, title, description, category, cover_image, content_markdown, status, published_at, created_at, updated_at
       FROM blog_posts
       WHERE slug = ?1 AND status = 'published'
       LIMIT 1`,
    )
    .bind(slug)
    .first<BlogRow>();

  return row ? mapBlogPost(row) : null;
}

export async function listAdminPosts(db: CmsDatabase): Promise<BlogPost[]> {
  const { results } = await db
    .prepare(
      `SELECT id, slug, title, description, category, cover_image, content_markdown, status, published_at, created_at, updated_at
       FROM blog_posts
       ORDER BY datetime(updated_at) DESC, id DESC`,
    )
    .all<BlogRow>();

  return results.map(mapBlogPost);
}

export async function getAdminPost(db: CmsDatabase, id: number): Promise<BlogPost | null> {
  const row = await db
    .prepare(
      `SELECT id, slug, title, description, category, cover_image, content_markdown, status, published_at, created_at, updated_at
       FROM blog_posts
       WHERE id = ?1
       LIMIT 1`,
    )
    .bind(id)
    .first<BlogRow>();

  return row ? mapBlogPost(row) : null;
}

export async function createPost(db: CmsDatabase, rawInput: unknown): Promise<Response> {
  const validation = validateBlogInput(rawInput);
  if ("error" in validation) {
    return jsonError(validation.error, 400);
  }

  const input = validation.value;
  const publishedAt = input.status === "published" ? input.publishedAt ?? new Date().toISOString() : input.publishedAt ?? null;

  try {
    const result = await db
      .prepare(
        `INSERT INTO blog_posts (slug, title, description, category, cover_image, content_markdown, status, published_at, updated_at)
         VALUES (?1, ?2, ?3, ?4, ?5, ?6, ?7, ?8, CURRENT_TIMESTAMP)`,
      )
      .bind(
        input.slug,
        input.title,
        input.description,
        input.category || null,
        input.coverImage || null,
        input.contentMarkdown,
        input.status,
        publishedAt,
      )
      .run();

    const id = Number(result.meta?.last_row_id ?? 0);
    const post = id ? await getAdminPost(db, id) : await getPostBySlug(db, input.slug);
    return jsonOk(post, 201, undefined, "Blog post created.");
  } catch (error) {
    return mapDatabaseWriteError(error, "Blog post could not be created.");
  }
}

export async function updatePost(db: CmsDatabase, id: number, rawInput: unknown): Promise<Response> {
  const existing = await getAdminPost(db, id);
  if (!existing) {
    return jsonError("Blog post was not found.", 404);
  }

  const validation = validateBlogInput(rawInput);
  if ("error" in validation) {
    return jsonError(validation.error, 400);
  }

  const input = validation.value;
  if (input.updatedAt && input.updatedAt !== existing.updatedAt) {
    return jsonError("This post changed after you opened it. Reload before saving.", 409);
  }

  if (existing.status === "published" && existing.slug !== input.slug && !input.confirmSlugChange) {
    return jsonError("Changing a published slug can break existing links. Confirm the slug change to continue.", 409);
  }

  const publishedAt =
    input.status === "published"
      ? input.publishedAt ?? existing.publishedAt ?? new Date().toISOString()
      : input.publishedAt ?? existing.publishedAt;

  try {
    await db
      .prepare(
        `UPDATE blog_posts
         SET slug = ?1,
             title = ?2,
             description = ?3,
             category = ?4,
             cover_image = ?5,
             content_markdown = ?6,
             status = ?7,
             published_at = ?8,
             updated_at = CURRENT_TIMESTAMP
         WHERE id = ?9`,
      )
      .bind(
        input.slug,
        input.title,
        input.description,
        input.category || null,
        input.coverImage || null,
        input.contentMarkdown,
        input.status,
        publishedAt,
        id,
      )
      .run();

    return jsonOk(await getAdminPost(db, id), 200, undefined, "Blog post saved.");
  } catch (error) {
    return mapDatabaseWriteError(error, "Blog post could not be saved.");
  }
}

export async function deletePost(db: CmsDatabase, id: number): Promise<Response> {
  await db.prepare("DELETE FROM blog_posts WHERE id = ?1").bind(id).run();
  return jsonOk({ deleted: true }, 200, undefined, "Blog post deleted.");
}

export async function listTechnicalSections(db: CmsDatabase, includeHidden: boolean): Promise<TechnicalSection[]> {
  const query = includeHidden
    ? `SELECT id, section_key, title, content_markdown, mermaid_source, sort_order, is_visible, created_at, updated_at
       FROM technical_content
       ORDER BY sort_order ASC, id ASC`
    : `SELECT id, section_key, title, content_markdown, mermaid_source, sort_order, is_visible, created_at, updated_at
       FROM technical_content
       WHERE is_visible = 1
       ORDER BY sort_order ASC, id ASC`;

  const { results } = await db.prepare(query).all<TechnicalRow>();
  return results.map(mapTechnicalSection);
}

export async function createTechnicalSection(db: CmsDatabase, rawInput: unknown): Promise<Response> {
  const validation = validateTechnicalInput(rawInput);
  if ("error" in validation) {
    return jsonError(validation.error, 400);
  }

  const input = validation.value;
  try {
    await db
      .prepare(
        `INSERT INTO technical_content (section_key, title, content_markdown, mermaid_source, sort_order, is_visible, updated_at)
         VALUES (?1, ?2, ?3, ?4, ?5, ?6, CURRENT_TIMESTAMP)`,
      )
      .bind(
        input.sectionKey,
        input.title,
        input.contentMarkdown,
        input.mermaidSource || null,
        input.sortOrder,
        input.isVisible ? 1 : 0,
      )
      .run();

    return jsonOk(await listTechnicalSections(db, true), 201, undefined, "Technical section created.");
  } catch (error) {
    return mapDatabaseWriteError(error, "Technical section could not be created.");
  }
}

export async function updateTechnicalSection(
  db: CmsDatabase,
  id: number,
  rawInput: unknown,
): Promise<Response> {
  const existing = await getTechnicalSection(db, id);
  if (!existing) {
    return jsonError("Technical section was not found.", 404);
  }

  const validation = validateTechnicalInput(rawInput);
  if ("error" in validation) {
    return jsonError(validation.error, 400);
  }

  const input = validation.value;
  if (input.updatedAt && input.updatedAt !== existing.updatedAt) {
    return jsonError("This section changed after you opened it. Reload before saving.", 409);
  }

  try {
    await db
      .prepare(
        `UPDATE technical_content
         SET section_key = ?1,
             title = ?2,
             content_markdown = ?3,
             mermaid_source = ?4,
             sort_order = ?5,
             is_visible = ?6,
             updated_at = CURRENT_TIMESTAMP
         WHERE id = ?7`,
      )
      .bind(
        input.sectionKey,
        input.title,
        input.contentMarkdown,
        input.mermaidSource || null,
        input.sortOrder,
        input.isVisible ? 1 : 0,
        id,
      )
      .run();

    return jsonOk(await getTechnicalSection(db, id), 200, undefined, "Technical section saved.");
  } catch (error) {
    return mapDatabaseWriteError(error, "Technical section could not be saved.");
  }
}

export async function deleteTechnicalSection(db: CmsDatabase, id: number): Promise<Response> {
  await db.prepare("DELETE FROM technical_content WHERE id = ?1").bind(id).run();
  return jsonOk({ deleted: true }, 200, undefined, "Technical section deleted.");
}

export async function getAnnouncementSettings(db: CmsDatabase): Promise<SiteAnnouncement> {
  try {
    const row = await db
      .prepare(
        `SELECT setting_key, setting_value, updated_at
         FROM site_settings
         WHERE setting_key = ?1
         LIMIT 1`,
      )
      .bind(ANNOUNCEMENT_SETTING_KEY)
      .first<SiteSettingsRow>();

    return row ? mapAnnouncementSetting(row) : DEFAULT_ANNOUNCEMENT;
  } catch (error) {
    if (isMissingSiteSettingsError(error)) {
      return DEFAULT_ANNOUNCEMENT;
    }

    throw error;
  }
}

export async function updateAnnouncementSettings(db: CmsDatabase, rawInput: unknown): Promise<Response> {
  const validation = validateAnnouncementInput(rawInput);
  if ("error" in validation) {
    return jsonError(validation.error, 400);
  }

  const input = validation.value;
  const settingValue = JSON.stringify({
    enabled: input.enabled,
    text: input.text,
    linkText: input.linkText,
    linkUrl: input.linkUrl,
  });

  try {
    await db
      .prepare(
        `INSERT INTO site_settings (setting_key, setting_value, updated_at)
         VALUES (?1, ?2, CURRENT_TIMESTAMP)
         ON CONFLICT(setting_key) DO UPDATE SET
           setting_value = excluded.setting_value,
           updated_at = CURRENT_TIMESTAMP`,
      )
      .bind(ANNOUNCEMENT_SETTING_KEY, settingValue)
      .run();

    return jsonOk(await getAnnouncementSettings(db), 200, undefined, "Announcement settings saved.");
  } catch (error) {
    if (isMissingSiteSettingsError(error)) {
      return jsonError("Site settings migration has not been applied.", 500);
    }

    console.error("Announcement settings update failed", { message: getErrorMessage(error) });
    return jsonError("Announcement settings could not be saved.", 500);
  }
}

export async function getReleaseManagement(
  db: CmsDatabase,
  options: { includeHidden: boolean } = { includeHidden: false },
): Promise<ReleaseManagement> {
  try {
    const settingsRow = await db
      .prepare(
        `SELECT main_heading,
                main_description,
                latest_version,
                github_releases_url,
                show_legacy_releases,
                announcement,
                updated_at
         FROM release_settings
         WHERE id = 1
         LIMIT 1`,
      )
      .first<ReleaseSettingsRow>();

    const platformQuery = options.includeHidden
      ? `SELECT platform_key,
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
         FROM platform_releases
         ORDER BY display_order ASC, platform_key ASC`
      : `SELECT platform_key,
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
         FROM platform_releases
         WHERE is_visible = 1
         ORDER BY display_order ASC, platform_key ASC`;

    const { results: platformRows } = await db.prepare(platformQuery).all<PlatformReleaseRow>();
    const legacyQuery = options.includeHidden
      ? `SELECT id, version, platform, title, url, button_label, release_notes_url, file_type, arch, display_order, is_visible
         FROM legacy_releases
         ORDER BY version DESC, display_order ASC, id ASC`
      : `SELECT id, version, platform, title, url, button_label, release_notes_url, file_type, arch, display_order, is_visible
         FROM legacy_releases
         WHERE is_visible = 1
         ORDER BY version DESC, display_order ASC, id ASC`;
    const { results: legacyRows } = await db.prepare(legacyQuery).all<LegacyReleaseRow>();

    const settings = settingsRow ? mapReleaseSettings(settingsRow) : fallbackReleaseData.settings;
    const platforms = platformRows.length > 0
      ? platformRows.map(mapPlatformRelease).filter((platform) => isSafePlatformRelease(platform, options.includeHidden))
      : filterFallbackPlatforms(options.includeHidden);
    const legacyReleases = settings.showLegacyReleases
      ? (legacyRows.length > 0 ? legacyRows.map(mapLegacyRelease).filter((asset) => isSafeLegacyRelease(asset, options.includeHidden)) : fallbackReleaseData.legacyReleases)
      : [];

    return {
      settings,
      platforms,
      legacyReleases,
    };
  } catch (error) {
    if (isMissingReleaseManagementError(error)) {
      return {
        ...fallbackReleaseData,
        platforms: filterFallbackPlatforms(options.includeHidden),
      };
    }

    throw error;
  }
}

export async function getPublicReleaseManagement(db: CmsDatabase): Promise<ReleaseManagement> {
  try {
    return await getReleaseManagement(db, { includeHidden: false });
  } catch (error) {
    console.error("Public release data read failed", getErrorMessage(error));
    return {
      ...fallbackReleaseData,
      platforms: filterFallbackPlatforms(false),
    };
  }
}

export async function updateReleaseManagement(db: CmsDatabase, rawInput: unknown): Promise<Response> {
  const validation = validateReleaseManagementInput(rawInput);
  if ("error" in validation) {
    return jsonError(validation.error, 400);
  }

  const input = validation.value;
  const statements = [
    db
      .prepare(
        `INSERT INTO release_settings (
           id,
           main_heading,
           main_description,
           latest_version,
           github_releases_url,
           show_legacy_releases,
           announcement,
           updated_at
         )
         VALUES (1, ?1, ?2, ?3, ?4, ?5, ?6, CURRENT_TIMESTAMP)
         ON CONFLICT(id) DO UPDATE SET
           main_heading = excluded.main_heading,
           main_description = excluded.main_description,
           latest_version = excluded.latest_version,
           github_releases_url = excluded.github_releases_url,
           show_legacy_releases = excluded.show_legacy_releases,
           announcement = excluded.announcement,
           updated_at = CURRENT_TIMESTAMP`,
      )
      .bind(
        input.settings.mainHeading,
        input.settings.mainDescription,
        input.settings.latestVersion,
        input.settings.githubReleasesUrl,
        input.settings.showLegacyReleases ? 1 : 0,
        input.settings.announcement,
      ),
    ...input.platforms.map((platform) =>
      db
        .prepare(
          `INSERT INTO platform_releases (
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
           VALUES (?1, ?2, ?3, ?4, ?5, ?6, ?7, ?8, ?9, ?10, ?11, ?12, ?13, CURRENT_TIMESTAMP)
           ON CONFLICT(platform_key) DO UPDATE SET
             display_name = excluded.display_name,
             current_version = excluded.current_version,
             is_available = excluded.is_available,
             primary_download_url = excluded.primary_download_url,
             primary_button_label = excluded.primary_button_label,
             secondary_download_url = excluded.secondary_download_url,
             secondary_button_label = excluded.secondary_button_label,
             status_label = excluded.status_label,
             release_note = excluded.release_note,
             release_date = excluded.release_date,
             display_order = excluded.display_order,
             is_visible = excluded.is_visible,
             updated_at = CURRENT_TIMESTAMP`,
        )
        .bind(
          platform.platformKey,
          platform.displayName,
          platform.currentVersion,
          platform.isAvailable ? 1 : 0,
          platform.primaryDownloadUrl,
          platform.primaryButtonLabel,
          platform.secondaryDownloadUrl,
          platform.secondaryButtonLabel,
          platform.statusLabel,
          platform.releaseNote,
          platform.releaseDate,
          platform.displayOrder,
          platform.isVisible ? 1 : 0,
        ),
    ),
  ];

  try {
    if (db.batch) {
      await db.batch(statements);
    } else {
      for (const statement of statements) {
        await statement.run();
      }
    }

    return jsonOk(await getReleaseManagement(db, { includeHidden: true }), 200, undefined, "Release settings saved.");
  } catch (error) {
    if (isMissingReleaseManagementError(error)) {
      return jsonError("Release management migration has not been applied.", 500);
    }

    console.error("Release management update failed", { message: getErrorMessage(error) });
    return jsonError("Release settings could not be saved.", 500);
  }
}

export async function readJsonBody<T = unknown>(
  request: Request,
): Promise<{ value: T } | { error: string }> {
  if (!isJsonContentType(request.headers.get("Content-Type"))) {
    return { error: "Content-Type must be application/json." };
  }

  const contentLength = request.headers.get("Content-Length");
  if (contentLength && Number(contentLength) > MAX_JSON_BYTES) {
    return { error: "Request body is too large." };
  }

  let text = "";
  try {
    text = await request.text();
  } catch {
    return { error: "Request body could not be read." };
  }

  if (new TextEncoder().encode(text).byteLength > MAX_JSON_BYTES) {
    return { error: "Request body is too large." };
  }

  try {
    return { value: JSON.parse(text) as T };
  } catch {
    return { error: "Request body must be valid JSON." };
  }
}

export function jsonOk<T>(
  data: T,
  status = 200,
  headers?: HeadersInit,
  message?: string,
): Response {
  const body: ApiSuccessResponse<T> = { ok: true, data, ...(message ? { message } : {}) };
  return Response.json(body, { status, headers: responseHeaders(headers) });
}

export function jsonError(error: string, status = 400, headers?: HeadersInit): Response {
  const body: ApiErrorResponse = { ok: false, error };
  return Response.json(body, { status, headers: responseHeaders(headers) });
}

export function normalizeSlug(value: string): string {
  return value
    .trim()
    .toLowerCase()
    .replace(/['"]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .replace(/-{2,}/g, "-");
}

export function validateMermaidSource(value: string | null | undefined): string | null {
  const source = (value ?? "").trim();
  if (!source) {
    return null;
  }

  if (source.length > 20_000) {
    return "Mermaid source must be 20,000 characters or fewer.";
  }

  if (/<\s*script\b/i.test(source) || /javascript:/i.test(source) || /\son[a-z]+\s*=/i.test(source)) {
    return "Mermaid source contains unsafe content.";
  }

  const firstLine = source.split(/\r?\n/).find((line) => line.trim() && !line.trim().startsWith("%%"))?.trim() ?? "";
  if (!MERMAID_START_PATTERN.test(firstLine)) {
    return "Mermaid source must start with a supported Mermaid diagram type.";
  }

  return null;
}

export function validateMarkdownSafety(markdown: string): string | null {
  if (/<\s*(script|iframe|object|embed|form|input|button|link|meta|style)\b/i.test(markdown)) {
    return "Markdown contains unsafe HTML.";
  }

  if (/\son[a-z]+\s*=/i.test(markdown) || /javascript:/i.test(markdown)) {
    return "Markdown contains unsafe attributes or links.";
  }

  return null;
}

function validateBlogInput(rawInput: unknown): { value: Required<BlogPostInput> } | { error: string } {
  if (!rawInput || typeof rawInput !== "object" || Array.isArray(rawInput)) {
    return { error: "Blog post payload must be an object." };
  }

  const input = rawInput as Record<string, unknown>;
  const title = normalizeString(input.title);
  const slug = normalizeSlug(normalizeString(input.slug));
  const description = normalizeString(input.description);
  const category = normalizeString(input.category);
  const coverImage = normalizeString(input.coverImage);
  const contentMarkdown = normalizeString(input.contentMarkdown);
  const status = input.status;
  const publishedAt = normalizeNullableString(input.publishedAt);
  const updatedAt = normalizeNullableString(input.updatedAt);
  const confirmSlugChange = input.confirmSlugChange === true;

  if (!title || title.length > 160) {
    return { error: "Title is required and must be 160 characters or fewer." };
  }

  if (!slug || slug.length > 120 || !SLUG_PATTERN.test(slug)) {
    return { error: "Slug must contain lowercase words separated by hyphens." };
  }

  if (!description || description.length > 300) {
    return { error: "Description is required and must be 300 characters or fewer." };
  }

  if (category.length > 80) {
    return { error: "Category must be 80 characters or fewer." };
  }

  const coverError = validateCoverImage(coverImage);
  if (coverError) {
    return { error: coverError };
  }

  if (!contentMarkdown || contentMarkdown.length > 100_000) {
    return { error: "Markdown content is required and must be 100,000 characters or fewer." };
  }

  const markdownError = validateMarkdownSafety(contentMarkdown);
  if (markdownError) {
    return { error: markdownError };
  }

  if (status !== "draft" && status !== "published") {
    return { error: "Status must be draft or published." };
  }

  if (publishedAt && Number.isNaN(Date.parse(publishedAt))) {
    return { error: "Published date must be a valid date." };
  }

  return {
    value: {
      title,
      slug,
      description,
      category,
      coverImage,
      contentMarkdown,
      status,
      publishedAt,
      updatedAt,
      confirmSlugChange,
    },
  };
}

function validateTechnicalInput(rawInput: unknown): { value: Required<TechnicalSectionInput> } | { error: string } {
  if (!rawInput || typeof rawInput !== "object" || Array.isArray(rawInput)) {
    return { error: "Technical section payload must be an object." };
  }

  const input = rawInput as Record<string, unknown>;
  const sectionKey = normalizeSlug(normalizeString(input.sectionKey));
  const title = normalizeString(input.title);
  const contentMarkdown = normalizeString(input.contentMarkdown);
  const mermaidSource = normalizeNullableString(input.mermaidSource);
  const sortOrder = Number(input.sortOrder);
  const isVisible = input.isVisible !== false;
  const updatedAt = normalizeNullableString(input.updatedAt);

  if (!sectionKey || sectionKey.length > 120 || !SECTION_KEY_PATTERN.test(sectionKey)) {
    return { error: "Section key must contain lowercase words separated by hyphens." };
  }

  if (!title || title.length > 160) {
    return { error: "Section title is required and must be 160 characters or fewer." };
  }

  if (!contentMarkdown || contentMarkdown.length > 50_000) {
    return { error: "Section markdown is required and must be 50,000 characters or fewer." };
  }

  const markdownError = validateMarkdownSafety(contentMarkdown);
  if (markdownError) {
    return { error: markdownError };
  }

  const mermaidError = validateMermaidSource(mermaidSource);
  if (mermaidError) {
    return { error: mermaidError };
  }

  if (!Number.isInteger(sortOrder) || sortOrder < -1_000_000 || sortOrder > 1_000_000) {
    return { error: "Sort order must be an integer." };
  }

  return {
    value: {
      sectionKey,
      title,
      contentMarkdown,
      mermaidSource,
      sortOrder,
      isVisible,
      updatedAt,
    },
  };
}

function validateAnnouncementInput(rawInput: unknown): { value: Required<SiteAnnouncementInput> } | { error: string } {
  if (!rawInput || typeof rawInput !== "object" || Array.isArray(rawInput)) {
    return { error: "Announcement settings payload must be an object." };
  }

  const input = rawInput as Record<string, unknown>;
  const enabled = input.enabled === true;
  const text = normalizeString(input.text);
  const linkText = normalizeString(input.linkText);
  const linkUrl = normalizeString(input.linkUrl);
  const updatedAt = normalizeNullableString(input.updatedAt);

  if (input.enabled !== true && input.enabled !== false) {
    return { error: "Enabled must be true or false." };
  }

  if (text.length > MAX_ANNOUNCEMENT_TEXT_LENGTH) {
    return { error: `Announcement text must be ${MAX_ANNOUNCEMENT_TEXT_LENGTH} characters or fewer.` };
  }

  if (enabled && !text) {
    return { error: "Announcement text is required when the bar is enabled." };
  }

  if (linkText.length > MAX_ANNOUNCEMENT_LINK_TEXT_LENGTH) {
    return { error: `Link text must be ${MAX_ANNOUNCEMENT_LINK_TEXT_LENGTH} characters or fewer.` };
  }

  if (linkUrl.length > MAX_ANNOUNCEMENT_LINK_URL_LENGTH) {
    return { error: `Link URL must be ${MAX_ANNOUNCEMENT_LINK_URL_LENGTH} characters or fewer.` };
  }

  const linkUrlError = validateAnnouncementUrl(linkUrl);
  if (linkUrlError) {
    return { error: linkUrlError };
  }

  return {
    value: {
      enabled,
      text,
      linkText: linkUrl ? linkText : "",
      linkUrl,
      updatedAt,
    },
  };
}

function validateReleaseManagementInput(rawInput: unknown): { value: ReleaseManagement } | { error: string } {
  if (!rawInput || typeof rawInput !== "object" || Array.isArray(rawInput)) {
    return { error: "Release management payload must be an object." };
  }

  const input = rawInput as Record<string, unknown>;
  const settingsValidation = validateReleaseSettingsInput(input.settings);
  if ("error" in settingsValidation) {
    return settingsValidation;
  }

  if (!Array.isArray(input.platforms)) {
    return { error: "Platform releases must be an array." };
  }

  const seen = new Set<string>();
  const platforms: PlatformRelease[] = [];
  for (const rawPlatform of input.platforms) {
    const platformValidation = validatePlatformReleaseInput(rawPlatform);
    if ("error" in platformValidation) {
      return platformValidation;
    }

    if (seen.has(platformValidation.value.platformKey)) {
      return { error: "Each platform can only appear once." };
    }

    seen.add(platformValidation.value.platformKey);
    platforms.push(platformValidation.value);
  }

  const missingPlatform = PLATFORM_KEYS.find((platformKey) => !seen.has(platformKey));
  if (missingPlatform) {
    return { error: `Missing release settings for ${missingPlatform}.` };
  }

  return {
    value: {
      settings: settingsValidation.value,
      platforms: platforms.sort((a, b) => a.displayOrder - b.displayOrder || a.platformKey.localeCompare(b.platformKey)),
      legacyReleases: [],
    },
  };
}

function validateReleaseSettingsInput(rawInput: unknown): { value: ReleaseSettings } | { error: string } {
  if (!rawInput || typeof rawInput !== "object" || Array.isArray(rawInput)) {
    return { error: "General release settings must be an object." };
  }

  const input = rawInput as Record<string, unknown>;
  const mainHeading = normalizeString(input.mainHeading);
  const mainDescription = normalizeString(input.mainDescription);
  const latestVersion = normalizeString(input.latestVersion);
  const githubReleasesUrl = normalizeString(input.githubReleasesUrl);
  const announcement = normalizeString(input.announcement);

  if (!mainHeading || mainHeading.length > 120) {
    return { error: "Main release heading is required and must be 120 characters or fewer." };
  }

  if (!mainDescription || mainDescription.length > MAX_RELEASE_TEXT_LENGTH) {
    return { error: `Main release description is required and must be ${MAX_RELEASE_TEXT_LENGTH} characters or fewer.` };
  }

  if (!latestVersion || latestVersion.length > 40) {
    return { error: "Latest overall version is required and must be 40 characters or fewer." };
  }

  const githubUrlError = validateHttpsUrl(githubReleasesUrl, "GitHub releases page URL");
  if (githubUrlError) {
    return { error: githubUrlError };
  }

  if (input.showLegacyReleases !== true && input.showLegacyReleases !== false) {
    return { error: "Show legacy releases must be true or false." };
  }

  if (announcement.length > MAX_RELEASE_TEXT_LENGTH) {
    return { error: `Release announcement must be ${MAX_RELEASE_TEXT_LENGTH} characters or fewer.` };
  }

  return {
    value: {
      mainHeading,
      mainDescription,
      latestVersion,
      githubReleasesUrl,
      showLegacyReleases: input.showLegacyReleases === true,
      announcement,
      updatedAt: normalizeNullableString(input.updatedAt),
    },
  };
}

function validatePlatformReleaseInput(rawInput: unknown): { value: PlatformRelease } | { error: string } {
  if (!rawInput || typeof rawInput !== "object" || Array.isArray(rawInput)) {
    return { error: "Platform release payload must be an object." };
  }

  const input = rawInput as Record<string, unknown>;
  const platformKey = normalizeString(input.platformKey) as ReleasePlatformKey;
  const displayName = normalizeString(input.displayName);
  const currentVersion = normalizeString(input.currentVersion);
  const primaryDownloadUrl = normalizeString(input.primaryDownloadUrl);
  const primaryButtonLabel = normalizeString(input.primaryButtonLabel);
  const secondaryDownloadUrl = normalizeString(input.secondaryDownloadUrl);
  const secondaryButtonLabel = normalizeString(input.secondaryButtonLabel);
  const statusLabel = normalizeString(input.statusLabel) as PlatformStatusLabel;
  const releaseNote = normalizeString(input.releaseNote);
  const releaseDate = normalizeNullableString(input.releaseDate);
  const displayOrder = Number(input.displayOrder);
  const isAvailable = input.isAvailable === true;
  const isVisible = input.isVisible === true;

  if (!PLATFORM_KEYS.includes(platformKey)) {
    return { error: "Platform key must be windows, macos, or linux." };
  }

  if (!displayName || displayName.length > 80) {
    return { error: `${platformKey} display name is required and must be 80 characters or fewer.` };
  }

  if (input.isAvailable !== true && input.isAvailable !== false) {
    return { error: `${displayName} availability must be true or false.` };
  }

  if (input.isVisible !== true && input.isVisible !== false) {
    return { error: `${displayName} public visibility must be true or false.` };
  }

  if (isAvailable && !currentVersion) {
    return { error: `${displayName} version is required when the platform is available.` };
  }

  if (currentVersion.length > 40) {
    return { error: `${displayName} version must be 40 characters or fewer.` };
  }

  if (!STATUS_LABELS.includes(statusLabel)) {
    return { error: `${displayName} status label is not valid.` };
  }

  if (isAvailable && !primaryDownloadUrl) {
    return { error: `${displayName} primary download URL is required when the platform is available.` };
  }

  const primaryUrlError = validateOptionalHttpsUrl(primaryDownloadUrl, `${displayName} primary download URL`);
  if (primaryUrlError) {
    return { error: primaryUrlError };
  }

  const secondaryUrlError = validateOptionalHttpsUrl(secondaryDownloadUrl, `${displayName} secondary download URL`);
  if (secondaryUrlError) {
    return { error: secondaryUrlError };
  }

  if ((isAvailable || primaryDownloadUrl) && (!primaryButtonLabel || primaryButtonLabel.length > 60)) {
    return { error: `${displayName} primary button label is required and must be 60 characters or fewer.` };
  }

  if (secondaryDownloadUrl && (!secondaryButtonLabel || secondaryButtonLabel.length > 60)) {
    return { error: `${displayName} secondary button label is required when a secondary URL is set.` };
  }

  if (secondaryButtonLabel.length > 60) {
    return { error: `${displayName} secondary button label must be 60 characters or fewer.` };
  }

  if (releaseNote.length > MAX_RELEASE_NOTE_LENGTH) {
    return { error: `${displayName} release note must be ${MAX_RELEASE_NOTE_LENGTH} characters or fewer.` };
  }

  if (releaseDate && !isValidDateOnly(releaseDate)) {
    return { error: `${displayName} release date must use YYYY-MM-DD format.` };
  }

  if (!Number.isInteger(displayOrder) || displayOrder < -1_000_000 || displayOrder > 1_000_000) {
    return { error: `${displayName} display order must be an integer.` };
  }

  return {
    value: {
      platformKey,
      displayName,
      currentVersion,
      isAvailable,
      primaryDownloadUrl,
      primaryButtonLabel,
      secondaryDownloadUrl,
      secondaryButtonLabel: secondaryDownloadUrl ? secondaryButtonLabel : "",
      statusLabel,
      releaseNote,
      releaseDate,
      displayOrder,
      isVisible,
      updatedAt: normalizeNullableString(input.updatedAt),
    },
  };
}

async function getPostBySlug(db: CmsDatabase, slug: string): Promise<BlogPost | null> {
  const row = await db
    .prepare(
      `SELECT id, slug, title, description, category, cover_image, content_markdown, status, published_at, created_at, updated_at
       FROM blog_posts
       WHERE slug = ?1
       LIMIT 1`,
    )
    .bind(slug)
    .first<BlogRow>();

  return row ? mapBlogPost(row) : null;
}

async function getTechnicalSection(db: CmsDatabase, id: number): Promise<TechnicalSection | null> {
  const row = await db
    .prepare(
      `SELECT id, section_key, title, content_markdown, mermaid_source, sort_order, is_visible, created_at, updated_at
       FROM technical_content
       WHERE id = ?1
       LIMIT 1`,
    )
    .bind(id)
    .first<TechnicalRow>();

  return row ? mapTechnicalSection(row) : null;
}

function mapBlogSummary(row: BlogRow): BlogPostSummary {
  return {
    id: row.id,
    slug: row.slug,
    title: row.title,
    description: row.description,
    category: row.category,
    coverImage: row.cover_image,
    status: row.status,
    publishedAt: row.published_at,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

function mapBlogPost(row: BlogRow): BlogPost {
  return {
    ...mapBlogSummary(row),
    id: row.id,
    status: row.status,
    contentMarkdown: row.content_markdown,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

function mapTechnicalSection(row: TechnicalRow): TechnicalSection {
  return {
    id: row.id,
    sectionKey: row.section_key,
    title: row.title,
    contentMarkdown: row.content_markdown,
    mermaidSource: row.mermaid_source,
    sortOrder: row.sort_order,
    isVisible: row.is_visible === 1,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

function mapAnnouncementSetting(row: SiteSettingsRow): SiteAnnouncement {
  try {
    const parsed = JSON.parse(row.setting_value) as Partial<SiteAnnouncement>;
    const text = normalizeString(parsed.text);
    const linkUrl = normalizeString(parsed.linkUrl);
    const linkText = normalizeString(parsed.linkText);

    return {
      enabled: parsed.enabled === true,
      text: text.slice(0, MAX_ANNOUNCEMENT_TEXT_LENGTH),
      linkText: linkUrl ? linkText.slice(0, MAX_ANNOUNCEMENT_LINK_TEXT_LENGTH) : "",
      linkUrl: validateAnnouncementUrl(linkUrl) ? "" : linkUrl,
      updatedAt: row.updated_at,
    };
  } catch {
    return DEFAULT_ANNOUNCEMENT;
  }
}

function mapReleaseSettings(row: ReleaseSettingsRow): ReleaseSettings {
  const githubReleasesUrl = normalizeString(row.github_releases_url);
  return {
    mainHeading: normalizeString(row.main_heading) || fallbackReleaseData.settings.mainHeading,
    mainDescription: normalizeString(row.main_description) || fallbackReleaseData.settings.mainDescription,
    latestVersion: normalizeString(row.latest_version) || fallbackReleaseData.settings.latestVersion,
    githubReleasesUrl: validateOptionalHttpsUrl(githubReleasesUrl, "GitHub releases page URL")
      ? fallbackReleaseData.settings.githubReleasesUrl
      : githubReleasesUrl,
    showLegacyReleases: row.show_legacy_releases === 1,
    announcement: normalizeString(row.announcement).slice(0, MAX_RELEASE_TEXT_LENGTH),
    updatedAt: row.updated_at,
  };
}

function mapPlatformRelease(row: PlatformReleaseRow): PlatformRelease {
  const primaryDownloadUrl = normalizeString(row.primary_download_url);
  const secondaryDownloadUrl = normalizeString(row.secondary_download_url);
  const statusLabel = STATUS_LABELS.includes(row.status_label) ? row.status_label : "Coming Soon";

  return {
    platformKey: row.platform_key,
    displayName: normalizeString(row.display_name),
    currentVersion: normalizeString(row.current_version),
    isAvailable: row.is_available === 1,
    primaryDownloadUrl: validateOptionalHttpsUrl(primaryDownloadUrl, "Primary download URL") ? "" : primaryDownloadUrl,
    primaryButtonLabel: normalizeString(row.primary_button_label),
    secondaryDownloadUrl: validateOptionalHttpsUrl(secondaryDownloadUrl, "Secondary download URL") ? "" : secondaryDownloadUrl,
    secondaryButtonLabel: normalizeString(row.secondary_button_label),
    statusLabel,
    releaseNote: normalizeString(row.release_note).slice(0, MAX_RELEASE_NOTE_LENGTH),
    releaseDate: row.release_date && isValidDateOnly(row.release_date) ? row.release_date : null,
    displayOrder: Number.isFinite(row.display_order) ? row.display_order : 0,
    isVisible: row.is_visible === 1,
    updatedAt: row.updated_at,
  };
}

function mapLegacyRelease(row: LegacyReleaseRow): LegacyReleaseAsset {
  const url = normalizeString(row.url);
  const releaseNotesUrl = normalizeString(row.release_notes_url);

  return {
    id: row.id,
    version: normalizeString(row.version),
    platform: normalizeString(row.platform),
    title: normalizeString(row.title),
    url: validateOptionalHttpsUrl(url, "Legacy download URL") ? "" : url,
    buttonLabel: normalizeString(row.button_label) || "Download",
    releaseNotesUrl: validateOptionalHttpsUrl(releaseNotesUrl, "Legacy release notes URL") ? "" : releaseNotesUrl,
    fileType: normalizeString(row.file_type),
    arch: normalizeString(row.arch),
    displayOrder: Number.isFinite(row.display_order) ? row.display_order : 0,
    isVisible: row.is_visible === 1,
  };
}

function isSafePlatformRelease(platform: PlatformRelease, includeHidden: boolean): boolean {
  if ((!includeHidden && !platform.isVisible) || !PLATFORM_KEYS.includes(platform.platformKey) || !platform.displayName) {
    return false;
  }

  if (!platform.isAvailable) {
    return true;
  }

  return Boolean(platform.currentVersion && platform.primaryDownloadUrl && platform.primaryButtonLabel);
}

function isSafeLegacyRelease(asset: LegacyReleaseAsset, includeHidden: boolean): boolean {
  return Boolean((includeHidden || asset.isVisible) && asset.version && asset.title && asset.url);
}

function filterFallbackPlatforms(includeHidden: boolean): PlatformRelease[] {
  return fallbackReleaseData.platforms
    .filter((platform) => includeHidden || platform.isVisible)
    .sort((a, b) => a.displayOrder - b.displayOrder || a.platformKey.localeCompare(b.platformKey));
}

function mapDatabaseWriteError(error: unknown, fallback: string): Response {
  const message = error instanceof Error ? error.message : "";
  if (/unique|constraint/i.test(message)) {
    return jsonError("A record with that slug or section key already exists.", 409);
  }

  console.error("CMS database write failed", { message });
  return jsonError(fallback, 500);
}

function validateAnnouncementUrl(value: string): string | null {
  if (!value) {
    return null;
  }

  if (value.startsWith("/")) {
    if (!value.startsWith("/") || value.startsWith("//") || value.includes("..") || /\s/.test(value)) {
      return "Link URL must be a valid HTTPS URL or root-relative path.";
    }

    return null;
  }

  try {
    const url = new URL(value);
    if (url.protocol !== "https:") {
      return "Link URL must be a valid HTTPS URL or root-relative path.";
    }
    return null;
  } catch {
    return "Link URL must be a valid HTTPS URL or root-relative path.";
  }
}

function validateOptionalHttpsUrl(value: string, label: string): string | null {
  if (!value) {
    return null;
  }

  if (value.length > MAX_RELEASE_URL_LENGTH) {
    return `${label} must be ${MAX_RELEASE_URL_LENGTH} characters or fewer.`;
  }

  return validateHttpsUrl(value, label);
}

function validateHttpsUrl(value: string, label: string): string | null {
  try {
    const url = new URL(value);
    if (url.protocol !== "https:") {
      return `${label} must be a valid https:// URL.`;
    }
    return null;
  } catch {
    return `${label} must be a valid https:// URL.`;
  }
}

function isValidDateOnly(value: string): boolean {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    return false;
  }

  const parsed = Date.parse(`${value}T00:00:00.000Z`);
  return !Number.isNaN(parsed) && new Date(parsed).toISOString().startsWith(value);
}

function validateCoverImage(value: string): string | null {
  if (!value) {
    return null;
  }

  if (value.startsWith("/")) {
    if (value.includes("..") || /\s/.test(value)) {
      return "Cover image path is not valid.";
    }

    return null;
  }

  try {
    const url = new URL(value);
    if (url.protocol !== "https:") {
      return "Cover image URL must use HTTPS.";
    }
    return null;
  } catch {
    return "Cover image must be an existing asset path or a valid HTTPS URL.";
  }
}

function isMissingSiteSettingsError(error: unknown): boolean {
  return /no such table: site_settings/i.test(getErrorMessage(error));
}

function isMissingReleaseManagementError(error: unknown): boolean {
  return /no such table: (release_settings|platform_releases|legacy_releases)/i.test(getErrorMessage(error));
}

async function createSessionCookie(request: Request, secret: string): Promise<string> {
  const now = Math.floor(Date.now() / 1000);
  const payload = base64UrlEncode(
    new TextEncoder().encode(JSON.stringify({ iat: now, exp: now + SESSION_MAX_AGE_SECONDS })),
  );
  const signature = await sign(payload, secret);
  const secure = new URL(request.url).protocol === "https:" ? "; Secure" : "";
  return `${SESSION_COOKIE_NAME}=${payload}.${signature}; HttpOnly${secure}; SameSite=Strict; Path=/; Max-Age=${SESSION_MAX_AGE_SECONDS}`;
}

function clearSessionCookie(request: Request): string {
  const secure = new URL(request.url).protocol === "https:" ? "; Secure" : "";
  return `${SESSION_COOKIE_NAME}=; HttpOnly${secure}; SameSite=Strict; Path=/; Max-Age=0`;
}

async function verifySessionCookie(cookie: string, secret: string): Promise<boolean> {
  const [payload, signature] = cookie.split(".");
  if (!payload || !signature) {
    return false;
  }

  const expected = await sign(payload, secret);
  if (!constantTimeEqual(signature, expected)) {
    return false;
  }

  try {
    const decoded = JSON.parse(new TextDecoder().decode(base64UrlDecode(payload))) as { exp?: number };
    return typeof decoded.exp === "number" && decoded.exp > Math.floor(Date.now() / 1000);
  } catch {
    return false;
  }
}

async function verifyPasswordHash(password: string, passwordHash: string): Promise<boolean> {
  const [algorithm, firstValue, secondValue, thirdValue] = passwordHash.split("$");
  if (algorithm === "sha256") {
    if (!firstValue || !secondValue) {
      return false;
    }

    const salt = base64UrlDecode(firstValue);
    const expected = base64UrlDecode(secondValue);
    const derived = await sha256PasswordDigest(password, salt);
    return constantTimeBytesEqual(derived, expected);
  }

  if (algorithm !== "pbkdf2-sha256") {
    return false;
  }

  const iterations = Number(firstValue);
  if (!Number.isInteger(iterations) || iterations < 100_000 || !secondValue || !thirdValue) {
    return false;
  }

  try {
    const salt = base64UrlDecode(secondValue);
    const expected = base64UrlDecode(thirdValue);
    const key = await crypto.subtle.importKey("raw", new TextEncoder().encode(password), "PBKDF2", false, [
      "deriveBits",
    ]);
    const derived = await crypto.subtle.deriveBits(
      { name: "PBKDF2", hash: "SHA-256", salt, iterations },
      key,
      expected.byteLength * 8,
    );

    return constantTimeBytesEqual(new Uint8Array(derived), expected);
  } catch {
    return false;
  }
}

async function sha256PasswordDigest(password: string, salt: Uint8Array): Promise<Uint8Array> {
  const passwordBytes = new TextEncoder().encode(password);
  const data = new Uint8Array(salt.byteLength + 1 + passwordBytes.byteLength);
  data.set(salt, 0);
  data.set([0], salt.byteLength);
  data.set(passwordBytes, salt.byteLength + 1);
  const digest = await crypto.subtle.digest("SHA-256", data);
  return new Uint8Array(digest);
}

async function loginAttemptKey(request: Request, secret: string): Promise<string> {
  const ip = request.headers.get("CF-Connecting-IP") ?? "unknown-ip";
  const userAgent = request.headers.get("User-Agent") ?? "unknown-ua";
  const data = new TextEncoder().encode(`${secret}:${ip}:${userAgent}`);
  const digest = await crypto.subtle.digest("SHA-256", data);
  return base64UrlEncode(new Uint8Array(digest));
}

async function getLoginLockout(
  db: CmsDatabase,
  attemptKey: string,
): Promise<{ locked: boolean; failedCount: number }> {
  const row = await db
    .prepare("SELECT failed_count, locked_until FROM admin_login_attempts WHERE attempt_key = ?1")
    .bind(attemptKey)
    .first<{ failed_count: number; locked_until: string | null }>();

  if (!row) {
    return { locked: false, failedCount: 0 };
  }

  const locked = row.locked_until ? Date.parse(row.locked_until) > Date.now() : false;
  return { locked, failedCount: row.failed_count };
}

async function recordFailedLogin(db: CmsDatabase, attemptKey: string, failedCount: number): Promise<void> {
  const lockedUntil =
    failedCount >= MAX_LOGIN_FAILURES ? new Date(Date.now() + LOCKOUT_MS).toISOString() : null;

  await db
    .prepare(
      `INSERT INTO admin_login_attempts (attempt_key, failed_count, locked_until, updated_at)
       VALUES (?1, ?2, ?3, CURRENT_TIMESTAMP)
       ON CONFLICT(attempt_key) DO UPDATE SET
         failed_count = excluded.failed_count,
         locked_until = excluded.locked_until,
         updated_at = CURRENT_TIMESTAMP`,
    )
    .bind(attemptKey, failedCount, lockedUntil)
    .run();
}

async function clearLoginAttempts(db: CmsDatabase, attemptKey: string): Promise<void> {
  await db.prepare("DELETE FROM admin_login_attempts WHERE attempt_key = ?1").bind(attemptKey).run();
}

async function sign(payload: string, secret: string): Promise<string> {
  const key = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );
  const signature = await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(payload));
  return base64UrlEncode(new Uint8Array(signature));
}

function getCookie(request: Request, name: string): string | null {
  const cookie = request.headers.get("Cookie") ?? "";
  const match = cookie
    .split(";")
    .map((part) => part.trim())
    .find((part) => part.startsWith(`${name}=`));

  return match ? decodeURIComponent(match.slice(name.length + 1)) : null;
}

function isJsonContentType(contentType: string | null): boolean {
  return contentType?.split(";")[0]?.trim().toLowerCase() === "application/json";
}

function normalizeString(value: unknown): string {
  return typeof value === "string" ? value.trim() : "";
}

function normalizeNullableString(value: unknown): string | null {
  if (value === null || value === undefined) {
    return null;
  }

  return typeof value === "string" ? value.trim() || null : null;
}

function responseHeaders(headers?: HeadersInit): HeadersInit {
  return {
    "Content-Type": "application/json; charset=utf-8",
    "Cache-Control": "no-store",
    "X-Content-Type-Options": "nosniff",
    ...(headers ?? {}),
  };
}

function getErrorMessage(error: unknown): string {
  return error instanceof Error ? error.message : "Unknown error";
}

function base64UrlEncode(bytes: Uint8Array): string {
  let binary = "";
  bytes.forEach((byte) => {
    binary += String.fromCharCode(byte);
  });
  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/g, "");
}

function base64UrlDecode(value: string): Uint8Array {
  const padded = value.replace(/-/g, "+").replace(/_/g, "/").padEnd(Math.ceil(value.length / 4) * 4, "=");
  const binary = atob(padded);
  const bytes = new Uint8Array(binary.length);
  for (let index = 0; index < binary.length; index += 1) {
    bytes[index] = binary.charCodeAt(index);
  }
  return bytes;
}

function constantTimeEqual(left: string, right: string): boolean {
  return constantTimeBytesEqual(new TextEncoder().encode(left), new TextEncoder().encode(right));
}

function constantTimeBytesEqual(left: Uint8Array, right: Uint8Array): boolean {
  let diff = left.length ^ right.length;
  const length = Math.max(left.length, right.length);
  for (let index = 0; index < length; index += 1) {
    diff |= (left[index] ?? 0) ^ (right[index] ?? 0);
  }
  return diff === 0;
}
