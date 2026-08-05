import {
  createAdminSessionCookie,
  verifyAdminPassword,
  type AdminAuthEnv,
} from "../../_shared/adminAuth";

type PagesFunction<Env> = (context: {
  request: Request;
  env: Env;
}) => Response | Promise<Response>;

const jsonHeaders = {
  "Content-Type": "application/json",
  "Cache-Control": "no-store",
};

function json(data: unknown, status = 200, headers?: HeadersInit) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { ...jsonHeaders, ...headers },
  });
}

export const onRequestPost: PagesFunction<AdminAuthEnv> = async ({ request, env }) => {
  let payload: { password?: unknown };

  try {
    payload = await request.json();
  } catch {
    return json({ message: "Enter the admin password and try again." }, 400);
  }

  const isValid = await verifyAdminPassword(payload.password, env);
  if (!isValid) {
    return json({ message: "That password did not work." }, 401);
  }

  try {
    const isSecureRequest =
      new URL(request.url).protocol === "https:" ||
      request.headers.get("CF-Visitor")?.includes('"scheme":"https"') ||
      request.headers.get("X-Forwarded-Proto") === "https";
    const cookie = await createAdminSessionCookie(env, isSecureRequest);
    return json({ success: true, email: env.ADMIN_EMAIL }, 200, { "Set-Cookie": cookie });
  } catch {
    return json({ message: "Admin authentication is not configured." }, 500);
  }
};
