import { getPublicReleaseManagement, jsonOk, type CmsEnv } from "../_lib/cms";

export const onRequestGet = async ({ env }: { env: CmsEnv }) => {
  return jsonOk(await getPublicReleaseManagement(env.WAITLIST_DB));
};
