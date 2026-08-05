import { getAuthorizedAdminEmail, type AdminAuthEnv } from "../../_shared/adminAuth";
import { getDb, json, type DbEnv, type PagesFunction } from "../../_shared/http";

type Env = DbEnv;

type WaitlistEntry = {
  id: string;
  email: string;
  name: string | null;
  source: string | null;
  page_url: string | null;
  user_agent: string | null;
  created_at: string;
};

export const onRequestGet: PagesFunction<Env & AdminAuthEnv> = async ({ request, env }) => {
  const adminEmail = await getAuthorizedAdminEmail(request, env);
  if (!adminEmail) {
    return json({ message: "This waitlist view is private." }, 401);
  }

  const entriesQuery = getDb(env).prepare(
    `SELECT id, email, name, source, source_page AS page_url, NULL AS user_agent, created_at
     FROM join_pro_requests
     ORDER BY datetime(created_at) DESC
     LIMIT 500`,
  );
  const countQuery = getDb(env).prepare("SELECT COUNT(*) AS total FROM join_pro_requests");

  const [entriesResult, countResult] = await Promise.all([
    entriesQuery.all<WaitlistEntry>(),
    countQuery.first<{ total: number }>(),
  ]);

  return json({
    entries: entriesResult.results || [],
    total: countResult?.total || 0,
  });
};
