export const joinProStatuses = ["New", "Contacted", "Accepted", "Rejected", "Archived"] as const;
export const contactStatuses = ["New", "Contacted", "Resolved", "Archived"] as const;
export const analyticsEvents = [
  "contact_cta_clicked",
  "contact_flow_opened",
  "contact_reason_selected",
  "contact_details_step_reached",
  "contact_final_step_reached",
  "contact_form_submitted",
  "contact_flow_abandoned",
  "join_pro_cta_clicked",
  "join_pro_form_opened",
  "join_pro_form_submitted",
] as const;
export const blogStatuses = ["draft", "published", "archived"] as const;

export type JoinProStatus = (typeof joinProStatuses)[number];
export type ContactStatus = (typeof contactStatuses)[number];
export type AnalyticsEventName = (typeof analyticsEvents)[number];
export type BlogStatus = (typeof blogStatuses)[number];

export type ValidationResult<T> = { ok: true; data: T } | { ok: false; errors: Record<string, string> };

export type UtmFields = {
  utmSource: string | null;
  utmMedium: string | null;
  utmCampaign: string | null;
};

export type ValidJoinProSubmission = UtmFields & {
  id: string;
  name: string;
  email: string;
  intendedUse: string;
  selectedAgents: string[];
  message: string | null;
  sourcePage: string;
  source: string | null;
  referrer: string | null;
  anonymousSessionId: string | null;
  turnstileToken: string | null;
};

export type ValidContactSubmission = {
  id: string;
  name: string;
  email: string;
  contactReason: string;
  message: string;
  sourcePage: string;
  anonymousSessionId: string | null;
  dedupeKey: string;
};

export type ValidAnalyticsEvent = UtmFields & {
  id: string;
  anonymousSessionId: string;
  eventName: AnalyticsEventName;
  sourcePage: string | null;
  funnelType: "contact" | "join_pro" | null;
  step: string | null;
  contactReason: string | null;
  dedupeKey: string;
};

export type VideoBlock = {
  type: "video";
  url: string;
  provider: "youtube" | "vimeo" | "mp4" | "webm";
  title: string | null;
  caption: string | null;
  posterImageUrl: string | null;
  autoplay: boolean;
  muted: boolean;
  loop: boolean;
  controls: boolean;
};

export type BlogContentBlock = VideoBlock | { type: "markdown"; markdown: string };

export type ValidBlogPostInput = {
  slug: string;
  title: string;
  excerpt: string | null;
  contentMarkdown: string;
  contentBlocks: BlogContentBlock[] | null;
  status: BlogStatus;
  author: string | null;
};

const htmlRiskPattern = /<\s*(script|iframe|object|embed|link|meta|style|form)\b|on[a-z]+\s*=|javascript\s*:/i;

export function createId(prefix: string) {
  return `${prefix}_${crypto.randomUUID()}`;
}

export function normalizeEmail(value: unknown) {
  if (typeof value !== "string") return null;
  const email = value.trim().toLowerCase();
  if (email.length < 6 || email.length > 254) return null;
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return null;
  return email;
}

function normalizeWhitespace(value: string) {
  return value.replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g, "").replace(/[ \t]+/g, " ").trim();
}

export function cleanText(value: unknown, maxLength: number, options?: { multiline?: boolean }) {
  if (typeof value !== "string") return null;
  let cleaned = options?.multiline
    ? value.replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g, "").replace(/\r\n?/g, "\n").trim()
    : normalizeWhitespace(value);
  if (!cleaned) return null;
  cleaned = cleaned.replaceAll("<", "&lt;").replaceAll(">", "&gt;");
  return cleaned.slice(0, maxLength);
}

export function parseBoolean(value: unknown, defaultValue: boolean) {
  if (typeof value === "boolean") return value;
  if (typeof value === "string") {
    if (value.toLowerCase() === "true") return true;
    if (value.toLowerCase() === "false") return false;
  }
  return defaultValue;
}

export function safeHttpUrl(value: unknown, maxLength = 500) {
  if (typeof value !== "string") return null;
  const trimmed = value.trim();
  if (!trimmed || trimmed.length > maxLength) return null;
  try {
    const url = new URL(trimmed);
    if (url.protocol !== "https:" && url.protocol !== "http:") return null;
    return url.toString();
  } catch {
    return null;
  }
}

export function validateAnonymousSessionId(value: unknown) {
  if (typeof value !== "string") return null;
  const trimmed = value.trim();
  if (!/^[A-Za-z0-9_-]{8,128}$/.test(trimmed)) return null;
  return trimmed;
}

export function extractUtm(payload: Record<string, unknown>, sourcePage?: string | null): UtmFields {
  const fromPayload = {
    utmSource: cleanText(payload.utmSource ?? payload.utm_source, 120),
    utmMedium: cleanText(payload.utmMedium ?? payload.utm_medium, 120),
    utmCampaign: cleanText(payload.utmCampaign ?? payload.utm_campaign, 160),
  };
  if (fromPayload.utmSource || fromPayload.utmMedium || fromPayload.utmCampaign || !sourcePage) return fromPayload;

  try {
    const params = new URL(sourcePage).searchParams;
    return {
      utmSource: cleanText(params.get("utm_source"), 120),
      utmMedium: cleanText(params.get("utm_medium"), 120),
      utmCampaign: cleanText(params.get("utm_campaign"), 160),
    };
  } catch {
    return fromPayload;
  }
}

function selectedAgents(value: unknown) {
  const values = Array.isArray(value)
    ? value
    : typeof value === "string"
      ? value.split(",")
      : [];
  return values
    .map((agent) => cleanText(agent, 80))
    .filter((agent): agent is string => Boolean(agent))
    .slice(0, 12);
}

export function validateJoinProSubmission(payload: unknown, request?: Request): ValidationResult<ValidJoinProSubmission> {
  const body = (payload && typeof payload === "object" ? payload : {}) as Record<string, unknown>;
  const errors: Record<string, string> = {};
  const name = cleanText(body.name, 120);
  const email = normalizeEmail(body.email);
  const intendedUse = cleanText(body.intendedUse ?? body.intended_use ?? body.useCase ?? body.use_case, 1200, {
    multiline: true,
  });
  const agents = selectedAgents(body.selectedAgents ?? body.selected_agents ?? body.agentsUsed ?? body.agents_used ?? body.agents);
  const message = cleanText(body.message, 2000, { multiline: true });
  const sourcePage =
    safeHttpUrl(body.sourcePage ?? body.source_page ?? body.pageUrl ?? body.page_url, 700) ||
    safeHttpUrl(request?.headers.get("Referer"), 700) ||
    "unknown";
  const referrer = safeHttpUrl(body.referrer, 700) || safeHttpUrl(request?.headers.get("Referer"), 700);
  const source = cleanText(body.source, 120);
  const anonymousSessionId = validateAnonymousSessionId(
    body.anonymousSessionId ?? body.anonymous_session_id ?? body.sessionId ?? body.session_id,
  );
  const turnstileToken = typeof body.turnstileToken === "string" ? body.turnstileToken.trim() || null : null;

  if (!name) errors.name = "Enter your name.";
  if (!email) errors.email = "Enter a valid email address.";
  if (!intendedUse) errors.intendedUse = "Tell us how you plan to use AgentDock Pro.";
  if (agents.length === 0) errors.selectedAgents = "Choose at least one agent.";

  if (Object.keys(errors).length) return { ok: false, errors };

  return {
    ok: true,
    data: {
      id: createId("jpr"),
      name: name!,
      email: email!,
      intendedUse: intendedUse!,
      selectedAgents: agents,
      message,
      sourcePage,
      source,
      referrer,
      anonymousSessionId,
      turnstileToken,
      ...extractUtm(body, sourcePage),
    },
  };
}

export function validateContactSubmission(payload: unknown): ValidationResult<ValidContactSubmission> {
  const body = (payload && typeof payload === "object" ? payload : {}) as Record<string, unknown>;
  const errors: Record<string, string> = {};
  const name = cleanText(body.name, 120);
  const email = normalizeEmail(body.email);
  const contactReason = cleanText(body.contactReason ?? body.contact_reason ?? body.reason, 120);
  const message = cleanText(body.message, 3000, { multiline: true });
  const sourcePage = safeHttpUrl(body.sourcePage ?? body.source_page ?? body.pageUrl ?? body.page_url, 700) || "unknown";
  const anonymousSessionId = validateAnonymousSessionId(
    body.anonymousSessionId ?? body.anonymous_session_id ?? body.sessionId ?? body.session_id,
  );

  if (!name) errors.name = "Enter your name.";
  if (!email) errors.email = "Enter a valid email address.";
  if (!contactReason) errors.contactReason = "Choose a contact reason.";
  if (!message) errors.message = "Enter a message.";

  if (Object.keys(errors).length) return { ok: false, errors };

  const hourBucket = new Date().toISOString().slice(0, 13);
  const dedupeKey = `${email}:${contactReason}:${message}:${sourcePage}:${hourBucket}`;

  return {
    ok: true,
    data: {
      id: createId("contact"),
      name: name!,
      email: email!,
      contactReason: contactReason!,
      message: message!,
      sourcePage,
      anonymousSessionId,
      dedupeKey,
    },
  };
}

export function validateAnalyticsEvent(payload: unknown): ValidationResult<ValidAnalyticsEvent> {
  const body = (payload && typeof payload === "object" ? payload : {}) as Record<string, unknown>;
  const errors: Record<string, string> = {};
  const properties = (body.properties && typeof body.properties === "object" ? body.properties : {}) as Record<string, unknown>;
  const eventName = cleanText(body.eventName ?? body.event_name ?? body.event ?? body.name, 80) as AnalyticsEventName | null;
  const anonymousSessionId = validateAnonymousSessionId(
    body.anonymousSessionId ?? body.anonymous_session_id ?? body.sessionId ?? body.session_id,
  );
  const sourcePage =
    safeHttpUrl(body.sourcePage ?? body.source_page ?? body.pageUrl ?? body.page_url, 700) ||
    cleanText(body.path, 700);
  const step = cleanText(body.step ?? properties.step, 80);
  const contactReason = cleanText(body.contactReason ?? body.contact_reason ?? body.reason ?? properties.reason, 120);
  const rawFunnel = cleanText(body.funnelType ?? body.funnel_type ?? body.formType ?? body.form_type, 40);
  const funnelType = rawFunnel === "contact" || rawFunnel === "join_pro" ? rawFunnel : eventName?.startsWith("contact_") ? "contact" : eventName?.startsWith("join_pro_") ? "join_pro" : null;

  if (!eventName || !analyticsEvents.includes(eventName)) errors.eventName = "Unsupported analytics event.";
  if (!anonymousSessionId) errors.anonymousSessionId = "A valid anonymous session ID is required.";
  if (contactReason && eventName !== "contact_reason_selected") errors.contactReason = "Contact reason is only accepted for contact reason events.";

  if (Object.keys(errors).length) return { ok: false, errors };

  const eventInstanceId = cleanText(body.eventInstanceId ?? body.event_instance_id, 160);
  const idempotencyKey = cleanText(body.idempotencyKey ?? body.idempotency_key, 160);
  const dayBucket = new Date().toISOString().slice(0, 10);
  const dedupeKey =
    idempotencyKey ||
    eventInstanceId ||
    [anonymousSessionId, eventName, sourcePage || "", funnelType || "", step || "", contactReason || "", dayBucket].join("|");

  return {
    ok: true,
    data: {
      id: createId("evt"),
      anonymousSessionId: anonymousSessionId!,
      eventName: eventName!,
      sourcePage,
      funnelType,
      step,
      contactReason,
      dedupeKey,
      ...extractUtm(body, sourcePage),
    },
  };
}

function stripFencedCode(markdown: string) {
  return markdown.replace(/```[\s\S]*?```/g, "");
}

export function validateMarkdownContent(value: unknown, maxLength = 200000) {
  if (typeof value !== "string") return { ok: false as const, error: "Markdown content is required." };
  if (value.length > maxLength) return { ok: false as const, error: "Markdown content is too large." };

  const mermaidBlocks = value.match(/```mermaid[\t ]*\n[\s\S]*?\n```/gi) || [];
  for (const block of mermaidBlocks) {
    if (block.length > 6000) {
      return { ok: false as const, error: "Mermaid blocks must be 6000 characters or less." };
    }
  }

  const markdownOutsideCode = stripFencedCode(value);
  if (htmlRiskPattern.test(markdownOutsideCode)) {
    return { ok: false as const, error: "Unsafe HTML is not allowed in blog Markdown." };
  }

  return { ok: true as const, markdown: value };
}

function validateVideoUrl(value: unknown) {
  const url = safeHttpUrl(value, 1200);
  if (!url) return null;

  const parsed = new URL(url);
  const host = parsed.hostname.toLowerCase().replace(/^www\./, "");
  const path = parsed.pathname.toLowerCase();
  if (["youtube.com", "m.youtube.com", "youtu.be"].includes(host)) return { url, provider: "youtube" as const };
  if (["vimeo.com", "player.vimeo.com"].includes(host)) return { url, provider: "vimeo" as const };
  if (path.endsWith(".mp4")) return { url, provider: "mp4" as const };
  if (path.endsWith(".webm")) return { url, provider: "webm" as const };
  return null;
}

export function validateContentBlocks(value: unknown) {
  if (value == null) return { ok: true as const, blocks: null };
  if (!Array.isArray(value)) return { ok: false as const, error: "Content blocks must be an array." };
  if (value.length > 100) return { ok: false as const, error: "Too many content blocks." };

  const blocks: BlogContentBlock[] = [];
  for (const rawBlock of value) {
    const block = (rawBlock && typeof rawBlock === "object" ? rawBlock : {}) as Record<string, unknown>;
    if (block.type === "markdown") {
      const markdown = validateMarkdownContent(block.markdown ?? "", 50000);
      if (!markdown.ok) return { ok: false as const, error: markdown.error };
      blocks.push({ type: "markdown", markdown: markdown.markdown });
      continue;
    }

    if (block.type !== "video") return { ok: false as const, error: "Unsupported content block type." };

    const video = validateVideoUrl(block.url);
    if (!video) return { ok: false as const, error: "Video URL must be YouTube, Vimeo, MP4, or WebM over HTTP(S)." };

    blocks.push({
      type: "video",
      url: video.url,
      provider: video.provider,
      title: cleanText(block.title, 160),
      caption: cleanText(block.caption, 600, { multiline: true }),
      posterImageUrl: safeHttpUrl(block.posterImageUrl ?? block.poster_image_url, 1200),
      autoplay: parseBoolean(block.autoplay, false),
      muted: parseBoolean(block.muted, false),
      loop: parseBoolean(block.loop, false),
      controls: parseBoolean(block.controls, true),
    });
  }

  return { ok: true as const, blocks };
}

export function validateBlogPostInput(payload: unknown): ValidationResult<ValidBlogPostInput> {
  const body = (payload && typeof payload === "object" ? payload : {}) as Record<string, unknown>;
  const errors: Record<string, string> = {};
  const slug = cleanText(body.slug, 140)?.toLowerCase().replace(/[^a-z0-9-]+/g, "-").replace(/^-+|-+$/g, "");
  const title = cleanText(body.title, 180);
  const excerpt = cleanText(body.excerpt, 500, { multiline: true });
  const author = cleanText(body.author, 120);
  const statusCandidate = cleanText(body.status, 40) as BlogStatus | null;
  const status = statusCandidate && blogStatuses.includes(statusCandidate) ? statusCandidate : "draft";
  const markdown = validateMarkdownContent(body.contentMarkdown ?? body.content_markdown ?? body.markdown ?? "");
  const blocks = validateContentBlocks(body.contentBlocks ?? body.content_blocks);

  if (!slug) errors.slug = "Enter a valid slug.";
  if (!title) errors.title = "Enter a title.";
  if (!markdown.ok) errors.contentMarkdown = markdown.error;
  if (!blocks.ok) errors.contentBlocks = blocks.error;

  if (Object.keys(errors).length) return { ok: false, errors };

  return {
    ok: true,
    data: {
      slug: slug!,
      title: title!,
      excerpt,
      contentMarkdown: markdown.ok ? markdown.markdown : "",
      contentBlocks: blocks.ok ? blocks.blocks : null,
      status,
      author,
    },
  };
}
