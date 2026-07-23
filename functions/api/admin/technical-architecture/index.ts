import {
  createTechnicalSection,
  jsonOk,
  listTechnicalSections,
  readJsonBody,
  requireAdminSession,
  type CmsEnv,
} from "../../../_lib/cms";

export const onRequestGet = async ({ request, env }: { request: Request; env: CmsEnv }) => {
  const session = await requireAdminSession(request, env);
  if ("response" in session) {
    return session.response;
  }

  return jsonOk(await listTechnicalSections(env.WAITLIST_DB, true));
};

export const onRequestPost = async ({ request, env }: { request: Request; env: CmsEnv }) => {
  const session = await requireAdminSession(request, env);
  if ("response" in session) {
    return session.response;
  }

  const body = await readJsonBody(request);
  if ("error" in body) {
    return Response.json({ ok: false, error: body.error }, { status: 400 });
  }

  return createTechnicalSection(env.WAITLIST_DB, body.value);
};
