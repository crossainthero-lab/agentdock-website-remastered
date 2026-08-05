import {
  checkRateLimit,
  insertJoinProRequest,
  insertLegacyWaitlistCompatibility,
  verifyTurnstileIfPresent,
  type BackendEnv,
} from "../../_shared/backend";
import { json, readJson, safeError, type PagesFunction } from "../../_shared/http";
import { validateJoinProSubmission } from "../../_shared/validation";

export const onRequestPost: PagesFunction<BackendEnv> = async ({ request, env }) => {
  const parsed = await readJson<Record<string, unknown>>(request, 12000);
  if (parsed.ok === false) return parsed.response;

  const payload = {
    ...parsed.data,
    intendedUse: parsed.data.intendedUse ?? parsed.data.intended_use ?? "Legacy waitlist signup",
    selectedAgents: parsed.data.selectedAgents ?? parsed.data.selected_agents ?? ["waitlist"],
    source: parsed.data.source ?? "waitlist-modal",
  };
  const validation = validateJoinProSubmission(payload, request);
  if (validation.ok === false) {
    return json({ success: false, message: "Please check the form and try again.", errors: validation.errors }, 400);
  }

  const rateLimit = await checkRateLimit(env, request, "waitlist", 5, 60 * 60);
  if (!rateLimit.allowed) {
    return json({ success: false, message: "Too many requests. Please try again later." }, 429, {
      "Retry-After": String(rateLimit.retryAfter),
    });
  }

  const turnstile = await verifyTurnstileIfPresent(request, validation.data.turnstileToken, env.TURNSTILE_SECRET_KEY);
  if (!turnstile.success) {
    return json({ success: false, message: turnstile.message }, 400);
  }

  try {
    const result = await insertJoinProRequest(env, validation.data);
    if (result.duplicate) {
      return json({
        success: true,
        duplicate: true,
        message: "You're already on the list. We'll keep you posted.",
      });
    }

    await insertLegacyWaitlistCompatibility(env, validation.data);

    return json({
      success: true,
      id: validation.data.id,
      message: "You're on the list. We'll keep you posted.",
    });
  } catch {
    return safeError("Something went wrong joining the waitlist. Please try again.");
  }
};
