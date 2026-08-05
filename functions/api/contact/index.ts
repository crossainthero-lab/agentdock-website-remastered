import { checkRateLimit, insertContactRequest, type BackendEnv } from "../../_shared/backend";
import { json, readJson, safeError, type PagesFunction } from "../../_shared/http";
import { validateContactSubmission } from "../../_shared/validation";

export const onRequestPost: PagesFunction<BackendEnv> = async ({ request, env }) => {
  const parsed = await readJson<unknown>(request, 12000);
  if (parsed.ok === false) return parsed.response;
  if (parsed.data && typeof parsed.data === "object" && typeof (parsed.data as Record<string, unknown>).website === "string" && (parsed.data as Record<string, string>).website.trim()) {
    return json({ success: true, message: "Your message has been received." });
  }

  const validation = validateContactSubmission(parsed.data);
  if (validation.ok === false) {
    return json({ success: false, message: "Please check the form and try again.", errors: validation.errors }, 400);
  }

  const rateLimit = await checkRateLimit(env, request, "contact", 5, 60 * 60);
  if (!rateLimit.allowed) {
    return json({ success: false, message: "Too many requests. Please try again later." }, 429, {
      "Retry-After": String(rateLimit.retryAfter),
    });
  }

  try {
    const result = await insertContactRequest(env, validation.data);
    if (result.duplicate) {
      return json({
        success: true,
        duplicate: true,
        message: "We already received that message.",
      });
    }

    return json({
      success: true,
      id: validation.data.id,
      status: "New",
      message: "Your message has been received.",
    });
  } catch {
    return safeError("Something went wrong submitting your message. Please try again.");
  }
};
