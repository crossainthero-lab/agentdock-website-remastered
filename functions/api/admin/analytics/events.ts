import { getAuthorizedAdminEmail, type AdminAuthEnv } from "../../../_shared/adminAuth";
import { getDb, json, type DbEnv, type PagesFunction } from "../../../_shared/http";

type Env = DbEnv;

export const onRequestGet: PagesFunction<Env & AdminAuthEnv> = async ({ request, env }) => {
  const adminEmail = await getAuthorizedAdminEmail(request, env);
  if (!adminEmail) return json({ message: "Unauthorized." }, 401);

  const url = new URL(request.url);
  const limit = Math.min(Number(url.searchParams.get("limit") || 100), 500);
  const eventName = url.searchParams.get("eventName");
  const where = eventName ? "WHERE event_name = ?" : "";
  const params = eventName ? [eventName, limit] : [limit];

  const events = await getDb(env).prepare(
    `SELECT id, event_name, source_page, funnel_type, step, contact_reason,
            utm_source, utm_medium, utm_campaign, created_at
     FROM anonymous_funnel_events
     ${where}
     ORDER BY datetime(created_at) DESC
     LIMIT ?`,
  )
    .bind(...params)
    .all();

  return json({ events: events.results || [] });
};
