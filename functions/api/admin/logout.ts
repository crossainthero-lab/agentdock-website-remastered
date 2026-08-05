import { clearAdminSessionCookie, type AdminAuthEnv } from "../../_shared/adminAuth";

type PagesFunction<Env> = (context: {
  request: Request;
  env: Env;
}) => Response | Promise<Response>;

export const onRequestPost: PagesFunction<AdminAuthEnv> = async () => {
  return new Response(JSON.stringify({ success: true }), {
    headers: {
      "Content-Type": "application/json",
      "Cache-Control": "no-store",
      "Set-Cookie": clearAdminSessionCookie(),
    },
  });
};
