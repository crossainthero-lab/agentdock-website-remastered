import { csv } from "../../../_shared/backend";
import { getAuthorizedAdminEmail, type AdminAuthEnv } from "../../../_shared/adminAuth";
import { getDb, noStoreHeaders, type DbEnv, type PagesFunction } from "../../../_shared/http";

type Env = DbEnv;

export const onRequestGet: PagesFunction<Env & AdminAuthEnv> = async ({ request, env }) => {
  const adminEmail = await getAuthorizedAdminEmail(request, env);
  if (!adminEmail) {
    return new Response("Unauthorized.", { status: 401, headers: noStoreHeaders("text/plain; charset=utf-8") });
  }

  const rows = await getDb(env).prepare(
    `SELECT id, name, email, intended_use, selected_agents, message, source_page, source, referrer,
            utm_source, utm_medium, utm_campaign, status, internal_notes, created_at, updated_at
     FROM join_pro_requests
     ORDER BY datetime(created_at) DESC`,
  ).all<Record<string, unknown>>();

  const columns = [
    "id",
    "name",
    "email",
    "intended_use",
    "selected_agents",
    "message",
    "source_page",
    "source",
    "referrer",
    "utm_source",
    "utm_medium",
    "utm_campaign",
    "status",
    "internal_notes",
    "created_at",
    "updated_at",
  ];

  return new Response(csv(rows.results || [], columns), {
    headers: {
      ...noStoreHeaders("text/csv; charset=utf-8"),
      "Content-Disposition": 'attachment; filename="agentdock-join-pro-requests.csv"',
    },
  });
};
