export type D1PreparedStatement = {
  bind: (...values: unknown[]) => D1PreparedStatement;
  first: <T = unknown>() => Promise<T | null>;
  all: <T = unknown>() => Promise<{ results?: T[] }>;
  run: () => Promise<unknown>;
};

export type D1Database = {
  prepare: (query: string) => D1PreparedStatement;
};

export type DbEnv = {
  DB?: D1Database;
  WAITLIST_DB?: D1Database;
};

export function getDb(env: DbEnv) {
  const db = env.DB || env.WAITLIST_DB;
  if (!db) {
    throw new Error("D1 database binding is not configured.");
  }
  return db;
}

export type PagesFunction<Env, Params = Record<string, string | string[]>> = (context: {
  request: Request;
  env: Env;
  params: Params;
}) => Response | Promise<Response>;

export type JsonParseResult<T> =
  | { ok: true; data: T }
  | { ok: false; response: Response };

const jsonHeaders = {
  "Content-Type": "application/json",
  "Cache-Control": "no-store",
};

export function json(data: unknown, status = 200, headers?: HeadersInit) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { ...jsonHeaders, ...headers },
  });
}

export function safeError(message = "Something went wrong. Please try again.", status = 500) {
  return json({ success: false, message }, status);
}

export async function readJson<T>(request: Request, maxBytes: number): Promise<JsonParseResult<T>> {
  const contentType = request.headers.get("Content-Type") || "";
  if (!contentType.toLowerCase().includes("application/json")) {
    return { ok: false, response: json({ success: false, message: "Send JSON content." }, 415) };
  }

  const contentLength = Number(request.headers.get("Content-Length") || 0);
  if (contentLength > maxBytes) {
    return { ok: false, response: json({ success: false, message: "The request is too large." }, 413) };
  }

  let text = "";
  try {
    text = await request.text();
  } catch {
    return { ok: false, response: json({ success: false, message: "The request could not be read." }, 400) };
  }

  if (new TextEncoder().encode(text).byteLength > maxBytes) {
    return { ok: false, response: json({ success: false, message: "The request is too large." }, 413) };
  }

  try {
    return { ok: true, data: JSON.parse(text) as T };
  } catch {
    return { ok: false, response: json({ success: false, message: "Please check the form and try again." }, 400) };
  }
}

export function getClientIp(request: Request) {
  return request.headers.get("CF-Connecting-IP") || request.headers.get("X-Forwarded-For")?.split(",")[0]?.trim() || "";
}

export function noStoreHeaders(contentType: string) {
  return {
    "Content-Type": contentType,
    "Cache-Control": "no-store",
  };
}
