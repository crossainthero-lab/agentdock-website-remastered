import { getAuthorizedAdminEmail, type AdminAuthEnv } from "../../../_shared/adminAuth";
import { getDb, json, type DbEnv, type PagesFunction } from "../../../_shared/http";
import { serializeContactRequest } from "../../../_shared/serializers";

type Env = DbEnv;

export const onRequestGet: PagesFunction<Env & AdminAuthEnv> = async ({ request, env }) => {
  const adminEmail = await getAuthorizedAdminEmail(request, env);
  if (!adminEmail) return json({ message: "Unauthorized." }, 401);

  const url = new URL(request.url);
  const status = url.searchParams.get("status");
  const limit = Math.min(Number(url.searchParams.get("limit") || 100), 500);
  const offset = Math.max(Number(url.searchParams.get("offset") || 0), 0);

  const where = status ? "WHERE status = ?" : "";
  const params = status ? [status, limit, offset] : [limit, offset];
  const contacts = await getDb(env).prepare(
    `SELECT id, name, email, contact_reason, message, source_page, anonymous_session_id,
            status, internal_notes, created_at, updated_at
     FROM contact_requests
     ${where}
     ORDER BY datetime(created_at) DESC
     LIMIT ? OFFSET ?`,
  )
    .bind(...params)
    .all();

  const count = await getDb(env).prepare(`SELECT COUNT(*) AS total FROM contact_requests ${where}`)
    .bind(...(status ? [status] : []))
    .first<{ total: number }>();

  return json({ contacts: (contacts.results || []).map(serializeContactRequest), total: count?.total || 0 });
};
