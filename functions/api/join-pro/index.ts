import {
  checkRateLimit,
  insertJoinProRequest,
  verifyTurnstileIfPresent,
  type BackendEnv,
} from "../../_shared/backend";
import { json, readJson, safeError, type PagesFunction } from "../../_shared/http";
import { validateJoinProSubmission } from "../../_shared/validation";

export const onRequestPost: PagesFunction<BackendEnv> = async ({ request, env }) => {
  const parsed = await readJson<unknown>(request, 16000);
  if (parsed.ok === false) return parsed.response;
  if (parsed.data && typeof parsed.data === "object" && typeof (parsed.data as Record<string, unknown>).website === "string" && (parsed.data as Record<string, string>).website.trim()) {
    return json({ success: true, message: "Your AgentDock Pro request has been received." });
  }

  const validation = validateJoinProSubmission(parsed.data, request);
  if (validation.ok === false) {
    return json({ success: false, message: "Please check the form and try again.", errors: validation.errors }, 400);
  }

  const rateLimit = await checkRateLimit(env, request, "join-pro", 5, 60 * 60);
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
        message: "We already have a request for that email.",
      });
    }

    return json({
      success: true,
      id: validation.data.id,
      status: "New",
      message: "Your AgentDock Pro request has been received.",
    });
  } catch {
    return safeError("Something went wrong submitting your request. Please try again.");
  }
};
