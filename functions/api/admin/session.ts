import { getAuthorizedAdminEmail, type AdminAuthEnv } from "../../_shared/adminAuth";

type PagesFunction<Env> = (context: {
  request: Request;
  env: Env;
}) => Response | Promise<Response>;

function json(data: unknown, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      "Content-Type": "application/json",
      "Cache-Control": "no-store",
    },
  });
}

export const onRequestGet: PagesFunction<AdminAuthEnv> = async ({ request, env }) => {
  const email = await getAuthorizedAdminEmail(request, env);
  if (!email) {
    return json({ authenticated: false }, 401);
  }

  return json({ authenticated: true, email });
};
