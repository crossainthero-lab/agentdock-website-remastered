import { getAuthorizedAdminEmail, type AdminAuthEnv } from "../../../_shared/adminAuth";
import { getDb, json, type DbEnv, type PagesFunction } from "../../../_shared/http";

type Env = DbEnv;

function rangeStart(range: string | null) {
  if (range === "all") return null;
  const days = range === "30d" ? 30 : 7;
  const date = new Date();
  date.setUTCDate(date.getUTCDate() - days);
  return date.toISOString();
}

function eventWhere(start: string | null) {
  return start ? "WHERE created_at >= ?" : "";
}

function bindStart<T extends { bind: (...values: unknown[]) => T }>(statement: T, start: string | null) {
  return start ? statement.bind(start) : statement;
}

export const onRequestGet: PagesFunction<Env & AdminAuthEnv> = async ({ request, env }) => {
  const adminEmail = await getAuthorizedAdminEmail(request, env);
  if (!adminEmail) return json({ message: "Unauthorized." }, 401);

  const url = new URL(request.url);
  const range = url.searchParams.get("range") || "7d";
  const start = rangeStart(range);
  const where = eventWhere(start);

  const totalsQuery = bindStart(
    getDb(env).prepare(
      `WITH scoped_events AS (
         SELECT * FROM anonymous_funnel_events ${where}
       ),
       contact_sessions AS (
         SELECT
           anonymous_session_id,
           MAX(CASE WHEN event_name = 'contact_final_step_reached' THEN 1 ELSE 0 END) AS reached_final,
           MAX(CASE WHEN event_name = 'contact_form_submitted' THEN 1 ELSE 0 END) AS submitted
         FROM scoped_events
         GROUP BY anonymous_session_id
       ),
       join_sessions AS (
         SELECT
           anonymous_session_id,
           MAX(CASE WHEN event_name = 'join_pro_form_opened' THEN 1 ELSE 0 END) AS opened,
           MAX(CASE WHEN event_name = 'join_pro_form_submitted' THEN 1 ELSE 0 END) AS submitted
         FROM scoped_events
         GROUP BY anonymous_session_id
       )
       SELECT
         (SELECT COUNT(*) FROM scoped_events WHERE event_name = 'contact_cta_clicked') AS contactCtaClicks,
         (SELECT COUNT(*) FROM scoped_events WHERE event_name = 'contact_flow_opened') AS contactFlowOpens,
         (SELECT COUNT(DISTINCT anonymous_session_id) FROM scoped_events WHERE event_name = 'contact_final_step_reached') AS contactFinalStepSessions,
         (SELECT COUNT(DISTINCT anonymous_session_id) FROM scoped_events WHERE event_name = 'contact_form_submitted') AS contactSubmittedSessions,
         (SELECT COUNT(*) FROM contact_sessions WHERE reached_final = 1 AND submitted = 0) AS contactFinalStepAbandonedSessions,
         (SELECT COUNT(*) FROM scoped_events WHERE event_name = 'join_pro_cta_clicked') AS joinProCtaClicks,
         (SELECT COUNT(DISTINCT anonymous_session_id) FROM scoped_events WHERE event_name = 'join_pro_form_opened') AS joinProFormOpens,
         (SELECT COUNT(DISTINCT anonymous_session_id) FROM scoped_events WHERE event_name = 'join_pro_form_submitted') AS joinProSubmittedSessions,
         (SELECT COUNT(*) FROM join_sessions WHERE opened = 1 AND submitted = 1) AS joinConvertedSessions`,
    ),
    start,
  );

  const pagesQuery = bindStart(
    getDb(env).prepare(
      `WITH scoped_events AS (
         SELECT * FROM anonymous_funnel_events ${where}
       ),
       submitted AS (
         SELECT DISTINCT anonymous_session_id FROM scoped_events WHERE event_name = 'contact_form_submitted'
       )
       SELECT
         COALESCE(source_page, 'unknown') AS sourcePage,
         COUNT(CASE WHEN event_name = 'contact_cta_clicked' THEN 1 END) AS contactCtaClicks,
         COUNT(CASE WHEN event_name = 'contact_flow_opened' THEN 1 END) AS contactFlowOpens,
         COUNT(DISTINCT CASE WHEN event_name = 'contact_final_step_reached' THEN anonymous_session_id END) AS contactFinalStepSessions,
         COUNT(DISTINCT CASE WHEN event_name = 'contact_form_submitted' THEN anonymous_session_id END) AS contactSubmittedSessions,
         COUNT(DISTINCT CASE WHEN event_name = 'contact_final_step_reached' AND anonymous_session_id NOT IN (SELECT anonymous_session_id FROM submitted) THEN anonymous_session_id END) AS contactFinalStepAbandonedSessions,
         COUNT(CASE WHEN event_name = 'join_pro_cta_clicked' THEN 1 END) AS joinProCtaClicks,
         COUNT(DISTINCT CASE WHEN event_name = 'join_pro_form_opened' THEN anonymous_session_id END) AS joinProFormOpens,
         COUNT(DISTINCT CASE WHEN event_name = 'join_pro_form_submitted' THEN anonymous_session_id END) AS joinProSubmittedSessions
       FROM scoped_events
       GROUP BY COALESCE(source_page, 'unknown')
       ORDER BY contactCtaClicks + joinProCtaClicks DESC, sourcePage ASC`,
    ),
    start,
  );

  const daysQuery = bindStart(
    getDb(env).prepare(
      `SELECT
         substr(created_at, 1, 10) AS day,
         COUNT(CASE WHEN event_name = 'contact_cta_clicked' THEN 1 END) AS contactCtaClicks,
         COUNT(CASE WHEN event_name = 'contact_flow_opened' THEN 1 END) AS contactFlowOpens,
         COUNT(DISTINCT CASE WHEN event_name = 'contact_final_step_reached' THEN anonymous_session_id END) AS contactFinalStepSessions,
         COUNT(DISTINCT CASE WHEN event_name = 'contact_form_submitted' THEN anonymous_session_id END) AS contactSubmittedSessions,
         COUNT(CASE WHEN event_name = 'join_pro_cta_clicked' THEN 1 END) AS joinProCtaClicks,
         COUNT(DISTINCT CASE WHEN event_name = 'join_pro_form_opened' THEN anonymous_session_id END) AS joinProFormOpens,
         COUNT(DISTINCT CASE WHEN event_name = 'join_pro_form_submitted' THEN anonymous_session_id END) AS joinProSubmittedSessions
       FROM anonymous_funnel_events
       ${where}
       GROUP BY substr(created_at, 1, 10)
       ORDER BY day DESC`,
    ),
    start,
  );

  const contactSubmissionsQuery = start
    ? getDb(env).prepare("SELECT COUNT(*) AS total FROM contact_requests WHERE created_at >= ?").bind(start)
    : getDb(env).prepare("SELECT COUNT(*) AS total FROM contact_requests");
  const joinSubmissionsQuery = start
    ? getDb(env).prepare("SELECT COUNT(*) AS total FROM join_pro_requests WHERE created_at >= ?").bind(start)
    : getDb(env).prepare("SELECT COUNT(*) AS total FROM join_pro_requests");

  const [totals, pages, days, contactSubmissions, joinSubmissions] = await Promise.all([
    totalsQuery.first<Record<string, number>>(),
    pagesQuery.all<Record<string, number | string>>(),
    daysQuery.all<Record<string, number | string>>(),
    contactSubmissionsQuery.first<{ total: number }>(),
    joinSubmissionsQuery.first<{ total: number }>(),
  ]);

  const finalStepSessions = totals?.contactFinalStepSessions || 0;
  const abandonedSessions = totals?.contactFinalStepAbandonedSessions || 0;
  const joinOpens = totals?.joinProFormOpens || 0;
  const joinSubmittedSessions = totals?.joinProSubmittedSessions || 0;

  return json({
    range: range === "30d" || range === "all" ? range : "7d",
    start,
    totals: {
      contactCtaClicks: totals?.contactCtaClicks || 0,
      contactFlowOpens: totals?.contactFlowOpens || 0,
      contactFinalStepSessions: finalStepSessions,
      contactSubmissions: contactSubmissions?.total || 0,
      contactSubmittedSessions: totals?.contactSubmittedSessions || 0,
      contactFinalStepAbandonedSessions: abandonedSessions,
      contactFinalStepAbandonmentRate: finalStepSessions ? abandonedSessions / finalStepSessions : 0,
      joinProCtaClicks: totals?.joinProCtaClicks || 0,
      joinProFormOpens: joinOpens,
      joinProSubmissions: joinSubmissions?.total || 0,
      joinProSubmittedSessions: joinSubmittedSessions,
      joinProConversionRate: joinOpens ? joinSubmittedSessions / joinOpens : 0,
    },
    groupedByPage: pages.results || [],
    groupedByDay: days.results || [],
  });
};
