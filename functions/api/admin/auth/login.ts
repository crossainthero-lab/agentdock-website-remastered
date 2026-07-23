import { handleLogin, type CmsEnv } from "../../../_lib/cms";

export const onRequestPost = async ({ request, env }: { request: Request; env: CmsEnv }) => {
  return handleLogin(request, env);
};
