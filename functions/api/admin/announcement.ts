import {
  getAnnouncementSettings,
  jsonOk,
  readJsonBody,
  requireAdminSession,
  updateAnnouncementSettings,
  type CmsEnv,
} from "../../_lib/cms";

export const onRequestGet = async ({ request, env }: { request: Request; env: CmsEnv }) => {
  const session = await requireAdminSession(request, env);
  if ("response" in session) {
    return session.response;
  }

  return jsonOk(await getAnnouncementSettings(env.WAITLIST_DB));
};

export const onRequestPut = async ({ request, env }: { request: Request; env: CmsEnv }) => {
  const session = await requireAdminSession(request, env);
  if ("response" in session) {
    return session.response;
  }

  const body = await readJsonBody(request);
  if ("error" in body) {
    return Response.json({ ok: false, error: body.error }, { status: 400 });
  }

  return updateAnnouncementSettings(env.WAITLIST_DB, body.value);
};
