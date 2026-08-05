import { getClientIp, getDb, type DbEnv } from "./http";
import {
  type AnalyticsEventName,
  type ValidAnalyticsEvent,
  type ValidContactSubmission,
  type ValidJoinProSubmission,
} from "./validation";

export type BackendEnv = DbEnv & {
  TURNSTILE_SECRET_KEY?: string;
};

export async function sha256Hex(value: string) {
  const digest = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(value));
  return Array.from(new Uint8Array(digest))
    .map((byte) => byte.toString(16).padStart(2, "0"))
    .join("");
}

function duplicateError(error: unknown) {
  const message = error instanceof Error ? error.message : String(error);
  return message.includes("UNIQUE constraint failed") || message.includes("constraint failed");
}

export async function checkRateLimit(
  env: BackendEnv,
  request: Request,
  scope: string,
  maxRequests: number,
  windowSeconds: number,
) {
  const db = getDb(env);
  const ip = getClientIp(request) || "unknown";
  const keyHash = await sha256Hex(`${scope}:${ip}:${new Date().toISOString().slice(0, 10)}`);
  const windowStart = new Date(Math.floor(Date.now() / (windowSeconds * 1000)) * windowSeconds * 1000).toISOString();
  const existing = await db.prepare(
    "SELECT count FROM submission_rate_limits WHERE scope = ? AND key_hash = ? AND window_start = ?",
  )
    .bind(scope, keyHash, windowStart)
    .first<{ count: number }>();

  if (existing && existing.count >= maxRequests) {
    return { allowed: false, retryAfter: windowSeconds };
  }

  if (existing) {
    await db.prepare(
      "UPDATE submission_rate_limits SET count = count + 1, updated_at = strftime('%Y-%m-%dT%H:%M:%fZ', 'now') WHERE scope = ? AND key_hash = ? AND window_start = ?",
    )
      .bind(scope, keyHash, windowStart)
      .run();
  } else {
    await db.prepare(
      "INSERT INTO submission_rate_limits (scope, key_hash, window_start, count) VALUES (?, ?, ?, 1)",
    )
      .bind(scope, keyHash, windowStart)
      .run();
  }

  return { allowed: true };
}

export async function verifyTurnstileIfPresent(request: Request, token: string | null, secret?: string) {
  if (!token) return { success: true };
  if (!secret) return { success: false, message: "Spam protection is not configured yet." };

  const body = new FormData();
  body.append("secret", secret);
  body.append("response", token);

  const remoteIp = request.headers.get("CF-Connecting-IP");
  if (remoteIp) body.append("remoteip", remoteIp);

  const response = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
    method: "POST",
    body,
  });
  const result = (await response.json()) as { success?: boolean };
  if (result.success) return { success: true };
  return { success: false, message: "The spam check failed. Please refresh and try again." };
}

export async function insertJoinProRequest(env: BackendEnv, submission: ValidJoinProSubmission) {
  const db = getDb(env);
  try {
    await db.prepare(
      `INSERT INTO join_pro_requests (
        id, name, email, intended_use, selected_agents, message, source_page, source, referrer,
        utm_source, utm_medium, utm_campaign, anonymous_session_id, status
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'New')`,
    )
      .bind(
        submission.id,
        submission.name,
        submission.email,
        submission.intendedUse,
        JSON.stringify(submission.selectedAgents),
        submission.message,
        submission.sourcePage,
        submission.source,
        submission.referrer,
        submission.utmSource,
        submission.utmMedium,
        submission.utmCampaign,
        submission.anonymousSessionId,
      )
      .run();

    if (submission.anonymousSessionId) {
      await insertAnalyticsEvent(env, {
        id: `evt_${crypto.randomUUID()}`,
        anonymousSessionId: submission.anonymousSessionId,
        eventName: "join_pro_form_submitted",
        sourcePage: submission.sourcePage,
        funnelType: "join_pro",
        step: null,
        contactReason: null,
        utmSource: submission.utmSource,
        utmMedium: submission.utmMedium,
        utmCampaign: submission.utmCampaign,
        dedupeKey: `server:${submission.anonymousSessionId}:join_pro_form_submitted:${new Date().toISOString().slice(0, 10)}`,
      });
    }

    return { duplicate: false };
  } catch (error) {
    if (duplicateError(error)) return { duplicate: true };
    throw error;
  }
}

export async function insertLegacyWaitlistCompatibility(env: BackendEnv, submission: ValidJoinProSubmission) {
  const db = getDb(env);
  try {
    await db.prepare(
      `INSERT INTO waitlist_entries (email, name, source, page_url, user_agent)
       VALUES (?, ?, ?, ?, ?)`,
    )
      .bind(submission.email, submission.name, submission.source || "join-pro", submission.sourcePage, null)
      .run();
  } catch (error) {
    if (!duplicateError(error)) throw error;
  }
}

export async function insertContactRequest(env: BackendEnv, submission: ValidContactSubmission) {
  const dedupeHash = await sha256Hex(submission.dedupeKey);
  const db = getDb(env);
  try {
    await db.prepare(
      `INSERT INTO contact_requests (
        id, name, email, contact_reason, message, source_page, anonymous_session_id, status, dedupe_key
      ) VALUES (?, ?, ?, ?, ?, ?, ?, 'New', ?)`,
    )
      .bind(
        submission.id,
        submission.name,
        submission.email,
        submission.contactReason,
        submission.message,
        submission.sourcePage,
        submission.anonymousSessionId,
        dedupeHash,
      )
      .run();

    if (submission.anonymousSessionId) {
      await insertAnalyticsEvent(env, {
        id: `evt_${crypto.randomUUID()}`,
        anonymousSessionId: submission.anonymousSessionId,
        eventName: "contact_form_submitted",
        sourcePage: submission.sourcePage,
        funnelType: "contact",
        step: null,
        contactReason: null,
        utmSource: null,
        utmMedium: null,
        utmCampaign: null,
        dedupeKey: `server:${submission.anonymousSessionId}:contact_form_submitted:${new Date().toISOString().slice(0, 10)}`,
      });
    }

    return { duplicate: false };
  } catch (error) {
    if (duplicateError(error)) return { duplicate: true };
    throw error;
  }
}

export async function insertAnalyticsEvent(env: BackendEnv, event: ValidAnalyticsEvent) {
  const db = getDb(env);
  try {
    await db.prepare(
      `INSERT INTO anonymous_funnel_events (
        id, anonymous_session_id, event_name, source_page, funnel_type, step, contact_reason,
        utm_source, utm_medium, utm_campaign, dedupe_key
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    )
      .bind(
        event.id,
        event.anonymousSessionId,
        event.eventName,
        event.sourcePage,
        event.funnelType,
        event.step,
        event.contactReason,
        event.utmSource,
        event.utmMedium,
        event.utmCampaign,
        event.dedupeKey,
      )
      .run();
    return { duplicate: false };
  } catch (error) {
    if (duplicateError(error)) return { duplicate: true };
    throw error;
  }
}

export function csvEscape(value: unknown) {
  if (value == null) return "";
  const stringValue = String(value);
  if (!/[",\n\r]/.test(stringValue)) return stringValue;
  return `"${stringValue.replaceAll('"', '""')}"`;
}

export function csv(rows: Record<string, unknown>[], columns: string[]) {
  return [
    columns.map(csvEscape).join(","),
    ...rows.map((row) => columns.map((column) => csvEscape(row[column])).join(",")),
  ].join("\n");
}

export function validStatus<T extends string>(value: unknown, statuses: readonly T[]) {
  return typeof value === "string" && statuses.includes(value as T) ? (value as T) : null;
}

export function eventCountSelect(eventName: AnalyticsEventName) {
  return `COUNT(CASE WHEN event_name = '${eventName}' THEN 1 END)`;
}
