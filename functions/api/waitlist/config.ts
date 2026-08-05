interface Env {
  TURNSTILE_SITE_KEY?: string;
}

type PagesFunction<Env> = (context: {
  request: Request;
  env: Env;
}) => Response | Promise<Response>;

export const onRequestGet: PagesFunction<Env> = async ({ env }) => {
  if (!env.TURNSTILE_SITE_KEY) {
    return Response.json({ error: "Waitlist protection is not configured yet." }, { status: 500 });
  }

  return Response.json({ turnstileSiteKey: env.TURNSTILE_SITE_KEY });
};
