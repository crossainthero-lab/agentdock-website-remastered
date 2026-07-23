import {
  deletePost,
  getAdminPost,
  jsonError,
  jsonOk,
  readJsonBody,
  requireAdminSession,
  updatePost,
  type CmsEnv,
} from "../../../_lib/cms";

export const onRequestGet = async ({
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

  const post = await getAdminPost(env.WAITLIST_DB, Number(params.id));
  if (!post) {
    return jsonError("Blog post was not found.", 404);
  }

  return jsonOk(post);
};

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

  return updatePost(env.WAITLIST_DB, Number(params.id), body.value);
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

  return deletePost(env.WAITLIST_DB, Number(params.id));
};
