import {
  deleteTechnicalSection,
  jsonError,
  readJsonBody,
  requireAdminSession,
  updateTechnicalSection,
  type CmsEnv,
} from "../../../_lib/cms";

export const onRequestPut = async ({
  request,
  env,
  params,
}: {
  request: Request;
  env: CmsEnv;
  params: { id: string };
}) => {
  const session = await requireAdminSession(request, env);
  if ("response" in session) {
    return session.response;
  }

  const body = await readJsonBody(request);
  if ("error" in body) {
    return jsonError(body.error, 400);
  }

  return updateTechnicalSection(env.WAITLIST_DB, Number(params.id), body.value);
};

export const onRequestDelete = async ({
  request,
  env,
  params,
}: {
  request: Request;
  env: CmsEnv;
  params: { id: string };
}) => {
  const session = await requireAdminSession(request, env);
  if ("response" in session) {
    return session.response;
  }

  return deleteTechnicalSection(env.WAITLIST_DB, Number(params.id));
};
