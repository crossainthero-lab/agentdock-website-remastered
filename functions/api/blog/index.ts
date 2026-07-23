import { jsonOk, listPublishedPosts, type CmsEnv } from "../../_lib/cms";

export const onRequestGet = async ({ env }: { env: CmsEnv }) => {
  return jsonOk(await listPublishedPosts(env.WAITLIST_DB));
};
