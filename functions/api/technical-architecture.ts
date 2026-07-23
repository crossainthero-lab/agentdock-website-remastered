import { jsonOk, listTechnicalSections, type CmsEnv } from "../_lib/cms";

export const onRequestGet = async ({ env }: { env: CmsEnv }) => {
  return jsonOk(await listTechnicalSections(env.WAITLIST_DB, false));
};
