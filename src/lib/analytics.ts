export type AnalyticsEvent =
  | 'contact_cta_clicked'
  | 'contact_flow_opened'
  | 'contact_reason_selected'
  | 'contact_details_step_reached'
  | 'contact_final_step_reached'
  | 'contact_form_submitted'
  | 'contact_flow_abandoned'
  | 'join_pro_cta_clicked'
  | 'join_pro_form_opened'
  | 'join_pro_form_submitted';

type AnalyticsProperties = {
  funnelType?: 'contact' | 'join_pro';
  step?: string;
  contactReason?: string;
  reason?: string;
};

function getSessionId() {
  if (typeof window === 'undefined') return 'server';
  const key = 'agentdock_anonymous_session_id';
  let sessionId = window.sessionStorage.getItem(key);
  if (!sessionId) {
    sessionId = `anon_${crypto.randomUUID().replaceAll('-', '')}`;
    window.sessionStorage.setItem(key, sessionId);
  }
  return sessionId;
}

function utm() {
  if (typeof window === 'undefined') return {};
  const params = new URLSearchParams(window.location.search);
  return {
    utmSource: params.get('utm_source') || undefined,
    utmMedium: params.get('utm_medium') || undefined,
    utmCampaign: params.get('utm_campaign') || undefined,
  };
}

class AnalyticsClient {
  readonly sessionId = getSessionId();
  private sent = new Set<string>();

  track(eventName: AnalyticsEvent, properties: AnalyticsProperties = {}, idempotencyKey?: string) {
    if (typeof window === 'undefined') return;
    const dedupeKey =
      idempotencyKey ||
      [this.sessionId, eventName, window.location.pathname, properties.step || '', properties.contactReason || properties.reason || ''].join('|');
    if (this.sent.has(dedupeKey)) return;
    this.sent.add(dedupeKey);

    void fetch('/api/analytics', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        anonymousSessionId: this.sessionId,
        eventName,
        sourcePage: window.location.href,
        funnelType: properties.funnelType || (eventName.startsWith('contact_') ? 'contact' : 'join_pro'),
        step: properties.step,
        contactReason: properties.contactReason || properties.reason,
        idempotencyKey: dedupeKey,
        ...utm(),
      }),
    }).catch(() => undefined);
  }
}

export const analytics = new AnalyticsClient();
