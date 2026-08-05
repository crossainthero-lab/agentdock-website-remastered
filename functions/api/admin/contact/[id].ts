import { validStatus } from "../../../_shared/backend";
import { getAuthorizedAdminEmail, type AdminAuthEnv } from "../../../_shared/adminAuth";
import { getDb, json, readJson, type DbEnv, type PagesFunction } from "../../../_shared/http";
import { serializeContactRequest } from "../../../_shared/serializers";
import { cleanText, contactStatuses } from "../../../_shared/validation";

type Env = DbEnv;

type Params = { id: string };

export const onRequestGet: PagesFunction<Env & AdminAuthEnv, Params> = async ({ request, env, params }) => {
  const adminEmail = await getAuthorizedAdminEmail(request, env);
  if (!adminEmail) return json({ message: "Unauthorized." }, 401);

  const contact = await getDb(env).prepare(
    `SELECT id, name, email, contact_reason, message, source_page, anonymous_session_id,
            status, internal_notes, created_at, updated_at
     FROM contact_requests
     WHERE id = ?`,
  )
    .bind(params.id)
    .first();

  if (!contact) return json({ message: "Contact request not found." }, 404);
  return json({ contact: serializeContactRequest(contact as Record<string, unknown>) });
};

export const onRequestPatch: PagesFunction<Env & AdminAuthEnv, Params> = async ({ request, env, params }) => {
  const adminEmail = await getAuthorizedAdminEmail(request, env);
  if (!adminEmail) return json({ message: "Unauthorized." }, 401);

  const parsed = await readJson<Record<string, unknown>>(request, 6000);
  if (parsed.ok === false) return parsed.response;

  const status = validStatus(parsed.data.status, contactStatuses);
  const internalNotes =
    "internalNotes" in parsed.data || "internal_notes" in parsed.data
      ? cleanText(parsed.data.internalNotes ?? parsed.data.internal_notes, 5000, { multiline: true }) || ""
      : null;

  if (!status && internalNotes === null) {
    return json({ success: false, message: "Send a valid status or internal notes." }, 400);
  }

  const existing = await getDb(env).prepare("SELECT id FROM contact_requests WHERE id = ?").bind(params.id).first();
  if (!existing) return json({ message: "Contact request not found." }, 404);

  if (status && internalNotes !== null) {
    await getDb(env).prepare(
      "UPDATE contact_requests SET status = ?, internal_notes = ?, updated_at = strftime('%Y-%m-%dT%H:%M:%fZ', 'now') WHERE id = ?",
    )
      .bind(status, internalNotes, params.id)
      .run();
  } else if (status) {
    await getDb(env).prepare(
      "UPDATE contact_requests SET status = ?, updated_at = strftime('%Y-%m-%dT%H:%M:%fZ', 'now') WHERE id = ?",
    )
      .bind(status, params.id)
      .run();
  } else {
    await getDb(env).prepare(
      "UPDATE contact_requests SET internal_notes = ?, updated_at = strftime('%Y-%m-%dT%H:%M:%fZ', 'now') WHERE id = ?",
    )
      .bind(internalNotes, params.id)
      .run();
  }

  return json({ success: true });
};
