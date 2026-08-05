import { checkRateLimit, insertAnalyticsEvent, type BackendEnv } from "../../_shared/backend";
import { json, readJson, safeError, type PagesFunction } from "../../_shared/http";
import { validateAnalyticsEvent } from "../../_shared/validation";

export const onRequestPost: PagesFunction<BackendEnv> = async ({ request, env }) => {
  const parsed = await readJson<unknown>(request, 6000);
  if (parsed.ok === false) return parsed.response;

  const validation = validateAnalyticsEvent(parsed.data);
  if (validation.ok === false) {
    return json({ success: false, message: "Invalid analytics event.", errors: validation.errors }, 400);
  }

  const rateLimit = await checkRateLimit(env, request, "analytics", 120, 60);
  if (!rateLimit.allowed) {
    return json({ success: false, message: "Too many events." }, 429, {
      "Retry-After": String(rateLimit.retryAfter),
    });
  }

  try {
    const result = await insertAnalyticsEvent(env, validation.data);
    return json({
      success: true,
      duplicate: result.duplicate,
      id: result.duplicate ? null : validation.data.id,
    });
  } catch {
    return safeError("The analytics event could not be recorded.");
  }
};
