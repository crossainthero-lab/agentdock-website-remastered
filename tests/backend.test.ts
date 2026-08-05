import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";
import { checkRateLimit, insertAnalyticsEvent } from "../functions/_shared/backend";
import { calculateFunnelMetrics, filterEventsByRange, type AnalyticsEventRow } from "../functions/_shared/analytics";
import {
  validateAnalyticsEvent,
  validateBlogPostInput,
  validateContactSubmission,
  validateJoinProSubmission,
} from "../functions/_shared/validation";

class FakeStatement {
  constructor(
    private db: FakeD1Database,
    private query: string,
    private values: unknown[] = [],
  ) {}

  bind(...values: unknown[]) {
    return new FakeStatement(this.db, this.query, values);
  }

  async first<T = unknown>() {
    return this.db.first(this.query, this.values) as T | null;
  }

  async all<T = unknown>() {
    return { results: this.db.all(this.query, this.values) as T[] };
  }

  async run() {
    return this.db.run(this.query, this.values);
  }
}

class FakeD1Database {
  rateLimits = new Map<string, number>();
  analytics = new Map<string, unknown[]>();

  prepare(query: string) {
    return new FakeStatement(this, query);
  }

  first(query: string, values: unknown[]) {
    if (query.includes("FROM submission_rate_limits")) {
      const key = values.slice(0, 3).join("|");
      const count = this.rateLimits.get(key);
      return count == null ? null : { count };
    }
    return null;
  }

  all(_query: string, _values: unknown[]) {
    return [];
  }

  run(query: string, values: unknown[]) {
    if (query.startsWith("INSERT INTO submission_rate_limits")) {
      const key = values.slice(0, 3).join("|");
      this.rateLimits.set(key, 1);
      return {};
    }
    if (query.startsWith("UPDATE submission_rate_limits")) {
      const key = values.slice(0, 3).join("|");
      this.rateLimits.set(key, (this.rateLimits.get(key) || 0) + 1);
      return {};
    }
    if (query.includes("INSERT INTO anonymous_funnel_events")) {
      const dedupeKey = String(values[10]);
      if (this.analytics.has(dedupeKey)) throw new Error("UNIQUE constraint failed: anonymous_funnel_events.dedupe_key");
      this.analytics.set(dedupeKey, values);
      return {};
    }
    return {};
  }
}

function jsonRequest(body: unknown) {
  return new Request("https://agentdock.ai/api/test", {
    method: "POST",
    headers: { "Content-Type": "application/json", "CF-Connecting-IP": "203.0.113.8" },
    body: JSON.stringify(body),
  });
}

test("valid Join AgentDock Pro submission normalizes and preserves fields", () => {
  const result = validateJoinProSubmission({
    name: " Billy ",
    email: "BILLY@EXAMPLE.COM ",
    intendedUse: "Build AIgency workflows",
    selectedAgents: ["Claude", "Codex"],
    message: "Interested in admin analytics",
    sourcePage: "https://agentdock.ai/?utm_source=x&utm_medium=y&utm_campaign=z",
  });

  assert.equal(result.ok, true);
  if (result.ok) {
    assert.equal(result.data.email, "billy@example.com");
    assert.deepEqual(result.data.selectedAgents, ["Claude", "Codex"]);
    assert.equal(result.data.utmCampaign, "z");
  }
});

test("invalid Join AgentDock Pro submission returns field errors", () => {
  const result = validateJoinProSubmission({ name: "", email: "bad", selectedAgents: [] });
  assert.equal(result.ok, false);
  if (!result.ok) {
    assert.equal(result.errors.email, "Enter a valid email address.");
    assert.equal(result.errors.selectedAgents, "Choose at least one agent.");
  }
});

test("valid Contact submission sanitizes public text", () => {
  const result = validateContactSubmission({
    name: "Alice",
    email: "ALICE@EXAMPLE.COM",
    contactReason: "Support",
    message: "Hello <script>alert(1)</script>",
    sourcePage: "https://agentdock.ai/contact",
    anonymousSessionId: "anon_session_123",
  });

  assert.equal(result.ok, true);
  if (result.ok) {
    assert.equal(result.data.email, "alice@example.com");
    assert.match(result.data.message, /&lt;script&gt;/);
  }
});

test("invalid Contact submission returns validation errors", () => {
  const result = validateContactSubmission({ email: "nope" });
  assert.equal(result.ok, false);
  if (!result.ok) assert.equal(result.errors.message, "Enter a message.");
});

test("rate limiting blocks requests after the configured window count", async () => {
  const env = { DB: new FakeD1Database() };
  const request = jsonRequest({});
  assert.equal((await checkRateLimit(env, request, "contact", 2, 60)).allowed, true);
  assert.equal((await checkRateLimit(env, request, "contact", 2, 60)).allowed, true);
  assert.equal((await checkRateLimit(env, request, "contact", 2, 60)).allowed, false);
});

test("analytics event insertion deduplicates by idempotency key", async () => {
  const env = { DB: new FakeD1Database() };
  const result = validateAnalyticsEvent({
    anonymousSessionId: "anon_session_123",
    eventName: "contact_final_step_reached",
    sourcePage: "https://agentdock.ai/",
    idempotencyKey: "same-event",
  });
  assert.equal(result.ok, true);
  if (!result.ok) return;

  assert.deepEqual(await insertAnalyticsEvent(env, result.data), { duplicate: false });
  assert.deepEqual(await insertAnalyticsEvent(env, result.data), { duplicate: true });
});

test("contact final-step abandonment uses unique sessions and excludes submissions", () => {
  const events: AnalyticsEventRow[] = [
    { anonymous_session_id: "a", event_name: "contact_final_step_reached", created_at: "2026-08-01T00:00:00.000Z" },
    { anonymous_session_id: "a", event_name: "contact_final_step_reached", created_at: "2026-08-01T00:01:00.000Z" },
    { anonymous_session_id: "b", event_name: "contact_final_step_reached", created_at: "2026-08-01T00:02:00.000Z" },
    { anonymous_session_id: "b", event_name: "contact_form_submitted", created_at: "2026-08-01T00:03:00.000Z" },
  ];

  const metrics = calculateFunnelMetrics(events);
  assert.equal(metrics.contactFinalStepSessions, 2);
  assert.equal(metrics.contactSubmittedSessions, 1);
  assert.equal(metrics.contactFinalStepAbandonedSessions, 1);
  assert.equal(metrics.contactFinalStepAbandonmentRate, 0.5);
});

test("Join Pro conversion uses unique open and submitted sessions", () => {
  const metrics = calculateFunnelMetrics([
    { anonymous_session_id: "a", event_name: "join_pro_form_opened", created_at: "2026-08-01T00:00:00.000Z" },
    { anonymous_session_id: "a", event_name: "join_pro_form_submitted", created_at: "2026-08-01T00:00:10.000Z" },
    { anonymous_session_id: "b", event_name: "join_pro_form_opened", created_at: "2026-08-01T00:01:00.000Z" },
  ]);

  assert.equal(metrics.joinProFormOpens, 2);
  assert.equal(metrics.joinProSubmittedSessions, 1);
  assert.equal(metrics.joinProConversionRate, 0.5);
});

test("date-range analytics filters last 7 and 30 days", () => {
  const now = new Date("2026-08-05T00:00:00.000Z");
  const events: AnalyticsEventRow[] = [
    { anonymous_session_id: "a", event_name: "contact_cta_clicked", created_at: "2026-08-01T00:00:00.000Z" },
    { anonymous_session_id: "b", event_name: "contact_cta_clicked", created_at: "2026-07-20T00:00:00.000Z" },
    { anonymous_session_id: "c", event_name: "contact_cta_clicked", created_at: "2026-06-01T00:00:00.000Z" },
  ];

  assert.equal(filterEventsByRange(events, "7d", now).length, 1);
  assert.equal(filterEventsByRange(events, "30d", now).length, 2);
  assert.equal(filterEventsByRange(events, "all", now).length, 3);
});

test("blog validation supports video blocks and rejects unsafe iframe or JavaScript URLs", () => {
  const valid = validateBlogPostInput({
    slug: "video-post",
    title: "Video post",
    contentMarkdown: "Intro",
    contentBlocks: [{ type: "video", url: "https://www.youtube.com/watch?v=abc", controls: true }],
    status: "published",
  });
  assert.equal(valid.ok, true);

  const iframe = validateBlogPostInput({
    slug: "iframe-post",
    title: "Iframe post",
    contentMarkdown: "<iframe src=\"https://example.com\"></iframe>",
  });
  assert.equal(iframe.ok, false);

  const javascriptUrl = validateBlogPostInput({
    slug: "bad-video",
    title: "Bad video",
    contentMarkdown: "Body",
    contentBlocks: [{ type: "video", url: "javascript:alert(1)" }],
  });
  assert.equal(javascriptUrl.ok, false);
});

test("Mermaid fenced Markdown is preserved and oversized Mermaid blocks are rejected", () => {
  const mermaid = "```mermaid\nflowchart TD\n  A[Prompt] --> B[AIgency]\n```";
  const valid = validateBlogPostInput({
    slug: "mermaid-post",
    title: "Mermaid post",
    contentMarkdown: `Intro\n\n${mermaid}`,
  });
  assert.equal(valid.ok, true);
  if (valid.ok) assert.match(valid.data.contentMarkdown, /```mermaid/);

  const invalid = validateBlogPostInput({
    slug: "huge-mermaid",
    title: "Huge Mermaid",
    contentMarkdown: `\`\`\`mermaid\n${"A-->B\n".repeat(1200)}\`\`\``,
  });
  assert.equal(invalid.ok, false);
});

test("existing blog post compatibility allows plain Markdown without content blocks", () => {
  const result = validateBlogPostInput({
    slug: "old-post",
    title: "Old post",
    contentMarkdown: "# Existing post\n\nPlain Markdown.",
  });
  assert.equal(result.ok, true);
  if (result.ok) assert.equal(result.data.contentBlocks, null);
});

test("migration preserves legacy waitlist and creates backend tables/indexes", () => {
  const migration = readFileSync(new URL("../migrations/0002_backend_data_analytics_blog.sql", import.meta.url), "utf8");
  assert.match(migration, /CREATE TABLE IF NOT EXISTS join_pro_requests/);
  assert.match(migration, /INSERT OR IGNORE INTO join_pro_requests/);
  assert.match(migration, /FROM waitlist_entries/);
  assert.match(migration, /CREATE TABLE IF NOT EXISTS contact_requests/);
  assert.match(migration, /CREATE TABLE IF NOT EXISTS anonymous_funnel_events/);
  assert.match(migration, /CREATE TABLE IF NOT EXISTS blog_posts/);
  assert.match(migration, /ROLLBACK/i);
});
