export interface AdminAuthEnv {
  ADMIN_EMAIL?: string;
  ADMIN_PASSWORD?: string;
  ADMIN_SESSION_SECRET?: string;
}

const COOKIE_NAME = "agentdock_admin";
const SESSION_SECONDS = 60 * 60 * 24;

function base64Url(bytes: ArrayBuffer) {
  const binary = String.fromCharCode(...new Uint8Array(bytes));
  return btoa(binary).replaceAll("+", "-").replaceAll("/", "_").replaceAll("=", "");
}

async function sign(value: string, secret: string) {
  const key = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );
  const signature = await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(value));
  return base64Url(signature);
}

function constantTimeEqual(left: string, right: string) {
  if (left.length !== right.length) return false;

  let result = 0;
  for (let index = 0; index < left.length; index += 1) {
    result |= left.charCodeAt(index) ^ right.charCodeAt(index);
  }

  return result === 0;
}

function parseCookies(request: Request) {
  const header = request.headers.get("Cookie") || "";
  return Object.fromEntries(
    header
      .split(";")
      .map((cookie) => cookie.trim())
      .filter(Boolean)
      .map((cookie) => {
        const separatorIndex = cookie.indexOf("=");
        if (separatorIndex === -1) return [cookie, ""];
        return [cookie.slice(0, separatorIndex), cookie.slice(separatorIndex + 1)];
      }),
  );
}

function accessEmail(request: Request, env: AdminAuthEnv) {
  const configuredEmail = env.ADMIN_EMAIL?.trim().toLowerCase();
  const headerEmail =
    request.headers.get("CF-Access-Authenticated-User-Email")?.trim().toLowerCase() || "";

  if (configuredEmail && headerEmail === configuredEmail) return configuredEmail;
  return "";
}

export async function verifyAdminPassword(password: unknown, env: AdminAuthEnv) {
  if (typeof password !== "string" || !env.ADMIN_PASSWORD) return false;
  return constantTimeEqual(password, env.ADMIN_PASSWORD);
}

export async function createAdminSessionCookie(env: AdminAuthEnv, secure = true) {
  const email = env.ADMIN_EMAIL?.trim().toLowerCase();
  const secret = env.ADMIN_SESSION_SECRET;

  if (!email || !secret) {
    throw new Error("Admin authentication is not configured.");
  }

  const expiresAt = Math.floor(Date.now() / 1000) + SESSION_SECONDS;
  const payload = `${email}.${expiresAt}`;
  const signature = await sign(payload, secret);
  const value = `${expiresAt}.${signature}`;

  return `${COOKIE_NAME}=${value}; Path=/; HttpOnly; ${secure ? "Secure; " : ""}SameSite=Strict; Max-Age=${SESSION_SECONDS}`;
}

export function clearAdminSessionCookie() {
  return `${COOKIE_NAME}=; Path=/; HttpOnly; Secure; SameSite=Strict; Max-Age=0`;
}

export async function getAuthorizedAdminEmail(request: Request, env: AdminAuthEnv) {
  const accessUser = accessEmail(request, env);
  if (accessUser) return accessUser;

  const email = env.ADMIN_EMAIL?.trim().toLowerCase();
  const secret = env.ADMIN_SESSION_SECRET;
  if (!email || !secret) return "";

  const session = parseCookies(request)[COOKIE_NAME];
  if (!session) return "";

  const [expiresAtRaw, signature] = session.split(".");
  const expiresAt = Number(expiresAtRaw);
  if (!Number.isFinite(expiresAt) || !signature) return "";
  if (expiresAt <= Math.floor(Date.now() / 1000)) return "";

  const expectedSignature = await sign(`${email}.${expiresAtRaw}`, secret);
  return constantTimeEqual(signature, expectedSignature) ? email : "";
}
