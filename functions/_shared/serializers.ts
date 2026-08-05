function parseJsonArray(value: unknown) {
  if (typeof value !== "string") return Array.isArray(value) ? value : [];
  try {
    const parsed = JSON.parse(value) as unknown;
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function serializeJoinProRequest(row: Record<string, unknown>) {
  const selectedAgents = parseJsonArray(row.selected_agents);
  return {
    ...row,
    intendedUse: row.intended_use,
    selectedAgents,
    selected_agents: selectedAgents,
    sourcePage: row.source_page,
    utmSource: row.utm_source,
    utmMedium: row.utm_medium,
    utmCampaign: row.utm_campaign,
    anonymousSessionId: row.anonymous_session_id,
    internalNotes: row.internal_notes,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export function serializeContactRequest(row: Record<string, unknown>) {
  return {
    ...row,
    contactReason: row.contact_reason,
    sourcePage: row.source_page,
    anonymousSessionId: row.anonymous_session_id,
    internalNotes: row.internal_notes,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export function serializeBlogPost(row: Record<string, unknown>) {
  const contentBlocks = typeof row.content_blocks === "string" ? parseJsonArray(row.content_blocks) : null;
  return {
    ...row,
    contentMarkdown: row.content_markdown,
    contentBlocks,
    content_blocks: contentBlocks,
    publishedAt: row.published_at,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}
