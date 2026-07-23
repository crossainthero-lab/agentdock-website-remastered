import { getAnnouncementSettings, jsonOk, type CmsEnv } from "../_lib/cms";

export const onRequestGet = async ({ env }: { env: CmsEnv }) => {
  try {
    return jsonOk(await getAnnouncementSettings(env.WAITLIST_DB));
  } catch (error) {
    console.error("Public announcement settings read failed", error instanceof Error ? error.message : "Unknown error");
    return jsonOk({
      enabled: false,
      text: "",
      linkText: "",
      linkUrl: "",
      updatedAt: null,
    });
  }
};
