import type { AnalyticsEventName } from "./validation";

export type AnalyticsEventRow = {
  anonymous_session_id: string;
  event_name: AnalyticsEventName;
  source_page?: string | null;
  created_at: string;
};

export function filterEventsByRange(events: AnalyticsEventRow[], range: "7d" | "30d" | "all", now = new Date()) {
  if (range === "all") return events;
  const days = range === "30d" ? 30 : 7;
  const start = new Date(now);
  start.setUTCDate(start.getUTCDate() - days);
  return events.filter((event) => new Date(event.created_at) >= start);
}

export function calculateFunnelMetrics(events: AnalyticsEventRow[]) {
  const contactFinal = new Set<string>();
  const contactSubmitted = new Set<string>();
  const joinOpened = new Set<string>();
  const joinSubmitted = new Set<string>();

  let contactCtaClicks = 0;
  let contactFlowOpens = 0;
  let joinProCtaClicks = 0;

  for (const event of events) {
    if (event.event_name === "contact_cta_clicked") contactCtaClicks += 1;
    if (event.event_name === "contact_flow_opened") contactFlowOpens += 1;
    if (event.event_name === "contact_final_step_reached") contactFinal.add(event.anonymous_session_id);
    if (event.event_name === "contact_form_submitted") contactSubmitted.add(event.anonymous_session_id);
    if (event.event_name === "join_pro_cta_clicked") joinProCtaClicks += 1;
    if (event.event_name === "join_pro_form_opened") joinOpened.add(event.anonymous_session_id);
    if (event.event_name === "join_pro_form_submitted") joinSubmitted.add(event.anonymous_session_id);
  }

  const contactAbandoned = [...contactFinal].filter((sessionId) => !contactSubmitted.has(sessionId));
  const joinConverted = [...joinOpened].filter((sessionId) => joinSubmitted.has(sessionId));

  return {
    contactCtaClicks,
    contactFlowOpens,
    contactFinalStepSessions: contactFinal.size,
    contactSubmittedSessions: contactSubmitted.size,
    contactFinalStepAbandonedSessions: contactAbandoned.length,
    contactFinalStepAbandonmentRate: contactFinal.size ? contactAbandoned.length / contactFinal.size : 0,
    joinProCtaClicks,
    joinProFormOpens: joinOpened.size,
    joinProSubmittedSessions: joinSubmitted.size,
    joinConvertedSessions: joinConverted.length,
    joinProConversionRate: joinOpened.size ? joinSubmitted.size / joinOpened.size : 0,
  };
}
