import type {
  WaitlistErrorResponse,
  WaitlistRequest,
  WaitlistSuccessResponse,
} from "../../src/types/waitlist";

interface WaitlistInsertResult {
  meta?: {
    changes?: number;
    rows_written?: number;
  };
}

interface WaitlistPreparedStatement {
  bind(...values: unknown[]): {
    run(): Promise<WaitlistInsertResult>;
  };
}

interface WaitlistDatabase {
  prepare(query: string): WaitlistPreparedStatement;
}

export interface WaitlistBindings {
  WAITLIST_DB: WaitlistDatabase;
  WAITLIST_ALLOWED_ORIGINS?: string;
}

const MAX_BODY_BYTES = 8 * 1024;
const MAX_NAME_LENGTH = 80;
const MAX_USE_CASE_LENGTH = 1000;
const SOURCE = "agentdock-website";
const EMAIL_PATTERN =
  /^[A-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[A-Z0-9](?:[A-Z0-9-]{0,61}[A-Z0-9])?(?:\.[A-Z0-9](?:[A-Z0-9-]{0,61}[A-Z0-9])?)+$/i;

const SUCCESS_NEW: WaitlistSuccessResponse = {
  ok: true,
  alreadyJoined: false,
  message: "You're on the AIgency waitlist.",
};

const SUCCESS_DUPLICATE: WaitlistSuccessResponse = {
  ok: true,
  alreadyJoined: true,
  message: "You're already on the AIgency waitlist.",
};

const SERVER_ERROR: WaitlistErrorResponse = {
  ok: false,
  error: "The waitlist could not be updated. Please try again.",
};

export const onRequestOptions = async ({ request, env }: { request: Request; env: WaitlistBindings }) => {
  const allowedOrigin = getAllowedOrigin(request, env);

  if (!allowedOrigin) {
    return new Response(null, { status: 403 });
  }

  return new Response(null, {
    status: 204,
    headers: corsHeaders(allowedOrigin),
  });
};

export const onRequestPost = async ({ request, env }: { request: Request; env: WaitlistBindings }) => {
  return handleWaitlistRequest(request, env);
};

export async function handleWaitlistRequest(
  request: Request,
  env: WaitlistBindings,
): Promise<Response> {
  const origin = request.headers.get("Origin");
  const allowedOrigin = origin ? getAllowedOrigin(request, env) : undefined;

  if (origin && !allowedOrigin) {
    return validationResponse("Requests must come from the AgentDock website.");
  }

  if (!isJsonContentType(request.headers.get("Content-Type"))) {
    return validationResponse("Content-Type must be application/json.", allowedOrigin);
  }

  const contentLength = request.headers.get("Content-Length");
  if (contentLength && Number(contentLength) > MAX_BODY_BYTES) {
    return validationResponse("The waitlist request is too large.", allowedOrigin);
  }

  const bodyResult = await readLimitedBody(request, MAX_BODY_BYTES);
  if ("error" in bodyResult) {
    return validationResponse(bodyResult.error, allowedOrigin);
  }

  let rawPayload: unknown;
  try {
    rawPayload = JSON.parse(bodyResult.value);
  } catch {
    return validationResponse("Request body must be valid JSON.", allowedOrigin);
  }

  const validation = validateWaitlistPayload(rawPayload);
  if ("error" in validation) {
    return validationResponse(validation.error, allowedOrigin);
  }

  try {
    const insertResult = await env.WAITLIST_DB.prepare(
      `INSERT OR IGNORE INTO aigency_waitlist (name, email, use_case, source)
       VALUES (?1, ?2, ?3, ?4)`,
    )
      .bind(
        validation.value.name,
        validation.value.email,
        validation.value.useCase || null,
        SOURCE,
      )
      .run();

    const inserted = Number(insertResult.meta?.changes ?? insertResult.meta?.rows_written ?? 0) > 0;
    return jsonResponse(inserted ? SUCCESS_NEW : SUCCESS_DUPLICATE, inserted ? 201 : 200, allowedOrigin);
  } catch (error) {
    console.error("AIgency waitlist insert failed", { message: getErrorMessage(error) });
    return jsonResponse(SERVER_ERROR, 500, allowedOrigin);
  }
}

function validateWaitlistPayload(
  payload: unknown,
): { ok: true; value: Required<Omit<WaitlistRequest, "website">> } | { ok: false; error: string } {
  if (!payload || typeof payload !== "object" || Array.isArray(payload)) {
    return { ok: false, error: "Request body must be a JSON object." };
  }

  const record = payload as Record<string, unknown>;
  const name = normalizeRequiredString(record.name);
  if (name === null) {
    return { ok: false, error: "Name is required." };
  }

  const rawEmail = normalizeRequiredString(record.email);
  if (rawEmail === null) {
    return { ok: false, error: "Email is required." };
  }

  const email = rawEmail.toLowerCase();
  const website = normalizeOptionalString(record.website);
  const useCase = normalizeOptionalString(record.useCase);

  if (website === null || useCase === null) {
    return { ok: false, error: "Use case and website must be text values." };
  }

  if (website.length > 0) {
    return { ok: false, error: "The waitlist request could not be accepted." };
  }

  if (name.length < 2 || name.length > MAX_NAME_LENGTH) {
    return { ok: false, error: "Name must be between 2 and 80 characters." };
  }

  if (!isValidEmail(email)) {
    return { ok: false, error: "Email must be a valid email address." };
  }

  if (useCase.length > MAX_USE_CASE_LENGTH) {
    return { ok: false, error: "Use case must be 1,000 characters or fewer." };
  }

  return { ok: true, value: { name, email, useCase } };
}

function normalizeRequiredString(value: unknown): string | null {
  return typeof value === "string" ? value.trim() : null;
}

function normalizeOptionalString(value: unknown): string | null {
  if (value === undefined || value === null) {
    return "";
  }

  return typeof value === "string" ? value.trim() : null;
}

function isValidEmail(email: string): boolean {
  return email.length <= 254 && EMAIL_PATTERN.test(email);
}

function isJsonContentType(contentType: string | null): boolean {
  if (!contentType) {
    return false;
  }

  return contentType.split(";")[0]?.trim().toLowerCase() === "application/json";
}

async function readLimitedBody(
  request: Request,
  maxBytes: number,
): Promise<{ ok: true; value: string } | { ok: false; error: string }> {
  if (!request.body) {
    return { ok: false, error: "Request body is required." };
  }

  const reader = request.body.getReader();
  const decoder = new TextDecoder();
  let received = 0;
  let body = "";

  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) {
        break;
      }

      received += value.byteLength;
      if (received > maxBytes) {
        return { ok: false, error: "The waitlist request is too large." };
      }

      body += decoder.decode(value, { stream: true });
    }

    body += decoder.decode();
  } finally {
    reader.releaseLock();
  }

  return { ok: true, value: body };
}

function getAllowedOrigin(request: Request, env: WaitlistBindings): string | undefined {
  const origin = request.headers.get("Origin");
  if (!origin) {
    return undefined;
  }

  const requestOrigin = new URL(request.url).origin;
  if (origin === requestOrigin || isLocalDevelopmentOrigin(origin)) {
    return origin;
  }

  const configuredOrigins = (env.WAITLIST_ALLOWED_ORIGINS ?? "")
    .split(",")
    .map((value) => value.trim())
    .filter(Boolean);

  return configuredOrigins.includes(origin) ? origin : undefined;
}

function isLocalDevelopmentOrigin(origin: string): boolean {
  try {
    const url = new URL(origin);
    return (
      (url.hostname === "localhost" || url.hostname === "127.0.0.1") &&
      (url.protocol === "http:" || url.protocol === "https:")
    );
  } catch {
    return false;
  }
}

function validationResponse(error: string, allowedOrigin?: string): Response {
  return jsonResponse({ ok: false, error }, 400, allowedOrigin);
}

function jsonResponse(
  body: WaitlistSuccessResponse | WaitlistErrorResponse,
  status: number,
  allowedOrigin?: string,
): Response {
  return Response.json(body, {
    status,
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "Cache-Control": "no-store",
      "X-Content-Type-Options": "nosniff",
      ...corsHeaders(allowedOrigin),
    },
  });
}

function corsHeaders(allowedOrigin?: string): HeadersInit {
  if (!allowedOrigin) {
    return {};
  }

  return {
    "Access-Control-Allow-Origin": allowedOrigin,
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Max-Age": "86400",
    Vary: "Origin",
  };
}

function getErrorMessage(error: unknown): string {
  return error instanceof Error ? error.message : "Unknown error";
}
