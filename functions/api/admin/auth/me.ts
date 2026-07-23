import { handleMe, type CmsEnv } from "../../../_lib/cms";

export const onRequestGet = async ({ request, env }: { request: Request; env: CmsEnv }) => {
  return handleMe(request, env);
};
