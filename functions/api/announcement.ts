import { getAnnouncementSettings, jsonOk, type CmsEnv } from "../_lib/cms";
import type { SiteAnnouncement } from "../../src/types/cms";

export const onRequestGet = async ({ env }: { env: CmsEnv }) => {
  try {
    return jsonOk(toPublicAnnouncement(await getAnnouncementSettings(env.WAITLIST_DB)));
  } catch (error) {
    console.error("Public announcement settings read failed", error instanceof Error ? error.message : "Unknown error");
    return jsonOk({
      enabled: false,
      text: "",
      linkText: "",
      linkUrl: "",
      openInNewTab: false,
      dismissible: false,
      version: "unavailable",
    });
  }
};

function toPublicAnnouncement(announcement: SiteAnnouncement): SiteAnnouncement {
  return {
    enabled: announcement.enabled,
    text: announcement.text,
    linkText: announcement.linkText,
    linkUrl: announcement.linkUrl,
    openInNewTab: announcement.openInNewTab,
    dismissible: announcement.dismissible,
    version: announcement.version,
  };
}
